import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const GithubToken = ref("");
    const GithubRepository = ref("");

    const DatabaseKey = ref("");

    const setGithubToken = (token: string) => {
      GithubToken.value = token;
    };

    const setGithubRepository = (repository: string) => {
      GithubRepository.value = repository;
    };

    const setDatabaseKey = (key: string) => {
      DatabaseKey.value = key;
    };

    return {
      DatabaseKey,
      GithubRepository,
      GithubToken,
      setDatabaseKey,
      setGithubRepository,
      setGithubToken,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
