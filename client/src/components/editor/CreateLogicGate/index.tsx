import { useEffect, useRef, useState } from "react";
import { CircuitIcon } from "../../../common/icons";
import BasicButton from "../../common/BasicButton";
import { toast } from "react-toastify";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import GateTypeEntity from "../../../entities/GateTypeEntity";
import { IO } from "../../../common/types";
import TextInput from "../../common/TextInput";

interface Props {
  onClose: () => void;
}

export default function CreateCircuit({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [name, setName] = useState<string>("");

  const truthTable = useSimulatorStore((state: SimulatorState) => state.truthTable);
  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);

  const addGateType = useSimulatorStore((actions: SimulatorActions) => actions.addGateType);
  const resetSimulator = useSimulatorStore((actions: SimulatorActions) => actions.resetSimulator);

  useEffect(() => {
    const handleClick = (event: any) => {
      if (ref.current === null || ref.current.contains(event.target)) {
        return;
      }

      onClose();
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleCreateClick = () => {
    onClose();

    if (truthTable.length === 0) {
      toast.error("You must first create a valid circuit.");
      return;
    }

    if (name == null || name.length < 1) {
      toast.error("You must provide a name for the circuit.");
      return;
    }

    if (!/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/.test(name)) {
      toast.error("The name can only contain letters, numbers and single spaces.");
      return;
    }

    const inputs: number = terminals.filter((pin) => pin.io === IO.Input).length;
    const outputs: number = terminals.length - inputs;

    const gateType: GateTypeEntity = new GateTypeEntity(name, inputs, outputs, truthTable);
    addGateType(gateType);
    resetSimulator();

    toast.success("Created new circuit.");
  };

  return (
    <div className="fixed w-full h-full right-0 top-0 backdrop-blur-[3px] z-20">
      <div
        className="absolute w-80 bg-zinc-800 top-1/3 left-1/2 transform -translate-x-1/2 rounded-md p-4 flex flex-col justify-between"
        ref={ref}
      >
        <div>
          <h1 className="font-bold text-lg">Create circuit</h1>
          <p className="text-zinc-400 text-sm">
            Convert your current logic into a logic gate that you can re-use within this project.
          </p>
        </div>
        <div className="my-2">
          <p className="font-bold">Name</p>
          <TextInput onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="ml-auto mt-5">
          <BasicButton name="Create" icon={<CircuitIcon size={20} />} onClick={handleCreateClick} />
        </div>
      </div>
    </div>
  );
}
