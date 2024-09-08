import create from "zustand";

interface Message {
  id: number;
  text: string;
  timestamp: number;
}

interface RoleState {
  title: string;
  description: string;
  isLoading: boolean;
}

interface GlobalState {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  toggleDrawer: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  messages: Message[];
  addMessage: (text: string) => void;
  roles: RoleState[];
  setRoleLoading: (index: number, isLoading: boolean) => void;
  isCEOLoading: boolean;
  setCEOLoading: (isLoading: boolean) => void;
  simulateLoading: () => void;
}

const initialRoles = [
  {
    title: "Developer",
    description: "Builds and maintains our software products.",
    isLoading: false,
  },
  {
    title: "Designer",
    description: "Creates intuitive and appealing user interfaces.",
    isLoading: false,
  },
  {
    title: "Product Manager",
    description: "Oversees product development and strategy.",
    isLoading: false,
  },
  {
    title: "Marketing Specialist",
    description: "Promotes our products and brand.",
    isLoading: false,
  },
  {
    title: "Customer Support",
    description: "Assists customers with inquiries and issues.",
    isLoading: false,
  },
  {
    title: "Sales Representative",
    description: "Drives revenue through product sales.",
    isLoading: false,
  },
];

const useGlobalState = create<GlobalState>((set, get) => ({
  isDrawerOpen: false,
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  messages: JSON.parse(localStorage.getItem("messages") || "[]"),
  addMessage: (text) =>
    set((state) => {
      const newMessage = { id: Date.now(), text, timestamp: Date.now() };
      const updatedMessages = [...state.messages, newMessage];
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
  simulateLoading: () => {
    const { setRoleLoading, setCEOLoading } = get();

    // Set all roles to loading
    get().roles.forEach((_, index) => setRoleLoading(index, true));

    // Simulate role loading
    get().roles.forEach((_, index) => {
      setTimeout(() => {
        setRoleLoading(index, false);

        // Check if all roles are done loading
        if (get().roles.every((role) => !role.isLoading)) {
          // Start CEO loading
          setCEOLoading(true);
          setTimeout(() => setCEOLoading(false), 2000 + Math.random() * 1000);
        }
      }, 1000 + Math.random() * 1000);
    });
  },
}));

export default useGlobalState;
