import { useEffect, useRef, useState } from "react";
import DynamicInput from "../DynamicInput";
import { EditorState, useEditorStore } from "../../store";
import { TerminalMeta } from "../../common/types";
import useMouse from "../../hooks/useMouse";

interface Props {
  id: string;
  terminal: TerminalMeta;
  name: string;
}

export default function Terminal({ id, terminal, name }: Props) {
  const [ref, setRef] = useState<any>(null); // we need to rerender for computePos to be correct
  const buttonRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [originY, setOriginY] = useState<number>(terminal.yPos);

  const { mouseDragOffset } = useMouse();

  const toggleTerminal = useEditorStore((state: EditorState) => state.toggleTerminal);
  const setTerminalName = useEditorStore((state: EditorState) => state.setTerminalName);
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);

  const computePos = (): any => {
    if (!ref) {
      return {};
    }

    const rect = ref.getBoundingClientRect();    
    const pos: any = {
      top: terminal.yPos - rect.height,
    };
    pos[terminal.input ? "left" : "right"] = -17;

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
    pos[terminal.input ? "left" : "right"] = buttonRect.width;

    return pos;
  };

  const handleNameChange = (name: string) => {
    setTerminalName(id, name);
  };

  const handleClick = () => {
    if (!terminal.input) {
      return;
    }

    toggleTerminal(id);
    setActive(!active);
    updateActivity();
  };  

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      terminal.yPos = Math.abs(mouseDragOffset.y - originY);
    }
  }, [dragging, mouseDragOffset, originY, terminal]);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  /*
  <DynamicInput
        className="relative font-bold bg-zinc-800 px-2 rounded-md"
        defaultValue={name}
        onChange={handleNameChange}
      />
      */

  return (
    <div className="absolute" ref={setRef} style={computePos()}>
      <div className="absolute h-1 w-8 bg-stone-950" style={computeEditorEntryPos()} />
      <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        <div
          className={`h-8 w-8 rounded-full border-4 ${terminal.input ? "mr-auto" : "ml-auto"} ${
            active ? "bg-red-500 border-zinc-700" : "bg-stone-950 border-zinc-600"
          }`}
          ref={buttonRef}
          onClick={handleClick}
        />
        <div
          className={`absolute top-0 h-8 w-2 ${
            terminal.input ? "right-8" : "left-8"
          } z-10 bg-transparent`}
        />
        {(hovering || dragging) && (
          <div
            className={`absolute top-0 w-2 h-8 ${
              terminal.input ? "right-10" : "left-10"
            } bg-zinc-700 hover:bg-zinc-400`}
            onMouseDown={() => {
              setDragging(true);
              setOriginY(terminal.yPos);
            }}
            onMouseUp={() => setDragging(false)}
          />
        )}
      </div>
    </div>
  );
}
