<template>
  <div class="datatable">
    <div class="datatable__container">
      <div class="datatable__container__table">
        <div class="datatable__container__head" ref="head">
          <div class="datatable__table__tr" :style="{ gridTemplateColumns: widthTemplate }">
            <div
              class="datatable__table__th"
              v-for="table in tables"
              :key="table.id"
              :style="{
                textAlign: table.align,
                ...table.columnStyle,
                ...table.headStyle,
              }"
            >
              <div class="datatable__table__th__block">
                <div v-if="typeof table.field === 'object' && table.title.render">
                  <component :is="table.title" v-bind="{ listData, filterList, listIndex: -1, ...table.props }"></component>
                </div>
                <div v-else v-html="table.title"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="datatable__container__body" ref="body" @scroll="scrollBody">
          <div
            v-for="(data, index) in filterList.data"
            class="datatable__table__tr"
            :key="data.id"
            :style="{ gridTemplateColumns: widthTemplate, cursor: clickTr ? 'pointer' : 'auto' }"
            @click="clickTrEvent(filterList.data[index], index, { listData, filterList, tables })"
          >
            <div
              class="datatable__table__td"
              v-for="table in tables"
              :key="table.id"
              :style="{
                textAlign: table.align,
                cursor: clickTr ? 'pointer' : 'auto',
                ...table.columnStyle,
                ...table.bodyStyle,
              }"
              @click="clickTdEvent(filterList.data[index], index, { listData, filterList, ...table.props })"
            >
              <template v-if="typeof table.field === 'object' && table.field.render">
                <component :is="table.field" v-bind="{ listIndex: index, listData, filterList, ...table.props }"></component
              ></template>
              <div v-else class="datatable__table__td__block" :style="{ webkitLineClamp: table.lineClamp || 2 }" v-html="content(table.field, index)"></div>
            </div>
          </div>
          <div v-if="listData.loading" class="datatable__table__loading">
            <slot name="loading" v-if="$slots.loading"></slot>
            <div v-else class="datatable__table__loading__animation"></div>
          </div>
        </div>
        <div class="datatable__container__foot">
          <div class="datatable__table__tr">
            <div class="datatable__table-foot">
              <div v-if="filterList.total" class="datatable__table-foot__left-text">總共{{ filterList.total }}筆</div>
              <div v-if="filterList.lastPage" class="datatable__table-foot__right-text">
                <div class="datatable__table-foot__right-text__per-page">
                  <select v-model="perPage" @change="changePerPage">
                    <option :value="10">顯示10筆</option>
                    <option :value="25">顯示25筆</option>
                    <option :value="50">顯示50筆</option>
                    <option :value="100">顯示100筆</option>
                    <option :value="250">顯示250筆</option>
                  </select>
                </div>
                <div class="datatable__table-foot__right-text__current-page">
                  <select v-model="currentPage" @change="changeCurrentPage">
                    <option v-for="i in filterList.lastPage" :key="i" :value="i">第{{ i }}頁</option>
                  </select>
                </div>
                <div class="datatable__table-foot__right-text__last-page">共{{ filterList.lastPage }}頁</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, isReactive } from 'vue'
import { v4 as uuid } from 'uuid'
import { ListModel } from '@/models/index'

/**
 * @type {Tables}
 * @property {Number} id 保留參數，請勿使用
 * @property {String} width 表格寬度，以 display:grid 為標準，但不能設為 auto。
 * @property {String|Function|VueComponent} field
 * if String: 直接對該key進行的顯示。
 * if Function: 執行後將結果以 innerHtml 的結果顯示。
 * if VueComponent: 以組件方式作讀取並顯示(一定要解算出含 render() 或 setup() 的結果)
 * @property {String} align 對齊排列，預設為 left
 * @property {Number} lineClamp 顯示行數，預設 2 行。
 * @property {Style} columnStyle 對表格進行樣式微調
 * @property {Style} headStyle 對該列表格標頭進行樣式微調 (謹慎使用，調整空間易造成跑版)
 * @property {Style} bodyStyle 對該列表格內容進行樣式微調 (謹慎使用，調整空間易造成跑版)
 * @property {Object} props 當 field 為 VueComponent 將參數傳至該組件
 *
 * @param {Array<Tables>} tables 要放入的設定
 * @param {ListModel} list 要解算為 table 的 ListModel
 * @param {Function} clickTr 點擊整列事件
 * @param {Function} clickTd 點擊單欄事件
 * @param {Boolean} ajax 是否使用 API 更新資料
 * @param {Function} filter 在沒有使用 ajax 的情況下執行過濾
 */
