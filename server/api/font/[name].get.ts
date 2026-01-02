import { getFont } from "~~/server/utils/font";

export default defineCachedEventHandler(async (event) => {
  const name = getRouterParam(event, "name")!;

  return await getFont(name);
});
