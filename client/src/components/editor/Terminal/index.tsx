import { useEffect, useRef, useState } from "react";
import DynamicInput from "../../common/DynamicInput";
import { EditorState, useEditorStore } from "../../../store";
import useMouse from "../../../hooks/useMouse";
import TerminalEntity from "../../../entities/TerminalEntity";
import { IO } from "../../../common/types";
import { SIMULATOR_HEIGHT } from "../../../common/constants";

interface Props {
  terminal: TerminalEntity;
  rerenderParent: () => void;
  editable?: boolean;
}

export default function Terminal({ terminal, rerenderParent, editable }: Props) {
  const [ref, setRef] = useState<any>(null); // we need to rerender for computePos to be correct
  const buttonRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [originY, setOriginY] = useState<number>(terminal.yPos);

  const { mouseDragOffset } = useMouse();

  const updateTerminal = useEditorStore((state: EditorState) => state.updateTerminal);
  const updateActivity = useEditorStore((state: EditorState) => state.updateActivity);

  useEffect(() => {
    if (dragging) {
      terminal.yPos = Math.min(
        Math.max(originY - mouseDragOffset.y, ref?.getBoundingClientRect().height || 0),
        SIMULATOR_HEIGHT || Number.MAX_SAFE_INTEGER,
      );
    }
  }, [dragging, mouseDragOffset, originY, terminal, ref]);

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
    updateTerminal(terminal);
  };

  const handleClick = () => {
    if (terminal.io !== IO.Input) {
      return;
    }

    terminal.pin.active = !terminal.pin.active;

    updateActivity();
    rerenderParent();
  };

  const handleHover = (entered: boolean) => {
    if (!editable) {
      return;
    }

    setHovering(entered);
  };

  return (
    <div className="absolute hover:cursor-pointer" ref={setRef} style={computePos()}>
      <DynamicInput
        className={`absolute font-bold bg-zinc-800 px-1 rounded-md ${
          terminal.io === IO.Input ? "left-[70px]" : "right-[70px]"
        } top-1 opacity-70`}
        defaultValue={terminal.name}
        onChange={handleNameChange}
        maxLength={10}
      />
      <div className="absolute h-1 w-4 bg-stone-950" style={computeEditorEntryPos()} />
      <div onMouseEnter={() => handleHover(true)} onMouseLeave={() => handleHover(false)}>
        <div
          className={`h-8 w-8 rounded-full border-4 ${
            terminal.io === IO.Input ? "mr-auto" : "ml-auto"
          } ${terminal.pin.active ? "bg-stone-950 border-red-500" : "bg-stone-950 border-zinc-600"}`}
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
