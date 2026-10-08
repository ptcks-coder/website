/**
 * Perekam video tutorial CKS per-scene — Electron (offscreen) + ffmpeg.
 *
 * Kunci perbaikan:
 *  - Tiap scene direkam sebagai KLIP TERPISAH (clips/<id>.mp4).
 *  - Durasi klip = (jeda awal) + (durasi audio narasi) + (jeda akhir),
 *    jadi narasi selalu pas dengan adegannya.
 *  - Ada PRAKTEK pengisian: mengetik di form (judul, subjudul, label tombol,
 *    isi artikel, dsb) agar tutorial menunjukkan cara mengisi, bukan hanya lihat.
 *
 * Pakai (di scripts/tutorial/electron):
 *   npx electron main.js
 *   ONLY=03-slider,05-artikel   → hanya scene tertentu
 */
const { app, BrowserWindow, screen } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("force-device-scale-factor", "1");

const FPS = 30;
const BASE = process.env.BASE_URL || "http://localhost:3000";
const ROOT = path.resolve(__dirname, "..", "..", "..", "docs", "tutorial");
const CLIPS = path.join(ROOT, "clips");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@cks.id";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const LEAD_MS = Number(process.env.LEAD_MS || 600); // jeda sebelum narasi
const TAIL_MS = Number(process.env.TAIL_MS || 900); // jeda setelah narasi
const MAX_BUFFER = 80 * 1024 * 1024;

const naskah = JSON.parse(fs.readFileSync(path.join(ROOT, "naskah.json"), "utf8"));

function wavDurationMs(file) {
  try {
    const buf = fs.readFileSync(file);
    let pos = 12;
    let byteRate = 0;
    let dataSize = 0;
    while (pos + 8 <= buf.length) {
      const id = buf.toString("ascii", pos, pos + 4);
      const size = buf.readUInt32LE(pos + 4);
      if (id === "fmt ") byteRate = buf.readUInt32LE(pos + 8 + 8);
      if (id === "data") {
        dataSize = size;
        break;
      }
      pos += 8 + size + (size % 2);
    }
    return byteRate ? (dataSize / byteRate) * 1000 : 0;
  } catch {
    return 0;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let win = null;
let ff = null;
let lastBitmap = null;
let frameTimer = null;
let frameW = 0;
let frameH = 0;
let viewH = 720;
let framesWritten = 0;
let sceneStartWall = 0;
const result = [];

async function js(code) {
  try {
    return await win.webContents.executeJavaScript(code, true);
  } catch {
    return null;
  }
}

async function hideDev() {
  return js(
    `(()=>{
      if(!window.__ckHideDev){
        window.__ckHideDev = true;
        const st=document.createElement('style');
        st.textContent='nextjs-portal{display:none!important}';
        document.head&&document.head.appendChild(st);
        const hide=()=>{document.querySelectorAll('nextjs-portal').forEach(el=>el.style.setProperty('display','none','important'));};
        hide();
        try{ new MutationObserver(hide).observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
      }
      return true;})()`
  );
}

/** Bar alamat palsu di bawah layar, agar penonton tahu halaman yang dibuka. */
async function showUrlBar() {
  return js(
    `(()=>{
      let el=document.getElementById('ck-urlbar');
      if(!el){
        if(!document.body) return false;
        el=document.createElement('div'); el.id='ck-urlbar'; el.textContent=location.host + location.pathname;
        document.body.appendChild(el);
        const st=document.createElement('style');
        st.textContent='#ck-urlbar{position:fixed;left:0;right:0;bottom:0;z-index:2147483647;background:rgba(15,23,42,.93);color:#fff;font:600 12px/1.2 "Segoe UI",Arial,sans-serif;padding:9px 14px;letter-spacing:.3px;pointer-events:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}';
        document.head.appendChild(st);
      } else {
        el.textContent = location.host + location.pathname;
      }
      return true;})()`
  );
}

async function goto(url, settle = 1400) {
  const want = url.split("?")[0];

  // Navigasi + verifikasi URL. loadURL kadang dibatalkan (ERR_ABORTED),
  // jadi kita cek location.pathname dan paksa ulang bila perlu.
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      await win.loadURL(BASE + url);
    } catch {
      /* abaikan, dicek lewat pathname */
    }
    await sleep(500);
    let path = await js("location.pathname");
    if (path === want) break;

    // paksa lewat JS (navigasi keras)
    try {
      await js(`location.href = ${JSON.stringify(BASE + url)}; true`);
    } catch {
      /* abaikan */
    }
    await sleep(900);
    path = await js("location.pathname");
    if (path === want) break;

    console.warn(`  ⚠ goto ${url} (percobaan ${attempt}) — path=${path}`);
    await sleep(600);
  }

  await sleep(400);
  await hideDev();
  await showUrlBar();
  await sleep(Math.max(0, settle - 400));
  await hideDev();
  await showUrlBar();

  const finalPath = await js("location.pathname");
  if (finalPath !== want) console.warn(`  ⚠ HALAMAN TIDAK SESUAI: minta ${want}, dapat ${finalPath}`);
}

