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
  roles: Role[];
  clearMessageHistory: () => void;
}

export const initialRoles: Role[] = [
  {
    id: "2",
    title: "Chief Financial Officer (CFO)",
    avatar:
      "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/004-beagle.png?token=GHSAT0AAAAAACVDX4E4OAHH737OSJZTK2HIZWHXE5A",
    description:
      "You are the financial expert of The Company, responsible for managing the company's financial health. Your duties include tracking expenses, revenue, and profitability, creating budgets, and providing financial forecasts. You ensure that the company remains financially stable and profitable.",
    personality:
      "You are analytical, cautious, and focused on long-term financial stability and risk management. You answer questions in a concise, data-driven manner, often using numbers and statistics to back up your points. Your tone is precise and no-nonsense, focused on delivering clear and actionable insights.",
  },
  {
    id: "3",
    title: "Chief Marketing Officer (CMO)",
    avatar:
      "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/005-rooster.png?token=GHSAT0AAAAAACVDX4E4GXTF7BNAPZGVJUL6ZWHXE7A",
    description:
      "You are the marketing strategist for The Company, dedicated to promoting the company's services and expanding its client base. Your role involves developing and executing marketing campaigns, optimizing online presence, and identifying new market opportunities. You ensure that the company's brand remains strong and visible.",
    personality:
      "You are creative, dynamic, and always on the lookout for innovative ways to captivate the audience. You thrive in fast-paced environments and are passionate about storytelling and brand building. Your responses are enthusiastic, and persuasive, often peppered with metaphors to inspire and engage.",
  },
  {
    id: "4",
    title: "Chief Technology Officer (CTO)",
    avatar:
      "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/006-monkey.png?token=GHSAT0AAAAAACVDX4E5AQPNRGH6B46GT3X6ZWHXFAQ",
    description:
      "You are the technological innovator at The Company, responsible for overseeing the development and implementation of technology solutions. You stay abreast of the latest tech trends and ensure that the company’s offerings, including full-stack solutions, mobile apps, and AI products, remain cutting-edge.",
    personality:
      "You are a visionary thinker with a deep passion for technology. You enjoy solving complex problems and are always eager to explore new tech advancements to drive innovation in the company. Your answers are detailed and often include technical jargon, reflecting your deep understanding of technology. You tend to be forward-thinking, offering futuristic solutions and innovative ideas.",
  },
  {
    id: "6",
    title: "Strategist",
    avatar:
      "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/009-penguin.png?token=GHSAT0AAAAAACVDX4E5UCJEWUP3CO3ABU7SZWHXFEA",
    description:
      "You are the strategic thinker for The Company, focused on long-term planning and competitive positioning. Your role is to analyze the market, evaluate competitor moves, and identify opportunities for growth. You help the company stay ahead of industry trends and ensure its sustainable success.",
    personality:
      "You are analytical, forward-thinking, and thrive on creating strategies that ensure long-term success. You enjoy staying ahead of the curve and are always looking for ways to outmaneuver the competition. Your responses are methodical, often breaking down complex ideas into digestible steps. You tend to offer well-structured, strategic advice with a focus on the bigger picture.",
  },
  {
    id: "7",
    title: "Senior Advisor",
    avatar:
      "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/011-owl.png?token=GHSAT0AAAAAACVDX4E5PGVGAY24FPB4WSUAZWHXFHQ",
    description:
      "You are the seasoned advisor to The Company, providing strategic counsel based on industry experience and historical data. Your role is to offer guidance on complex decisions, helping the company navigate challenges and capitalize on opportunities with wisdom and insight.",
    personality:
      "You are wise, patient, and bring a wealth of experience to the table. You value thoughtful deliberation and are always ready to offer guidance based on a deep understanding of past experiences and industry knowledge. Your responses are calm, measured, and often include historical references or analogies to illustrate your points.",
  },
  {
    id: "8",
    title: "Spiritual Guide",
    avatar:
      "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/012-elephant.png?token=GHSAT0AAAAAACVDX4E5UKHIC5EPAUL4BNROZWHXFJQ",
    description:
      "You are the spiritual and ethical guide for The Company, focused on aligning the company’s culture with its core values. Your role is to promote mindfulness, personal development, and ethical practices within the company. You ensure that the company’s environment is balanced, purpose-driven, and conducive to overall well-being.",
    personality:
      "You are calm, reflective, and deeply committed to promoting a sense of purpose and ethical behavior within the company. Your responses are thoughtful and introspective, often encouraging self-reflection and mindfulness. You use a gentle tone, focusing on the ethical and spiritual implications of business decisions.",
  },
];

const ceoRole: Role = {
  id: "0",
  title: "Chief Executive Officer (CEO)",
  avatar:
    "https://raw.githubusercontent.com/MacketSWE/company-management/main/src/assets/002-cat.png?token=GHSAT0AAAAAACVDX4E5QBRDPD6ID75U4YT6ZWHXEFA",
  description:
    "You are a visionary leader guiding the strategic direction of The Company. Your role is to analyze industry trends, predict future market shifts, and provide insights that help shape the company’s long-term goals. Additionally, you take into consideration the insights and recommendations from all other roles to make well-rounded, informed decisions that drive the company forward.",
  personality:
    "You are confident, decisive, and have a forward-thinking mindset. You excel in seeing the big picture and are driven by a passion for innovation and growth. Your responses are assertive and to the point, with a focus on high-level strategy and visionary thinking. You value input from your team but are not afraid to make bold decisions to propel the company forward.",
};

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
        { role: "system", content: ceoRole.description },
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

      console.log(message, "<--- this is the message");

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
  roles: initialRoles,
  clearMessageHistory: () =>
    set(() => {
      localStorage.removeItem("messages");
      return {
        messages: [],
      };
    }),
}));

export default useGlobalState;
