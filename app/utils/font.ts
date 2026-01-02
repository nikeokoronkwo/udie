import type {
  ResolveFontResult,
  FontFaceData,
  LocalFontSource,
  RemoteFontSource,
} from "unifont";

export type FontResult = ResolveFontResult & {
  provider?: "google" | "fontsource" | "fontshare" | "googleicons" | undefined;
};

export function convertFontToString(name: string, result: ResolveFontResult) {
  return result.fonts.map((f) => convertSingleFontToString(name, f));
}

export function convertFonttoFaces(name: string, result: ResolveFontResult) {
  return result.fonts.map((f) => convertSingleFontToFace(name, f));
}

function convertSingleFontToFace(name: string, font: FontFaceData) {
  return new FontFace(name, buildFontFaceSrc(font.src), {
    style: font.style,
    stretch: font.stretch,
    weight:
      typeof font.weight === "string"
        ? font.weight
        : typeof font.weight === "number"
          ? font.weight.toString()
          : font.weight?.join(" "),
    unicodeRange: font.unicodeRange?.join(", "),
  });
}

function convertSingleFontToString(name: string, font: FontFaceData) {
  function* generateFontFace() {
    yield `@font-face {
    font-family: ${name}
    src: ${buildFontFaceSrc(font.src)}`;
    if (font.style) yield `    font-style: ${font.style}`;
    if (font.stretch) yield `    font-stretch: ${font.stretch}`;
    if (font.weight)
      yield `    font-weight: ${typeof font.weight === "string" ? font.weight : typeof font.weight === "number" ? font.weight.toString() : font.weight?.join(" ")}`;
    if (font.unicodeRange)
      yield `    unicode-range: ${font.unicodeRange?.join(", ")}`;
    yield `}`;
  }
  return Array.from(generateFontFace()).join("\n");
}

function buildFontFaceSrc(src: (LocalFontSource | RemoteFontSource)[]): string {
  return src
    .map((source) => {
      return "name" in source
        ? `local(${source.name})`
        : Array.from(buildSingleRemoteFontFace(source)).join(" ");
    })
    .join(", ");
}

function* buildSingleRemoteFontFace(source: RemoteFontSource) {
  yield `url(${source.url})`;
  if (source.format) yield `format(${source.format})`;
  if (source.tech) yield `tech(${source.tech})`;
}
