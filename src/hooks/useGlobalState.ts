import { create } from "zustand";

interface GlobalState {
  messages: string[];
  addMessage: (message: string) => void;
}

const useGlobalState = create<GlobalState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useGlobalState;
