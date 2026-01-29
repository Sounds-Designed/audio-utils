const normalizeSample = (sample: number, normalizationFactor: number): number =>
  sample * normalizationFactor;

export const normalizeAnimationFrame = (
  frame: number[],
  normalizationFactor: number
): number[] => frame.map((sample: number) => normalizeSample(sample, normalizationFactor));