import { ChangeEvent, useEffect, useState } from "react";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import TruthTable from "../../simulator/TruthTable";
import { deserializeCircuit, serializeCircuit } from "../../../libs/circuitFile";
import { Project } from "../../../common/types";
import BasicButton from "../../common/BasicButton";
import { CircuitIcon, MenuIcon, SaveIcon, TableIcon, UploadIcon } from "../../../common/icons";
import { useNavigate } from "react-router-dom";
import { updateProject } from "../../../services/project/service";
import CreateLogicGate from "../CreateLogicGate";
import {
  subscribeEditorChanges,
  unsubscribeEditorChanges,
} from "../../../utils/editorChangesEvent";
import { toast } from "react-toastify";

interface Props {
  project?: Project;
}

export default function EditorBar({ project }: Props) {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showTruthTable, setShowTruthTable] = useState<boolean>(false);
  const [creatingCircuit, setCreatingCircuit] = useState<boolean>(false);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);

  const gates = useSimulatorStore((state: SimulatorState) => state.gates);
  const gateTypes = useSimulatorStore((state: SimulatorState) => state.gateTypes);
  const wires = useSimulatorStore((state: SimulatorState) => state.wires);
  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);
  const truthTable = useSimulatorStore((state: SimulatorState) => state.truthTable);

  const setGateTypes = useSimulatorStore((actions: SimulatorActions) => actions.setGateTypes);
  const setGates = useSimulatorStore((actions: SimulatorActions) => actions.setGates);
  const setTerminals = useSimulatorStore((actions: SimulatorActions) => actions.setTerminals);
  const setWires = useSimulatorStore((actions: SimulatorActions) => actions.setWires);
  const updateActivity = useSimulatorStore((actions: SimulatorActions) => actions.updateActivity);
  const updateTruthTable = useSimulatorStore(
    (actions: SimulatorActions) => actions.updateTruthTable,
  );

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
      try {
        const [gateTypes, gates, terminals, wires] = deserializeCircuit(buffer)!;
        setGateTypes(gateTypes);
        setGates(gates);
        setTerminals(terminals);
        setWires(wires);
        updateTruthTable();
        updateActivity();
      } catch {
        toast.error("You can only import valid circuit files.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportClick = () => {
    const data = serializeCircuit(gateTypes, gates, terminals, wires);
    const fileURL = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));

    const downloadElement = document.createElement("a");
    downloadElement.setAttribute("download", `${project ? project.name : "playground"}.circuit`);
    downloadElement.href = fileURL;
    document.body.appendChild(downloadElement);

    window.requestAnimationFrame(() => {
      downloadElement.dispatchEvent(new MouseEvent("click"));
      document.body.removeChild(downloadElement);
    });
  };

  const handleSaveChanges = async () => {
    if (!project) {
      return;
    }

    const data = serializeCircuit(gateTypes, gates, terminals, wires);
    await updateProject(project.id!, { data: new Uint8Array(data) });

    setUnsavedChanges(false);
  };

  useEffect(() => {
    if (!project) {
      return;
    }

    const handleSaveKey = (event: KeyboardEvent) => {
      if (!unsavedChanges) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        handleSaveChanges();
      }
    };

    document.addEventListener("keydown", handleSaveKey);
    return () => document.removeEventListener("keydown", handleSaveKey);
  }, [project, unsavedChanges, gateTypes, gates, terminals, wires]);

  useEffect(() => {
    if (!project) {
      return;
    }

    const handleEditorChange = () => {
      if (unsavedChanges) {
        return;
      }

      setUnsavedChanges(true);
    };

    subscribeEditorChanges(handleEditorChange);
    return () => unsubscribeEditorChanges(handleEditorChange);
  }, [project, unsavedChanges]);

  return (
    <div className="relative flex justify-between">
      {creatingCircuit && <CreateLogicGate onClose={() => setCreatingCircuit(false)} />}
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
            name="New logic gate"
            icon={<CircuitIcon size={20} />}
            hoverable
            onClick={() => setCreatingCircuit(true)}
          />
        </div>
      </div>
      <div className="flex space-x-2">
        {project && (
          <div className="group ml-auto">
            {unsavedChanges ? (
              <div
                className={`flex space-x-1 items-center px-2 py-1 rounded-md font-bold hover:cursor-pointer bg-red-400 hover:bg-violet-500`}
                onClick={handleSaveChanges}
              >
                <SaveIcon size={20} />
                <p className="group-hover:hidden">Unsaved changes</p>
                <p className="hidden group-hover:block">Save changes</p>
              </div>
            ) : (
              <BasicButton
                name="Back to project"
                icon={<CircuitIcon size={20} />}
                onClick={() => project && navigate(`/project/${project.id}`)}
              />
            )}
          </div>
        )}
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
