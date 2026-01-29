const getMultiplierFromFrame = (frame: number[]): number =>
  Math.max(...frame);

export const getMultipliersFromFrames = (
  frames: number[][]
): number[] => {
  const multipliers: number[] = [];

  frames.forEach((frame: number[]) => {
    const multiplier: number = getMultiplierFromFrame(frame);

    multipliers.push(multiplier);
  });

  return multipliers;
};
