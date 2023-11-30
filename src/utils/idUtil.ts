export const inputPinId = (gateId: number, pinIndex: number): string => {
  return `${gateId}-in-${pinIndex}`;
};

export const outputPinId = (gateId: number, pinIndex: number): string => {
  return `${gateId}-out-${pinIndex}`;
};

export const globalInputPinId = (pinIndex: number): string => `in-global-${pinIndex}`;

export const globalOutputPinId = (pinIndex: number): string => `out-global-${pinIndex}`;

export const isInputPinId = (id: string): boolean => id.includes("in");

export const isOutputPinId = (id: string): boolean => id.includes("out");

export const isGlobalPinId = (id: string): boolean => id.includes("global");

export const indexFromPinId = (id: string): number => {
  const args = id.split("-");
  return Number(args[2]);
}
