<script setup lang="ts">
import axios from "axios";
import type { FormInst, UploadFileInfo } from "naive-ui";

import { nanoid } from "nanoid";

import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();
const { error, info, success } = useMessage();

const uploadingToGithub = ref(false);
const savingInDatabase = ref(false);
const submitting = ref(false);
const formRef = ref<FormInst | null>(null);

const showModal = ref(false);

const image = ref({
  base64: "",
  extension: "",
});

const formattedText = ref("");

const formValue = ref({
  imageAuthor: "midjourney",
  imageId: nanoid(),
  prompt: "",
});

const rules = {
  imageAuthor: {
    message: "Please select an image author",
    required: true,
    trigger: ["input", "blur"],
  },
  imageId: {
    message: "Please add an image ID",
    required: true,
    trigger: ["input"],
  },
  imageurl: {
    message: "Please upload an image",
    required: true,
    trigger: ["change"],
  },
  prompt: {
    message: "Please add a prompt",
    required: true,
    trigger: ["input", "blur"],
  },
};

const imageAuthorOptions = [
  { label: "MidJourney", value: "midjourney" },
  { label: "DALL·E 2", value: "dall-e-2" },
];

const refreshImageId = () => {
  formValue.value.imageId = nanoid();
};

const pastePromptFromClipboard = async () => {
  const clipboardText = await navigator.clipboard.readText();
  formValue.value.prompt = clipboardText;
};

const transformPrompt = () => {
  console.log("transforming prompt");

  let prompt = formValue.value.prompt;

  // remove the first two characters
  prompt = prompt.substring(2);

  // find the next two asterisks
  const nextTwoAsterisks = prompt.indexOf("**");

  // remove everything after
  prompt = prompt.substring(0, nextTwoAsterisks);

  formattedText.value = prompt;

  formValue.value.prompt = prompt;
};

const clearPrompt = () => {
  formValue.value.prompt = "";
  formattedText.value = "";
};

const refreshPage = () => {
  window.location.reload();
};

const handleChange = async (data: { fileList: UploadFileInfo[] }) => {
  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  let file: any;

  if (data.fileList.length > 0) {
    file = data.fileList[0];

    const base64: string = (await toBase64(file.file as File)) as string;

    image.value.base64 = base64;
    image.value.extension = file.file.name.split(".").pop();
  } else {
    file = null;
  }
};

const addToGallery = (e: MouseEvent) => {
  submitting.value = true;
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      // upload the image to GitHub
      if (settingsStore.GithubToken === "") {
        error("No GitHub token found...");
        submitting.value = false;
        return;
      }

      if (settingsStore.GithubRepository === "") {
        error("No GitHub repository found...");
        submitting.value = false;
        return;
      }

      if (settingsStore.DatabaseKey === "") {
        error("No database key found...");
        submitting.value = false;
        return;
      }

      uploadingToGithub.value = true;

      const imageContent = ref(image.value.base64);

      const imageFormats = [
        "data:image/png;base64,",
        "data:image/jpeg;base64,",
        "data:image/jpg;base64,",
        "data:image/gif;base64,",
        "data:image/webp;base64,",
        "data:image/svg+xml;base64,",
        "data:image/tiff;base64,",
        "data:image/bmp;base64,",
      ];

      // clean out the image format from the base64 string
      imageFormats.forEach((format) => {
        if (imageContent.value.startsWith(format)) {
          imageContent.value = imageContent.value.replace(format, "");
        }
      });

      const githubResponse = await axios({
        data: {
          content: imageContent.value,
          message: "feat: :sparkles: Add image to gallery",
        },
        headers: {
          Authorization: "token " + settingsStore.GithubToken,
          "Content-Type": "application/json",
        },
        method: "PUT",
        url:
          "https://api.github.com/repos/" +
          settingsStore.GithubRepository +
          "/contents/" +
          formValue.value.imageId +
          "." +
          image.value.extension,
      });

      uploadingToGithub.value = false;

      if (githubResponse.status === 201) {
        success("Image uploaded to GitHub");
      } else {
        error("Error uploading image to GitHub");
        submitting.value = false;
        return;
      }

      const sha = githubResponse.data.content.sha;

      // save the image in the database

      savingInDatabase.value = true;

      const apiResponse = await axios({
        data: {
          dbKey: settingsStore.DatabaseKey,

          extension: image.value.extension,
          imageAuthor: formValue.value.imageAuthor,
          imageId: formValue.value.imageId,
          prompt: formValue.value.prompt,
        },
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        url: "/api/gallery",
      });

      savingInDatabase.value = false;

      console.log(apiResponse, apiResponse.status);

      if (apiResponse.status === 201) {
        success("Image saved in database");
        showModal.value = true;
      } else {
        error("Error saving image in database");

        // delete the image from GitHub
        await axios({
          data: {
            message: "feat: :fire: Delete image from gallery",
            sha,
          },
          headers: {
            Authorization: "token " + settingsStore.GithubToken,
            "Content-Type": "application/json",
          },
          method: "DELETE",
          url:
            "https://api.github.com/repos/" +
            settingsStore.GithubRepository +
            "/contents/" +
            formValue.value.imageId +
            "." +
            image.value.extension,
        });

        info("Image deleted from GitHub");

        submitting.value = false;
        return;
      }

      submitting.value = false;
    } else {
      console.log(errors);
      error("Please fill out all fields");

      submitting.value = false;
    }
  });
};
</script>

