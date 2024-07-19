import { MouseEvent } from "react";
import { Pos } from "../../../common/types";
import PinEntity from "../../../entities/PinEntity";

interface Props {
  pin: PinEntity;
  pos: Pos;
  onMouseDown: (event: MouseEvent) => void;
  setLastPin: (pin: PinEntity | null) => void;
}

const PIN_RADIUS = 10;

export default function Pin({ pin, pos, onMouseDown, setLastPin }: Props) {
  return (
    <circle
      className="fill-stone-950"
      cx={pos.x}
      cy={pos.y}
      r={PIN_RADIUS}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setLastPin(pin)}
      onMouseLeave={() => setLastPin(null)}
    />
  );
}
