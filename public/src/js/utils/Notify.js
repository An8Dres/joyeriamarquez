import { notify } from '../dom.js'

let timeOutId = undefined

export default class Notify {
  static async show({title = 'Notify', text = 'This is a notify', type = 0, handler = () => {}}) {
    notify.classList.remove('open')
    try {
      handler()
      clearTimeout(timeOutId)
      notify.querySelector('.notify-title').innerText = title
      notify.querySelector('.notify-text').innerText = text
      setTimeout(() => {notify.classList.add('open')}, 20)
      timeOutId = setTimeout(() => {notify.classList.remove('open')}, 5000)
    } catch (err) {
      console.error('No se pudo monstrar la notificación: ', err)
    }
  }
}