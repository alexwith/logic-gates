import { ChangeEvent, useRef, useState } from "react";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import TruthTable from "../../simulator/TruthTable";
import { toast } from "react-toastify";
import { deserializeCircuit, serializeCircuit } from "../../../libs/circuitFile";
import GateTypeEntity from "../../../entities/GateTypeEntity";
import { IO, Project } from "../../../common/types";
import BasicButton from "../../common/BasicButton";
import { CreateIcon, MenuIcon, SaveIcon, TableIcon, UploadIcon } from "../../../common/icons";
import { useNavigate } from "react-router-dom";
import { updateProject } from "../../../services/project/service";

interface Props {
  project: Project;
}

export default function EditorBar({ project }: Props) {
  const navigate = useNavigate();

  const circuitNameRef: any = useRef<any>(null);

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showTruthTable, setShowTruthTable] = useState<boolean>(false);

  const gates = useSimulatorStore((state: SimulatorState) => state.gates);
  const gateTypes = useSimulatorStore((state: SimulatorState) => state.gateTypes);
  const wires = useSimulatorStore((state: SimulatorState) => state.wires);
  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);
  const truthTable = useSimulatorStore((state: SimulatorState) => state.truthTable);

  const setGateTypes = useSimulatorStore((actions: SimulatorActions) => actions.setGateTypes);
  const setGates = useSimulatorStore((actions: SimulatorActions) => actions.setGates);
  const setTerminals = useSimulatorStore((actions: SimulatorActions) => actions.setTerminals);
  const setWires = useSimulatorStore((actions: SimulatorActions) => actions.setWires);
  const addGateType = useSimulatorStore((actions: SimulatorActions) => actions.addGateType);
  const updateActivity = useSimulatorStore((actions: SimulatorActions) => actions.updateActivity);
  const clearEditor = useSimulatorStore((actions: SimulatorActions) => actions.reset);
  const updateTruthTable = useSimulatorStore(
    (actions: SimulatorActions) => actions.updateTruthTable,
  );

  const handleSaveChangesClick = () => {
    navigate(`/project/${project.id}`);

    const data = serializeCircuit(gateTypes, gates, terminals, wires);
    updateProject(project.id!, { data: new Uint8Array(data) });
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
      updateTruthTable();
      updateActivity();
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportClick = () => {
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
    if (truthTable.length === 0) {
      toast.error("You must first create a valid circuit.");
      return;
    }

    const { value: name } = circuitNameRef.current;
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
    clearEditor();

    circuitNameRef.current.value = "";

    toast.success("Created new circuit.");
  };

  return (
    <div className="relative flex justify-between">
      <input
        className="font-bold text-xl px-2 bg-transparent placeholder:text-zinc-600 outline-none"
        ref={circuitNameRef}
        type="text"
        placeholder="NAME"
      />
      <div className="flex space-x-2">
        <div onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
          <BasicButton name="Menu" icon={<MenuIcon size={20} />} />
          <div
            className={`absolute flex flex-col space-y-1 bg-zinc-800 p-2 w-44 rounded-md z-10 ${
              showMenu ? "" : "hidden"
            }`}
          >
            <BasicButton
              name="Export"
              icon={<UploadIcon size={20} />}
              hoverable
              onClick={handleExportClick}
            />
            <div>
              <input
                className="opacity-0 absolute -z-10"
                type="file"
                id="import-button"
                onChange={handleImportClick}
              />
              <label
                className="flex space-x-1 items-center px-2 py-1 rounded-md font-bold hover:bg-violet-500 hover:cursor-pointer"
                htmlFor="import-button"
              >
                <SaveIcon size={20} />
                <p>Import</p>
              </label>
            </div>
            <BasicButton
              name="Create circuit"
              icon={<CreateIcon size={20} />}
              hoverable
              onClick={handleCreateClick}
            />
            <BasicButton
              name="Save changes"
              icon={<SaveIcon size={20} />}
              hoverable
              onClick={handleSaveChangesClick}
            />
          </div>
        </div>
        <div
          onMouseEnter={() => setShowTruthTable(true)}
          onMouseLeave={() => setShowTruthTable(false)}
        >
          <BasicButton name="Truth table" icon={<TableIcon size={20} />} />
          {showTruthTable && (
            <div className="absolute overflow-scroll max-h-44 no-scrollbar z-10 right-0">
              <TruthTable terminals={terminals} truthTable={truthTable} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
