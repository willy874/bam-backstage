<template>
  <div class="datatable-foot">
    <div class="datatable-foot__left-text">總共{{ list.total }}筆</div>
    <div class="datatable-foot__right-text">
      <div class="datatable-foot__right-text__per-page">
        <select v-model="list.perPage" @change="changePerPage">
          <option :value="perPage">顯示{{ perPage }}筆</option>
          <option :value="25">顯示25筆</option>
          <option :value="50">顯示50筆</option>
          <option :value="100">顯示100筆</option>
          <option :value="250">顯示250筆</option>
        </select>
      </div>
      <div class="datatable-foot__right-text__current-page">
        <select v-model="list.currentPage" @change="changeCurrentPage">
          <option v-for="i in list.lastPage" :key="i" :value="i">第{{ i }}頁</option>
        </select>
      </div>
      <div class="datatable-foot__right-text__last-page">共{{ list.lastPage }}頁</div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { ListModel } from '@/models/index'

/**
 * @param {Function} setFilterList 設定過濾 List 的 Function
 * @param {ListModel} listData 傳入 DataTable 原始的 ListModel
 */
export default {
  props: {
    setFilterList: {
      type: Function,
      required: true,
    },
    listData: {
      type: ListModel,
      required: true,
    },
    ajax: {
      type: Boolean,
      default: false,
    },
  },
  name: 'DataTableFooterBar',
  setup(props) {
    const list = reactive(props.listData)
    const perPage = ref(props.listData.perPage)
    const first = ref(true)
    const mathPageData = () => {
      if (props.ajax) {
        // AJAX 行為
      } else {
        if (list.total === 0) list.total = list.data.length
        if (list.currentPage === 0) list.currentPage = 1
        if (list.perPage === 0) list.perPage = 10
        if (list.lastPage === 0) list.lastPage = Math.ceil(list.total / list.perPage)
      }
    }
    const changePerPage = () => {
      if (props.ajax) {
        // AJAX 行為
      } else {
        list.currentPage = 1
        list.lastPage = Math.ceil(list.total / list.perPage)
      }
    }
    const changeCurrentPage = () => {}
    props.setFilterList((listData) => {
      if (props.ajax) {
        // AJAX 行為
      } else {
        if (first.value && list.perPage) {
          perPage.value = list.perPage
          first.value = false
        } else {
          perPage.value = 10
        }
      }
      mathPageData()
      if (props.ajax) {
        return list
      } else {
        return listData.set({
          data: listData.data.filter((m, i) => {
            return (listData.currentPage - 1) * listData.perPage <= i && i < listData.currentPage * listData.perPage
          }),
        })
      }
    })
    return {
      changePerPage,
      changeCurrentPage,
      perPage,
      list,
    }
  },
}
</script>

<style lang="scss" scoped>
.datatable-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 1rem;
  &__left-text {
    display: flex;
    align-items: center;
    padding-top: 0.25rem;
    padding-right: 1rem;
    padding-bottom: 0.25rem;
    padding-left: 0.75rem;
  }
  &__right-text {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    &__per-page {
      padding-top: 0.25rem;
      padding-right: 1rem;
      padding-bottom: 0.25rem;
    }
    &__current-page {
      padding-top: 0.25rem;
      padding-right: 1rem;
      padding-bottom: 0.25rem;
    }
    &__last-page {
      display: flex;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      padding-left: 0.75rem;
    }

    select {
      padding: 0.25rem 1.75rem 0.25rem 0.75rem;
      font-size: 14px;
      line-height: 1.5;
      cursor: pointer;
      background-color: transparent;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.25rem center;
      background-size: 16px 12px;
      border: 1px solid transparent;
      border-radius: 0.25rem;
      appearance: none;
      &:focus {
        border: 1px solid #86b7fe;
        outline: 0;
        box-shadow: 0 0 0.4rem 0 #86b7fe;
      }
    }
  }
}
</style>
