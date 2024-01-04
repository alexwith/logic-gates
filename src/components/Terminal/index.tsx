import { useRef, useState } from "react";
import DynamicInput from "../DynamicInput";
import { EditorState, useEditorStore } from "../../store";

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

  const toggleTerminal = useEditorStore((state: EditorState) => state.toggleTerminal);
  const setTerminalName = useEditorStore((state: EditorState) => state.setTerminalName);
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);

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

  const computeEditorEntryPos = (): any => {
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
          active ? "bg-red-500 border-zinc-700" : "bg-stone-950 border-zinc-600"
        }`}
        ref={buttonRef}
        onClick={handleClick}
      />
      <div className="absolute h-1 w-8 bg-stone-950 -z-10" style={computeEditorEntryPos()} />
      <DynamicInput
        className="relative font-bold bg-zinc-800 px-2 rounded-md"
        defaultValue={name}
        onChange={handleNameChange}
      />
    </div>
  );
}
