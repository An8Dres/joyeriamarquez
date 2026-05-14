export default class Format {
  static #separator = [".", "'", ".", "'"]

  static #form = (num1, num2) => {
    let a1 = num1
    let a2 = num2
    let n1 = ""
    let n2 = ""

    this.#separator.forEach(s => {
      const sep1 = a1.toString().split(s)
      sep1.forEach(part => n1 += part)
      a1 = n1
      n1 = ""

      const sep2 = a2.toString().split(s)
      sep2.forEach(part => n2 += part)
      a2 = n2
      n2 = ""
    })

    return [parseInt(a1), parseInt(a2)]
  }

  static format(number = 0) {
    let n = number.toString()
    let part1, part2

    this.#separator.forEach((s, i) => {
      const l = ((i + 1) * 4) - 1

      if (n.length > l) {
        part1 = n.slice(0, -l)
        part2 = n.slice(-l)
        n = part1 + s + part2
      }
    })

    return n
  }

  static mult(num1 = 0, num2 = 0) {
    const numbers = this.#form(num1, num2)
    const result = numbers[0] * numbers[1]
    return this.format(result)
  }

  static sum(num1 = 0, num2 = 0) {
    const numbers = this.#form(num1, num2)
    const result = numbers[0] + numbers[1]
    return this.format(result)
  }
}