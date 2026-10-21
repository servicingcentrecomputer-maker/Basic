import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function HeroVisual({ availability }) {
  const ref = useRef(null);
  const frameRequest = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const reduceMotion = usePrefersReducedMotion();

  function paint() {
    const node = ref.current;
    const goal = target.current;
    const value = current.current;

    value.x += (goal.x - value.x) * 0.18;
    value.y += (goal.y - value.y) * 0.18;

    if (node) {
      node.style.setProperty("--frame-x", `${(value.x * 14).toFixed(2)}px`);
      node.style.setProperty("--frame-y", `${(value.y * 10).toFixed(2)}px`);
      node.style.setProperty("--frame-rx", `${(value.y * -5).toFixed(2)}deg`);
      node.style.setProperty("--frame-ry", `${(value.x * 7).toFixed(2)}deg`);
      node.style.setProperty("--badge-x", `${(value.x * -22).toFixed(2)}px`);
      node.style.setProperty("--badge-y", `${(value.y * -16).toFixed(2)}px`);
      node.style.setProperty("--note-x", `${(value.x * 20).toFixed(2)}px`);
      node.style.setProperty("--note-y", `${(value.y * 14).toFixed(2)}px`);
    }

    if (Math.abs(goal.x - value.x) > 0.001 || Math.abs(goal.y - value.y) > 0.001) {
      frameRequest.current = requestAnimationFrame(paint);
    } else {
      frameRequest.current = 0;
    }
  }

  const startPaint = () => {
    if (!frameRequest.current) {
      frameRequest.current = requestAnimationFrame(paint);
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(frameRequest.current);
  }, []);

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType === "touch" || !ref.current) {
      return;
    }
    const bounds = ref.current.getBoundingClientRect();
    target.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };
    startPaint();
  };

  const resetPointer = () => {
    target.current = { x: 0, y: 0 };
    startPaint();
  };

  return (
    <div
      className="hero-visual"
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="hero-frame">
        <img
          src="/assets/hero.svg"
          alt="Editorial poster showing a website layout with warm terracotta shapes, cream panels, and the words Good design, quietly done."
          width="900"
          height="1080"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div
        className={`hero-badge${availability.available ? "" : " status-dot--closed"}`}
      >
        <span
          className={`status-dot${availability.available ? "" : " status-dot--closed"}`}
          aria-hidden="true"
        />
        {availability.booking}
      </div>

      <div className="hero-note">
        <p>Design &amp; code, under one roof.</p>
        <span>No hand-offs</span>
      </div>
    </div>
  );
}
