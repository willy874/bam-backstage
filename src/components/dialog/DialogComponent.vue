<script>
import { h } from 'vue'
import cx from 'classnames'
import useDialog from './use'
import PopupComponent from './PopupComponent.vue'

export default {
  dialog: useDialog(),
  setup() {
    const dialog = useDialog()
    document.addEventListener('dragend', () => {
      dialog.dragStatus = 0
    })
    document.addEventListener('touchend', () => {
      dialog.touchStatus = 0
    })
    const isPopupOpen = () => dialog.popups.length
    const popupMove = (e) => {
      const el = dialog.dragTarget.ref
      const offsetWidth = el.offsetWidth
      const offsetHeight = el.offsetHeight
      if (dialog.dragTarget.windowRangeLimt) {
        el.style.left = e.pageX - dialog.dropOffsetX + 'px'
        el.style.top = e.pageY - dialog.dropOffsetY + 'px'
      } else {
        if (window.innerWidth - offsetWidth < e.pageX - dialog.dropOffsetX) {
          el.style.left = window.innerWidth - offsetWidth - 1 + 'px'
        } else if (e.pageX - dialog.dropOffsetX < 1) {
          el.style.left = 0
        } else {
          el.style.left = e.pageX - dialog.dropOffsetX + 'px'
        }
        if (window.innerHeight - offsetHeight < e.pageY - dialog.dropOffsetY) {
          el.style.top = window.innerHeight - offsetHeight - 1 + 'px'
        } else if (e.pageY - dialog.dropOffsetY < 1) {
          el.style.top = 0
        } else {
          el.style.top = e.pageY - dialog.dropOffsetY + 'px'
        }
      }
    }
    const windowResize = () => {
      if (isPopupOpen()) {
        dialog.popups.forEach((popup) => {
          const target = popup.ref
          const correctionValue = 8
          const offsetRight = target.offsetWidth + target.offsetLeft
          const offsetBottom = target.offsetHeight + target.offsetTop
          if (window.innerWidth - correctionValue <= offsetRight) {
            if (window.innerWidth - correctionValue > target.offsetWidth) {
              target.style.left = window.innerWidth - popup.offsetWidth - correctionValue + 'px'
            }
          }
          if (window.innerHeight - correctionValue <= offsetBottom) {
            if (window.innerHeight - correctionValue > target.offsetHeight) {
              target.style.top = window.innerHeight - popup.offsetHeight - correctionValue + 'px'
            }
          }
          requestAnimationFrame(() => {
            if (!popup.positionLock) {
              popup.initPosition()
            }
          })
        })
      }
    }
    window.addEventListener('resize', windowResize)
    return () => {
      return h(
        'div',
        {
          class: cx('dialog', {
            'dialog--active': !isPopupOpen(),
          }),
          onClick: () => {
            dialog.popups.forEach((popup) => {
              if (popup.onBackgroundClick) popup.onBackgroundClick(popup)
            })
          },
          onDragover: (e) => {
            if (dialog.dragTarget && dialog.dragTarget.ref) {
              if (dialog.dragStatus) {
                popupMove(e)
              }
            }
          },
          onTouchmove: (event) => {
            if (dialog.dragTarget && dialog.dragTarget.ref) {
              if (dialog.touchStatus) {
                const e = Array.from(event.touches).find((p) => p.target === event.target)
                popupMove(e)
              }
            }
          },
        },
        [
          dialog.popups.map((popup, index) => {
            return h(PopupComponent, {
              popup,
              index,
              key: popup.id,
            })
          }),
        ]
      )
    }
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 40;
  background-color: rgba(0, 0, 0, 0.25);
  opacity: 1;
  transition: opacity 0.3s;
}
.dialog--active {
  pointer-events: none;
  opacity: 0;
}
</style>
