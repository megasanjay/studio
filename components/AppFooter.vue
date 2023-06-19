<template>
  <footer
    class="fixed bottom-0 flex h-24 w-full items-center justify-center rounded-lg border-t bg-white p-4 md:flex md:items-center md:justify-between md:p-6"
  >
    <span class="text-sm text-gray-500 sm:text-center">
      © {{ new Date().getFullYear() }}
      <a href="https://sanjaysoundarajan.dev/" class="hover:underline">
        Sanjay Soundarajan
      </a>
      . All Rights Reserved.
    </span>

    <ul
      class="mt-3 flex flex-wrap items-center space-x-4 text-sm text-gray-500 sm:mt-0"
    >
      <li class="flex items-center justify-center">
        <a
          href="https://github.com/megasanjay/aigallery"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon
            name="mdi:source-repository"
            :width="30"
            :height="30"
            class="cursor-pointer text-slate-800 transition-colors hover:text-sky-700"
          />
        </a>
      </li>
      <li class="flex items-center justify-center">
        <a
          href="https://github.com/megasanjay"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon
            name="mdi:github"
            :width="30"
            :height="30"
            class="cursor-pointer text-slate-800 transition-colors hover:text-sky-700"
          />
        </a>
      </li>
      <li class="flex items-center justify-center">
        <a
          href="https://twitter.com/megasanjay"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Icon
            name="mdi:twitter"
            :width="30"
            :height="30"
            class="cursor-pointer text-slate-800 transition-colors hover:text-sky-700"
          />
        </a>
      </li>
    </ul>
  </footer>
</template>
