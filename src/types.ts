export interface SoundElement {
  id: string;
  title: string;
  icon: string;
  category: string;
  url: string; // Mock URL
}

export interface AudioTrack {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  duration: string;
  coverUrl: string;
  tags: {
    texture: string;
    mood: string;
    frequency: string;
    scenario: string;
    caution: string;
  };
}

export type SleepState = 'LATENCY' | 'DEEP_SLEEP' | 'SNORING' | 'WAKE_UP_PHASE' | 'IDLE';

export interface AIStrategy {
  state: SleepState;
  action: string;
  description: string;
}
