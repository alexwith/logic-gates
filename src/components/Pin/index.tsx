import { Pos } from "../../common/types";
import { DiagramState, useDiagramStore } from "../../store";

interface Props {
  id: string;
  pos: Pos;
  setIsConnectingPin: (isDragging: boolean) => void;
  setLastPin: (id: string | null) => void;
}

const PIN_RADIUS = 10;

export default function Pin({ id, pos, setIsConnectingPin, setLastPin }: Props) {
  const setSelectedPin = useDiagramStore((state: DiagramState) => state.setSelectedPin);

  const handleMouseDown = () => {
    setIsConnectingPin(true);
    setSelectedPin(id);
  };

  return (
    <circle
      className="fill-stone-950"
      cx={pos.x}
      cy={pos.y}
      r={PIN_RADIUS}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setLastPin(id)}
      onMouseLeave={() => setLastPin(null)}
    />
  );
}
