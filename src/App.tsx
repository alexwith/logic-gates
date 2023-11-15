import { ChangeEvent, KeyboardEvent, MouseEvent, useRef } from "react";
import Diagram from "./components/Diagram";
import { PortMeta } from "./common/types";
import TruthTable from "./components/TruthTable";
import { useDispatch, useSelector } from "react-redux";
import { DiagramState } from "./reducers/diagramReducer";
import PortTypes from "./components/PortTypes";

export default function App() {
  const dispatch = useDispatch();
  const globalPins = useSelector((state: DiagramState) => state.globalPins);
  const currentTruthTable = useSelector((state: DiagramState) => state.currentTruthTable);

  const portNameRef: any = useRef();

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

    dispatch({ type: "ADD_PORT_TYPE", payload: port });
    dispatch({ type: "CLEAR_DIAGRAM" });

    portNameRef.current.value = "";
  };

  return (
    <div>
      <h1 className="font-black text-3xl p-4">Logic Gates</h1>
      <div className="m-6">
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
            <div
              className="font-bold text-lg bg-cyan-500 w-fit px-2 py-1 rounded-md hover:cursor-pointer ml-auto"
              onClick={handleCreateClick}
            >
              Create
            </div>
          </div>
        </div>
        <div className="flex h-screen">
          <Diagram />
          <TruthTable pins={globalPins} truthTable={currentTruthTable} />
        </div>
      </div>
    </div>
  );
}
