<script setup lang="ts">
// TODO: Add filtering support with Minisearch logic:
import type { ResolveFontResult } from "unifont";

const openDialog = ref(false);

function onCreate(item: string) {
  // activate dialog
}

const selectedFont = defineModel<string | undefined>();
const { data, status } = await useFetch("/api/fonts");

const {
  data: fontData,
  status: fontStatus,
  error: fontError,
  refresh: fontRefresh,
} = await useLazyAsyncData(selectedFont.value ?? "none", async () =>
  selectedFont.value ? $fetch(`/api/font/${selectedFont.value}`) : undefined,
);

const fontFaces = computed(() =>
  selectedFont.value && fontData.value
    ? convertFonttoFaces(
        selectedFont.value!,
        fontData.value as ResolveFontResult,
      )
    : [],
);

const isFontLoading = ref(false);
const fontLoadError = ref<string | null>(null);

// Track loaded fonts to clean them up later
const loadedFontFaces = ref<FontFace[]>([]);

const loadNewFonts = async () => {
  if (!fontFaces.value.length) return;

  try {
    isFontLoading.value = true;
    fontLoadError.value = null;

    // Remove only previously loaded custom fonts
    loadedFontFaces.value.forEach((font) => {
      document.fonts.delete(font);
    });
    loadedFontFaces.value = [];

    // Add new fonts
    for (const font of fontFaces.value) {
      document.fonts.add(font);
      loadedFontFaces.value.push(font);
    }

    // Load all fonts
    await Promise.all(fontFaces.value.map((f) => f.load()));

    console.log("Fonts loaded successfully:", fontFaces.value);
  } catch (error) {
    fontLoadError.value =
      error instanceof Error ? error.message : "Failed to load fonts";
    console.error("Font loading error:", error);
  } finally {
    isFontLoading.value = false;
  }
};

// Watch for font changes
watch(selectedFont, async (recent, old) => {
  console.log(`${old} -> ${recent}`);

  await fontRefresh();

  if (fontData.value) {
    await loadNewFonts();
  }
});

// Load fonts when fontFaces changes
watch(
  fontFaces,
  async (newFaces) => {
    if (newFaces.length > 0) {
      await loadNewFonts();
    }
  },
  { immediate: true },
);

// Cleanup on unmount
onUnmounted(() => {
  loadedFontFaces.value.forEach((font) => {
    document.fonts.delete(font);
  });
});
</script>

<template>
  <UModal v-model:open="openDialog">
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UModal>
  <div
    class="flex flex-col justify-center items-center mx-auto max-w-lg space-y-4 p-4"
  >
    <UInputMenu
      v-model="selectedFont"
      :items="data"
      :loading="status === 'pending'"
      virtualize
      create-item
      @create="onCreate"
      placeholder="Select Font"
      icon="i-lucide-type"
      class="w-full min-w-sm"
      size="xl"
    ></UInputMenu>

    <div class="flex flex-col items-center justify-center py-2 max-w-lg w-full">
      <div>
        <div v-if="fontStatus === 'pending' || isFontLoading">
          Loading Font...
        </div>
        <div v-else-if="fontStatus === 'error' || fontLoadError">
          Error Loading Font
          <DevOnly>
            {{ fontError }}
            {{ fontLoadError }}
          </DevOnly>
        </div>
        <div
          v-else-if="fontData?.fonts.length === 0"
          class="flex flex-col items-center justify-center space-y-2"
        >
          <span>Font not available</span>
          <UButton @click="fontRefresh()">Refresh</UButton>
        </div>
        <div v-else-if="selectedFont && fontData">
          <!-- <DevOnly>
            {{ fontData }}
          </DevOnly> -->

          <!-- Title with font applied -->
          <div class="text-4xl mb-2">
            <span :style="{ fontFamily: `'${selectedFont}'` }">
              {{ selectedFont }}
            </span>
          </div>

          <!-- Provided by -->
          <div
            v-if="fontData?.provider"
            class="text-sm italic text-neutral-300"
          >
            Provided by {{ fontData?.provider }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1"></div>
  </div>
</template>
