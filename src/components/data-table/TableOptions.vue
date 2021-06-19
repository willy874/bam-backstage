<template>
  <div class="d-flex flex-center w-100">
    <RouterLink class="btn-icon" :to="routeTo" title="查看詳細">
      <Icon pattern="Loupe" size="24" />
    </RouterLink>
    <button type="button" class="btn-icon" v-if="authDelete" @click="clickDelete" title="刪除">
      <Icon pattern="Trash" size="24" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'TableOptions',
  props: {
    authDelete: {
      type: Boolean,
      default: false,
    },
    detailRoute: {
      type: String,
      default: '',
    },
    listIndex: {
      type: Number,
      required: true,
    },
    listData: {
      type: Object,
      required: true,
    },
    orderDelete: {
      type: Function,
    },
    pageId: {
      type: [Number, String],
    },
    imgId: {
      type: [Number, String],
    },
    deleteCheck: {
      type: Function,
      default: () => false,
    },
  },
  computed: {
    routeTo() {
      const params = {
        id: this.listData.data[this.listIndex].id,
      }
      if (this.pageId) {
        params.id = this.pageId
        params.img = this.listData.data[this.listIndex].id
      }
      if (this.imgId) {
        params.img = this.imgId
      }
      return { name: this.detailRoute, params, query: this.$route.query }
    },
  },
  methods: {
    async clickDelete(e) {
      const model = this.listData.data[this.listIndex]
      const index = this.listIndex
      const list = this.listData
      if (this.deleteCheck(model, index, list)) {
        this.$swal.fire({
          title: '無法刪除該筆資料',
          icon: 'error',
        })
        return
      }
      if (this.orderDelete) {
        this.orderDelete(e, model, index, list)
      } else {
        const swalResult = await this.$alert.delete()
        if (swalResult.isConfirmed) {
          await model.deleteData()
          list.data.splice(index, 1)
        }
      }
    },
  },
}
</script>
