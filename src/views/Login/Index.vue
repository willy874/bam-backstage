<template>
  <form class="fixed inset-0 z-40" :style="{ background }">
    <div class="flex justify-center items-center absolute inset-0 px-4 pb-10">
      <div class="border rounded-xl px-4 shadow-lg">
        <div class="pb-3">
          <img class="my-3 mx-auto w-48" src="../../assets/logo-light.png" alt="LOGO" />
        </div>
        <div>
          <div class="py-2">
            <TextBox :model="form" field="account">
              <template #prefix>
                <Icon class="m-1 text-blue-400" src="Add" size="24" />
              </template>
            </TextBox>
          </div>
          <div class="py-2">
            <TextBox :model="form" field="password">
              <template #prefix>
                <Icon class="m-1 text-blue-400" src="Play" size="24" />
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
import { useRouter } from 'vue-router'

const response = {
  data: {
    id: 1,
    name: 'admin',
  },
}

export default {
  setup() {
    const router = useRouter()
    const form = reactive({
      account: 'admin',
      password: 'password',
    })
    const login = () => {
      new Promise((resolve, reject) => {
        if (form.account === 'admin' && form.password === 'password') {
          resolve(response)
        } else {
          reject(new Error('帳號或密碼錯誤'))
        }
      })
        .then((res) => {
          console.log(res)
          router.push('/')
        })
        .catch((err) => {
          console.log(err)
        })
    }
    return { form, login, background: '#fff' }
  },
}
</script>
