import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import { Pos } from "../common/types";

export default function useMouse(manualMouseOrigin?: boolean) {
  const [mouseOrigin, setMouseOrigin] = useState<Pos>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Pos>({
    x: 0,
    y: 0,
  });

  const updateOrigin = (event: ReactMouseEvent) => {
    setMouseOrigin({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (manualMouseOrigin) {
        return;
      }

      setMouseOrigin({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [manualMouseOrigin]);

  return {
    mousePosition,
    updateOrigin,
    mouseDragOffset: {
      x: mouseOrigin.x - mousePosition.x,
      y: mouseOrigin.y - mousePosition.y,
    },
  };
}