<template>
  <div class="relative px-6 py-8">
    <n-form
      ref="formRef"
      :label-width="140"
      :model="formValue"
      :rules="rules"
      size="large"
      label-placement="left"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="Image ID:" path="imageId">
        <n-input
          v-model:value="formValue.imageId"
          placeholder="ih-jpPi0JKX258J8Wf3N0"
          disabled
        />

        <n-button secondary class="ml-4" type="warning" @click="refreshImageId">
          <template #icon>
            <Icon name="material-symbols:refresh" />
          </template>
        </n-button>
      </n-form-item>

      <n-form-item label="Image:" path="imageurl">
        <n-upload ref="upload" :default-upload="false" @change="handleChange">
          <n-button>Select File</n-button>
        </n-upload>
      </n-form-item>

      <n-form-item
        label="Image Prompt:"
        path="prompt"
        :feedback="formattedText"
      >
        <n-input
          v-model:value="formValue.prompt"
          placeholder="A rat in space"
        />

        <div class="ml-4 flex items-center space-x-4">
          <n-button secondary type="info" @click="pastePromptFromClipboard">
            <template #icon>
              <Icon name="material-symbols:chat-paste-go" />
            </template>
          </n-button>

          <n-button
            secondary
            :disabled="formValue.prompt === ''"
            @click="transformPrompt"
          >
            <template #icon>
              <Icon name="icon-park-outline:modify" />
            </template>
          </n-button>

          <n-button
            :disabled="formValue.prompt === ''"
            type="error"
            secondary
            @click="clearPrompt"
          >
            <template #icon>
              <Icon name="mdi:clear-octagon" />
            </template>
          </n-button>
        </div>
      </n-form-item>

      <n-form-item label="Image Author:" path="imageAuthor">
        <n-select
          v-model:value="formValue.imageAuthor"
          :options="imageAuthorOptions"
        />
      </n-form-item>

      <n-form-item class="mt-20 flex justify-center">
        <n-button
          type="primary"
          :disabled="submitting"
          size="large"
          @click="addToGallery"
        >
          <template #icon>
            <Icon name="mdi:upload" />
          </template>

          Add to Gallery
        </n-button>
      </n-form-item>
    </n-form>

    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      transform-origin="center"
      preset="dialog"
      title="Upload Status"
      content="Image added to gallery!"
      positive-text="Upload another image"
      negative-text="Close"
      @positive-click="refreshPage"
      @negative-click="refreshPage"
    />

    <div
      v-if="uploadingToGithub"
      class="fixed bottom-[100px] right-2 h-[150px] w-[150px]"
    >
      <client-only>
        <Vue3Lottie
          animation-link="https://assets3.lottiefiles.com/packages/lf20_xrloheoi.json"
        />
      </client-only>
    </div>
    <div
      v-if="savingInDatabase"
      class="fixed bottom-[100px] right-2 h-[150px] w-[150px]"
    >
      <client-only>
        <Vue3Lottie
          animation-link="https://assets4.lottiefiles.com/packages/lf20_abgqow0v.json"
        />
      </client-only>
    </div>
  </div>
</template>
