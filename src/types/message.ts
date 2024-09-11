export interface Message {
  id: string;
  model: string;
  question: string;
  timestamp: number;
  ceoAnswer: {
    text: string;
    inputTokens: number;
    outputTokens: number;
  };
  roleAnsers: {
    [key: string]: {
      text: string;
      inputTokens: number;
      outputTokens: number;
    };
  };
}
