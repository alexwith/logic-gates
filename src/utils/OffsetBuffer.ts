import { Buffer } from "buffer";

export class OffsetBuffer {
  buffer: Buffer;
  offset: number = 0;

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  writeString(value: string) {
    this.writeUInt8(value.length);
    this.buffer.write(value, this.offset);
    this.offset += value.length;
  }

  writeUInt8(value: number) {
    this.buffer.writeUInt8(value, this.offset);
    this.offset++;
  }

  writeUInt16(value: number) {
    this.buffer.writeUInt16BE(value, this.offset);
    this.offset += 2;
  }

  readString(): string {
    const length = this.readUInt8();
    const result = this.buffer.toString("utf8", this.offset, this.offset + length);
    this.offset += length;

    return result;
  }

  readUInt8(): number {
    const result = this.buffer.readUInt8(this.offset);
    this.offset++;
    return result;
  }

  readUInt16(): number {
    const result = this.buffer.readUInt16BE(this.offset);
    this.offset += 2;

    return result;
  }

  readBigInt64BE(): bigint {
    const result = this.buffer.readBigInt64BE(this.offset);
    this.offset += 8;

    return result;
  }
}
