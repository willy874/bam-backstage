<template>
  <DialogLayout v-bind="$props" title="訂單資料">
    <form style="min-width: 375px">
      <div class="flex flex-wrap -mx-2 items-center">
        <div class="py-2 px-2 xs:w-1/2 w-full flex">
          <div class="flex-shrink-0 w-20">下單時間</div>
          <div class="flex-grow">{{ dayFormat(model.created_at) }}</div>
        </div>
        <div class="py-2 px-2 xs:w-1/2 w-full flex items-center">
          <div class="flex-shrink-0 w-20">狀態</div>
          <div class="flex-grow flex items-center justify-between">
            <div class="font-bold" :style="{ color: convState(model.state).color }">{{ convState(model.state).text }}</div>
            <button v-if="model.state === 0" type="button" class="btn text-primary-mirror bg-gray-500 hover:bg-gray-600 text-xs" @click="cancelSubmit">
              取消訂單
            </button>
          </div>
        </div>
      </div>
      <div class="py-3">
        <div class="text-xl">下單產品</div>
        <div class="flex -mx-2 xs:-mx-4">
          <div class="py-2 px-2 xs:px-4 w-1/3 xs:w-40">
            <div
              class="pt-1/1 rounded-full bg-cover bg-center"
              v-if="productData.images[0]"
              :style="{ backgroundImage: `url(${productData.images[0].image_base64})` }"
            ></div>
            <div class="rounded-full overflow-hidden bg-gray-200 p-1" v-else>
              <Icon class="text-gray-400" src="ProfileUser" size="100%" />
            </div>
          </div>
          <div class="py-2 px-2 xs:px-4 flex-grow w-2/3 sm:w-0">
            <div class="py-2">
              <div class="text-2xl">{{ model.product_name }}</div>
              <div>{{ model.product_description }}</div>
            </div>
            <div class="flex flex-wrap -mx-2">
              <div class="py-2 flex w-full sm:w-2/3">
                <div class="flex-shrink-0 px-2">類型:</div>
                <div class="flex-grow px-2">{{ model.product_category_name }}</div>
              </div>
              <div class="py-2 flex w-full sm:w-1/3">
                <div class="flex-shrink-0 px-2">價格:</div>
                <div class="flex-grow px-2">{{ model.product_price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="py-3">
        <div class="text-xl">購買會員</div>
        <div class="flex -mx-2 xs:-mx-4">
          <div class="py-2 px-2 xs:px-4 w-1/3 xs:w-40">
            <div class="pt-1/1 rounded-full bg-cover bg-center" v-if="memberData.image_url" :style="{ backgroundImage: `url(${memberData.image_url})` }"></div>
            <div class="rounded-full overflow-hidden bg-gray-200 p-1" v-else>
              <Icon class="text-gray-400" src="ProfileUser" size="100%" />
            </div>
          </div>
          <div class="py-2 px-2 xs:px-4 flex-grow w-2/3 sm:w-0">
            <div class="py-2">
              <div class="text-2xl">{{ model.member_name }}</div>
              <div>{{ memberData.status_message }}</div>
            </div>
            <div class="sm:flex flex-wrap -mx-2">
              <div class="py-2 flex w-full sm:w-1/2">
                <div class="flex-shrink-0 px-2">姓名:</div>
                <div class="flex-grow px-2">{{ model.member_real_name }}</div>
              </div>
              <div class="py-2 flex w-full sm:w-1/2">
                <div class="flex-shrink-0 px-2">電子郵件:</div>
                <div class="flex-grow px-2">{{ model.member_email }}</div>
              </div>
              <div class="py-2 flex w-full sm:w-1/2">
                <div class="flex-shrink-0 px-2">電話:</div>
                <div class="flex-grow px-2">{{ model.member_phone_number }}</div>
              </div>
              <div class="py-2 flex w-full sm:w-1/2">
                <div class="flex-shrink-0 px-2">地址:</div>
                <div class="flex-grow px-2">{{ model.member_address }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </form>
    <template #footer>
      <div class="flex flex-wrap justify-between items-center rounded-b-lg border-t p-2">
        <div class="px-2"></div>
        <div class="px-1 flex flex-wrap items-center">
          <button class="btn mx-1 text-primary-mirror bg-gray-500 hover:bg-gray-600" type="button" @click="close">關閉</button>
        </div>
      </div>
    </template>
  </DialogLayout>
</template>

<script>
import dayjs from 'dayjs'
import { reactive, onMounted, nextTick } from 'vue'
import throttle from 'lodash/throttle'
import { OrderModel, MemberModel, ProductModel } from '@/models/index'
import DialogLayout from '@/container/DialogLayout.vue'
import Swal from '@/utility/alert'
import { devErrorMessage } from '@/utility/error'

export default {
  name: 'OrderDetailDialog',
  props: ['drag', 'touch', 'props', 'id', 'popupElement', 'dialog', 'initPosition'],
  components: {
    DialogLayout,
  },
  setup(props) {
    const model = reactive(new OrderModel(props.props.model))
    const memberData = reactive(new MemberModel())
    const productData = reactive(new ProductModel())
    onMounted(async () => {
      await model.readData()
      memberData.id = model.member_id
      productData.id = model.product_id
      await Promise.all([memberData.readData(), productData.readData()])
      const allResponse = await Promise.allSettled(productData.images.map(async (image) => await image.readData()))
      allResponse
        .map((res, index) => (res.value ? false : productData.images[index].id))
        .filter((p) => p !== false)
        .forEach((id) => {
          const index = productData.images.map((p) => Number(p.id)).indexOf(Number(id))
          productData.images.splice(index, 1)
        })
      await nextTick()
      props.initPosition()
    })
    const popupProps = reactive(props.props)
    return {
      model,
      memberData,
      productData,
      dayFormat: (dateTime, type) => {
        if (type === 'date') {
          return dayjs(dateTime).format('YYYY/MM/DD')
        }
        if (type === 'time') {
          return dayjs(dateTime).format('HH:mm:ss')
        }
        return dayjs(dateTime).format('YYYY/MM/DD HH:mm:ss')
      },
      close: throttle(() => {
        props.dialog.closePopup(props.id)
      }, 300),
      cancelSubmit: throttle(async (e) => {
        e.preventDefault()
        const swalResult = await Swal.checkConfirm({ title: '是否要取消該訂單' })
        if (swalResult.isConfirmed) {
          try {
            const res = await model.updateData({
              requesHandler() {
                return { state: 2 }
              },
            })
            if (res.isAxiosError) {
              throw res.message
            }
            popupProps.model.set(model)
            props.dialog.closePopup(props.id)
          } catch (error) {
            devErrorMessage({
              dir: '/src/views/Order',
              component: 'OrderDetailDialog',
              func: 'submit',
              message: error.message,
            })
            Swal.error({ title: '儲存失敗' })
          }
        }
      }, 300),
      convState(code) {
        switch (code) {
          case 0:
            return {
              color: 'rgb(59, 130, 246)',
              text: '未付款',
            }
          case 1:
            return {
              color: 'rgb(52, 211, 153)',
              text: '已付款',
            }
          case 2:
            return {
              color: 'rgb(156, 163, 175)',
              text: '已取消',
            }
          default:
            return {
              text: '',
            }
        }
      },
    }
  },
}
</script>
