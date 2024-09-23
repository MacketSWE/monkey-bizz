import { create, StoreApi } from "zustand";
import { BusinessInfo } from "../types/businessInfo";
import { defaultBusinessInfo } from "../defaults/defaultBusinessInfo";

const businessInfoStorageKey = "businessInfo";

interface BusinessInfoState {
  businessInfo: BusinessInfo;
  setBusinessInfo: (info: BusinessInfo) => void;
}

const init = (set: StoreApi<BusinessInfoState>["setState"]) => {
  const storedInfo = localStorage.getItem(businessInfoStorageKey);
  if (storedInfo) {
    set({ businessInfo: JSON.parse(storedInfo) });
  } else {
    set({ businessInfo: defaultBusinessInfo });
  }
};

export const useBusinessInfo = create<BusinessInfoState>((set) => {
  init(set);
  return {
    businessInfo: defaultBusinessInfo,
    setBusinessInfo: (info) => {
      set({ businessInfo: info });
      localStorage.setItem(businessInfoStorageKey, JSON.stringify(info));
    },
  };
});
