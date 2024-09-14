import { create } from "zustand";
import { Role } from "../types/role";
import { Message } from "../types/message";
import { askLLM } from "../endpoints/askLLM";
import { useCardState } from "./useCardState";
import { BusinessInfo } from "../types/businessInfo";
import { businessInfo } from "../fixtures/businessInfo";
import { initialRoles } from "../fixtures/initialRoles";
import { LLMMessage } from "../types/llmMessage";

interface GlobalState {
  isDrawerOpen: boolean;
  businessInfo: BusinessInfo;
  setIsDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  modalType: string | null;
  setModalType: (type: string | null) => void;
  modalContent: string | null;
  setModalContent: (content: string | null) => void;
  messages: Message[];
  askQuestion: (question: string) => void;
  roles: Role[];
  clearMessageHistory: () => void;
  setBusinessInfo: (info: BusinessInfo) => void;
  selectedRole: Role | null;
  setSelectedRole: (role: Role | null) => void;
}

const ceoRole: Role = {
  id: "0",
  title: "Chief Executive Officer (CEO)",
  avatar:
    "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/002-cat.png?token=GHSAT0AAAAAACVDX4E5QBRDPD6ID75U4YT6ZWHXEFA",
  description:
    "You are a visionary leader guiding the strategic direction of The Company. Your role is to analyze industry trends, predict future market shifts, and provide insights that help shape the company's long-term goals. Additionally, you take into consideration the insights and recommendations from all other roles to make well-rounded, informed decisions that drive the company forward.",
  personality:
    "You are confident, decisive, and have a forward-thinking mindset. You excel in seeing the big picture and are driven by a passion for innovation and growth. Your responses are assertive and to the point, with a focus on high-level strategy and visionary thinking. You value input from your team but are not afraid to make bold decisions to propel the company forward.",
};

const useGlobalState = create<GlobalState>((set, get) => ({
  isDrawerOpen: false,
  businessInfo: JSON.parse(
    localStorage.getItem("businessInfo") || JSON.stringify(businessInfo)
  ),
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  modalType: null,
  setModalType: (type) => set({ modalType: type }),
  modalContent: null,
  setModalContent: (content) => set({ modalContent: content }),
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

      const rolePromises = roles.map(async (role) => {
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
        { role: "system", content: ceoRole.description },
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
  roles: initialRoles, // Ensure this is correctly set
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
  selectedRole: null,
  setSelectedRole: (role) => set({ selectedRole: role }),
}));

export default useGlobalState;
