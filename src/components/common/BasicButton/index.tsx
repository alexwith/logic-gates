import { MouseEventHandler, ReactNode } from "react";

interface Props {
  name: string;
  icon: ReactNode;
  hoverable?: boolean;
  onClick?: MouseEventHandler;
}

export default function BasicButton({ name, icon, hoverable, onClick }: Props) {
  return (
    <div
      className={`flex space-x-1 items-center px-2 py-1 rounded-md font-bold hover:cursor-pointer ${
        hoverable ? "hover:bg-violet-500" : "bg-violet-500"
      }`}
      onClick={onClick}
    >
      {icon}
      <p>{name}</p>
    </div>
  );
}