/** Mulai dari kondisi logout (hapus cookie sesi). */
async function clearSession() {
  try {
    await win.webContents.session.clearStorageData({ storages: ["cookies"] });
  } catch {
    /* abaikan */
  }
}

async function focusSel(selector) {
  return js(
    `(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)return false;el.focus();return true;})()`
  );
}

async function clickText(text) {
  return js(
    `(()=>{const t=${JSON.stringify(text)};const el=[...document.querySelectorAll('a,button')].find(x=>x.textContent.trim().toLowerCase().includes(t.toLowerCase()));if(!el)return false;el.click();return true;})()`
  );
}

async function scrollToY(y) {
  return js(`window.scrollTo(0, ${Math.round(y)}); true`);
}

async function scrollHeight() {
  const v = await js(`Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)`);
  return typeof v === "number" ? v : 0;
}

async function smoothScrollTo(targetY, durationMs = 1500) {
  const startY = (await js("window.scrollY")) || 0;
  const maxY = Math.max(0, (await scrollHeight()) - viewH);
  const endY = Math.min(targetY, maxY);
  const steps = Math.max(2, Math.round(durationMs / 40));
  for (let i = 1; i <= steps; i += 1) {
    await scrollToY(startY + (endY - startY) * (i / steps));
    await sleep(40);
  }
}

async function scrollThrough(durationMs = 2000) {
  const h = await scrollHeight();
  await smoothScrollTo(Math.max(0, h - viewH), durationMs);
}

const toTop = () => scrollToY(0);

/* ————— PRAKTEK: mengetik ke form ————— */

/** Cari input/textarea dari label (mendukung label[for] maupun label+input sebaris). */
const FIND_BY_LABEL = (label) =>
  `(()=>{const L=${JSON.stringify(String(label).toLowerCase())};const labels=[...document.querySelectorAll('label')];
    const l=labels.find(x=>x.textContent.trim().toLowerCase().startsWith(L));if(!l)return null;
    const id=l.getAttribute('for');if(id){const el=document.getElementById(id);if(el)return el;}
    const p=l.parentElement;return (p&&p.querySelector('input,textarea,select'))||null;})()`;

async function typeIntoLabel(label, text, delay = 42) {
  await js(`(()=>{const el=${FIND_BY_LABEL(label)};if(el)el.focus();return true;})()`);
  for (let i = 1; i <= text.length; i += 1) {
    const part = text.slice(0, i);
    await js(
      `(()=>{const el=${FIND_BY_LABEL(label)};if(!el)return false;
        const proto = el.tagName==='TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto,'value').set;
        setter.call(el, ${JSON.stringify(part)});
        el.dispatchEvent(new Event('input',{bubbles:true}));
        return true;})()`
    );
    await sleep(delay);
  }
}

async function typeIntoSelector(selector, text, delay = 42) {
  await focusSel(selector);
  for (let i = 1; i <= text.length; i += 1) {
    const part = text.slice(0, i);
    await js(
      `(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)return false;
        const proto = el.tagName==='TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(proto,'value').set;
        setter.call(el, ${JSON.stringify(part)});
        el.dispatchEvent(new Event('input',{bubbles:true}));
        return true;})()`
    );
    await sleep(delay);
  }
}

