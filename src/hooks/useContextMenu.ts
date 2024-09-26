import { useEffect, useState, MouseEvent as ReactMouseEvent } from "react";

interface ContextMenuData {
  handleContextMenu: (event: ReactMouseEvent) => void;
  showContextMenu: boolean;
}

export default function useContextMenu(enabled?: boolean): ContextMenuData {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleContextMenu = (event: ReactMouseEvent) => {
    if (!enabled) {
      return;
    }

    event.preventDefault();
    setShowMenu(true);
  };

  useEffect(() => {
    const handleClick = () => {
      if (!enabled) {
        return;
      }

      showMenu && setShowMenu(false);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.addEventListener("click", handleClick);
    };
  }, [enabled, showMenu]);

  return { handleContextMenu, showContextMenu: showMenu };
}
