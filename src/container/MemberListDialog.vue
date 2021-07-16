<template>
  <DialogLayout v-bind="$props" title="會員列表">
    <template #navbar>
      <div class="border shadow">
        <div class="p-2 flex -mx-2">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0 py-1 px-2">
              <Icon class="text-primary-500" src="Search" size="24" />
            </div>
            <div v-if="filterOptions.allow.length" class="p-1">
              <SelectDrop
                :model="filterOptions"
                field="search"
                :options="filterOptions.allow"
                :close-element="popupElement"
                placeholder="請選擇關鍵字搜尋類型"
              ></SelectDrop>
            </div>
            <div v-if="filterOptions.type === 'keyword'" class="p-1">
              <TextBox type="text" :model="filterOptions" field="keyword" placeholder="請輸入搜尋關鍵字" />
            </div>
            <div v-if="filterOptions.type === 'category'" class="p-1">
              <SelectDrop :model="filterOptions" field="category" :options="filterOptions.search.category" placeholder="請選擇類型"></SelectDrop>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div>
      <DataTable v-bind="dataTableProps" style="height: calc(100vh - 210px)"></DataTable>
    </div>
    <template #footer>
      <div class="flex justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-1">已選擇 {{ selectedList.length }} 張圖片</div>
        <div class="px-1 flex items-center">
          <button class="btn mx-1 text-primary-mirror bg-blue-500 hover:bg-blue-600" type="button" @click="clear">清除</button>
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">取消</button>
          <button class="btn mx-1 text-primary-mirror bg-green-500 hover:bg-green-600" type="button" @click="submit">確定</button>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import { reactive, onMounted, nextTick, computed } from 'vue'
import throttle from 'lodash/throttle'
import DialogLayout from '@/container/DialogLayout.vue'
import TableCheckbox from '@/components/data-table/TableCheckbox.vue'
import schema from '@/models/config/database'
import { ListModel, SearchModel } from '@/models/index'

export default {
  name: 'MemberListDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const category = props.props.model
    const arrMamberId = category.members.map((p) => p.member.id)
    const listData = reactive(new ListModel(schema.Members))
    const selecteOptions = [
      {
        value: 'name',
        label: '暱稱',
      },
      {
        value: 'real_name',
        label: '名稱',
      },
      {
        value: 'status_message',
        label: '個人狀態訊息',
      },
      {
        value: 'email',
        label: '電子郵件',
      },
      {
        value: 'address',
        label: '地址',
      },
    ]
    const filterOptions = reactive(
      new SearchModel({
        allow: selecteOptions,
      })
    )
    onMounted(async () => {
      await listData.readList()
      await nextTick()
      props.initPosition()
      listData.data.forEach((model) => {
        if (arrMamberId.includes(model.id)) {
          model.selected = true
        }
      })
    })
    const selectedList = computed(() => {
      return listData.data.filter((p) => p.selected)
    })
    const dataTableProps = reactive({
      options: [
        {
          title: '選擇',
          field: TableCheckbox,
          width: '50px',
          align: 'center',
        },
        {
          title: 'No.',
          field: (item, index) => index + 1,
          width: '80px',
          align: 'center',
        },
        {
          title: '相片',
          field: (item) => {
            if (item.image_url) {
              return `<div class="w-10 mx-auto"><div class="pt-1/1 rounded-full bg-cover bg-center" style="background-image: url(${item.image_url})"></div></div>`
            }
            return `<div class="w-10 mx-auto"><div class="rounded-full overflow-hidden bg-gray-200 text-gray-400 p-1"><svg width="100%" viewBox="0 0 45.532 45.532" fill="currentColor">
        <path d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"/>
        </svg></div></div>`
          },
          width: '60px',
          align: 'center',
        },
        {
          title: () => {
            const target = selecteOptions.find((p) => p.value === filterOptions.search)
            return target ? target.label : ''
          },
          field: (item) => {
            return item[filterOptions.search] || ''
          },
          width: 1,
          columnStyle: {
            minWidth: '180px',
          },
          bodyStyle: {
            padding: '0 0.5rem',
          },
          align: 'center',
        },
      ],
      clickTr: async (item, index, { listData }) => {
        const model = listData.data[index]
        if (model.selected) {
          model.selected = false
        } else {
          model.selected = true
        }
      },
      filter: filterOptions.searchFilter(),
      model: listData,
    })

    const close = (selectedMemers) => {
      if (Array.isArray(selectedMemers)) {
        props.props.selectedMemers = selectedMemers
      }
      props.dialog.closePopup(props.id)
    }
    return {
      dataTableProps,
      selectedList,
      close,
      filterOptions,
      clear: throttle(() => {
        listData.data.forEach((model) => {
          model.selected = false
        })
      }, 300),
      submit: () => {
        close(selectedList.value)
      },
    }
  },
}
</script>
