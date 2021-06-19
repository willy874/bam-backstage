<template>
  <PageLayout>
    <template #header>
      <div class="border-b flex py-2">
        <h2 class="text-2xl font-bold px-3">{{ routeTitle }}</h2>
      </div>
    </template>
    <div class="flex-grow flex flex-col p-4">
      <DataTable v-bind="dataTableProps">
        <template #header>
          <div>頭部</div>
        </template>
        <template #footer>
          <div>腳部</div>
        </template>
      </DataTable>
    </div>
    <template #footer></template>
  </PageLayout>
</template>

<script>
import { reactive } from 'vue'
// import dayjs from 'dayjs'
import PageLayout from '@/container/PageLayout.vue'
import { ListModel, ArticleModel } from '@/models/index'

export default {
  name: 'ArticleList',
  props: {
    routeTitle: {
      type: String,
      default: '文章編輯',
    },
  },
  setup() {
    const listModelData = reactive(
      new ListModel({
        model: ArticleModel,
      })
    )
    setTimeout(() => {
      listModelData.set({
        data: [
          {
            id: 1,
            subject: '測試',
            content: '',
            image: {},
            created_at: '',
            published_at: '',
            finished_at: '',
            status: 1,
          },
        ],
      })
    }, 2000)

    const dataTableProps = reactive({
      options: [
        { title: 'No.', field: (item, index) => index + 1, width: '80px', align: 'center' },
        {
          title: '標題',
          field: 'subject',
          width: 1,
          columnStyle: { minWidth: '160px' },
          bodyStyle: { padding: '0 0.5rem' },
          align: 'center',
        },
        {
          title: '內容',
          field: 'content',
          width: 1,
          columnStyle: { minWidth: '160px' },
          bodyStyle: { padding: '0 0.5rem' },
          align: 'center',
        },
        { title: '顯示/隱藏', field: (item) => (item.status ? '顯示' : '隱藏'), width: '100px', align: 'center' },
      ],
      list: listModelData,
    })
    return {
      dataTableProps,
    }
  },
  components: {
    PageLayout,
  },
}
</script>
