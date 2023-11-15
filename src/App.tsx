import { ChangeEvent, KeyboardEvent, MouseEvent, useRef, useState } from "react";
import Diagram from "./components/Diagram";
import { GlobalPinMeta, PortMeta } from "./common/types";
import TruthTable from "./components/TruthTable";
import { BASE_PORTS } from "./common/constants";

const testGlobalPins: GlobalPinMeta[] = [
  {
    id: 0,
    pos: { x: 100, y: 210 },
    label: "A",
    input: true,
  },
  {
    id: 1,
    pos: { x: 100, y: 250 },
    label: "B",
    input: true,
  },
  {
    id: 2,
    pos: { x: 500, y: 230 },
    label: "F",
    input: false,
  },
];

export default function App() {
  const [ports, setPorts] = useState<PortMeta[]>(BASE_PORTS);
  const [globalPins, setGlobalPins] = useState<GlobalPinMeta[]>(testGlobalPins);
  const [currentTruthTable, setCurrentTruthTable] = useState<boolean[][]>([]);
  const [addingPort, setAddingPort] = useState<PortMeta | null>(null);
  const portNameRef: any = useRef();
  const diagramRef: any = useRef();

  const handlePortNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.target.value = event.target.value.toUpperCase();
  };

  const handlePortNameKeydown = (event: KeyboardEvent) => {
    if (/[^A-Za-z0-9]+/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleCreateClick = (event: MouseEvent) => {
    const inputs: number = globalPins.filter((pin) => pin.input).length;
    const outputs: number = globalPins.length - inputs;

    const truthTable: Map<string, boolean[]> = new Map();
    currentTruthTable.forEach((line) => {
      const inputValues = line.slice(0, inputs);
      const outputValues = line.slice(inputs);
      truthTable.set(inputValues.toString(), outputValues);
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
    setPorts([...ports, port]);

    portNameRef.current.value = "";

    diagramRef.current.clear();
  };

  return (
    <div>
      <h1 className="font-black text-3xl p-4">Logic Gates</h1>
      <div className="m-6">
        <div className="mb-4">
          <div className="flex space-x-2 mb-4">
            {ports.map((port, i) => (
              <div
                className="bg-violet-500 w-fit p-2 font-bold rounded-md select-none"
                draggable
                onDragStart={() => {
                  setAddingPort(port);
                }}
              >
                {port.name}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              className="font-bold text-2xl bg-transparent placeholder:text-slate-700 outline-none"
              ref={portNameRef}
              type="text"
              placeholder="NAME"
              onKeyDown={handlePortNameKeydown}
              onChange={handlePortNameChange}
            />
            <div
              className="font-bold text-lg bg-cyan-500 w-fit px-2 py-1 rounded-md hover:cursor-pointer ml-auto"
              onClick={handleCreateClick}
            >
              Create
            </div>
          </div>
        </div>
        <div className="flex h-screen">
          <Diagram
            ref={diagramRef}
            globalPins={globalPins}
            setGlobalPins={setGlobalPins}
            setTruthTable={setCurrentTruthTable}
            addingPort={addingPort}
          />
          <TruthTable pins={globalPins} truthTable={currentTruthTable} />
        </div>
      </div>
    </div>
  );
}
