import { getMultipliersFromFrames } from "./utils/multiplier.utils";
import { normalizeAnimationFrame } from "./utils/normalization.utils";

/**
 * Gets an `AudioBuffer` from a URL to an audio file
 *
 * @param url The URL to an audio file
 * @returns An audio buffer containing the data from the file
 */
export const getAudioBufferFromURL = (url: string): Promise<AudioBuffer> => {
  if (!window) {
    throw new Error(
      "The global `window` is not available, please ensure you're not trying to run this code on a server"
    );
  }

  const { AudioContext } = window;

  if (!AudioContext) {
    throw new Error("The `AudioContext` API is not available");
  }

  const audioContext = new AudioContext();

  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .catch((error) => {
      throw new Error(
        "There was an error decoding the audio data from the file provided: %o",
        error
      );
    });
};

/**
 *
 * @param audioBuffer
 * @param options
 * @returns
 */
export const getAnimationFramesFromAudioBuffer = (
  audioBuffer: AudioBuffer,
  options?: Partial<GetAnimationFramesFromAudioBufferOptions>
) => {
  const _defaults: GetAnimationFramesFromAudioBufferOptions = {
    channel: 0,
    animation: false,
    frames: 10,
  };

  const _options: GetAnimationFramesFromAudioBufferOptions = Object.assign(
    {},
    _defaults,
    options || {}
  );

  const channelData: Float32Array = audioBuffer.getChannelData(
    _options.channel
  );

  if (!_options.animation) return [channelData];

  const frames: Array<Float32Array> = [];
  const framesToGenerate: number = audioBuffer.sampleRate / _options.frames;

  for (
    let index: number = 0;
    index < channelData.length;
    index += framesToGenerate
  ) {
    const frame: Float32Array = channelData.slice(
      index,
      index + framesToGenerate
    );

    frames.push(frame);
  }

  return frames;
};

/**
 *
 * @param frames A `Float32Array[]` containing the data for our animation
 * @param samples The number of samples to use for each frame
 *
 * @returns An `Array<Float32Array>` containing our down-sampled animation frames
 */
export const downsampleAnimationFrames = (
  frames: Array<Float32Array>,
  samples: number
): number[][] => {
  // If no frames are provided return an empty array earlier
  if (!frames.length) return [];

  // Setup an array to store our downsampled frames
  const outputFrames: number[][] = [];
  const { length } = frames;

  for (let frameIndex = 0; frameIndex < length; frameIndex++) {
    if (frameIndex >= length) break;

    const frame: Float32Array | undefined = frames[frameIndex];

    if (!frame) continue;

    const blockSize: number = Math.floor(frame.length / samples); // the number of samples in each subdivision
    const filteredDataBlock: number[] = [];

    for (let i = 0; i < samples; i++) {
      if (i >= samples) break;

      let blockStart: number = blockSize * i; // the location of the first sample in the block
      let sum: number = 0;

      for (let j = 0; j < blockSize; j++) {
        if (j >= blockSize) break;

        const sample: number | undefined = frame[blockStart + j];

        if (sample === undefined) continue;

        sum = sum + Math.abs(sample); // find the sum of all the samples in the block
      }

      filteredDataBlock.push(sum / blockSize); // divide the sum by the block size to get the average
    }

    outputFrames.push(filteredDataBlock);
  }

  return outputFrames;
};

/**
 * This function scans all items in the provided 2D `Float32Array` to compute a multiplication factor to normalize the
 * largest value to 1.  It then maps all of the values to `value * multiplicationFactor` and returns the mapped values,
 * thus normalizing all values to spread between 0 and 1.
 *
 * @param data An array of `Float32Array`s holding animation frame data
 * @returns The animation frame data, normalized so all values are spread to & clamped between 0 and 1.
 */
export const normalizeAnimationFrames = (frames: number[][]): number[][] => {
  if (!frames.length) return [];

  const multipliers: number[] = getMultipliersFromFrames(frames);
  const normalizationFactor: number = Math.pow(Math.max(...multipliers), -1);

  const normalizedFrames: number[][] = frames.map((frame: number[]) => {
    return normalizeAnimationFrame(frame, normalizationFactor);
  });

  return normalizedFrames;
};
