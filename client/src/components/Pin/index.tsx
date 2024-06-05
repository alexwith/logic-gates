import { MouseEvent } from "react";
import { Pos } from "../../common/types";

interface Props {
  id: string;
  pos: Pos;
  onMouseDown: (event: MouseEvent) => void;
  setLastPin: (id: string | null) => void;
}

const PIN_RADIUS = 10;

export default function Pin({ id, pos, onMouseDown, setLastPin }: Props) {
  return (
    <circle
      className="fill-stone-950"
      cx={pos.x}
      cy={pos.y}
      r={PIN_RADIUS}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setLastPin(id)}
      onMouseLeave={() => setLastPin(null)}
    />
  );
}
