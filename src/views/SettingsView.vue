<script setup lang="ts">
import type { FormInst } from "naive-ui";
import { NButton, NForm, NFormItem, NInput } from "naive-ui";
import { ref } from "vue";

const formRef = ref<FormInst | null>(null);

const formValue = ref({
  phone: "",
  user: {
    name: "",
    age: "",
  },
});

const rules = {
  phone: {
    message: "Please input your number",
    required: true,
    trigger: ["input"],
  },
  user: {
    name: {
      message: "Please input your name",
      required: true,
      trigger: "blur",
    },
    age: {
      message: "Please input your age",
      required: true,
      trigger: ["input", "blur"],
    },
  },
};

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log("Valid");
    } else {
      console.log(errors);
      console.log("Invalid");
    }
  });
};
</script>

<template>
  <div class="flex flex-col">
    <h1 class="mb-8">Settings</h1>

    <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" size="large">
      <n-form-item label="Name" path="user.name">
        <n-input v-model:value="formValue.user.name" placeholder="Input Name" />
      </n-form-item>
      <n-form-item label="Age" path="user.age">
        <n-input v-model:value="formValue.user.age" placeholder="Input Age" />
      </n-form-item>
      <n-form-item label="Phone" path="phone">
        <n-input v-model:value="formValue.phone" placeholder="Phone Number" />
      </n-form-item>
      <n-form-item>
        <n-button @click="handleValidateClick"> Validate </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<style></style>
