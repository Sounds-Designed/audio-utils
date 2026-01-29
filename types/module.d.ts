type GetAnimationFramesFromAudioBufferOptions = {
  animation: boolean;
  channel: number;
  frames: number;
};

declare module "@sounds-designed/audio-utils" {
  export function getAudioBufferFromURL(url: string): Promise<AudioBuffer>;

  export function getAnimationFramesFromAudioBuffer(
    audioBuffer: AudioBuffer,
    options: Partial<GetAnimationFramesFromAudioBufferOptions>
  ): Array<Float32Array>;
}
