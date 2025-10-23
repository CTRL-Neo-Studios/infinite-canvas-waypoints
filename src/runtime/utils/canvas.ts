import type { Side } from '../types/jsoncanvas'

export function getAnchorPoint(nodeEl: HTMLElement, side?: Side) {
  const x = parseInt(nodeEl.style.left || '0', 10)
  const y = parseInt(nodeEl.style.top || '0', 10)
  const width = nodeEl.offsetWidth
  const height = nodeEl.offsetHeight

  switch (side) {
    case 'top':
      return { x: x + width / 2, y }
    case 'right':
      return { x: x + width, y: y + height / 2 }
    case 'bottom':
      return { x: x + width / 2, y: y + height }
    case 'left':
      return { x, y: y + height / 2 }
    default:
      return { x: x + width / 2, y: y + height / 2 }
  }
}


