import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

function PauseIcon({ paused }) {
  if (paused) {
    return (
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
        <path
          d="M6 3.5 12 8l-6 4.5v-9Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M6 3.5v9M10 3.5v9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ClientsMarquee({ clients }) {
  const reduceMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion) {
      setPaused(true);
    }
  }, [reduceMotion]);

  return (
    <section className="trust" aria-label="Selected clients">
      <div className="container trust-inner">
        <div className="trust-label-group">
          <p className="trust-label">Selected clients</p>
          <button
            type="button"
            className="trust-toggle"
            aria-pressed={paused}
            aria-label={paused ? "Play client list animation" : "Pause client list animation"}
            title={paused ? "Play client list" : "Pause client list"}
            onClick={() => setPaused((value) => !value)}
          >
            <PauseIcon paused={paused} />
          </button>
        </div>

        <div className="trust-marquee">
          <div className={`trust-track${paused ? " is-paused" : ""}`}>
            <ul className="trust-list">
              {clients.map((client) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
            <ul className="trust-list" aria-hidden="true">
              {clients.map((client) => (
                <li key={`${client}-duplicate`}>{client}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
