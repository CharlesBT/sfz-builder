// asset url transformation for build
export function getAssetUrl(filepath: string) {
  return new URL(`/src/assets/${filepath}`, import.meta.url).href
}
