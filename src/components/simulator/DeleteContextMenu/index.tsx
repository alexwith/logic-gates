import { MouseEvent } from "react";
import { SimulatorActions, useSimulatorStore } from "../../../store/simulatorStore";
import { dispatchEditorChanges } from "../../../utils/editorChangesEvent";

interface Props {
  name: string;
  show: boolean;
  handleDeleteClick: (event: MouseEvent) => void;
}

export default function ElementContextMenu({ name, show, handleDeleteClick }: Props) {
  const updateActivity = useSimulatorStore((actions: SimulatorActions) => actions.updateActivity);
  const updateTruthTable = useSimulatorStore(
    (actions: SimulatorActions) => actions.updateTruthTable,
  );

  return (
    <div
      className="absolute bg-zinc-800 rounded-md flex flex-col overflow-hidden text-center z-30"
      style={{ display: show ? "block" : "none" }}
    >
      <h1 className="font-bold text-center text-md bg-zinc-700 px-2">{name}</h1>
      <div className="m-1">
        <div
          className="px-2 rounded-sm font-bold text-sm hover:bg-violet-500 hover:cursor-pointer"
          onClick={(event) => {
            handleDeleteClick(event);
            dispatchEditorChanges();
            updateTruthTable();
            updateActivity();
          }}
        >
          Delete
        </div>
      </div>
    </div>
  );
}
