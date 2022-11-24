/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export class regExpUtils {
  public static getFirstMatch(text: string, regExp: RegExp) {
    return this.getFirstMatchV2(text, regExp)
  }

  private static getFirstMatchV2(text: string, regExp: RegExp) {
    const [[, group1]] = [...text.matchAll(regExp)]
    return group1
  }

  private static getFirstMatchV1(text: string, regExp: RegExp) {
    const match = regExp.exec(text)
    if (match) {
      return match[1]
    }
    return null
  }
}
