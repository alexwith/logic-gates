import { MouseEvent } from "react";
import { Pos } from "../../../common/types";
import PinEntity from "../../../entities/PinEntity";

interface Props {
  pin: PinEntity;
  pos: Pos;
  onMouseDown: (event: MouseEvent) => void;
  onHover?: (pin: PinEntity | null) => void;
}

const PIN_RADIUS = 8;

export default function Pin({ pin, pos, onMouseDown, onHover }: Props) {
  return (
    <circle
      className="fill-stone-950"
      cx={pos.x}
      cy={pos.y}
      r={PIN_RADIUS}
      onMouseDown={onMouseDown}
      onMouseEnter={() => onHover?.(pin)}
      onMouseLeave={() => onHover?.(null)}
    />
  );
}
