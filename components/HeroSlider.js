"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DEMO_IMAGES } from "@/lib/demo-images";

const SLIDES = [
  {
    src: DEMO_IMAGES.hero,
    title: "Penempatan CPMI terarah",
    subtitle: "Pendampingan dari minat lowongan hingga persiapan dokumen dan BLK."
  },
  {
    src: DEMO_IMAGES.lowongan["tw-caregiver"],
    title: "Siap menuju Taiwan",
    subtitle: "Contoh minat caregiver, pabrik, dan sektor informal."
  },
  {
    src: DEMO_IMAGES.lowongan["hk-prt"],
    title: "Peluang di Hong Kong",
    subtitle: "Informasi umum PRT dan perawat lansia — detail saat daftar."
  },
  {
    src: DEMO_IMAGES.lowongan["my-pabrik"],
    title: "Malaysia & Singapura",
    subtitle: "Contoh minat produksi dan jasa untuk calon pekerja migran."
  }
];

const INTERVAL_MS = 5500;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((next) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timerRef.current);
  }, [paused]);

  return (
    <section
      className="hero-slider"
      aria-label="Slider beranda CKS"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`hero-slide${i === index ? " is-active" : ""}`}
          aria-hidden={i !== index}
        >
          {/* img biasa: file demo lokal, hindari next/image w=3840 yang gagal */}
          <img
            src={slide.src}
            alt=""
            className="hero-slide-photo"
            decoding={i === 0 ? "sync" : "async"}
            fetchPriority={i === 0 ? "high" : "low"}
          />
          <div className="hero-slide-overlay" aria-hidden="true" />
          <div className="container hero-slide-inner">
            <div className="hero-slide-copy">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <div className="hero-actions">
                <Link href="/daftar" className="btn btn-primary">
                  Daftar CPMI
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="hero-nav hero-nav-prev"
        aria-label="Slide sebelumnya"
        onClick={prev}
      >
        ‹
      </button>
      <button
        type="button"
        className="hero-nav hero-nav-next"
        aria-label="Slide berikutnya"
        onClick={next}
      >
        ›
      </button>

      <div className="hero-dots" role="tablist" aria-label="Pilih slide">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Slide ${i + 1}: ${slide.title}`}
            className={`hero-dot${i === index ? " is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
