// const loadedStyles = new Set()

export default class Templates {
  static #loadedTemplates = {}

  static #get(name) {
    return this.#loadedTemplates[name]
  }

  static async getTemplate(name = '') {
    const path = `templates/${name}.html`

    if (!this.#get(name)) {
      const res = await fetch(path)
      const html = await res.text()

      const container = document.createElement('div')
      container.innerHTML = html

      const tpl = container.querySelector('template')
      if (!tpl) throw new Error(`Did not find template "${name}"`)
      this.#loadedTemplates[name] = tpl
    }

    return this.#get(name).content.firstElementChild
  }
}

  // const css = `css/${name}.css`

    // if (!loadedStyles.has(css)) {
    //   const link = document.createElement('link')
    //   link.rel = 'stylesheet'
    //   link.href = css
    //   document.head.appendChild(link)
    //   loadedStyles.add(css)
    // }