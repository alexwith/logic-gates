export const getGateDimensions = (name: string, inputs: number, outputs: number) => {
  return {
    height: 32 + Math.max(inputs, outputs) * 16,
    width: 30 + 15 * name.length
  }
}