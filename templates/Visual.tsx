import { useEffect, useRef } from "react";
import * as React from "react";
import p5 from "p5";

type VisualProps<T> = {
  func: (p: p5, config?: T) => { setup: () => void; draw: () => void };
  config?: T;
};

export function Visual<T>({ func, config }: VisualProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sketch = (p: p5) => {
      const system = func(p, config);
      p.setup = () => system.setup();
      p.draw = () => system.draw();
    };

    const instance = new p5(sketch, containerRef.current!);
    return () => instance.remove();
  }, [config]);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 backdrop-blur-md">
      <div className="relative z-10" ref={containerRef} />
    </div>
  );
}