export default {
  name: 'DataTable',
  props: {
    model: {
      type: ListModel,
      default: () => new ListModel(),
    },
    options: {
      type: Array,
      default: () => [],
    },
    clickTr: {
      type: Function,
      default: null,
    },
    clickTd: {
      type: Function,
      default: null,
    },
    ajax: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Function,
      default: (data) => data,
    },
  },
  setup(props, context) {
    const tables = reactive(
      props.options.map((item) => {
        return {
          uuid: uuid(),
          ...item,
        }
      })
    )
    const listData = isReactive(props.model) ? props.model : reactive(props.model)
    const perPage = ref(listData.perPage || 10)
    const currentPage = ref(listData.currentPage || 1)
    const listTotal = computed(() => (props.ajax ? listData.total : listData.data.length))
    const listCurrentPage = computed(() => (props.ajax ? listData.currentPage : listData.currentPage || 1))
    const listPerPage = computed(() => (props.ajax ? listData.perPage : listData.perPage || perPage.value))
    const listLastPage = computed(() => (props.ajax ? listData.lastPage : Math.ceil(listTotal.value / listPerPage.value)))
    const filterList = computed(() => {
      const list = new ListModel({
        ...listData,
        model: listData.modelType,
        api: listData.api,
        primaryKey: listData.primaryKey,
        total: listTotal.value,
        currentPage: listCurrentPage.value,
        perPage: listPerPage.value,
        lastPage: listLastPage.value,
      })
      if (props.ajax) {
        return list
      } else if (props.filter) {
        return props.filter(list)
      } else {
        return list.set({
          data: list.data.filter((m, i) => {
            return (listCurrentPage.value - 1) * listPerPage.value <= i && i < listCurrentPage.value * listPerPage.value
          }),
        })
      }
    })
    const widthTemplate = computed(() => {
      return tables
        .map((table) => {
          switch (true) {
            case !!Number(table.width):
              return table.width + 'fr'
            case /%|rem|px|fr/.test(table.width):
              return table.width
            default:
              return 0
          }
        })
        .join(' ')
    })
    const head = ref(null)
    const body = ref(null)
    return {
      head,
      body,
      clickTrEvent: props.clickTr || (() => {}),
      clickTdEvent: props.clickTd || (() => {}),
      tables,
      listData,
      filterList,
      widthTemplate,
      perPage,
      currentPage,
      listTotal,
      listCurrentPage,
      listPerPage,
      listLastPage,
      changePerPage: () => {
        if (props.ajax) {
          listData.readList({
            params: {
              page: currentPage.value,
              per_page: perPage.value,
            },
          })
        } else {
          currentPage.value = 1
        }
      },
      changeCurrentPage: () => {
        if (props.ajax) {
          listData.readList({
            params: {
              page: currentPage.value,
              per_page: perPage.value,
            },
          })
        } else {
          listData.currentPage = currentPage.value
        }
      },
      scrollBody: (e) => {
        head.value.scrollTo(e.target.scrollLeft, 0)
      },
      content: (field, index) => {
        if (typeof field === 'string') {
          return filterList.value.data[index][field]
        }
        if (typeof field === 'function') {
          return field(filterList.value.data[index], index, { listData, filterList })
        }
        return ''
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.datatable {
  position: relative;
  display: flex;
  flex-grow: 1;
  &__container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    &__table {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      border: 1px solid #eee;
      border-radius: 0.25rem;
    }
    &__head {
      position: sticky;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1;
      flex-shrink: 0;
      overflow: auto;
      background-color: #f6f6f6;
      &::-webkit-scrollbar {
        width: 0;
        height: 2px;
      }
      &::-webkit-scrollbar-track-piece {
        background: #ccc;
      }
    }
    &__body {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-shrink: 1;
      overflow: auto;
      box-shadow: inset -2px 0 16px 4px rgba(0, 0, 0, 0.06);
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
      .datatable__table__tr {
        flex-shrink: 0;
        &:last-of-type {
          border: 0;
        }
        &:hover {
          > .datatable__table__td {
            background-color: #f6f6f6;
          }
        }
      }
    }
    &__header {
      flex-shrink: 0;
      margin: 4px 0;
      background-color: #f6f6f6;
      .datatable__table {
        &__tr {
          border: 1px solid #999;
        }
      }
    }
    &__foot {
      position: sticky;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      flex-shrink: 0;
      background-color: #f6f6f6;
    }
  }
}
.datatable__table {
  &__loading {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    &__animation {
      width: 2rem;
      height: 2rem;
      border-color: transparent rgb(23, 162, 184) rgb(23, 162, 184);
      border-width: 4px;
      border-radius: 50%;
      animation: rotate 1s linear infinite;
    }
  }
  &__tr {
    display: grid;
    text-decoration: none;
  }
  &__th {
    overflow: hidden;
    font-size: 14px;
    &__block {
      width: 100%;
      padding: 0.5rem;
      font-weight: bold;
      white-space: nowrap;
    }
  }
  &__td {
    display: flex;
    align-items: center;
    overflow: hidden;
    font-size: 14px;
    color: #343a40;
    &__block {
      display: -webkit-box;
      width: 100%;
      margin: 0.5rem 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      -webkit-box-orient: vertical;
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.datatable__table-foot {
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
