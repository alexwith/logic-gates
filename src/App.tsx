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

  return (
    <div className="flex flex-col items-center">
      <div>
        <h1 className="font-black text-3xl my-6">Logic Gates</h1>
        <div className="flex space-x-20">
          <div className="flex flex-col space-y-2 h-[700px] w-[200px] rounded-lg border-slate-700 border-4 font-bold text-md p-2">
            <input
              className="font-bold text-xl bg-transparent placeholder:text-slate-700 outline-none"
              ref={gateNameRef}
              type="text"
              placeholder="NAME"
              onKeyDown={handleGateNameKeydown}
              onChange={handleGateNameChange}
            />
            <div
              className="bg-violet-500 px-2 py-1 rounded-md hover:cursor-pointer hover:bg-violet-600"
              onClick={handleCreateClick}
            >
              Create
            </div>
            <div>
              <h1 className="my-2">Truth Table</h1>
              <div className="overflow-x-scroll">
                <TruthTable pins={terminals} truthTable={currentTruthTable} />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[1200px] space-y-2">
            <Diagram />
            <GateTypes />
          </div>
        </div>
      </div>
    </div>
  );
}
