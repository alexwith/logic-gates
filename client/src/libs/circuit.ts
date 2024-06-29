import GateEntity from "../entities/GateEntity";
import WireEntity from "../entities/WireEntity";

export function simulate(wires: WireEntity[], gates: GateEntity[]) {
  for (let i = 0; i < 10; i++) {
    wires.forEach((wire) => {
      wire.execute();
    });

    gates.forEach((gate) => {
      gate.execute();
    });
  }
}
