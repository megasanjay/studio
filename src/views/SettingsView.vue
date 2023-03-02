<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { FormInst } from "naive-ui";
import { NButton, NCard, NFormItem, NInput } from "naive-ui";
import { ref } from "vue";

const formRef = ref<FormInst | null>(null);

const ghtoken = ref("");

const rules = {
  ghtoken: {
    required: true,
    trigger: ["input", "blur"],
    validator() {
      if (ghtoken.value !== "ghp_xxx") {
        return new Error("Please add your GitHub token");
      }
    },
  },
};

const pasteFromClipboard = (type: string) => {
  navigator.clipboard.readText().then((text) => {
    if (type === "ghtoken") {
      ghtoken.value = text;
    }
  });
};

const save = (type: string) => {
  if (type === "ghtoken") {
    localStorage.setItem("ghtoken", ghtoken.value);
  }
};
</script>

<template>
  <div class="flex flex-col">
    <h1 class="my-6 text-slate-700">Settings</h1>

    <n-card title="GitHub" class="mb-6">
      <n-form-item label="Access Token" path="ghtoken" size="large" :rule="rules.ghtoken">
        <n-input v-model:value="ghtoken" placeholder="ghp_xxx" />
        <n-button class="ml-2" @click="pasteFromClipboard('ghtoken')">
          <Icon icon="zondicons:paste" />
        </n-button>
        <n-button class="ml-2" @click="save('ghtoken')">
          <Icon icon="material-symbols:save" />
        </n-button>
      </n-form-item>

      <n-form-item label="Repository" path="ghtoken" size="large" :rule="rules.ghtoken">
        <n-input v-model:value="ghtoken" placeholder="megasanjay/aigallery" />
        <n-button class="ml-2" @click="pasteFromClipboard('ghtoken')">
          <Icon icon="zondicons:paste" />
        </n-button>
        <n-button class="ml-2" @click="save('ghtoken')">
          <Icon icon="material-symbols:save" />
        </n-button>
      </n-form-item>
    </n-card>

    <n-card title="Database">
      <n-form-item label="Access URI" path="ghtoken" size="large" :rule="rules.ghtoken">
        <n-input v-model:value="ghtoken" placeholder="ghp_xxx" />
        <n-button class="ml-2" @click="pasteFromClipboard('ghtoken')">
          <Icon icon="zondicons:paste" />
        </n-button>
        <n-button class="ml-2" @click="save('ghtoken')">
          <Icon icon="material-symbols:save" />
        </n-button>
      </n-form-item>
    </n-card>
  </div>
</template>

<style></style>
