import { ChangeEvent, KeyboardEvent, useRef } from "react";
import Diagram from "./components/Diagram";
import { PortMeta } from "./common/types";
import TruthTable from "./components/TruthTable";
import PortTypes from "./components/PortTypes";
import { DiagramState, useDiagramStore } from "./store";

export default function App() {
  const portNameRef: any = useRef();

  const globalPins = useDiagramStore((state: DiagramState) => state.globalPins);
  const currentTruthTable = useDiagramStore((state: DiagramState) => state.currentTruthTable);

  const addPortType = useDiagramStore((state: DiagramState) => state.addPortType);
  const clearDiagram = useDiagramStore((state: DiagramState) => state.clear);
  const addGlobalPin = useDiagramStore((state: DiagramState) => state.addGlobalPin);

  const handlePortNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
  };

  const handlePortNameKeydown = (event: KeyboardEvent) => {
    if (/[^A-Za-z0-9]+/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleCreateClick = () => {
    const inputs: number = globalPins.filter((pin) => pin.input).length;
    const outputs: number = globalPins.length - inputs;

    const truthTable: any = {};
    currentTruthTable.forEach((line) => {
      const inputValues = line.slice(0, inputs);
      const outputValues = line.slice(inputs);
      truthTable[inputValues.toString()] = outputValues;
    });

    const { value: name } = portNameRef.current;
    const port: PortMeta = {
      id: -1,
      name,
      pos: { x: 0, y: 0 },
      height: 60,
      width: 30 + 15 * name.length,
      inputs,
      outputs,
      truthTable,
    };

    addPortType(port);
    clearDiagram();

    portNameRef.current.value = "";
  };

  const handleAddGlobalClick = (input: boolean) => {
    addGlobalPin(input);
  };

  return (
    <div className="mx-14">
      <h1 className="font-black text-3xl my-6">Logic Gates</h1>
      <div className="my-6">
        <div className="mb-4">
          <PortTypes />
          <div className="flex">
            <input
              className="font-bold text-2xl bg-transparent placeholder:text-slate-700 outline-none"
              ref={portNameRef}
              type="text"
              placeholder="NAME"
              onKeyDown={handlePortNameKeydown}
              onChange={handlePortNameChange}
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
                onClick={() => handleAddGlobalClick(true)}
              >
                Add Input
              </div>
              <div
                className="bg-cyan-500 w-fit px-2 py-1 rounded-md hover:cursor-pointer"
                onClick={() => handleAddGlobalClick(false)}
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
            <TruthTable pins={globalPins} truthTable={currentTruthTable} />
          </div>
        </div>
      </div>
    </div>
  );
}
