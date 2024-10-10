import { ChangeEvent, RefObject, useCallback, useEffect, useState } from "react";
import { SimulatorActions, SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import TruthTable from "../../simulator/TruthTable";
import { deserializeCircuit, serializeCircuit } from "../../../libs/circuitFile";
import BasicButton from "../../common/BasicButton";
import {
  CircuitIcon,
  LogInIcon,
  MenuIcon,
  SaveIcon,
  TableIcon,
  UploadIcon,
} from "../../../common/icons";
import CreateGateMenu from "../CreateGateMenu";
import ExportMenu from "../ExportMenu";
import {
  subscribeEditorChanges,
  unsubscribeEditorChanges,
} from "../../../utils/editorChangesEvent";
import { toast } from "react-toastify";

interface Props {
  displayRef: RefObject<SVGSVGElement>;
}

export default function EditorBar({ displayRef }: Props) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showTruthTable, setShowTruthTable] = useState<boolean>(false);
  const [creatingCircuit, setCreatingCircuit] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const gates = useSimulatorStore((state: SimulatorState) => state.gates);
  const gateTypes = useSimulatorStore((state: SimulatorState) => state.gateTypes);
  const wires = useSimulatorStore((state: SimulatorState) => state.wires);
  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);
  const truthTable = useSimulatorStore((state: SimulatorState) => state.truthTable);
  const editingGateType = useSimulatorStore((state: SimulatorState) => state.editingGateType);

  const setGateTypes = useSimulatorStore((actions: SimulatorActions) => actions.setGateTypes);
  const updateSimulator = useSimulatorStore((actions: SimulatorActions) => actions.updateSimulator);
  const setEditingGateType = useSimulatorStore(
    (actions: SimulatorActions) => actions.setEditingGateType,
  );

  const saveToLocalStorage = useCallback(() => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      localStorage.setItem("current-data", event.target.result);
    };

    const data = serializeCircuit(gateTypes, gates, terminals, wires);
    reader.readAsDataURL(new Blob([data], { type: "text/plain" }));
  }, [gateTypes, gates, terminals, wires]);

  useEffect(() => {
    const handleEditorChange = () => {
      saveToLocalStorage();
    };

    subscribeEditorChanges(handleEditorChange);
    return () => unsubscribeEditorChanges(handleEditorChange);
  }, [saveToLocalStorage]);

  useEffect(() => {
    saveToLocalStorage();
  }, [saveToLocalStorage]);

  useEffect(() => {
    const dataURI = localStorage.getItem("current-data") as string;
    const byteString = atob(dataURI.split(",")[1]);
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      data[i] = byteString.charCodeAt(i);
    }

    try {
      const [gateTypes, gates, terminals, wires] = deserializeCircuit(buffer)!;
      setGateTypes(gateTypes);
      updateSimulator(gates, terminals, wires);
    } catch {
      toast.error("You can only import valid circuit files.");
    }
  }, []);

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
        updateSimulator(gates, terminals, wires);
      } catch {
        toast.error("You can only import valid circuit files.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportClick = () => {
    setExporting(true);
  };

  const handleSaveEditing = () => {
    if (!editingGateType) {
      return;
    }

    const { gateType } = editingGateType;
    gateType.truthTable = truthTable;
    gateType.terminals = terminals;
    gateType.gates = gates;
    gateType.wires = wires;

    setEditingGateType(null);

    const [parentGates, parentTerminals, parentWires] = editingGateType.parentSnapshot;
    updateSimulator(parentGates, parentTerminals, parentWires);
  };

  const handleGoBackEditing = () => {
    if (!editingGateType) {
      return;
    }

    setEditingGateType(null);

    const [parentGates, parentTerminals, parentWires] = editingGateType.parentSnapshot;
    updateSimulator(parentGates, parentTerminals, parentWires);
  };

  return (
    <div className="relative flex justify-between">
      {creatingCircuit && <CreateGateMenu onClose={() => setCreatingCircuit(false)} />}
      {exporting && <ExportMenu displayRef={displayRef} onClose={() => setExporting(false)} />}
      <div onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
        <BasicButton name="Menu" icon={<MenuIcon size={20} />} />
        <div
          className={`absolute flex flex-col space-y-1 bg-zinc-800 p-2 w-44 rounded-md z-10 ${
            showMenu ? "" : "hidden"
          }`}
        >
          {editingGateType ? (
            <>
              <BasicButton
                name="Save changes"
                icon={<SaveIcon size={20} />}
                hoverable
                onClick={handleSaveEditing}
              />
              <BasicButton
                name="Go back"
                icon={<LogInIcon size={20} />}
                hoverable
                onClick={handleGoBackEditing}
              />
            </>
          ) : (
            <>
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
                name="Export"
                icon={<UploadIcon size={20} />}
                hoverable
                onClick={handleExportClick}
              />
              <BasicButton
                name="New logic gate"
                icon={<CircuitIcon size={20} />}
                hoverable
                onClick={() => setCreatingCircuit(true)}
              />
            </>
          )}
        </div>
      </div>
      {editingGateType && (
        <p className="font-bold text-lg">
          Editing the <span className="text-violet-500">{editingGateType.gateType.name}</span>{" "}
          circuit...
        </p>
      )}
      <div className="flex space-x-2">
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
