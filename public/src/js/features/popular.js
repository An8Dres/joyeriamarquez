import { popularContainer } from '../ui/dom.js'

const div = popularContainer.querySelector('div')
const btnLeft = popularContainer.querySelector('.left')
const btnRight = popularContainer.querySelector('.right')

function mostrarBotonesScroll(offset) {
  if (div.scrollLeft + div.clientWidth + offset > div.scrollWidth - 10) btnRight.classList.remove('visible')
  if (div.scrollLeft + offset < 50) btnLeft.classList.remove('visible')
}

popularContainer.onclick = e => {
  let offset

  if (e.target.matches('.left')) {
    btnRight.classList.add('visible')
    offset = -200
  } else if (e.target.matches('.right')) {
    btnLeft.classList.add('visible')
    offset = 200
  }

  div.scrollLeft += offset

  mostrarBotonesScroll(offset)
}