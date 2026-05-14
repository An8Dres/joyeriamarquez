import { panel, containerItemsBag } from '../dom.js'
import Bag from '../Bag.js'
import Format from './Format.js'
import Notify from './Notify.js'
import Whatsapp from './Whatsapp.js'
import QuantityPicker from './QuantityPicker.js'
import TemplateLoader from './TemplateLoader.js'

async function load() {
  let ids = Bag.getItems().map(i => i = i.id)
  const tpl = await TemplateLoader.getTemplate('bagItem')

  fetch('/bag-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  })
  .then(res => res.json())
  .then(data => { data.forEach(item => { 
      const card = tpl.cloneNode(true)
      card.dataset.id = item.id

      let cantity = Bag.findItem(item.id).cantity

      if (cantity < 2) {
        if (cantity < 1) card.classList.add('disabled')
        card.querySelector('.qty-btn--minus').disabled = true
      }
      else if (cantity > 998) {
        card.querySelector('.qty-btn--plus').disabled = true
        cantity = 999
      }

      card.querySelector('img').src = `src/pdts/icon/${item.id}.webp`
      card.querySelector('.item-card__type').textContent = item.type.toUpperCase()
      card.querySelector('.item-card__name').textContent = item.name
      card.querySelector('.price').textContent = item.price
      card.querySelector('.qty-input').value = cantity
      card.querySelector('.qty-total span').textContent = Format.mult(cantity, item.price)

      containerItemsBag.appendChild(card)
    })
    calculateTotalBag()
  })
}

function calculateTotalBag() {
  const bagTotal = panel.querySelector('.bag-buttons__total span')
  const itemsTotal = panel.querySelectorAll('.qty-total span')
  let total = 0

  itemsTotal.forEach(t => {
    total = Format.sum(total, t.textContent)
  })

  bagTotal.innerText = total
}

export function actions() {
  function getBagLink() {
    let link = location.host + '/order?t='
      containerItemsBag.querySelectorAll('.item-card').forEach(i => {
        const cant = i.querySelector('input').value
        if (cant > 0) {
          link += i.dataset.id
          link += cant > 1 ? ':' + cant : ''
          link += ','
        }
      })
      return link.slice(0, -1)
  }
  function onClickHandler(e) {
    //remove Item
    if (e.target.closest('.item-card__button--remove')) {
      Bag.remove(e.target.closest('.item-card'))
      calculateTotalBag()
    }
    //Copy link
    else if (e.target.closest('.bag-buttons__share')) {
      Notify.show({
        title: 'Copiado en portapapeles',
        text: 'Ya puedes compartirlo',
        handler: () => {navigator.clipboard.writeText(getBagLink())}
      })
    }
    //Button order
    else if (e.target.closest('.bag-buttons__order')) {
      Whatsapp.sendOrder(getBagLink())
    }
  }
  function onUpdateHandler(card) {
    Bag.add(card)
    setTimeout(calculateTotalBag, 0)
  }

  const QTY = new QuantityPicker()
  QTY.addEventsTo(panel)
  QTY.onClick(onClickHandler)
  QTY.onUpdate(onUpdateHandler)

  load()
}
