import { create } from "zustand";
import { Role } from "../types/role";
import { Message } from "../types/message";
import { askLLM } from "../endpoints/askLLM";
import { useCardState } from "./useCardState";
import { BusinessInfo } from "../types/businessInfo";
import { defaultBusinessInfo } from "../defaults/defaultBusinessInfo";
import { ceoRole, initialRoles } from "../fixtures/initialRoles";
import { LLMMessage } from "../types/llmMessage";

interface GlobalState {
  isDrawerOpen: boolean;
  businessInfo: BusinessInfo;
  setIsDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  modalType: string | null;
  setModalType: (type: string | null) => void;
  modalContent: string | null;
  messages: Message[];
  askQuestion: (question: string) => void;
  roles: Role[];
  ceoRole: Role;
  clearMessageHistory: () => void;
  setBusinessInfo: (info: BusinessInfo) => void;
  selectedRole: Role | null;
  setSelectedRole: (role: Role | null) => void;
  deleteMessage: (id: string) => void;
  setRoles: (updatedRole: Role) => void;
  setCeoRole: (updatedCeoRole: Role) => void;
  resetBusinessInfo: () => void;
}

const useGlobalState = create<GlobalState>((set, get) => ({
  isDrawerOpen: false,
  businessInfo: defaultBusinessInfo,
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  modalType: null,
  setModalType: (type) => set({ modalType: type }),
  modalContent: null,
  messages: JSON.parse(localStorage.getItem("messages") || "[]"),
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
          { role: "system", content: role.personality },
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
      const ceoAnswer = await askLLM([
        { role: "system", content: get().ceoRole.description },
        ...ceoHistory,
        {
          role: "user",
          content: `This is the question: ${question}. This is what the others answered: ${roleAnswers.reduce(
            (acc, answer) => acc + answer.content,
            ""
          )}. Take all of this into account to answer the question, but give your own answer based on what you think is best.`,
        },
      ]);
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
  ceoRole: JSON.parse(
    localStorage.getItem("ceoRole") || JSON.stringify(ceoRole)
  ),
  roles: JSON.parse(
    localStorage.getItem("roles") || JSON.stringify(initialRoles)
  ),
  clearMessageHistory: () =>
    set(() => {
      localStorage.removeItem("messages");
      return {
        messages: [],
      };
    }),
  setBusinessInfo: (info) => {
    set({ businessInfo: info });
    localStorage.setItem("businessInfo", JSON.stringify(info));
  },
  resetBusinessInfo: () => {
    set({ businessInfo: defaultBusinessInfo });
    localStorage.setItem("businessInfo", JSON.stringify(defaultBusinessInfo));
  },
  selectedRole: null,
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
