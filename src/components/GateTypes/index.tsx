import { DiagramState, useDiagramStore } from "../../store";

export default function GateTypes() {
  const gateTypes = useDiagramStore((state: DiagramState) => state.gateTypes);

  const setAddingGateType = useDiagramStore((state: DiagramState) => state.setAddingGateType);

  return (
    <div className="flex space-x-2 mb-4">
      {gateTypes.map((type, i) => (
        <div
          className="bg-violet-500 w-fit p-2 font-bold rounded-md select-none"
          key={i}
          draggable
          onDragStart={() => {
            setAddingGateType(type);
          }}
        >
          {type.name}
        </div>
      ))}
    </div>
  );
}
