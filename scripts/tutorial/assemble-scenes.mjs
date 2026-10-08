/**
 * Rakit video tutorial dari klip per-scene + narasi.
 *
 * Alur:
 *   1. Untuk tiap scene: tempel narasi di klip-nya (jeda awal + narasi + sisa
 *      diisi senyap sampai durasi klip). → scenes/<id>.mp4
 *   2. Gabung semua scene berurutan → tutorial-lengkap.mp4
 *
 * Prasyarat: sudah menjalankan perekam Electron (menghasilkan clips/clips.json).
 * Pakai: node scripts/tutorial/assemble-scenes.mjs
 */
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve("docs/tutorial");
const CLIPS = path.join(ROOT, "clips");
const SCENES = path.join(ROOT, "scenes");
const LEAD = Number(process.env.LEAD_SEC || 0.6);

const meta = JSON.parse(readFileSync(path.join(ROOT, "clips.json"), "utf8"));
const FPS = meta.fps || 30;

await fs.mkdir(SCENES, { recursive: true });

const parts = [];

for (const sc of meta.scenes) {
  const clip = path.join(CLIPS, `${sc.id}.mp4`);
  const wav = path.join(ROOT, "audio", `${sc.id}.wav`);
  const clipDur = sc.frames / FPS;
  const sceneAudio = path.join(SCENES, `${sc.id}.wav`);
  const out = path.join(SCENES, `${sc.id}.mp4`);

  // audio: jeda awal + narasi, lalu di-pad sampai pas durasi klip
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-f", "lavfi",
      "-t", LEAD.toFixed(3),
      "-i", "anullsrc=r=24000:cl=mono",
      "-i", wav,
      "-filter_complex",
      `[0:a][1:a]concat=n=2:v=0:a=1,apad=whole_dur=${clipDur.toFixed(3)}[a]`,
      "-map", "[a]",
      "-c:a", "pcm_s16le",
      sceneAudio
    ],
    { stdio: "ignore" }
  );

  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i", clip,
      "-i", sceneAudio,
      "-c:v", "copy",
      "-c:a", "aac",
      "-b:a", "192k",
      "-ar", "44100",
      "-ac", "2",
      "-shortest",
      "-movflags", "+faststart",
      out
    ],
    { stdio: "ignore" }
  );

  parts.push(out);
  console.log(
    `OK  ${sc.id.padEnd(20)} klip=${clipDur.toFixed(1)}s  narasi=${(sc.audioMs / 1000).toFixed(1)}s`
  );
}

const listPath = path.join(SCENES, "list.txt");
await fs.writeFile(listPath, parts.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n"), "utf8");

const final = path.join(ROOT, "tutorial-lengkap.mp4");
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", listPath,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "192k",
    "-ar", "44100",
    "-ac", "2",
    "-movflags", "+faststart",
    final
  ],
  { stdio: "inherit" }
);

console.log(`\nSelesai: ${final}`);
