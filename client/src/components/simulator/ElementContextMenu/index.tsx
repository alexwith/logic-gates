import { MouseEvent } from "react";
import { dispatchEditorChanges } from "../../../utils/editorChangesEvent";

interface Props {
  name: string;
  show: boolean;
  handleDeleteClick: (event: MouseEvent) => void;
}

export default function ElementContextMenu({ name, show, handleDeleteClick }: Props) {
  return (
    <div
      className="absolute bg-zinc-800 rounded-md flex flex-col overflow-hidden text-center"
      style={{ display: show ? "block" : "none" }}
    >
      <h1 className="font-bold text-center text-lg bg-zinc-700 px-2">{name}</h1>
      <div className="m-2">
        <div
          className="px-2 rounded-md font-bold hover:bg-violet-500 hover:cursor-pointer"
          onClick={(event) => {
            handleDeleteClick(event);
            dispatchEditorChanges();
          }}
        >
          Delete
        </div>
      </div>
    </div>
  );
}
