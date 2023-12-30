import { useRef, useState } from "react";
import DynamicInput from "../DynamicInput";
import { DiagramState, useDiagramStore } from "../../store";

interface Props {
  id: string;
  yPos: number;
  input: boolean;
  name: string;
}

export default function Terminal({ id, yPos, input, name }: Props) {
  const [ref, setRef] = useState<any>(null); // we need to rerender for computePos to be correct
  const buttonRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<boolean>(false);

  const toggleTerminal = useDiagramStore((state: DiagramState) => state.toggleTerminal);
  const setTerminalName = useDiagramStore((state: DiagramState) => state.setTerminalName);
  const updateActivity = useDiagramStore((state: DiagramState) => state.updateActivity);

  const computePos = (): any => {
    if (!ref) {
      return {};
    }

    const rect = ref.getBoundingClientRect();
    const pos: any = {
      top: yPos - rect.height,
    };
    pos[input ? "left" : "right"] = -17;

    return pos;
  };

  const computeDiagramEntryPos = (): any => {
    if (!buttonRef.current) {
      return {};
    }

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const pos: any = {
      top: buttonRect.height / 2 - 1,
    };
    pos[input ? "left" : "right"] = buttonRect.width;

    return pos;
  };

  const handleClick = () => {
    if (!input) {
      return;
    }

    toggleTerminal(id);
    setActive(!active);
    updateActivity();
  };

  const handleNameChange = (name: string) => {
    setTerminalName(id, name);
  };

  return (
    <div className="absolute" ref={setRef} style={computePos()}>
      <div
        className={`h-8 w-8 rounded-full border-4 ${input ? "mr-auto" : "ml-auto"} ${
          active ? "bg-red-500 border-slate-800" : "bg-stone-950 border-slate-500"
        }`}
        ref={buttonRef}
        onClick={handleClick}
      />
      <div className="absolute h-1 w-8 bg-stone-950 -z-10" style={computeDiagramEntryPos()} />
      <DynamicInput
        className="relative font-bold bg-slate-800 px-2 rounded-md"
        defaultValue={name}
        onChange={handleNameChange}
      />
    </div>
  );
}
