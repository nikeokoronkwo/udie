export default async function () {
  // find fonts
  const {
    data: fonts,
    status: fontsStatus,
    error: fontsError,
    refresh,
  } = await useFetch("/api/fonts");

  const fontBlock = reactive(
    Object.fromEntries(
      fonts.value?.map((f) => [f, useLazyFetch(`/api/font/${f}`)]) ?? [],
    ),
  );

  return {
    fonts: fontBlock,
    refresh,
  };
}
