/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

// asset url transformation for build
export function getAssetUrl(filepath: string) {
  return new URL(`/src/assets/${filepath}`, import.meta.url).href
}
