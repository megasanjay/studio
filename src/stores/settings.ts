import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const GithubToken = ref("");
    const GithubRepository = ref("");

    const setGithubToken = (token: string) => {
      GithubToken.value = token;
    };

    const setGithubRepository = (repository: string) => {
      GithubRepository.value = repository;
    };

    return {
      GithubRepository,
      GithubToken,
      setGithubRepository,
      setGithubToken,
    };
  },
  {
    persist: { storage: localStorage },
  }
);
