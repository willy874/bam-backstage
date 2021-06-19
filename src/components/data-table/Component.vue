<template>
  <div class="datatable">
    <div class="datatable__container">
      <!-- <div class="datatable__container__header" v-if="$slots.header">
        <div class="datatable__table__tr">
          <slot name="header"></slot>
        </div>
      </div> -->
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
                <div v-if="typeof table.field === 'object' && table.title.render" :is="table.title" v-bind="{ listData, ...table.props }"></div>
                <div v-else v-html="table.title"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="datatable__container__body" ref="body" @scroll="scrollBody">
          <div v-for="(data, index) in listData.data" class="datatable__table__tr" :key="data.id" :style="{ gridTemplateColumns: widthTemplate }">
            <div
              class="datatable__table__td"
              v-for="table in tables"
              :key="table.id"
              :style="{
                textAlign: table.align,
                ...table.columnStyle,
                ...table.bodyStyle,
              }"
            >
              <div v-if="typeof table.field === 'object' && table.field.render" :is="table.field" v-bind="{ listIndex: index, listData, ...table.props }"></div>
              <div
                v-else
                class="datatable__table__td__block"
                :style="{ webkitLineClamp: table.lineClamp || 2 }"
                v-html="content(table.field, index, listData)"
              ></div>
            </div>
          </div>
        </div>
        <div class="datatable__container__foot" v-if="$slots.footer">
          <div class="datatable__table__tr">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed, isReactive } from 'vue'
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
  },
  setup(props) {
    const tables = reactive(
      props.options.map((item) => {
        return {
          uuid: uuid(),
          ...item,
        }
      })
    )
    const listData = isReactive(props.list) ? props.list : reactive(props.list)
    const sortList = computed(() => {
      return listData.data.map((model) => {
        return {
          id: model.id,
        }
      })
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

    return {
      tables,
      listData,
      sortList,
      widthTemplate,
      scrollBody: (e) => {
        this.$refs.head.scrollTo(e.target.scrollLeft, 0)
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
      flex-grow: 1;
      flex-shrink: 1;
      overflow: auto;
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
      .datatable__table {
        &__tr {
          border-top: 2px solid #999;
          border-bottom: 0;
        }
      }
    }
  }
}
.datatable__table__tr {
  display: grid;
  text-decoration: none;
}
.datatable__table {
  &__th {
    overflow: hidden;
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
</style>
