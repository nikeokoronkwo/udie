<script setup lang="ts">
import * as locales from "@nuxt/ui/locale";
import type { NavigationMenuItem } from "@nuxt/ui";

const locale = ref("en");

const selectedFont = ref<string | undefined>();

const items: NavigationMenuItem[] = [
  {
    label: "Figma Kit",
    to: "https://go.nuxt.com/figma-ui",
    target: "_blank",
  },
  {
    label: "Playground",
    to: "https://stackblitz.com/edit/nuxt-ui",
    target: "_blank",
  },
  {
    label: "Releases",
    to: "https://github.com/nuxt/ui/releases",
    target: "_blank",
  },
];

const socialMediaItems = [
  {
    name: "Github",
    icon: "simple-icons:github",
    href: "https://github.com/nikeokoronkwo/udie",
  },
  {
    name: "Bluesky",
    icon: "simple-icons:bluesky",
    href: "https://bsky.app/profile/nikechukwu.bsky.social",
  },
];
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col">
      <div class="flex-1 flex flex-row divide-x divide-zinc-300 space-x-4">
        <FontView
          class="grow"
          v-model:font="selectedFont"
          v-model:locale="locale"
        />
        <FontSearch class="flex-none" v-model="selectedFont" />
      </div>
      <UFooter class="border-t border-t-neutral-300">
        <template #left>
          <p class="text-muted text-sm">
            Udi Edemede | Copyright © {{ new Date().getFullYear() }}
          </p>
        </template>

        <template #right>
          <UButton
            v-for="item in socialMediaItems"
            :key="item.name"
            :aria-label="item.name"
            target="_blank"
            :to="item.href"
            :icon="item.icon"
            color="neutral"
            variant="ghost"
            size="xl"
          />
        </template>
      </UFooter>
      <!-- <footer
        class="flex flex-row items-center justify-between border-t border-t-zinc-300 bg-transparent p-2 backdrop-blur-lg backdrop-opacity-50"
      >
        <div></div>
        <div class="flex flex-row items-center justify-center space-x-2">
          <a
            v-for="item in socialMediaItems"
            :href="item.href"
            target="_blank"
            :title="item.name"
            class="flex items-center justify-center space-x-4"
          >
            <Icon :name="item.icon" class="text-3xl" />
          </a>
        </div>
      </footer> -->
    </div>
  </UApp>
</template>
