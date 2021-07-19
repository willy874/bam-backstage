<template>
  <div>
    <button type="button" class="btn-icon text-primary-500 hover:text-primary-600" @click="click">
      <Icon src="Question" size="24" />
    </button>
  </div>
</template>

<script>
import QuestionDialog from './QuestionDialog.vue'
import { useDialog } from '@/components/dialog/index'

export default {
  name: 'QuestionButton',
  inheritAttrs: false,
  props: {
    questionContent: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { questionContent } = props
    return {
      click: () => {
        const dialog = useDialog()
        dialog.popup(QuestionDialog, {
          width: '576px',
          props: {
            content: questionContent,
          },
        })
      },
    }
  },
}
</script>
