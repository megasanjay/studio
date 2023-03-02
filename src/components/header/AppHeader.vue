<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { NSpace } from "naive-ui";
import { RouterLink } from "vue-router";

// eslint-disable-next-line no-undef
const development = process.env.NODE_ENV === "development";
</script>

<template>
  <header :class="{ 'debug-screens': development }">
    <n-space justify="space-between" align="center" class="pl-4 pr-2">
      <RouterLink to="/">
        <h1 class="relative top-0 left-0 p-2 text-4xl font-black text-[#565656]">
          <span class="text-4xl font-black text-primary-900"> AI Gallery Studio</span>
        </h1>
      </RouterLink>

      <RouterLink to="/settings">
        <div
          class="mr-4 flex cursor-pointer items-center justify-center text-slate-600 transition-all hover:text-slate-400"
        >
          <Icon icon="material-symbols:settings" :width="30" :height="30" />
        </div>
      </RouterLink>
    </n-space>
  </header>
</template>
