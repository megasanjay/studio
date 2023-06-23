<script setup lang="ts">
import { NSpace } from "naive-ui";
import { RouterLink } from "vue-router";

const development = process.env.NODE_ENV === "development";
</script>

<template>
  <header :class="{ 'debug-screens': development }">
    <n-space
      justify="space-between"
      align="center"
      class="bg-slate-50 pl-4 pr-2"
    >
      <RouterLink to="/">
        <h1
          class="relative left-0 top-0 p-2 text-4xl font-black text-slate-600"
        >
          AI-Gallery Studio
        </h1>
      </RouterLink>

      <RouterLink to="/settings">
        <div
          class="mr-4 flex cursor-pointer items-center justify-center text-slate-600 transition-all hover:text-slate-400"
        >
          <Icon name="material-symbols:settings" :width="30" :height="30" />
        </div>
      </RouterLink>
    </n-space>
  </header>
</template>
