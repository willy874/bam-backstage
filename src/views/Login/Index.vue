<template>
  <form class="fixed inset-0 z-40" :style="{ background }" @submit="login">
    <div class="flex justify-center items-center absolute inset-0 px-4 pb-10">
      <div class="border rounded-xl px-4 shadow-lg">
        <div class="pb-3">
          <img class="my-3 mx-auto w-48" src="../../assets/logo-light.png" alt="LOGO" />
        </div>
        <div>
          <div class="py-2">
            <TextBox :model="form" field="username">
              <template #prefix>
                <Icon class="m-1 text-blue-400" src="User" size="24" />
              </template>
            </TextBox>
          </div>
          <div class="py-2">
            <TextBox :model="form" field="password">
              <template #prefix>
                <Icon class="m-1 text-blue-400" src="Padlock" size="24" />
              </template>
            </TextBox>
          </div>
          <div class="text-center my-3">
            <button type="button" class="btn-pill bg-blue-400 text-white shadow focus:bg-blue-500 hover:bg-blue-600 transition" @click="login">登入</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { reactive } from 'vue'
import { useAdmin } from '@/admin/index'

export default {
  setup() {
    const admin = useAdmin()
    const form = reactive({
      username: 'admin',
      password: 'password',
    })
    const login = async () => {
      await admin.login(form)
    }
    return { form, login, background: '#fff' }
  },
}
</script>
