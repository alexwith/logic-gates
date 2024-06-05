export const inputPinId = (gateId: number, pinIndex: number): string => {
  return `${gateId}-in-${pinIndex}`;
};

export const outputPinId = (gateId: number, pinIndex: number): string => {
  return `${gateId}-out-${pinIndex}`;
};

export const inputTerminalId = (id: number): string => `in-terminal-${id}`;

export const outputTerminalId = (id: number): string => `out-terminal-${id}`;

export const isInputPinId = (id: string): boolean => id.includes("in-");

export const isOutputPinId = (id: string): boolean => id.includes("out-");

export const isTerminalId = (id: string): boolean => id.includes("terminal");

export const gateIdFromPinId = (id: string): number => {
  const args = id.split("-");
  return Number(args[0]);
}

export const indexFromPinId = (id: string): number => {
  const args = id.split("-");
  return Number(args[2]);
}