/** Mengetik ke editor Tiptap (contenteditable). */
async function typeIntoEditor(text, chunk = 3, delay = 45) {
  await js(`(()=>{const pm=document.querySelector('.ProseMirror');if(!pm)return false;pm.focus();return true;})()`);
  for (let i = 0; i < text.length; i += chunk) {
    const part = text.slice(i, i + chunk);
    await js(
      `(()=>{const pm=document.querySelector('.ProseMirror');if(!pm)return false;pm.focus();
        document.execCommand('insertText',false,${JSON.stringify(part)});return true;})()`
    );
    await sleep(delay);
  }
}

/* ————— Skenario (id sama dengan naskah.json) ————— */
const scenarios = {
  "01-login": async () => {
    // Mulai dari LOGOUT: buka /admin → otomatis diarahkan ke halaman login
    await goto("/admin", 2400);
    await sleep(1000);
    await typeIntoSelector("#email", ADMIN_EMAIL);
    await sleep(400);
    await typeIntoSelector("#password", ADMIN_PASSWORD);
    await sleep(700);
    await clickText("Masuk");
    for (let i = 0; i < 80; i += 1) {
      const ok = await js(`document.body && document.body.innerText.includes('Halo')`);
      if (ok) break;
      await sleep(150);
    }
    await sleep(1500);
  },
  "02-dashboard": async () => {
    await goto("/admin", 2000);
    await toTop();
    await sleep(900);
    await smoothScrollTo(520, 1400);
    await sleep(500);
    await smoothScrollTo(1150, 1400);
    await sleep(400);
    await toTop();
  },
  "03-slider": async () => {
    await goto("/admin/heroSlide", 1800);
    await sleep(800);
    await clickText("Add");
    await sleep(2000);
    // PRAKTEK mengisi form slide
    await typeIntoLabel("Judul", "Peluang kerja ke Jepang");
    await typeIntoLabel("Subjudul", "Program resmi dengan pelatihan dan pendampingan.");
    await typeIntoLabel("Label Tombol", "Lihat lowongan");
    await typeIntoLabel("Tautan Tombol", "/lowongan");
    await sleep(600);
    await scrollThrough(1500);
  },
  "04-artikel-daftar": async () => {
    await goto("/admin/posts", 2000);
    await sleep(900);
    await scrollThrough(1200);
    await toTop();
  },
  "05-artikel-editor": async () => {
    await goto("/admin/posts/new", 2600);
    await toTop();
    // PRAKTEK menulis artikel
    await typeIntoSelector(".ck-title-input", "Panduan menyiapkan paspor untuk CPMI");
    await sleep(400);
    await js(`(()=>{const pm=document.querySelector('.ProseMirror');if(pm)pm.scrollIntoView({block:'center'});return true;})()`);
    await sleep(600);
    await typeIntoEditor("Paspor adalah dokumen utama sebelum keberangkatan. Siapkan sejak awal agar proses penempatan berjalan lancar.");
    await sleep(700);
    await smoothScrollTo(700, 1400);
    await sleep(500);
    await scrollThrough(1400);
    await toTop();
  },
  "06-galeri": async () => {
    await goto("/admin/galeri", 2200);
    await sleep(700);
    await clickText("Tambah media");
    await sleep(1200);
    // PRAKTEK mengisi form galeri
    await typeIntoLabel("Judul", "Kegiatan sosialisasi CPMI");
    await typeIntoLabel("Caption", "Dokumentasi kegiatan sosialisasi bersama calon pekerja.");
    await sleep(600);
    await scrollThrough(1400);
  },
  "07-event": async () => {
    await goto("/admin/events", 2000);
    await sleep(700);
    await clickText("Event baru");
    await sleep(2200);
    // PRAKTEK mengisi form event
    await typeIntoSelector(".ck-title-input", "Pelatihan bahasa dan budaya kerja");
    await sleep(500);
    await typeIntoLabel("Deskripsi singkat", "Kelas persiapan sebelum keberangkatan bagi peserta BLK.");
    await sleep(600);
    await scrollThrough(1500);
  },
  "08-kategori": async () => {
    await goto("/admin/category", 2000);
    await sleep(1100);
  },
  "09-tag": async () => {
    await goto("/admin/tag", 2000);
    await sleep(1100);
  },
  "10-lowongan": async () => {
    await goto("/admin/job", 2000);
    await sleep(700);
    await clickText("Add");
    await sleep(2000);
    await typeIntoLabel("Negara", "Jepang");
    await typeIntoLabel("Posisi", "Operator produksi");
    await sleep(500);
    await scrollThrough(1300);
  },
  "11-cabang": async () => {
    await goto("/admin/branch", 2000);
    await sleep(800);
    await scrollThrough(1200);
  },
  "12-pendaftaran": async () => {
    await goto("/admin/registration", 2000);
    await sleep(1200);
  },
  "13-pesan": async () => {
    await goto("/admin/message", 2000);
    await sleep(1000);
    await js(
      `(()=>{const r=document.querySelector('table tbody tr');const a=r?r.querySelector('a'):null;if(a)a.click();else if(r)r.click();return true;})()`
    );
    await sleep(2200);
    await scrollThrough(1100);
  },
  "14-pengguna": async () => {
    await goto("/admin/user", 2000);
    await sleep(1100);
    await scrollThrough(1100);
  },
  "15-pengaturan": async () => {
    await goto("/admin/pengaturan", 2200);
    await sleep(900);
    // PRAKTEK mengisi data kontak
    await typeIntoLabel("Telepon kantor", "0341-000000");
    await typeIntoLabel("WhatsApp", "628123456789");
    await sleep(500);
    await smoothScrollTo(600, 1400);
    await scrollThrough(1800);
    await toTop();
  },
  "16-publik-beranda": async () => {
    await goto("/", 2200);
    await toTop();
    await sleep(900);
    await scrollThrough(2800);
    await toTop();
  },
  "17-publik-profil": async () => {
    await goto("/profil", 1800);
    await scrollThrough(1500);
  },
  "18-publik-layanan": async () => {
    await goto("/layanan", 1800);
    await sleep(800);
    await scrollThrough(2000);
  },
  "19-publik-lowongan": async () => {
    await goto("/lowongan", 1800);
    await sleep(700);
    await scrollThrough(1800);
  },
  "20-publik-galeri": async () => {
    await goto("/galeri", 2000);
    await sleep(800);
    await scrollThrough(2000);
  },
  "21-publik-event": async () => {
    await goto("/event", 1800);
    await sleep(700);
    await scrollThrough(1600);
  },
  "22-publik-cabang": async () => {
    await goto("/cabang", 1800);
    await sleep(800);
    await scrollThrough(1400);
  },
  "23-publik-blog": async () => {
    await goto("/blog", 1800);
    await sleep(700);
    await scrollThrough(1400);
    await goto("/blog/alur-izin-pulang-umum", 2000);
    await toTop();
    await sleep(700);
    await scrollThrough(1400);
  },
  "24-publik-kontak": async () => {
    await goto("/kontak", 1800);
    await sleep(700);
    await scrollThrough(1400);
  },
  "25-publik-daftar": async () => {
    await goto("/daftar", 1800);
    await sleep(800);
    // PRAKTEK mengisi formulir pendaftaran
    await typeIntoLabel("Nama lengkap", "Budi Santoso");
    await typeIntoLabel("NIK", "3507000000000000");
    await typeIntoLabel("Telepon", "081234567890");
    await typeIntoLabel("Email", "budi.contoh@email.com");
    await sleep(600);
    await scrollThrough(1400);
  },
  "26-outro": async () => {
    await goto("/", 2200);
    await toTop();
    await sleep(1500);
  }
};

