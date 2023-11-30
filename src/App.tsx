import { ChangeEvent, KeyboardEvent, useRef } from "react";
import Diagram from "./components/Diagram";
import { GateMeta } from "./common/types";
import TruthTable from "./components/TruthTable";
import GateTypes from "./components/GateTypes";
import { DiagramState, useDiagramStore } from "./store";

export default function App() {
  const gateNameRef: any = useRef();

  const terminals = useDiagramStore((state: DiagramState) => state.terminals);
  const currentTruthTable = useDiagramStore((state: DiagramState) => state.currentTruthTable);

  const addGateType = useDiagramStore((state: DiagramState) => state.addGateType);
  const clearDiagram = useDiagramStore((state: DiagramState) => state.clear);
  const addTerminal = useDiagramStore((state: DiagramState) => state.addTerminal);

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
    clearDiagram();

    gateNameRef.current.value = "";
  };

  const handleAddTerminalClick = (input: boolean) => {
    addTerminal(input);
  };

  return (
    <div className="mx-14">
      <h1 className="font-black text-3xl my-6">Logic Gates</h1>
      <div className="my-6">
        <div className="mb-4">
          <GateTypes />
          <div className="flex">
            <input
              className="font-bold text-2xl bg-transparent placeholder:text-slate-700 outline-none"
              ref={gateNameRef}
              type="text"
              placeholder="NAME"
              onKeyDown={handleGateNameKeydown}
              onChange={handleGateNameChange}
            />
            <div className="ml-auto flex space-x-2 font-bold text-md ">
              <div
                className="bg-cyan-500 w-fit px-2 py-1 rounded-md hover:cursor-pointer"
                onClick={handleCreateClick}
              >
                Create
              </div>
              <div
                className="bg-cyan-500 w-fit px-2 py-1 rounded-md hover:cursor-pointer"
                onClick={() => handleAddTerminalClick(true)}
              >
                Add Input
              </div>
              <div
                className="bg-cyan-500 w-fit px-2 py-1 rounded-md hover:cursor-pointer"
                onClick={() => handleAddTerminalClick(false)}
              >
                Add Output
              </div>
            </div>
          </div>
        </div>
        <Diagram />
        <div>
          <h1 className="font-bold text-2xl mt-4">Circuit Information</h1>
          <div>
            <h1 className="font-bold">Truth Table</h1>
            <TruthTable pins={terminals} truthTable={currentTruthTable} />
          </div>
        </div>
      </div>
    </div>
  );
}
