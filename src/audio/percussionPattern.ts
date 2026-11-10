export const BPM = 94;
export const STEPS_PER_BEAT = 4;
export const STEPS = 16;
export const STEP_DURATION = 60 / BPM / STEPS_PER_BEAT;

export const PATTERN = {
  // A slow heartbeat under everything else: deep, sparse and unsettling.
  dunun: [0, 2, 8, 10],
  low: [0, 3, 6, 8, 11, 14],
  tone: [2, 5, 10, 13],
  slap: [7, 9, 15],
  bell: [4, 12],
  shaker: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
};

export const DRUMMER_STEPS: number[][] = [
  [0, 3, 6, 8, 11, 14],
  [2, 4, 7, 9, 12, 15],
  [0, 2, 5, 7, 10, 12, 15],
];
