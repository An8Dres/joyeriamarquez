import Format from './Format.js'

export default class QuantityPicker {
  #onUpdate
  #onClick

  constructor() {
    this.#onUpdate = () => {}
    this.#onClick = () => {}
  }

  #update(qtyPicker) {
    const card = qtyPicker.closest('article')
    const total = qtyPicker.querySelector('.qty-total span')
    const input = qtyPicker.querySelector('.qty-input')
    const btnPlus = qtyPicker.querySelector('.qty-btn--plus')
    const btnMinus = qtyPicker.querySelector('.qty-btn--minus')
    const price = qtyPicker.closest('article').querySelector('.price').textContent

    input.value = input.value ? parseInt(input.value) : 0

    if (input.value < 2) {
      btnMinus.setAttribute('disabled', '')
    } else {
      btnMinus.removeAttribute('disabled')
    }

    this.#onUpdate(card)

    if (input.value > 998) {
      input.value = 999
      btnPlus.setAttribute('disabled', '')
    } else {
      btnPlus.removeAttribute('disabled', '')
    }

    total.innerText = Format.mult(price, input.value)
  }

  addEventsTo(container) {
    container.addEventListener('click', e => {
      const i = e.target
      const qtyPicker = i.closest('.qty-picker')
      if (qtyPicker) {
        const input = qtyPicker.querySelector('.qty-input')
        const btnPlus = qtyPicker.querySelector('.qty-btn--plus')
        const btnMinus = qtyPicker.querySelector('.qty-btn--minus')
        
        if (i == btnPlus || i == btnMinus) {
          i == btnPlus ? input.value++ : input.value--;
          this.#update(qtyPicker)
        }
      }

      this.#onClick(e)
    })

    container.addEventListener('input', e => {
      this.#update(e.target.closest('.qty-picker'))
    })

    container.addEventListener('keydown',e => {
      if (e.target.closest('.qty-input') && !'1234567890'.includes(e.key) && e.key != 'Backspace' && e.key != 'Tab') e.preventDefault()
    })
  }

  onClick(callback = () => {}) {
    this.#onClick = callback
  }

  onUpdate(callback = () => {}) {
    this.#onUpdate = callback
  }
}