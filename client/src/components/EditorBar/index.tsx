import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { IoCreateOutline as CreateIcon } from "react-icons/io5";
import { LuTable2 as TableIcon } from "react-icons/lu";
import { EditorState, useEditorStore } from "../../store";
import TruthTable from "../TruthTable";
import { GateMeta } from "../../common/types";
import { toast } from "react-toastify";

export function EditorBar() {
  const gateNameRef: any = useRef<any>(null);

  const [showTruthTable, setShowTruthTable] = useState<boolean>(false);

  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const currentTruthTable = useEditorStore((state: EditorState) => state.currentTruthTable);

  const addGateType = useEditorStore((state: EditorState) => state.addGateType);
  const clearEditor = useEditorStore((state: EditorState) => state.clear);

  const handleGateNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
  };

  const handleGateNameKeydown = (event: KeyboardEvent) => {
    if (/[^A-Za-z0-9]+/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleCreateClick = () => {
    if (currentTruthTable.length === 0) {
      toast.error("You must first create a valid circuit.");
      return;
    }

    const { value: name } = gateNameRef.current;
    if (name == null || name.length < 1) {
      toast.error("You must provide a name for the circuit.");
      return;
    }

    const inputs: number = terminals.filter((pin) => pin.input).length;
    const outputs: number = terminals.length - inputs;

    const truthTable: any = {};
    currentTruthTable.forEach((line) => {
      const inputValues = line.slice(0, inputs);
      const outputValues = line.slice(inputs);
      truthTable[inputValues.toString()] = outputValues;
    });

    const gate: GateMeta = {
      id: -1,
      name,
      pos: { x: 0, y: 0 },
      height: 60,
      width: 30 + 15 * name.length,
      inputs,
      outputs,
      truthTable,
    };

    addGateType(gate);
    clearEditor();

    gateNameRef.current.value = "";

    toast.success("Created new circuit.");
  };

  return (
    <div className="relative flex justify-between">
      <input
        className="font-bold text-xl px-2 bg-transparent placeholder:text-zinc-600 outline-none"
        ref={gateNameRef}
        type="text"
        placeholder="NAME"
        onKeyDown={handleGateNameKeydown}
        onChange={handleGateNameChange}
      />
      <div className="flex space-x-2">
        <div
          onClick={handleCreateClick}
          className="flex space-x-1 items-center px-2 py-1 rounded-md font-bold bg-violet-500 hover:cursor-pointer"
        >
          <CreateIcon size={20} />
          <p>Create circuit</p>
        </div>
        <div
          onMouseEnter={() => setShowTruthTable(true)}
          onMouseLeave={() => setShowTruthTable(false)}
        >
          <div className="flex space-x-1 items-center px-2 py-1 rounded-md font-bold bg-violet-500 hover:cursor-pointer">
            <TableIcon size={20} />
            <p>Truth table</p>
          </div>
          {showTruthTable ? (
            <div className="absolute overflow-scroll max-h-44 no-scrollbar z-10 right-0">
              <TruthTable pins={terminals} truthTable={currentTruthTable} />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