/* ————— Perekaman per scene ————— */

let currentClip = null;

function startClip(id) {
  fs.mkdirSync(CLIPS, { recursive: true });
  const out = path.join(CLIPS, `${id}.mp4`);
  currentClip = out;
  framesWritten = 0;
  sceneStartWall = Date.now();
  ff = spawn(
    "ffmpeg",
    [
      "-y",
      "-f", "rawvideo",
      "-pix_fmt", "bgra",
      "-s", `${frameW}x${frameH}`,
      "-r", String(FPS),
      "-i", "-",
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-crf", "21",
      "-pix_fmt", "yuv420p",
      out
    ],
    { stdio: ["pipe", "ignore", "ignore"] }
  );
  return out;
}

function stopClip() {
  return new Promise((resolve) => {
    if (!ff) return resolve(null);
    const proc = ff;
    ff = null;
    proc.stdin.end();
    proc.on("close", () => resolve(proc));
  });
}

async function runAll() {
  // Pastikan mulai dari kondisi LOGOUT
  await clearSession();

  const only = process.env.ONLY ? new Set(process.env.ONLY.split(",").map((s) => s.trim())) : null;
  const scenes = only ? naskah.scenes.filter((s) => only.has(s.id)) : naskah.scenes;

  for (const scene of scenes) {
    const run = scenarios[scene.id];
    const audioMs = wavDurationMs(path.join(ROOT, "audio", `${scene.id}.wav`));
    const targetMs = LEAD_MS + audioMs + TAIL_MS;

    console.log(`\n▶  ${scene.id} — ${scene.title}  (narasi ${(audioMs / 1000).toFixed(1)}s)`);

    const out = startClip(scene.id);
    const t0 = sceneStartWall;

    if (run) await run();
    else await sleep(1200);

    // pastikan klip punya cukup frame: minimal sepanjang narasi + jeda
    const needFrames = Math.ceil((targetMs / 1000) * FPS);
    const waitStart = Date.now();
    while (framesWritten < needFrames && Date.now() - waitStart < 40000) {
      await sleep(100);
    }

    const durMs = Date.now() - t0;
    const frames = framesWritten;
    await stopClip();

    console.log(`   klip=${(frames / FPS).toFixed(1)}s (target ${(targetMs / 1000).toFixed(1)}s)`);
    result.push({ id: scene.id, title: scene.title, frames, ms: durMs, audioMs, targetMs, file: out });

    await sleep(250);
  }
}

