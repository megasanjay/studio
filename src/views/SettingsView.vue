<script setup lang="ts">
import { Icon } from "@iconify/vue";
import axios from "axios";
import { NButton, NCard, NFormItem, NInput } from "naive-ui";
import { ref } from "vue";

import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();

const ghtoken = ref("");
const ghrepository = ref("");

if (settingsStore.GithubToken !== "") {
  console.log("GitHub token found...");
  ghtoken.value = settingsStore.GithubToken;
} else {
  console.log("No GitHub token found...");
}

if (settingsStore.GithubRepository !== "") {
  console.log("GitHub repository found...");
  ghrepository.value = settingsStore.GithubRepository;
} else {
  console.log("No GitHub repository found...");
}

const rules: any = {
  ghrepository: {
    required: true,
    trigger: ["input", "blur"],
    async validator() {
      if (ghtoken.value !== "") {
        // Check if the repository exists

        const repoExists = await axios.get("https://api.github.com/repos/" + ghrepository.value, {
          headers: {
            Authorization: `token ${ghtoken.value}`,
          },
        });

        if (repoExists.status === 200) {
          console.log("GitHub repository exists");
          return true;
        } else {
          return new Error("GitHub repository does not exist");
        }
      } else {
        return new Error("Please add your GitHub token");
      }
    },
  },
  ghtoken: {
    required: true,
    trigger: ["input", "blur"],
    async validator() {
      if (ghtoken.value == "") {
        return new Error("Please add your GitHub token");
      } else {
        // validate token by testing it against the GitHub API for rate limit
        const res = await axios.get("https://api.github.com/rate_limit", {
          headers: {
            Authorization: `token ${ghtoken.value}`,
          },
        });

        if (res.status === 200) {
          console.log("GitHub token is valid");
          return true;
        } else {
          return new Error("Invalid GitHub token");
        }
      }
    },
  },
};

const pasteFromClipboard = (field: any) => {
  navigator.clipboard.readText().then((text) => {
    field.value = text;
  });
};

const save = (field: string) => {
  if (field === "ghtoken") {
    settingsStore.GithubToken = ghtoken.value;
  } else if (field === "ghrepository") {
    settingsStore.GithubRepository = ghrepository.value;
  }
};

const clear = (field: string) => {
  if (field === "ghtoken") {
    settingsStore.setGithubToken("");
    ghtoken.value = "";
  } else if (field === "ghrepository") {
    settingsStore.setGithubRepository("");
    ghrepository.value = "";
  }
};
</script>

<template>
  <div class="flex flex-col">
    <h1 class="my-6 text-slate-700">Settings</h1>

    <n-card title="GitHub" class="mb-6">
      <n-form-item label="Access Token" path="ghtoken" size="large" :rule="rules.ghtoken">
        <n-input v-model:value="ghtoken" placeholder="ghp_xxx" />

        <n-button class="ml-2" @click="pasteFromClipboard(ghtoken)">
          <Icon icon="zondicons:paste" />
        </n-button>
        <n-button class="ml-2" @click="save('ghtoken')">
          <Icon icon="material-symbols:save" />
        </n-button>
        <n-button class="ml-2" @click="clear('ghtoken')">
          <Icon icon="mdi:clear-octagon" />
        </n-button>
      </n-form-item>

      <n-form-item label="Repository" path="ghrepository" size="large" :rule="rules.ghrepository">
        <n-input v-model:value="ghrepository" placeholder="megasanjay/aigallery" />

        <n-button class="ml-2" @click="pasteFromClipboard(ghrepository)">
          <Icon icon="zondicons:paste" />
        </n-button>
        <n-button class="ml-2" @click="save('ghrepository')">
          <Icon icon="material-symbols:save" />
        </n-button>
        <n-button class="ml-2" @click="clear('ghrepository')">
          <Icon icon="mdi:clear-octagon" />
        </n-button>
      </n-form-item>
    </n-card>
  </div>
</template>

<style></style>
