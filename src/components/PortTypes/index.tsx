import { useDispatch, useSelector } from "react-redux";
import { DiagramState } from "../../reducers/diagramReducer";

export default function PortTypes() {
  const dispatch = useDispatch();
  const types = useSelector((state: DiagramState) => state.portTypes);

  return (
    <div className="flex space-x-2 mb-4">
      {types.map((type, i) => (
        <div
          className="bg-violet-500 w-fit p-2 font-bold rounded-md select-none"
          key={i}
          draggable
          onDragStart={() => {
            dispatch({ type: "SET_ADDING_PORT_TYPE", payload: type });
          }}
        >
          {type.name}
        </div>
      ))}
    </div>
  );
}
