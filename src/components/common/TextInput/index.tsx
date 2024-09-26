import { ChangeEventHandler } from "react";

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
  value?: string;
  className?: string;
}

export default function TextInput({ onChange, value, className }: Props) {
  return (
    <input
      className={`appearance-none focus:outline-none bg-transparent border-2 border-zinc-700 rounded-md py-1 px-2 ${className}`}
      type="text"
      value={value}
      onChange={onChange}
    />
  );
}
