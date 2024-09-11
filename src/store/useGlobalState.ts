import create from "zustand";
import { Role } from "../types/role";
import { Message } from "../types/message";
import { askLLM } from "../endpoints/askLLM";

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
  simulateLoading: () => void;
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
  messages: [],
  askQuestion: async (question) => {
    try {
      console.log("Asking question:", question);
      const roles = get().roles;
      const rolePromises = roles.map(async (role) => {
        const answer = await askLLM([
          { role: "system", content: role.personality },
          { role: "user", content: question },
        ]);
        return answer;
      });

      const roleAnswers = await Promise.all(rolePromises);

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

      console.log("Role answers:", roleAnswers);
      console.log("CEO answer:", ceoAnswer);

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
      return { messages: [...state.messages, newMessage] };
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
  simulateLoading: () => {
    const {
      setRoleLoading,
      setCEOLoading,
      addMessage,
      updateMessageWithRoleAnswer,
      updateMessageWithCEOAnswer,
    } = get();
    const messageId = Date.now().toString();
    addMessage("Sample question");

    // Set all roles to loading
    get().roles.forEach((_, index) => setRoleLoading(index, true));

    // Simulate role loading and answering
    get().roles.forEach((role, index) => {
      setTimeout(() => {
        setRoleLoading(index, false);
        updateMessageWithRoleAnswer(
          messageId,
          role.id,
          `Sample answer from ${role.title}`
        );

        // Check if all roles are done loading
        if (get().roles.every((role) => !role.isLoading)) {
          // Start CEO loading
          setCEOLoading(true);
          setTimeout(() => {
            setCEOLoading(false);
            updateMessageWithCEOAnswer(messageId, "Sample CEO answer");
          }, 2000 + Math.random() * 1000);
        }
      }, 1000 + Math.random() * 1000);
    });
  },
  clearMessageHistory: () =>
    set((state) => ({
      roles: state.roles.map((role) => ({
        ...role,
        messages: [],
      })),
    })),
}));

export default useGlobalState;
