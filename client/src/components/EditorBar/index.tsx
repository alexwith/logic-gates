import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { IoCreateOutline as CreateIcon } from "react-icons/io5";
import { LuTable2 as TableIcon } from "react-icons/lu";
import { HiOutlineSave as SaveIcon, HiOutlineUpload as UploadIcon } from "react-icons/hi";
import { EditorState, useEditorStore } from "../../store";
import TruthTable from "../TruthTable";
import { toast } from "react-toastify";
import { deserializeCircuit, serializeCircuit } from "../../libs/circuitFile";
import GateTypeEntity from "../../entities/GateTypeEntity";

export function EditorBar() {
  const gateNameRef: any = useRef<any>(null);

  const [showTruthTable, setShowTruthTable] = useState<boolean>(false);

  const gates = useEditorStore((state: EditorState) => state.gates);
  const gateTypes = useEditorStore((state: EditorState) => state.gateTypes);
  const wires = useEditorStore((state: EditorState) => state.wires);
  const terminals = useEditorStore((state: EditorState) => state.terminals);
  const currentTruthTable = useEditorStore((state: EditorState) => state.currentTruthTable);

  const setGateTypes = useEditorStore((state: EditorState) => state.setGateTypes);
  const setGates = useEditorStore((state: EditorState) => state.setGates);
  const setTerminals = useEditorStore((state: EditorState) => state.setTerminals);
  const setWires = useEditorStore((state: EditorState) => state.setWires);
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

  const handleImportClick = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const file = files[0];
    event.target.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      const buffer: ArrayBuffer = reader.result as ArrayBuffer;
      const [gateTypes, gates, terminals, wires] = deserializeCircuit(buffer)!;
      setGateTypes(gateTypes);
      setGates(gates);
      setTerminals(terminals);
      setWires(wires);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSaveClick = () => {
    const data = serializeCircuit(gateTypes, gates, terminals, wires);
    const fileURL = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));

    const downloadElement = document.createElement("a");
    downloadElement.setAttribute("download", "test.circuit");
    downloadElement.href = fileURL;
    document.body.appendChild(downloadElement);

    window.requestAnimationFrame(() => {
      downloadElement.dispatchEvent(new MouseEvent("click"));
      document.body.removeChild(downloadElement);
    });
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

    const inputs: number = terminals.filter((pin) => pin.io).length;
    const outputs: number = terminals.length - inputs;

    const gate: GateTypeEntity = new GateTypeEntity(name, inputs, outputs, currentTruthTable);
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
        <div>
          <input
            className="opacity-0 absolute -z-10"
            type="file"
            id="import-button"
            onChange={handleImportClick}
          />
          <label
            className="flex space-x-1 items-center px-2 py-1 rounded-md font-bold bg-violet-500 hover:cursor-pointer"
            htmlFor="import-button"
          >
            <UploadIcon size={20} />
            <p>Import</p>
          </label>
        </div>
        <div
          onClick={handleSaveClick}
          className="flex space-x-1 items-center px-2 py-1 rounded-md font-bold bg-violet-500 hover:cursor-pointer"
        >
          <SaveIcon size={20} />
          <p>Save</p>
        </div>
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
          {showTruthTable && (
            <div className="absolute overflow-scroll max-h-44 no-scrollbar z-10 right-0">
              <TruthTable terminals={terminals} truthTable={currentTruthTable} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
