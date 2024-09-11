import create from "zustand";
import { Role } from "../types/role";
import { Message } from "../types/message";
import { askLLM } from "../endpoints/askLLM";
import { useCardState } from "./useCardState";

interface GlobalState {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  messages: Message[];
  askQuestion: (question: string) => void;
  addMessage: (question: string) => void;
  updateMessageWithRoleAnswer: (
    messageId: string,
    roleId: string,
    answer: string
  ) => void;
  updateMessageWithCEOAnswer: (messageId: string, answer: string) => void;
  roles: Role[];
  setRoleLoading: (index: number, isLoading: boolean) => void;
  isCEOLoading: boolean;
  setCEOLoading: (isLoading: boolean) => void;
  clearMessageHistory: () => void;
}

const initialRoles: Role[] = [
  {
    title: "Developer",
    description: "Builds and maintains our software products.",
    avatar: "",
    personality: "",
    id: "1",
    isLoading: false,
  },
  {
    title: "Designer",
    description: "Creates intuitive and appealing user interfaces.",
    isLoading: false,
    avatar: "",
    personality: "",
    id: "2",
  },
  {
    title: "Product Manager",
    description: "Oversees product development and strategy.",
    isLoading: false,
    avatar: "",
    personality: "",
    id: "3",
  },
  {
    title: "Marketing Specialist",
    description: "Promotes our products and brand.",
    isLoading: false,
    avatar: "",
    personality: "",
    id: "4",
  },
  {
    title: "Customer Support",
    description: "Assists customers with inquiries and issues.",
    isLoading: false,
    avatar: "",
    personality: "",
    id: "5",
  },
  {
    title: "Sales Representative",
    description: "Drives revenue through product sales.",
    isLoading: false,
    avatar: "",
    personality: "",
    id: "6",
  },
];

const useGlobalState = create<GlobalState>((set, get) => ({
  isDrawerOpen: false,
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  messages: JSON.parse(localStorage.getItem("messages") || "[]"),
  askQuestion: async (question) => {
    try {
      console.log("Asking question:", question);
      const roles = get().roles;
      const rolePromises = roles.map(async (role) => {
        const { setCards: setCardsPre, cards: cardsPre } =
          useCardState.getState();
        setCardsPre({
          ...cardsPre,
          [role.id]: {
            content: "",
            isLoading: true,
          },
        });
        const answer = await askLLM([
          { role: "system", content: role.personality },
          { role: "user", content: question },
        ]);
        const { setCards: setCardsPost, cards: cardsPost } =
          useCardState.getState();
        setCardsPost({
          ...cardsPost,
          [role.id]: {
            content: answer.content,
            isLoading: false,
          },
        });

        return answer;
      });

      const roleAnswers = await Promise.all(rolePromises);

      const { setCeo: setCeoPre } = useCardState.getState();
      setCeoPre({
        content: "",
        isLoading: true,
      });
      const ceoAnswer = await askLLM([
        { role: "system", content: "You are the CEO of the company" },
        {
          role: "user",
          content: `This is the question: ${question}. This is what the others answered: ${roleAnswers.reduce(
            (acc, answer) => acc + answer.content,
            ""
          )}`,
        },
      ]);
      const { setCeo: setCeoPost } = useCardState.getState();
      setCeoPost({
        content: ceoAnswer.content,
        isLoading: false,
      });

      console.log("Role answers:", roleAnswers);
      console.log("CEO answer:", ceoAnswer);
      const message: Message = {
        id: new Date().getTime().toString(),
        model: "gpt-4o-mini",
        question,
        timestamp: new Date().getTime(),
        ceoAnswer: {
          text: ceoAnswer.content,
          inputTokens: ceoAnswer.usage.prompt_tokens,
          outputTokens: ceoAnswer.usage.completion_tokens,
        },
        roleAnsers: roleAnswers.reduce((acc, answer, index) => {
          acc[get().roles[index].id] = {
            text: answer.content,
            inputTokens: answer.usage.prompt_tokens,
            outputTokens: answer.usage.completion_tokens,
          };
          return acc;
        }, {} as Record<string, { text: string; inputTokens: number; outputTokens: number }>),
      };

      console.log(message);

      // Add message to history and save to localStorage
      set((state) => {
        const updatedMessages = [...state.messages, message];
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
        return { messages: updatedMessages };
      });

      // You can process the answers further here if needed
    } catch (error) {
      console.error("Error in askQuestion:", error);
    }
  },
  addMessage: (question) =>
    set((state) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        model: "gpt-3.5-turbo",
        question,
        timestamp: Date.now(),
        ceoAnswer: {
          text: "",
          inputTokens: 0,
          outputTokens: 0,
        },
        roleAnsers: {},
      };
      const updatedMessages = [...state.messages, newMessage];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    }),
  updateMessageWithRoleAnswer: (messageId, roleId, answer) =>
    set((state) => {
      const updatedMessages = state.messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            roleAnsers: {
              ...message.roleAnsers,
              [roleId]: {
                text: answer,
                inputTokens: Math.floor(Math.random() * 100) + 50,
                outputTokens: Math.floor(Math.random() * 200) + 100,
              },
            },
          };
        }
        return message;
      });
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    }),
  updateMessageWithCEOAnswer: (messageId, answer) =>
    set((state) => {
      const updatedMessages = state.messages.map((message) => {
        if (message.id === messageId) {
          return {
            ...message,
            ceoAnswer: {
              text: answer,
              inputTokens: Math.floor(Math.random() * 200) + 100,
              outputTokens: Math.floor(Math.random() * 300) + 150,
            },
          };
        }
        return message;
      });
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    }),
  roles: initialRoles,
  setRoleLoading: (index, isLoading) =>
    set((state) => {
      const newRoles = [...state.roles];
      newRoles[index].isLoading = isLoading;
      return { roles: newRoles };
    }),
  isCEOLoading: false,
  setCEOLoading: (isLoading) => set({ isCEOLoading: isLoading }),
  clearMessageHistory: () =>
    set((state) => {
      localStorage.removeItem("messages");
      return {
        messages: [],
        roles: state.roles.map((role) => ({
          ...role,
          messages: [],
        })),
      };
    }),
}));

export default useGlobalState;
