import { useState } from "react";
import BasicButton from "../BasicButton";
import { SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import TruthTable from "../../simulator/TruthTable";
import { TableIcon } from "../../../common/icons";

export default function TruthTableButton() {
  const [show, setShow] = useState<boolean>(false);

  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);
  const truthTable = useSimulatorStore((state: SimulatorState) => state.truthTable);

  return (
    <div className="relative">
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        <BasicButton name="Truth Table" icon={<TableIcon size={20} />} />
        {show && (
          <div className="absolute overflow-scroll max-h-44 no-scrollbar z-10 right-0">
            <TruthTable terminals={terminals} truthTable={truthTable} />
          </div>
        )}
      </div>
    </div>
  );
}
