import { useState } from "react";
import { LuTable2 as TableIcon } from "react-icons/lu";
import BasicButton from "../BasicButton";
import { EditorState, useEditorStore } from "../../../store";
import TruthTable from "../../editor/TruthTable";

export default function TruthTableButton() {
  const [show, setShow] = useState<boolean>(false);

  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const currentTruthTable = useEditorStore((state: EditorState) => state.currentTruthTable);

  return (
    <div className="relative">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <BasicButton name="Truth Table" icon={<TableIcon size={20} />} />
        {show && (
          <div className="absolute overflow-scroll max-h-44 no-scrollbar z-10 right-0">
            <TruthTable terminals={terminals} truthTable={currentTruthTable} />
          </div>
        )}
      </div>
    </div>
  );
}
