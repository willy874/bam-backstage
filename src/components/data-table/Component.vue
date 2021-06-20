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
                <div v-if="typeof table.field === 'object' && table.title.render" :is="table.title" v-bind="{ listData, listIndex: -1, ...table.props }"></div>
                <div v-else v-html="table.title"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="datatable__container__body" ref="body" @scroll="scrollBody">
          <div
            v-for="(data, index) in listData.data"
            class="datatable__table__tr"
            :key="data.id"
            :style="{ gridTemplateColumns: widthTemplate, cursor: clickTr ? 'pointer' : 'auto' }"
            @click="clickTrEvent(listData.data[index], index, listData, tables)"
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
              @click="clickTdEvent(listData.data[index], index, listData, table.props)"
            >
              <template
                v-if="typeof table.field === 'object' && table.field.render"
                :is="table.field"
                v-bind="{ listIndex: index, listData, ...table.props }"
              ></template>
              <div
                v-else
                class="datatable__table__td__block"
                :style="{ webkitLineClamp: table.lineClamp || 2 }"
                v-html="content(table.field, index, listData)"
              ></div>
            </div>
          </div>
          <div v-if="list.loading" class="datatable__table__loading">
            <slot name="loading" v-if="$slots.loading"></slot>
            <div v-else class="datatable__table__loading__animation"></div>
          </div>
        </div>
        <div class="datatable__container__foot">
          <div class="datatable__table__tr">
            <slot v-if="$slots.footer" name="footer"></slot>
            <FooterBar v-bind="{ setFilterList, listData: list, ajax }" />
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
import FooterBar from './FooterBar.vue'

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
 * @param {Function} clickTr
 * @param {Function} clickTd
 */
export default {
  name: 'DataTable',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    list: {
      type: ListModel,
      default: () => new ListModel(),
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
    const listData = isReactive(props.list) ? props.list : reactive(props.list)
    const filterList = ref((list) => list)
    const setFilterList = (handle) => {
      filterList.value = handle
    }
    const handleList = computed(() => {
      return filterList.value(
        new ListModel({
          model: listData.modelType,
          api: listData.api,
          primaryKey: listData.primaryKey,
          ...listData,
        })
      )
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
      listData: handleList,
      widthTemplate,
      setFilterList,
      scrollBody: (e) => {
        head.value.scrollTo(e.target.scrollLeft, 0)
      },
      widthType: (width) => {
        switch (true) {
          case width === 'grow':
            return { flexGrow: 1, flexShrink: 1 }
          case /%|rem|px/.test(width):
            return { width }
          default:
            return { width: 0 }
        }
      },
      content: (field, index, list) => {
        if (typeof field === 'string') {
          return list.data[index][field]
        }
        if (typeof field === 'function') {
          return field(list.data[index], index, list)
        }
        return ''
      },
    }
  },
  components: {
    FooterBar,
  },
}
/**
 * drag
 * dragend
 * dragenter
 * dragexit
 * dragleave
 * dragover
 * dragstart
 * drop
 * dblclick
 */
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
          background-color: #f6f6f6;
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
</style>
