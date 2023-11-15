import { Pos } from "../../common/types";

interface Props {
  id: string;
  pos: Pos;
  input: boolean;
  label?: string;
  global?: boolean;  
  setIsConnectingPin: (isDragging: boolean) => void;
  setSelectedPin: (id: string) => void;
  setLastPin: (id: string | null) => void;
  toggleActive?: () => void; // only for global pins
}

const PIN_RADIUS = 10;

export default function Pin({
  id,
  pos,
  input,
  label,
  global,  
  setIsConnectingPin,
  setSelectedPin,
  setLastPin,
  toggleActive,
}: Props) {
  const handleClick = () => {    
    if (!global || !input) {
      return;
    }

    toggleActive!();
  };

  const handleMouseDown = () => {
    setIsConnectingPin(true);
    setSelectedPin(id);
  };

  return (
    <>
      <circle
        className="fill-stone-950"
        cx={pos.x}
        cy={pos.y}
        r={PIN_RADIUS}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setLastPin(id)}
        onMouseLeave={() => setLastPin(null)}
      />
      {label && (
        <text
          className="fill-white select-none"
          x={pos.x + (input ? -1 : 1) * 25}
          y={pos.y + PIN_RADIUS / 4}
          dominantBaseline="middle"
          textAnchor="middle"
          fontWeight={"bold"}
          fontSize={25}
          fontFamily={"Inter"}
        >
          {label}
        </text>
      )}
    </>
  );
}
