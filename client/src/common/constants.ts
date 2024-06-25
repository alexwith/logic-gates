import GateTypeEntity from "../entities/GateTypeEntity";

export const EDITOR_WIDTH = 1200; //px

export const BASE_GATES: GateTypeEntity[] = [
  new GateTypeEntity("AND", 2, 1, [[true, true, true]]),
  new GateTypeEntity("NOT", 1, 1, [[false, true]]),
  new GateTypeEntity("OR", 2, 1, [
    [true, false, true],
    [false, true, true],
    [true, true, true],
  ]),
  new GateTypeEntity("XOR", 2, 1, [
    [true, false, true],
    [false, true, true],
  ]),
];

export const POS_ZERO = { x: 0, y: 0 };
