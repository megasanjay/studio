<script setup lang="ts">
import { NLayout, NLayoutContent, NMessageProvider, NSpace } from "naive-ui";
import { RouterView } from "vue-router";

import AppFooter from "./components/footer/AppFooter.vue";
import AppHeader from "./components/header/AppHeader.vue";
</script>

<template>
  <n-message-provider>
    <AppHeader />

    <n-space vertical size="large">
      <n-layout has-sider>
        <n-layout-content class="h-[calc(100vh-56px)] pl-6 pt-5 pb-3">
          <main class="mx-auto max-w-screen-2xl">
            <RouterView />
          </main>
        </n-layout-content>
      </n-layout>
    </n-space>

    <AppFooter />
  </n-message-provider>
</template>

<style scoped></style>
