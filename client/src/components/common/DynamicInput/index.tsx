import { ChangeEvent, useEffect, useRef, useState } from "react";

interface Props {
  defaultValue: string;
  onChange: (value: string) => void;
  className?: string;
  maxLength?: number;
}

export default function DynamicInput({ defaultValue, onChange, className, maxLength }: Props) {
  const widthRef = useRef<HTMLSpanElement>(null);
  const [content, setContent] = useState<string>(defaultValue);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!widthRef.current) {
      return;
    }

    setWidth(widthRef.current.offsetWidth);
  }, [content]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (maxLength && value.length > maxLength) {
      event.preventDefault();
      return;
    }

    setContent(value);
    onChange(value);
  };

  return (
    <div className={className}>
      <input
        className="bg-transparent outline-none min-w-[20px] text-center"
        value={defaultValue}
        type={"text"}
        style={{ width }}
        onChange={handleChange}
      />
      <span className="absolute whitespace-pre opacity-0 left-0" ref={widthRef}>
        {content}
      </span>
    </div>
  );
}
