const MIL = ".", DEC = ","
const SYMBOLS = [MIL, "'", MIL, "'"]

const Format = {
  __proto__: null,

  parseNumber(...numbers) {
    const result = new Float64Array(numbers.length)
    let n = 0

    for (let i = 0; i < numbers.length; i++) {
      n = numbers[i]

      for (let j = 0; j < SYMBOLS.length; j++) {
        const sep = n.split(SYMBOLS[j])
        n = ""
        sep.forEach(part => n += part)
      }

      const final = n.split(DEC)
      result[i] = parseFloat(final[0] + "." + final[1])
    }

    return numbers.length === 1 ? result[0] : numbers.length > 0 ? result : null
  },
  
  formatNumber(number = 0) {
    const parts = number.toString().split(".")
    let n = parts[0]
    let part1, part2

    for (let i = 0; i < SYMBOLS.length; i++) {
      const l = ((i + 1) * 4) - 1

      if (n.length > l) {
        part1 = n.slice(0, -l)
        part2 = n.slice(-l)
        n = part1 + SYMBOLS[i] + part2
      }
    }

    if (parts[1]) n += DEC + parts[1]

    return n
  },
  
  mult(num1 = 0, num2 = 0) {
    const numbers = this.parseNumber(num1, num2)
    const result = numbers[0] * numbers[1]
    return this.formatNumber(result)
  },

  sum(...numbers) {
    const formaties = this.parseNumber(numbers)
    let result = 0
    for (let i = 0; i < numbers.length; i++) result += formaties[i]
    return this.formatNumber(result)
  }
}

export default Format