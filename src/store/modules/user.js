import { defineStore } from "pinia";
import { store } from "../index";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
  }),
  getters: {
    getUserName() {
      return this.username;
    },
  },
  actions: {
    setUserName(username) {
      this.username = username;
    },
    clearState() {
      this.$reset();
    },
  },
});

export function useUserStoreWidthOut() {
  return useUserStore(store);
}
