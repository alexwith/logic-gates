import { useEffect, useState } from "react";
import { Pos } from "../common/types";

export default function useMouse() {
  const [mouseOrigin, setMouseOrigin] = useState<Pos>({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState<Pos>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = (event: MouseEvent) => {
      setMouseOrigin({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return {
    mousePosition,
    mouseDragOffset: {
      x: mouseOrigin.x - mousePosition.x,
      y: mouseOrigin.y - mousePosition.y,
    },
  };
}
