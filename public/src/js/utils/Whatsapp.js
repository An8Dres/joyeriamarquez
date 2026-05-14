import { btnWhatsapp } from '../../js/dom.js'

export default class Whatsapp {
  static #phoneNumber = 573218669435
  static #defaultMessage = "¡Hola Milo, quiero más información! 😄"
  static #orderMessage = "¡Hola! Deseo ordenar estos productos Milo"

  static getNumber() {
    return this.#phoneNumber
  }
  static getOrder() {
    return this.#orderMessage
  }
  static getDefault() {
    return this.#defaultMessage
  }
  static send(message = '') {
    window.open(`https://wa.me/${Whatsapp.getNumber()}?text=${encodeURIComponent(message)}`, '_blank')
  }
  static sendOrder(linkURL = '') {
    Whatsapp.send(linkURL + '\n\n' + Whatsapp.getOrder())
  }
  static sendDefault() { Whatsapp.send(Whatsapp.getDefault()) }
}

btnWhatsapp.onclick = Whatsapp.sendDefault