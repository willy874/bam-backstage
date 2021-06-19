<template>
  <PageLayout>
    <template #header>
      <div class="border-b flex">
        <div class="px-4 py-2">
          <Breadcrumb />
        </div>
        <div class="flex items-end py-1"></div>
      </div>
    </template>
    <div class="flex-grow flex flex-col p-4">
      <DataTable v-bind="dataTableProps">
        <template #header v-if="dataTableHeater" :is="dataTableHeater"></template>
        <template #footer v-if="dataTableFooter" :is="dataTableFooter"></template>
      </DataTable>
    </div>
    <template #footer v-if="pageFooter" :is="pageFooter"></template>
  </PageLayout>
</template>

<script>
import { reactive } from 'vue'
import PageLayout from '@/container/PageLayout.vue'
import { ListModel, ArticleModel } from '@/models/index'

export default {
  name: 'ArticleList',
  props: {
    routeTitle: {
      type: String,
      default: '',
    },
    modelSchema: {
      type: Object,
      default: () => ({
        model: ArticleModel,
      }),
    },
    pageHeater: {
      type: Object,
      default: () => null,
    },
    pageFooter: {
      type: Object,
      default: () => null,
    },
    dataTable: {
      type: Object,
      default: () => ({}),
    },
    dataTableHeater: {
      type: Object,
      default: () => null,
    },
    dataTableFooter: {
      type: Object,
      default: () => null,
    },
    setupTest: {
      type: Function,
      default: () => {},
    },
  },
  setup(props, context) {
    const listModelData = reactive(new ListModel(props.modelSchema))
    const dataTableProps = reactive({
      ...props.dataTable,
      list: listModelData,
    })

    const setupResult = {
      dataTableProps,
    }

    // 攔截回傳，資料檢測。
    props.setupTest({
      props,
      context,
      setupResult,
    })

    return setupResult
  },
  components: {
    PageLayout,
  },
}
</script>
