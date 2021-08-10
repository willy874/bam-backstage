<template>
  <PageLayout>
    <div class="flex flex-col flex-grow p-2">
      <div class="flex flex-wrap flex-shrink-0">
        <div class="w-1/2 sm:w-1/4 p-2">
          <div class="border-2 flex justify-center items-center rounded-xl text-center">
            <div class="px-4">
              <div class="text-sm pt-2 whitespace-nowrap">總會員數</div>
              <div class="text-3xl py-6 text-primary-500">{{ model.member.member }}</div>
            </div>
          </div>
        </div>
        <div class="w-1/2 sm:w-1/4 p-2">
          <div class="border-2 flex justify-center items-center rounded-xl text-center">
            <div class="px-4">
              <div class="text-sm pt-2 whitespace-nowrap">已驗證會員數</div>
              <div class="text-3xl py-6 text-green-500">{{ model.member.verification }}</div>
            </div>
          </div>
        </div>
        <div class="w-1/2 sm:w-1/4 p-2">
          <div class="border-2 flex justify-center items-center rounded-xl text-center">
            <div class="px-4">
              <div class="text-sm pt-2 whitespace-nowrap">封鎖會員數</div>
              <div class="text-3xl py-6 text-red-500">{{ model.member.block }}</div>
            </div>
          </div>
        </div>
        <div class="w-1/2 sm:w-1/4 p-2">
          <div class="border-2 flex justify-center items-center rounded-xl text-center">
            <div class="px-4">
              <div class="text-sm pt-2 whitespace-nowrap">本月新註冊數</div>
              <div class="text-3xl py-6 text-blue-500">{{ model.member.new_register }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap flex-shrink-0">
        <div class="w-full sm:w-1/3 p-2">
          <div class="border-2 flex justify-center items-center rounded-xl text-center">
            <div class="px-4">
              <div class="text-sm pt-2 whitespace-nowrap">上月發送訊息數</div>
              <div class="py-6">
                <span class="text-3xl text-green-500">{{ pushMessagesLastMonth.success }}</span>
                <span class="inline-block mx-1">/</span>
                <span class="text-red-500">{{ pushMessagesLastMonth.fail }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full sm:w-1/3 p-2">
          <div class="border-2 flex justify-center items-center rounded-xl text-center">
            <div class="px-4">
              <div class="text-sm pt-2 whitespace-nowrap">本月發送訊息數</div>
              <div class="py-6">
                <span class="text-3xl text-green-500">{{ pushMessagesThisMonth.success }}</span>
                <span class="inline-block mx-1">/</span>
                <span class="text-red-500">{{ pushMessagesThisMonth.fail }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full sm:w-1/3 p-2">
          <div class="border-2 flex justify-center items-center rounded-xl text-center">
            <div class="px-4">
              <div class="text-sm pt-2 whitespace-nowrap">總發送訊息數</div>
              <div class="py-6">
                <span class="text-3xl text-green-500">{{ pushMessagesTotal.success }}</span>
                <span class="inline-block mx-1">/</span>
                <span class="text-red-500">{{ pushMessagesTotal.fail }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-grow relative" style="min-height: 300px">
        <MemberChar class="border-2 absolute inset-2 rounded-xl" :options="memberCharOptions" />
      </div>
    </div>
  </PageLayout>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { DashboardModel } from '@/models'
import PageLayout from '@/container/PageLayout.vue'
import MemberChar from './MemberChar.vue'

export default {
  name: 'Dashboard',
  components: {
    MemberChar,
    PageLayout,
  },
  setup() {
    const model = reactive(new DashboardModel())
    const memberCharOptions = computed(() => {
      return {
        xAxis: {
          type: 'category',
          data: '1月,2月,3月,4月,5月,6月,7月,8月,9月,10月,11月,12月'.split(','),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: model.memberChart.map((p) => p.register_count),
            type: 'bar',
          },
          {
            data: model.memberChart.map((p) => p.block_count),
            type: 'bar',
          },
        ],
      }
    })
    onMounted(async () => {
      await model.readData()
    })

    const pushMessagesData = (data) => {
      if (data) return data
      return { success: 0, fail: 0 }
    }
    return {
      model,
      memberCharOptions,
      pushMessagesLastMonth: computed(() => pushMessagesData(model.pushMessages.last_month)),
      pushMessagesThisMonth: computed(() => pushMessagesData(model.pushMessages.this_month)),
      pushMessagesTotal: computed(() => pushMessagesData(model.pushMessages.total)),
    }
  },
}
</script>
