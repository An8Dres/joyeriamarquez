const parser = {
  __proto__: null,
  getNumero(precio) {
    const texto = String(precio)
    const textoSinPuntos = texto.replace(/\./g, "")
    return Number(textoSinPuntos)
  },
  getPrecio(numero) {
    let texto = numero.toString()
    return texto.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  },
  getSrcset(imagenId) {
    const IMG_SIZES = ['165', '360', '533', '720', '940']
    let url = ""
    for (let i = 0; i < IMG_SIZES.length; i++) {
      const SIZE = IMG_SIZES[i]
      url += `https://napoleonejoyas.co/cdn/shop/files/${imagenId}_x${SIZE}.jpg ${SIZE}w, ` // CDN/image.jpg
    }
    return url.substring(0, url.length - 2)
  },
  getURL(nombre) {
    return nombre
    .toLowerCase()
    .normalize("NFD") // separa acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos
    .replace(/[^a-z0-9\s-]/g, "") // elimina símbolos
    .trim()
    .replace(/\s+/g, "-") // espacios -> -
    .replace(/-+/g, "-") // evita ---
  }
}