"use client";

import { useEffect, useState } from "react";

function isVideoItem(item) {
  if (item?.mediaType === "VIDEO") return true;
  return /\.(mp4|webm|mov)(\?|$)/i.test(String(item?.image || ""));
}

export default function GaleriGrid({ items }) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <div className="galeri-grid">
        {items.map((item) => {
          const video = isVideoItem(item);
          return (
            <figure
              key={item.id}
              className="galeri-item"
              role="button"
              tabIndex={0}
              onClick={() => setActive(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(item);
                }
              }}
            >
              {video ? (
                <video
                  src={item.image}
                  width={640}
                  height={400}
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={item.caption || item.title}
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.caption || item.title}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <figcaption>{item.caption || item.title}</figcaption>
            </figure>
          );
        })}
      </div>

      {active ? (
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setActive(null);
          }}
        >
          <button type="button" className="lightbox-close" onClick={() => setActive(null)} aria-label="Tutup">
            ×
          </button>
          <figure className="lightbox-figure">
            {isVideoItem(active) ? (
              <video src={active.image} controls autoPlay playsInline />
            ) : (
              <img src={active.image} alt={active.caption || active.title} />
            )}
            <figcaption>{active.caption || active.title}</figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
