import GateTypeEntity from "../../../entities/GateTypeEntity";
import useContextMenu from "../../../hooks/useContextMenu";
import { SimulatorActions, useSimulatorStore } from "../../../store/simulatorStore";

interface Props {
  type: GateTypeEntity;
}

export default function GateType({ type }: Props) {
  const { handleContextMenu, showContextMenu } = useContextMenu(true);

  const setEditingGateType = useSimulatorStore(
    (actions: SimulatorActions) => actions.setEditingGateType,
  );
  const setAddingGateType = useSimulatorStore(
    (actions: SimulatorActions) => actions.setAddingGateType,
  );
  const updateActivity = useSimulatorStore((actions: SimulatorActions) => actions.updateActivity);
  const updateTruthTable = useSimulatorStore(
    (actions: SimulatorActions) => actions.updateTruthTable,
  );

  const handleEditClick = () => {
    setEditingGateType(type);
    updateTruthTable();
    updateActivity();
  };

  return (
    <div
      className="bg-violet-500 w-fit p-2 font-bold rounded-md select-none"
      draggable
      onDragStart={() => {
        setAddingGateType(type);
      }}
      onContextMenu={(event) => {
        if (type.terminals.length === 0) {
          return;
        }

        handleContextMenu(event);
      }}
    >
      {type.name}
      {showContextMenu && (
        <div className="absolute bg-zinc-800 rounded-md flex flex-col overflow-hidden text-center z-30">
          <h1 className="font-bold text-center text-md bg-zinc-700 px-2">{type.name}</h1>
          <div className="m-1">
            <div
              className="px-2 w-20 rounded-sm font-bold text-sm hover:bg-violet-500 hover:cursor-pointer"
              onClick={handleEditClick}
            >
              Edit
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
