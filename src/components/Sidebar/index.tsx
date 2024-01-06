import { ChangeEvent, KeyboardEvent, useRef } from "react";
import { PiCircuitryFill as CircuitIcon } from "react-icons/pi";
import { LuTable2 as TableIcon } from "react-icons/lu";
import { EditorState, useEditorStore } from "../../store";
import { GateMeta } from "../../common/types";
import TruthTable from "../TruthTable";

export default function Sidebar() {
  const gateNameRef: any = useRef();

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
    const inputs: number = terminals.filter((pin) => pin.input).length;
    const outputs: number = terminals.length - inputs;

    const truthTable: any = {};
    currentTruthTable.forEach((line) => {
      const inputValues = line.slice(0, inputs);
      const outputValues = line.slice(inputs);
      truthTable[inputValues.toString()] = outputValues;
    });

    const { value: name } = gateNameRef.current;
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
  };

  return (
    <div className="flex flex-col space-y-2 h-fit w-[200px] rounded-lg bg-zinc-800 font-medium text-md p-2">
      <input
        className="font-bold text-xl px-2 bg-transparent placeholder:text-zinc-600 outline-none"
        ref={gateNameRef}
        type="text"
        placeholder="NAME"
        onKeyDown={handleGateNameKeydown}
        onChange={handleGateNameChange}
      />
      <div
        className="flex space-x-1 items-center px-2 py-1 rounded-md hover:cursor-pointer hover:bg-zinc-700"
        onClick={handleCreateClick}
      >
        <CircuitIcon size={20} />
        <p>Create circuit</p>
      </div>
      <div className="w-full h-[2px] rounded-full bg-zinc-700" />
      <div className="px-2">
        <div className="flex space-x-1 items-center">
          <TableIcon size={20} />
          <h1 className="my-2">Truth table</h1>
        </div>
        <div className="overflow-scroll max-h-44">
          <TruthTable pins={terminals} truthTable={currentTruthTable} />
        </div>
      </div>
    </div>
  );
}
