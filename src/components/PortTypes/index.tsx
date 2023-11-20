import { DiagramState, useDiagramStore } from "../../store";

export default function PortTypes() {
  const portTypes = useDiagramStore((state: DiagramState) => state.portTypes);

  const setAddingPortType = useDiagramStore((state: DiagramState) => state.setAddingPortType);

  return (
    <div className="flex space-x-2 mb-4">
      {portTypes.map((type, i) => (
        <div
          className="bg-violet-500 w-fit p-2 font-bold rounded-md select-none"
          key={i}
          draggable
          onDragStart={() => {
            setAddingPortType(type);
          }}
        >
          {type.name}
        </div>
      ))}
    </div>
  );
}
