import { notifyElement } from '../ui/dom.js'

let timeOutId = undefined

export const Notify = {
  __proto__: null,

  async show({title = 'Notify', text = 'This is a notify', type = 0, handler = () => {}}) {
    notifyElement.classList.remove('open')
    try {
      handler()
      clearTimeout(timeOutId)
      notifyElement.querySelector('.notify-title').innerText = title
      notifyElement.querySelector('.notify-text').innerText = text
      setTimeout(()=> {notifyElement.classList.add('open')}, 20)
      timeOutId = setTimeout(()=> {notifyElement.classList.remove('open')}, 5000)
    } catch (err) {
      console.error('No se pudo monstrar la notificación: ', err)
    }
  }
}

notifyElement.querySelector('.notify-btn').onclick = ()=> notifyElement.classList.remove('open')