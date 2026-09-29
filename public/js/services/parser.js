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
  getSrcset(urlOriginal) {
    //generar Srcset para Cloudinary
    const anchos = [300, 600, 900, 1200, 1800]
    
    const uploadIndex = urlOriginal.indexOf('/upload/');
    
    if (uploadIndex === -1) return urlOriginal

    const basePart = urlOriginal.substring(0, uploadIndex + 8)
    const imageId = urlOriginal.substring(uploadIndex + 8)

    const lineasSrcset = anchos.map(ancho => {
      const parametros = `w_${ancho},f_auto,q_auto`;
      const urlTransformada = `${basePart}${parametros}/${imageId}`;
      
      return `${urlTransformada}${ancho}w`
    });

    return lineasSrcset.join(',\n')
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