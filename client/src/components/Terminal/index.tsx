import { useEffect, useRef, useState } from "react";
import DynamicInput from "../DynamicInput";
import { EditorState, useEditorStore } from "../../store";
import useMouse from "../../hooks/useMouse";
import TerminalEntity from "../../entities/TerminalEntity";
import { IO } from "../../common/types";

interface Props {
  terminal: TerminalEntity;
  editorRect: DOMRect | undefined;
}

export default function Terminal({ terminal, editorRect }: Props) {
  const [ref, setRef] = useState<any>(null); // we need to rerender for computePos to be correct
  const buttonRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [originY, setOriginY] = useState<number>(terminal.yPos);

  const { mouseDragOffset } = useMouse();

  const toggleTerminal = useEditorStore((state: EditorState) => state.toggleTerminal);  
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);

  const computePos = (): any => {
    if (!ref) {
      return {};
    }

    const rect = ref.getBoundingClientRect();
    const pos: any = {
      top: terminal.yPos - rect.height,
    };
    pos[terminal.io === IO.Input ? "left" : "right"] = -17;

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
    pos[terminal.io === IO.Input ? "left" : "right"] = buttonRect.width;

    return pos;
  };

  const handleNameChange = (name: string) => {
    terminal.name = name;    
  };

  const handleClick = () => {
    if (terminal.io !== IO.Input) {
      return;
    }

    toggleTerminal(terminal);
    setActive(!active);
    updateActivity();
  };

  useEffect(() => {
    if (dragging) {
      terminal.yPos = Math.min(
        Math.max(originY - mouseDragOffset.y, ref?.getBoundingClientRect().height || 0),
        editorRect?.height || Number.MAX_SAFE_INTEGER
      );
    }
  }, [dragging, mouseDragOffset, originY, terminal, editorRect?.height, ref]);

  useEffect(() => {
    const handleMouseUp = () => {
      setDragging(false);
    };

    // we need to use document.body so this event is called before the useMouse's mouseup event
    document.body.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.body.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="absolute" ref={setRef} style={computePos()}>
      <DynamicInput
        className={`absolute font-bold bg-zinc-800 px-1 rounded-md ${
          terminal.io === IO.Input ? "left-[70px]" : "right-[70px]"
        } top-1 opacity-70`}
        defaultValue={terminal.name}
        onChange={handleNameChange}
        maxLength={10}
      />
      <div className="absolute h-1 w-4 bg-stone-950" style={computeEditorEntryPos()} />
      <div onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        <div
          className={`h-8 w-8 rounded-full border-4 ${
            terminal.io === IO.Input ? "mr-auto" : "ml-auto"
          } ${active ? "bg-red-500 border-zinc-700" : "bg-stone-950 border-zinc-600"}`}
          ref={buttonRef}
          onClick={handleClick}
        />
        <div
          className={`absolute top-0 h-8 w-2 ${
            terminal.io === IO.Input ? "right-8" : "left-8"
          } z-10 bg-transparent`}
        />
        {(hovering || dragging) && (
          <div
            className={`absolute top-0 w-2 h-8 ${
              terminal.io === IO.Input ? "right-10" : "left-10"
            } bg-zinc-700 hover:bg-zinc-400`}
            onMouseDown={() => {
              setDragging(true);
              setOriginY(terminal.yPos);
            }}
          />
        )}
      </div>
    </div>
  );
}
