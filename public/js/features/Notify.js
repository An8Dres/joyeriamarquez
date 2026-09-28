let timeOutId = undefined

const classType = ['info', 'warn','error']

const Notify = {
  __proto__: null,

  show({title = 'Notify', text = 'This is a notify', type = 0, handler = () => {}}) {
    notifyElement.classList.remove('open')
    try {
      handler()
      clearTimeout(timeOutId)
      //TODO: REPAIR
      classType.forEach(c => {
        if (c === classType[type]) return
        if (notifyElement.classList.contains(c)) notifyElement.classList.remove(c)
      })
      notifyElement.classList.add(classType[type])
      notifyElement.querySelector('.notify-title').innerText = title
      notifyElement.querySelector('.notify-text').innerText = text
      notifyElement.classList.add('open')
      timeOutId = setTimeout(()=> {notifyElement.classList.remove('open')}, 5000)
    } catch (err) {
      console.error('No se pudo monstrar la notificación: ', err)
    }
  },

  close() { notifyElement.classList.remove('open') }
}