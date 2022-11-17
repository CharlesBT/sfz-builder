/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export class jsUtils {
  static upperCaseFirstLetter(string) {
    // uppercase first letter of each words
    const words = string.split(' ')
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    return words.join(' ')
  }

  // returns an array of grouped size elements
  static splitArrayBySize(array, size) {
    const result = []
    while (array.length) {
      result.push(array.splice(0, size))
    }
    return result
  }

  // find closest value in array
  static findClosestValueInArray(array, value) {
    const result = array.reduce((a, b) => {
      return Math.abs(b - value) < Math.abs(a - value) ? b : a
    })
    return result
  }

  // promise version of setTimeout
  static sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }
}
