import {
  DragEvent,
  MouseEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ConnectionMeta, GlobalPinMeta, PortMeta, Pos } from "../../common/types";
import Port from "../Port";
import Pin from "../Pin";
import Connection from "../Connection";

interface Props {
  globalPins: GlobalPinMeta[];
  setGlobalPins: (globalPins: GlobalPinMeta[]) => void;
  setTruthTable: (truthTable: boolean[][]) => void;
  addingPort: PortMeta | null;
}

export default forwardRef(
  ({ globalPins, setGlobalPins, setTruthTable, addingPort }: Props, yesRef) => {
    const ref: any = useRef();
    const [ports, setPorts] = useState<PortMeta[]>([]);
    const [connections, setConnections] = useState<ConnectionMeta[]>([]);
    const [mouseOrigin, setMouseOrigin] = useState<Pos>({ x: 0, y: 0 });

    const [selectedPort, setSelectedPort] = useState<number>(-1);
    const [selectedPin, setSelectedPin] = useState<string>("");
    const [portOrigin, setPortOrigin] = useState<Pos>({ x: 0, y: 0 });
    const [isDraggingPort, setIsDraggingPort] = useState<boolean>(false);
    const [isConnectingPin, setIsConnectingPin] = useState<boolean>(false);
    const [connectingPinEnd, setConnectingPinEnd] = useState<Pos | null>(null);
    const [lastPin, setLastPin] = useState<string | null>("");

    const [activeGlobalPins, setActiveGlobalPins] = useState<string[]>([]);
    const [activeLocalPins, setActiveLocalPins] = useState<string[]>([]);

    useEffect(() => {
      setTruthTable(createTruthTable());
    }, [activeGlobalPins, activeLocalPins]);

    useImperativeHandle(yesRef, () => ({
      clear() {
        setPorts([]);
        setConnections([]);
        setActiveGlobalPins([]);
        setActiveLocalPins([]);
      },
    }));

    const computePinPos = (pinId: string) => {
      const args = pinId.split("-");
      const pinIndex = Number(args[0]);
      if (pinId.includes("global")) {
        return globalPins[pinIndex].pos;
      }

      const portId = Number(args[2]);
      const input = args[1] === "in";

      const port = ports.find((port) => port.id === portId);
      if (!port) {
        return { x: 0, y: 0 };
      }

      const { x: cx, y: cy } = port.pos;

      const pins = input ? port.inputs : port.outputs;
      const spacing = port.height / pins;
      const offsetY = spacing / 2;
      const offsetX = input ? 0 : port.width;

      return { x: cx + offsetX, y: cy + offsetY + spacing * pinIndex };
    };

    const toggleGlobalPin = (id: string) => {
      const updatedActiveGlobalPins = [...activeGlobalPins];
      const index = updatedActiveGlobalPins.indexOf(id);
      index !== -1 ? updatedActiveGlobalPins.splice(index, 1) : updatedActiveGlobalPins.push(id);
      setActiveGlobalPins(updatedActiveGlobalPins);

      updateActivity(updatedActiveGlobalPins);
    };

    const updateActivity = (activeBasePins?: string[]) => {
      const activeLocalPins: string[] = [...(activeBasePins || activeGlobalPins)];
      globalPins.forEach((globalPin, _) => {
        tryPinCompute(`${globalPin.id}-global`, activeLocalPins);
      });
      setActiveLocalPins(activeLocalPins);
    };

    const tryPinCompute = (id: string, activeLocalPins: string[]) => {
      const nextPins = [];
      for (const connection of connections) {
        const { pin0Id, pin1Id } = connection;
        if (pin0Id === id && pin1Id.includes("in")) {
          nextPins.push(pin1Id);
          if (activeLocalPins.includes(id)) {
            activeLocalPins.push(pin1Id);
          }
        }
        if (pin1Id === id && pin0Id.includes("in")) {
          nextPins.push(pin0Id);
          if (activeLocalPins.includes(id)) {
            activeLocalPins.push(pin0Id);
          }
        }
      }

      for (const pinId of nextPins) {
        const args = pinId.split("-");
        const portId = Number(args[2]);
        const port = ports.find((port) => port.id === portId)!;

        const inputValues = [];
        for (let i = 0; i < port.inputs; i++) {
          inputValues.push(activeLocalPins.includes(`${i}-in-${portId}`));
        }

        const outputValues =
          port.truthTable.get(inputValues.toString()) ??
          Array(port.outputs).fill(false, 0, port.outputs);

        for (let i = 0; i < port.outputs; i++) {
          const pinId = `${i}-out-${portId}`;
          const outputValue = outputValues[i];
          if (outputValue) {
            activeLocalPins.push(pinId);
          } else {
            const index = activeLocalPins.indexOf(pinId);
            index !== -1 && activeLocalPins.splice(index, 1);
          }

          tryPinCompute(pinId, activeLocalPins);
        }
      }
    };

    const createTruthTable = (): boolean[][] => {
      const truthTable: boolean[][] = [];

      const globalInputPins = globalPins.filter((pin) => pin.input).length;
      const combinationAmount = 1 << globalInputPins; // 2^(globalInputPins)
      const combinations: boolean[][] = [];
      for (let i = 0; i < combinationAmount; i++) {
        combinations.push([]);
        for (let j = 0; j < globalInputPins; j++) {
          if (((1 << j) & i) > 0) {
            combinations[i][j] = true;
          } else {
            combinations[i][j] = false;
          }
        }
      }

      combinations.forEach((combination, i) => {
        const globalPinCombination = [];
        for (let i = 0; i < combination.length; i++) {
          if (combination[i]) {
            globalPinCombination.push(`${i}-global`);
          }
        }

        const activeLocalPins: string[] = [...globalPinCombination];
        globalPins.forEach((globalPin, _) => {
          tryPinCompute(`${globalPin.id}-global`, activeLocalPins);
        });

        const outputValues: boolean[] = [];
        globalPins
          .filter((pin) => !pin.input)
          .forEach((globalOutputPin) => {
            const id = `${globalOutputPin.id}-global`;

            let matchingPinId: string | null = null;
            for (const connection of connections) {
              const { pin0Id, pin1Id } = connection;
              if (pin0Id === id) {
                matchingPinId = pin1Id;
                break;
              }
              if (pin1Id === id) {
                matchingPinId = pin0Id;
                break;
              }
            }

            if (!matchingPinId) {
              outputValues.push(false);
              return;
            }

            const outputValue = activeLocalPins.includes(matchingPinId);
            outputValues.push(outputValue);
          });

        truthTable.push(combination.concat(outputValues));
      });

      return truthTable;
    };

    const handlePortDraggingMove = (event: MouseEvent) => {
      const port = ports[selectedPort];
      const updatedPorts = [...ports];
      port.pos = {
        x: Math.abs(mouseOrigin.x - event.clientX - portOrigin.x),
        y: Math.abs(mouseOrigin.y - event.clientY - portOrigin.y),
      };
      updatedPorts[selectedPort] = port;

      setPorts(updatedPorts);
    };

    const handlePinConnectingMove = (event: MouseEvent) => {
      const { x, y } = computePinPos(selectedPin);
      setConnectingPinEnd({
        x: Math.abs(mouseOrigin.x - event.clientX - x),
        y: Math.abs(mouseOrigin.y - event.clientY - y),
      });
    };

    const handlePinConnectingEnd = () => {
      setIsConnectingPin(false);

      if (!lastPin) {
        return;
      }

      const updatedConnections = [...connections];
      updatedConnections.push({
        pin0Id: selectedPin,
        pin1Id: lastPin,
      });
      setConnections(updatedConnections);

      updateActivity();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingPort) {
        handlePortDraggingMove(event);
      }
      if (isConnectingPin) {
        handlePinConnectingMove(event);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingPort) {
        setIsDraggingPort(false);
      }
      if (isConnectingPin) {
        handlePinConnectingEnd();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      setMouseOrigin({ x: event.clientX, y: event.clientY });
    };

    const handleDrop = (event: DragEvent) => {
      if (!addingPort) {
        return;
      }

      const rect: any = ref.current.getBoundingClientRect();

      const port: PortMeta = {
        id: ports.length,
        name: addingPort.name,
        pos: {
          x: event.clientX - rect.left - addingPort.width / 2,
          y: event.clientY - rect.top - addingPort.height / 2,
        },
        height: addingPort.height,
        width: addingPort.width,
        inputs: addingPort.inputs,
        outputs: addingPort.outputs,
        truthTable: addingPort.truthTable,
      };

      setPorts([...ports, port]);
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    };

    return (
      <div
        className="border-slate-500 border-4 rounded-lg grow"
        ref={ref}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <svg
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseDown={handleMouseDown}
        >
          {isConnectingPin && selectedPin && connectingPinEnd && (
            <Connection
              id={-1}
              pos0={computePinPos(selectedPin)}
              pos1={connectingPinEnd}
              active={false}
            />
          )}
          {connections.map((connection, i) => (
            <Connection
              key={i}
              id={i}
              pos0={computePinPos(connection.pin0Id)}
              pos1={computePinPos(connection.pin1Id)}
              active={
                activeLocalPins.includes(connection.pin0Id) ||
                activeLocalPins.includes(connection.pin1Id)
              }
            />
          ))}
          {ports.map((port, _) => (
            <>
              <Port
                key={port.id}
                id={port.id}
                name={port.name}
                pos={port.pos}
                height={port.height}
                width={port.width}
                inputs={port.inputs}
                outputs={port.outputs}
                setIsDraggingPort={setIsDraggingPort}
                setSelectedPort={(id) => {
                  setSelectedPort(id);
                  setPortOrigin(port.pos);
                }}
              />
              {[...Array(port.inputs)].map((_, j) => {
                const id = `${j}-in-${port.id}`;

                return (
                  <Pin
                    key={j}
                    id={id}
                    pos={computePinPos(id)}
                    input={true}
                    setIsConnectingPin={setIsConnectingPin}
                    setSelectedPin={setSelectedPin}
                    setLastPin={setLastPin}
                  />
                );
              })}
              {[...Array(port.outputs)].map((_, j) => {
                const id = `${j}-out-${port.id}`;

                return (
                  <Pin
                    key={j}
                    id={id}
                    pos={computePinPos(id)}
                    input={false}
                    setIsConnectingPin={setIsConnectingPin}
                    setSelectedPin={setSelectedPin}
                    setLastPin={setLastPin}
                  />
                );
              })}
            </>
          ))}
          {globalPins.map((pin, _) => {
            const id = `${pin.id}-global`;

            return (
              <Pin
                pos={pin.pos}
                id={id}
                input={pin.input}
                label={pin.label}
                global
                setIsConnectingPin={setIsConnectingPin}
                setSelectedPin={setSelectedPin}
                setLastPin={setLastPin}
                toggleActive={() => toggleGlobalPin(id)}
              />
            );
          })}
        </svg>
      </div>
    );
  }
);
