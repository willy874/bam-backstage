<script>
import { h, onMounted, ref, shallowRef } from 'vue'
import Popup from './popup'
import DialogComponent from './DialogComponent.vue'

export default {
  props: {
    popup: {
      type: Popup,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const popup = props.popup
    const PopupView = shallowRef(popup.view)
    const dialog = DialogComponent.dialog
    const popupItem = ref({})
    onMounted(() => {
      popup.initPosition = () => {
        popup.ref = popupItem
        const position = popup.position
        const correctionValue = 20
        popup.offsetWidth = popupItem.value.offsetWidth
        popup.offsetHeight = popupItem.value.offsetHeight
        const topMath = (top) => {
          if (typeof top === 'number') {
            return top + 'px'
          } else if (typeof top === 'string') {
            if (top === 'top') {
              return correctionValue + 'px'
            } else if (top === 'center') {
              return (window.innerHeight - popupItem.value.offsetHeight) / 2 + 'px'
            } else if (top === 'bottom') {
              return window.innerHeight - correctionValue + 'px'
            }
            return top
          }
          return 0
        }
        const leftMath = (left) => {
          if (typeof left === 'number') {
            return left + 'px'
          } else if (typeof left === 'string') {
            if (left === 'left') {
              return correctionValue + 'px'
            } else if (left === 'center') {
              return (window.innerWidth - popupItem.value.offsetWidth) / 2 + 'px'
            } else if (left === 'bottom') {
              return window.innerWidth - correctionValue + 'px'
            }
            return left
          }
          return 0
        }
        if (position.x || position.y) {
          popupItem.value.style.left = position.x ? leftMath(position.x) : 0
          popupItem.value.style.top = position.y ? topMath(position.y) : 0
        }
        if (position.left || position.top) {
          popupItem.value.style.left = position.left ? leftMath(position.left) : 0
          popupItem.value.style.top = position.top ? topMath(position.top) : 0
        }
      }
      popup.initPosition()
    })
    return () => {
      return h(
        'div',
        {
          ref: popupItem,
          class: 'dialog__popup',
          onClick: (e) => e.stopPropagation(),
          // change zIndex
          onMousedown: () => {
            const indexOf = dialog.popups.indexOf(popup)
            if (dialog.popups[indexOf].zIndexLock) {
              return
            }
            if (indexOf !== dialog.popups.length - 1) {
              dialog.popups.push(dialog.popups.splice(indexOf, 1)[0])
            }
          },
          style: {
            maxWidth: popup.width || 'auto',
            width: popup.width ? '100%' : 'auto',
            maxHeight: popup.height || '100vh',
            height: popup.height ? '100%' : 'auto',
            zIndex: (props.index + 1) * 1,
          },
        },
        [
          h(PopupView.value, {
            id: popup.id,
            dialog: dialog,
            popupElement: popupItem.value,
            props: popup.props,
            onClick: (e) => e.stopPropagation(),
            initPosition: popup.initPosition,
            drag: (e) => {
              e.dataTransfer.setDragImage(new Image(), 0, 0)
              dialog.dragTarget = popup
              dialog.dropOffsetX = e.pageX - popupItem.value.offsetLeft
              dialog.dropOffsetY = e.pageY - popupItem.value.offsetTop
              dialog.dragStatus = 1
            },
            touch: (event) => {
              const e = Array.from(event.touches).find((p) => p.target === event.target)
              dialog.dragTarget = popup
              dialog.dropOffsetX = e.pageX - popupItem.value.offsetLeft
              dialog.dropOffsetY = e.pageY - popupItem.value.offsetTop
              dialog.touchStatus = 1
            },
          }),
        ]
      )
    }
  },
}
</script>

<style lang="scss" scoped>
.dialog__popup {
  position: absolute;
  transition: opacity 0.3s;
  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #ccc;
  }
  &::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 0.5rem;
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
  &::-webkit-scrollbar-corner {
    background: #555;
    border-radius: 50%;
  }
  &::-webkit-scrollbar-track-piece {
    background: #eee;
  }
}
</style>
