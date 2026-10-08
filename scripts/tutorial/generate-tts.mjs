/**
 * Generate narasi tutorial dengan Gemini TTS (voice: Leda).
 *
 * Pakai:
 *   $env:GOOGLE_API_KEY="..."; node scripts/tutorial/generate-tts.mjs
 *
 * Opsional:
 *   GEMINI_TTS_MODEL  (default: dari naskah.json — gemini-3.8-flash-tts)
 *   GEMINI_TTS_VOICE  (default: dari naskah.json — Leda)
 *   ONLY=01-login,02-dashboard   (hanya scene tertentu)
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("docs/tutorial");
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("GOOGLE_API_KEY belum diset.");
  process.exit(1);
}

const naskah = JSON.parse(await fs.readFile(path.join(ROOT, "naskah.json"), "utf8"));
const MODEL = process.env.GEMINI_TTS_MODEL || naskah.model || "gemini-3.8-flash-tts";
const VOICE = process.env.GEMINI_TTS_VOICE || naskah.voice || "Leda";
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(",").map((s) => s.trim())) : null;

const outDir = path.join(ROOT, "audio");
await fs.mkdir(outDir, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

console.log(`Model: ${MODEL} | Voice: ${VOICE} | ${naskah.scenes.length} scene`);

let ok = 0;
let gagal = 0;

for (const scene of naskah.scenes) {
  if (ONLY && !ONLY.has(scene.id)) continue;

  const out = path.join(outDir, `${scene.id}.wav`);
  const body = {
    contents: [{ parts: [{ text: scene.text }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } }
    }
  };

  let done = false;
  for (let attempt = 1; attempt <= 3 && !done; attempt += 1) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const t = await res.text();
        console.error(`  ${scene.id} gagal (HTTP ${res.status}): ${t.slice(0, 160)}`);
        await sleep(1500 * attempt);
        continue;
      }
      const json = await res.json();
      const part = json?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
      if (!part?.inlineData?.data) {
        console.error(`  ${scene.id}: tidak ada audio pada respons.`);
        continue;
      }
      await fs.writeFile(out, Buffer.from(part.inlineData.data, "base64"));
      console.log(`OK  ${scene.id}.wav (${part.inlineData.mimeType})`);
      ok += 1;
      done = true;
    } catch (err) {
      console.error(`  ${scene.id} error: ${err.message}`);
      await sleep(1500 * attempt);
    }
  }
  if (!done) gagal += 1;
  await sleep(400);
}

console.log(`\nSelesai. Berhasil: ${ok}, gagal: ${gagal}. Output: docs/tutorial/audio/`);
