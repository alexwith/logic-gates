import { useDispatch } from "react-redux";
import { Pos } from "../../common/types";

interface Props {
  id: string;
  pos: Pos;
  input: boolean;
  label?: string;
  global?: boolean;
  setIsConnectingPin: (isDragging: boolean) => void;
  setLastPin: (id: string | null) => void;  
}

const PIN_RADIUS = 10;

export default function Pin({
  id,
  pos,
  input,
  label,
  global,
  setIsConnectingPin,
  setLastPin,
}: Props) {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!global || !input) {
      return;
    }

    dispatch({ type: "TOGGLE_GLOBAL_PIN", payload: id });    
  };

  const handleMouseDown = () => {
    setIsConnectingPin(true);

    dispatch({ type: "SET_SELECTED_PIN", payload: id });
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
