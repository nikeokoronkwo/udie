import { getFonts } from "~~/server/utils/font";

export default defineCachedEventHandler(async (event) => {
  return (await getFonts()) ?? [];
});
