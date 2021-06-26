import { reactive } from 'vue'
import Dialog from './dialog'

const dialog = new Dialog()

export default function () {
  return reactive(dialog)
}
