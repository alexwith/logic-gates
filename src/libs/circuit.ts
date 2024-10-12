import GateEntity from "../entities/GateEntity";
import TerminalEntity from "../entities/TerminalEntity";
import WireEntity from "../entities/WireEntity";

export function simulate(terminals: TerminalEntity[], wires: WireEntity[], gates: GateEntity[]) {
  terminals.forEach((terminal) => {
    if (
      wires.filter((wire) => terminal.pin === wire.startPin || terminal.pin === wire.endPin)
        .length === 0
    ) {
      terminal.pin.active = false;
    }
  });

  for (let i = 0; i < gates.length; i++) {
    wires.forEach((wire) => {
      wire.execute();
    });

    gates.forEach((gate) => {
      gate.execute();

      wires.forEach((wire) => {
        wire.execute();
      });
    });
  }
}
