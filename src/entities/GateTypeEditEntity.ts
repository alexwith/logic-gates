import GateEntity from "./GateEntity";
import GateTypeEntity from "./GateTypeEntity";
import TerminalEntity from "./TerminalEntity";
import WireEntity from "./WireEntity";

export class GateTypeEditEntity {
  gateType: GateTypeEntity;
  parentSnapshot: [GateEntity[], TerminalEntity[], WireEntity[]];

  constructor(
    gateType: GateTypeEntity,
    parentSnapshot: [GateEntity[], TerminalEntity[], WireEntity[]],
  ) {
    this.gateType = gateType;
    this.parentSnapshot = parentSnapshot;
  }
}
