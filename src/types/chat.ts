export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'future-self';
  timestamp: Date;
}

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FuturePersona {
  personality: string;
  achievedGoals: string[];
  milestones: string[];
}