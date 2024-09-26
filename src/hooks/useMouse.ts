import { MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import { Pos } from "../common/types";

export default function useMouse(manualMouseOrigin?: boolean, ignoreMouseUp?: boolean) {
  const [mouseOrigin, setMouseOrigin] = useState<Pos | null>(null);
  const [mousePosition, setMousePosition] = useState<Pos>({
    x: 0,
    y: 0,
  });

  const updateOrigin = (event: ReactMouseEvent) => {
    setMouseOrigin({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (manualMouseOrigin) {
        return;
      }

      setMouseOrigin({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = () => {
      setMouseOrigin(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    if (!ignoreMouseUp) {
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);

      if (!ignoreMouseUp) {
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [manualMouseOrigin, ignoreMouseUp]);

  return {
    mousePosition,
    updateOrigin,
    mouseDragOffset: {
      x: !mouseOrigin ? 0 : mouseOrigin.x - mousePosition.x,
      y: !mouseOrigin ? 0 : mouseOrigin.y - mousePosition.y,
    },
  };
}
