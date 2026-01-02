import { createUnifont, providers } from "unifont";

export const useUnifont = async () =>
  await createUnifont(
    [
      providers.google(),
      providers.fontsource(),
      providers.fontshare(),
      providers.googleicons(),
    ],
    {
      storage: useStorage("kv"),
    },
  );

export const getFonts = cachedFunction(async () => {
  return Array.from(new Set(await (await useUnifont()).listFonts()).values());
});

export const getFont = cachedFunction(async (font: string) => {
  return await (await useUnifont()).resolveFont(font);
});
