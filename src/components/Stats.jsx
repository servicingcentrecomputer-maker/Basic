import { useEffect, useRef, useState } from "react";
import { useInViewOnce } from "../hooks/useInViewOnce.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

const numberFormat = new Intl.NumberFormat("en-US");

function Stat({ stat }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.6, rootMargin: "0px" });
  const reduceMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? stat.value : 0);
  const animatedValue = useRef(null);

  useEffect(() => {
    if (reduceMotion) {
      animatedValue.current = stat.value;
      setDisplay(stat.value);
      return undefined;
    }

    if (!inView || animatedValue.current === stat.value) {
      return undefined;
    }

    if (stat.value === 0) {
      animatedValue.current = stat.value;
      setDisplay(stat.value);
      return undefined;
    }

    const duration = 1400;
    const start = performance.now();
    let frame = 0;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(stat.value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        animatedValue.current = stat.value;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, stat.value]);

  const formatted = `${stat.prefix ?? ""}${numberFormat.format(display)}${stat.suffix ?? ""}`;

  return (
    <div className="stat" ref={ref}>
      <strong aria-hidden="true">{formatted}</strong>
      <span aria-hidden="true">{stat.label}</span>
      <span className="visually-hidden">
        {`${stat.prefix ?? ""}${numberFormat.format(stat.value)}${stat.suffix ?? ""} — ${stat.label}`}
      </span>
    </div>
  );
}

export default function Stats({ stats }) {
  return (
    <div className="hero-proof">
      {stats.map((stat) => (
        <Stat key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