app.whenReady().then(async () => {
  const work = screen.getPrimaryDisplay().workAreaSize;
  console.log(`Layar kerja: ${work.width}x${work.height}`);

  win = new BrowserWindow({
    width: work.width,
    height: work.height,
    useContentSize: true,
    show: false,
    webPreferences: { offscreen: true, backgroundThrottling: false }
  });
  win.webContents.setFrameRate(FPS);

  // NextAdmin menahan navigasi lewat beforeunload saat form berubah.
  // Untuk perekaman, kita izinkan meninggalkan halaman.
  win.webContents.on("will-prevent-unload", (event) => {
    event.preventDefault();
  });

  let resolveFirst;
  const firstPaint = new Promise((r) => {
    resolveFirst = r;
  });

  win.webContents.on("paint", (event, dirty, image) => {
    try {
      const bmp = image.toBitmap();
      const s = image.getSize();
      if (!frameW) {
        frameW = s.width;
        frameH = s.height;
        viewH = frameH;
        console.log(`Frame pertama: ${frameW}x${frameH}`);
        resolveFirst();
      }
      if (s.width === frameW && s.height === frameH) lastBitmap = bmp;
    } catch {
      /* abaikan */
    }
  });

  frameTimer = setInterval(() => {
    if (!lastBitmap || !ff || !ff.stdin.writable) return;
    // tulis frame sebanyak yang dibutuhkan agar timeline video = waktu nyata
    const target = Math.floor(((Date.now() - sceneStartWall) / 1000) * FPS);
    while (framesWritten < target) {
      if (ff.stdin.writableLength > MAX_BUFFER) break;
      ff.stdin.write(lastBitmap);
      framesWritten += 1;
    }
  }, 10);

  // perbarui bar alamat (untuk navigasi internal/SPA)
  setInterval(() => {
    showUrlBar();
  }, 700);

  win.loadURL(BASE + "/admin/login").catch(() => {});
  await Promise.race([firstPaint, sleep(20000)]);

  if (!frameW) {
    console.error("Tidak ada frame dari offscreen paint.");
    app.quit();
    return;
  }

  try {
    await runAll();
  } catch (err) {
    console.error("Gagal:", err);
  }

  clearInterval(frameTimer);
  fs.writeFileSync(path.join(ROOT, "clips.json"), JSON.stringify({ fps: FPS, width: frameW, height: frameH, scenes: result }, null, 2));

  console.log(`\nSelesai. ${result.length} klip di ${CLIPS}`);
  console.log("Lanjut: node scripts/tutorial/assemble-scenes.mjs");
  await sleep(300);
  app.exit(0);
});
