import { RefObject, useEffect, useRef, useState } from "react";
import { CircuitIcon, JPEGIcon } from "../../../common/icons";
import BasicButton from "../../common/BasicButton";
import { serializeCircuit } from "../../../libs/circuitFile";
import { SimulatorState, useSimulatorStore } from "../../../store/simulatorStore";
import TextInput from "../../common/TextInput";
import { downloadSVGImage } from "../../../libs/svgImageExport";

interface Props {
  displayRef: RefObject<SVGSVGElement>;
  onClose: () => void;
}

export default function ExportMenu({ displayRef, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [name, setName] = useState<string>("");

  const gates = useSimulatorStore((state: SimulatorState) => state.gates);
  const gateTypes = useSimulatorStore((state: SimulatorState) => state.gateTypes);
  const wires = useSimulatorStore((state: SimulatorState) => state.wires);
  const terminals = useSimulatorStore((state: SimulatorState) => state.terminals);

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

  const handleCircuitFileClick = () => {
    if (!name) {
      return;
    }

    const data = serializeCircuit(gateTypes, gates, terminals, wires);
    const fileURL = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));

    const downloadElement = document.createElement("a");
    downloadElement.href = fileURL;
    downloadElement.download = `${name}.circuit`;
    document.body.appendChild(downloadElement);

    window.requestAnimationFrame(() => {
      downloadElement.click();
      document.body.removeChild(downloadElement);
    });
  };

  const handleJPEGFileClick = () => {
    const { current } = displayRef;
    if (!name || !current) {
      return;
    }

    downloadSVGImage(current, name);
  };

  return (
    <div className="fixed w-full h-full right-0 top-0 backdrop-blur-[3px] z-20">
      <div
        className="absolute w-72 bg-midnight border-violet-500 border-[1px] top-1/3 left-1/2 transform -translate-x-1/2 rounded-md p-4 flex flex-col justify-between"
        ref={ref}
      >
        <div>
          <h1 className="font-bold text-lg">Export</h1>
          <p className="text-zinc-400 text-sm">
            Save your logic gate to a file or export it as an image.
          </p>
        </div>
        <div className="my-2">
          <p className="font-bold">Name</p>
          <TextInput onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="flex flex-col gap-2 w-fit">
          <BasicButton
            name="Export as circuit"
            icon={<CircuitIcon size={20} />}
            hoverable
            onClick={handleCircuitFileClick}
          />
          <BasicButton
            name="Export as JPEG"
            icon={<JPEGIcon size={20} />}
            hoverable
            onClick={handleJPEGFileClick}
          />
        </div>
      </div>
    </div>
  );
}
