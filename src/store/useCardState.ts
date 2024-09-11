import { create } from "zustand";

interface CardState {
  ceo: {
    content: string;
    isLoading: boolean;
  };
  cards: {
    [key: string]: {
      content: string;
      isLoading: boolean;
    };
  };

  setCeo: (ceo: { content: string; isLoading: boolean }) => void;
  setCards: (cards: {
    [key: string]: { content: string; isLoading: boolean };
  }) => void;
}

export const useCardState = create<CardState>((set) => ({
  ceo: {
    content: "",
    isLoading: false,
  },
  cards: {},

  setCeo: (ceo) => set({ ceo }),
  setCards: (cards) => set({ cards }),
}));
