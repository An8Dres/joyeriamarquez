const MIL = ".", DEC = ","
const SYMBOLS = [MIL, "'", MIL, "'"]

const Format = {
  __proto__: null,
  
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
  productParser(array) {
    for (let i = 0; i < array.length; i++) {
      const p = array[i]
      p.href = `/product/${p.id}/${this.parseURL(p.titulo)}`
      p.main_image_id = this.createBaseImageURL(p.main_image_id)
      p.precio = this.formatNumber(p.precio)
      p.precio_anterior = this.formatNumber(p.precio_anterior)
    }
    return array
  },
  createBaseImageURL(id) {
    const IMG_SIZES = ['165', '360', '533', '720', '940']
    let url = ""
    for (let i = 0; i < IMG_SIZES.length; i++) {
      const SIZE = IMG_SIZES[i]
      url += `https://napoleonejoyas.co/cdn/shop/files/${id}_x${SIZE}.jpg ${SIZE}w, ` // CDN/image.jpg
    }
    return url.substring(0, url.length - 2)
  },
  parseURL(text) {
    return text
    .toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[^a-z0-9\s-]/g, "") // elimina símbolos
    .trim()
    .replace(/\s+/g, "-") // espacios -> -
    .replace(/-+/g, "-") // evita ---
  }
}

export default Format