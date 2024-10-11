import { create } from "zustand";
import { Role } from "../types/role";
import { Message } from "../types/message";
import { askLLM } from "../endpoints/askLLM";
import { useCardState } from "./useCardState";
import { ceoRole, initialRoles } from "../fixtures/initialRoles";
import { LLMMessage } from "../types/llmMessage";
import { useBusinessInfo } from "./useBusinessInfo";

interface GlobalState {
  isDrawerOpen: boolean;
  modalType: string | null;
  modalContent: string | null;
  messages: Message[];
  roles: Role[];
  ceoRole: Role;
  selectedRole: Role | null;

  setIsDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  setModalType: (type: string | null) => void;
  askQuestion: (question: string) => void;
  clearMessageHistory: () => void;
  setSelectedRole: (role: Role | null) => void;
  deleteMessage: (id: string) => void;
  setRoles: (updatedRole: Role) => void;
  setCeoRole: (updatedCeoRole: Role) => void;
}

const useGlobalState = create<GlobalState>((set, get) => ({
  // Values
  isDrawerOpen: false,
  modalType: null,
  modalContent: null,
  messages: JSON.parse(localStorage.getItem("messages") || "[]"),
  ceoRole: JSON.parse(
    localStorage.getItem("ceoRole") || JSON.stringify(ceoRole)
  ),
  roles: JSON.parse(
    localStorage.getItem("roles") || JSON.stringify(initialRoles)
  ),
  selectedRole: null,

  // Functions
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  setModalType: (type) => set({ modalType: type }),

  askQuestion: async (question) => {
    try {
      console.log("Asking question:", question);
      const roles = get().roles;
      const { setCards } = useCardState.getState();

      // Set all role cards to loading
      setCards(
        roles.reduce((acc, role) => {
          acc[role.id] = {
            content: "",
            isLoading: true,
          };
          return acc;
        }, {} as Record<string, { content: string; isLoading: boolean }>)
      );

      const getSystemPrompt = (role: Role) => `
        ===================================================
        This is your role: ${role.description}. 
        ===================================================
        This is your personality: ${role.personality}.
        ===================================================
        This is the business info: ${JSON.stringify(
          useBusinessInfo.getState().businessInfo,
          null,
          2
        )}.
        ===================================================
        `;

      const rolePromises = get().roles.map(async (role) => {
        const roleHistory: LLMMessage[] = [];
        get().messages.forEach((message) => {
          if (message.roleAnsers[role.id]) {
            roleHistory.push(
              {
                role: "user",
                content: message.question,
              },
              { role: "assistant", content: message.roleAnsers[role.id].text }
            );
          }
        });

        const answer = await askLLM([
          { role: "system", content: getSystemPrompt(role) },
          ...roleHistory,
          { role: "user", content: question },
        ]);

        const { cards } = useCardState.getState();
        setCards({
          ...cards,
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
      const ceoHistory: LLMMessage[] = [];
      get().messages.forEach((message) => {
        if (message.ceoAnswer) {
          ceoHistory.push(
            {
              role: "user",
              content: message.question,
            },
            { role: "assistant", content: message.ceoAnswer.text }
          );
        }
      });

      const ceoPrompt: LLMMessage[] = [
        { role: "system", content: getSystemPrompt(get().ceoRole) },
        ...ceoHistory,
        {
          role: "user",
          content: `
          ===================================================
          This is the users input: ${question}.
          ===================================================
          This is what the others answered: ${roleAnswers.reduce(
            (acc, answer) => acc + answer.content,
            ""
          )}.
          
          ===================================================
          Take all of this into account to answer the user, but give your own answer based on what you think is best.`,
        },
      ];

      const ceoAnswer = await askLLM(ceoPrompt);

      const { setCeo: setCeoPost } = useCardState.getState();
      setCeoPost({
        content: ceoAnswer.content,
        isLoading: false,
      });

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

  clearMessageHistory: () =>
    set(() => {
      localStorage.removeItem("messages");
      return {
        messages: [],
      };
    }),

  setSelectedRole: (role) => set({ selectedRole: role }),

  deleteMessage: (id) => {
    set((state) => {
      const updatedMessages = state.messages.filter((msg) => msg.id !== id);
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
      return { messages: updatedMessages };
    });
  },

  setRoles: (updatedRole) => {
    set((state) => {
      const updatedRoles = state.roles.map((role) =>
        role.id === updatedRole.id ? updatedRole : role
      );
      localStorage.setItem("roles", JSON.stringify(updatedRoles));
      return { roles: updatedRoles };
    });
  },

  setCeoRole: (updatedCeoRole) => {
    set(() => {
      localStorage.setItem("ceoRole", JSON.stringify(updatedCeoRole));
      return { ceoRole: updatedCeoRole };
    });
  },
}));

export default useGlobalState;
