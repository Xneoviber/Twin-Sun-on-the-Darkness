export enum SpeakerType {
  NARRATOR = 'Narrator',
  YUKA = 'Yuka',
  YUKI = 'Yuki',
  SHUN = 'Shun',
  SYSTEM = 'System',
  END = 'END'
}

export interface Choice {
  text: string;
  nextScene: string;
  effects?: (flags: GameFlags) => void;
}

export interface Scene {
  id: string;
  background: string;
  speaker: string;
  dialogue: string;
  choices: Choice[];
}

export interface GameFlags {
  yukaSuspicious: boolean;
  yukiDominant: boolean;
  confrontation: boolean;
  yukaKnows: boolean;
  roadheadKnown: boolean;
  endingReached: boolean;
}

export interface GameState {
  currentSceneId: string;
  flags: GameFlags;
  visitedScenes: string[];
}
