const midiKeyMap = new Map<string, number>()

midiKeyMap.set('C0', 0)
midiKeyMap.set('C#0', 1)
midiKeyMap.set('D0', 2)
midiKeyMap.set('D#0', 3)
midiKeyMap.set('E0', 4)
midiKeyMap.set('F0', 5)
midiKeyMap.set('F#0', 6)
midiKeyMap.set('G0', 7)
midiKeyMap.set('G#0', 8)
midiKeyMap.set('A0', 9)
midiKeyMap.set('A#0', 10)
midiKeyMap.set('B0', 11)
midiKeyMap.set('C1', 12)
midiKeyMap.set('C#1', 13)
midiKeyMap.set('D1', 14)
midiKeyMap.set('D#1', 15)
midiKeyMap.set('E1', 16)
midiKeyMap.set('F1', 17)
midiKeyMap.set('F#1', 18)
midiKeyMap.set('G1', 19)
midiKeyMap.set('G#1', 20)
midiKeyMap.set('A1', 21)
midiKeyMap.set('A#1', 22)
midiKeyMap.set('B1', 23)
midiKeyMap.set('C2', 24)
midiKeyMap.set('C#2', 25)
midiKeyMap.set('D2', 26)
midiKeyMap.set('D#2', 27)
midiKeyMap.set('E2', 28)
midiKeyMap.set('F2', 29)
midiKeyMap.set('F#2', 30)
midiKeyMap.set('G2', 31)
midiKeyMap.set('G#2', 32)
midiKeyMap.set('A2', 33)
midiKeyMap.set('A#2', 34)
midiKeyMap.set('B2', 35)
midiKeyMap.set('C3', 36)
midiKeyMap.set('C#3', 37)
midiKeyMap.set('D3', 38)
midiKeyMap.set('D#3', 39)
midiKeyMap.set('E3', 40)
midiKeyMap.set('F3', 41)
midiKeyMap.set('F#3', 42)
midiKeyMap.set('G3', 43)
midiKeyMap.set('G#3', 44)
midiKeyMap.set('A3', 45)
midiKeyMap.set('A#3', 46)
midiKeyMap.set('B3', 47)
midiKeyMap.set('C4', 48)
midiKeyMap.set('C#4', 49)
midiKeyMap.set('D4', 50)
midiKeyMap.set('D#4', 51)
midiKeyMap.set('E4', 52)
midiKeyMap.set('F4', 53)
midiKeyMap.set('F#4', 54)
midiKeyMap.set('G4', 55)
midiKeyMap.set('G#4', 56)
midiKeyMap.set('A4', 57)
midiKeyMap.set('A#4', 58)
midiKeyMap.set('B4', 59)
midiKeyMap.set('C5', 60)
midiKeyMap.set('C#5', 61)
midiKeyMap.set('D5', 62)
midiKeyMap.set('D#5', 63)
midiKeyMap.set('E5', 64)
midiKeyMap.set('F5', 65)
midiKeyMap.set('F#5', 66)
midiKeyMap.set('G5', 67)
midiKeyMap.set('G#5', 68)
midiKeyMap.set('A5', 69)
midiKeyMap.set('A#5', 70)
midiKeyMap.set('B5', 71)
midiKeyMap.set('C6', 72)
midiKeyMap.set('C#6', 73)
midiKeyMap.set('D6', 74)
midiKeyMap.set('D#6', 75)
midiKeyMap.set('E6', 76)
midiKeyMap.set('F6', 77)
midiKeyMap.set('F#6', 78)
midiKeyMap.set('G6', 79)
midiKeyMap.set('G#6', 80)
midiKeyMap.set('A6', 81)
midiKeyMap.set('A#6', 82)
midiKeyMap.set('B6', 83)
midiKeyMap.set('C7', 84)
midiKeyMap.set('C#7', 85)
midiKeyMap.set('D7', 86)
midiKeyMap.set('D#7', 87)
midiKeyMap.set('E7', 88)
midiKeyMap.set('F7', 89)
midiKeyMap.set('F#7', 90)
midiKeyMap.set('G7', 91)
midiKeyMap.set('G#7', 92)
midiKeyMap.set('A7', 93)
midiKeyMap.set('A#7', 94)
midiKeyMap.set('B7', 95)
midiKeyMap.set('C8', 96)
midiKeyMap.set('C#8', 97)
midiKeyMap.set('D8', 98)
midiKeyMap.set('D#8', 99)
midiKeyMap.set('E8', 100)
midiKeyMap.set('F8', 101)
midiKeyMap.set('F#8', 102)
midiKeyMap.set('G8', 103)
midiKeyMap.set('G#8', 104)
midiKeyMap.set('A8', 105)
midiKeyMap.set('A#8', 106)
midiKeyMap.set('B8', 107)
midiKeyMap.set('C9', 108)
midiKeyMap.set('C#9', 109)
midiKeyMap.set('D9', 110)
midiKeyMap.set('D#9', 111)
midiKeyMap.set('E9', 112)
midiKeyMap.set('F9', 113)
midiKeyMap.set('F#9', 114)
midiKeyMap.set('G9', 115)
midiKeyMap.set('G#9', 116)
midiKeyMap.set('A9', 117)
midiKeyMap.set('A#9', 118)
midiKeyMap.set('B9', 119)
midiKeyMap.set('C10', 120)
midiKeyMap.set('C#10', 121)
midiKeyMap.set('D10', 122)
midiKeyMap.set('D#10', 123)
midiKeyMap.set('E10', 124)
midiKeyMap.set('F10', 125)
midiKeyMap.set('F#10', 126)
midiKeyMap.set('G10', 127)

//  iterate over pairs of keys and values #1
// for (const [key, value] of midiKeyMap) {
//     console.log(key + ': ' + value)
// }

// //  iterate over pairs of keys and values #1
// for (const [key, value] of midiKeyMap.entries()) {
//     console.log(key + ': ' + value)
// }

// //  iterate over keys
// for (const key of midiKeyMap.keys()) {
//     console.log(key)
// }

// //  iterate over values
// for (const value of midiKeyMap.values()) {
//     console.log(value)
// }

export { midiKeyMap }
