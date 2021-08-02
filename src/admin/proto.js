import {
  ref
} from 'vue'
import {
  useDatabase
} from '@/database/index'
import {
  request
} from '@/plugins/axios/request'
import config from '@/config/index'
import {
  devErrorMessage
} from '@/utility/error'
import permission from './permission'
import Swal from '@/utility/alert'
export default class Admin {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.user = null
    this.permission = permission
    this.isLogin = ref(false)
    /**
     * 是否開放全部權限
     * @type {Boolean} 
     */
    this.allow = false
  }

  allowPermissions(jwt) {
    this.router.addRoutePermissions(jwt.payload.profile.permissions)
    Object.keys(this.permission).forEach(key => {
      const auth = this.permission[key]
      if (jwt.payload.profile.permissions.includes(auth.name) || this.allow) {
        auth.allow = true
      }
    })
  }

  parseJwt(token) {
    try {
      return {
        header: JSON.parse(atob(token.split('.')[0])),
        payload: JSON.parse(atob(token.split('.')[1])),
        verifySignature: token.split('.')[2]
      }
    } catch (error) {
      devErrorMessage({
        dir: '/src/admin',
        component: 'class Admin',
        func: 'parseJwt',
        message: error.message,
      })
      return false
    }
  }

  reflashToken() {
    const timeLimit = 30 * 60000 // 微秒
    const fixTime = 1 * 60000 // 微秒
    const tokenLimit = localStorage.getItem('tokenLimit') || new Date().getTime() + timeLimit - fixTime
    localStorage.setItem('tokenLimit', tokenLimit)
    const awaitTime = tokenLimit - new Date().getTime()
    if (awaitTime >= 0) {
      setTimeout(async () => {
        try {
          const adminData = atob(JSON.parse(localStorage.getItem('admin')))
          const res = await request.post('dashboard/login', adminData)
          if (res.isAxiosError) {
            throw res.message
          }
          localStorage.setItem('token', res.data)
          localStorage.setItem('tokenLimit', new Date().getTime() + timeLimit - fixTime)
          this.reflashToken()
        } catch (error) {
          devErrorMessage({
            dir: '/src/admin',
            component: 'class Admin',
            func: 'reflashToken',
            message: error.message,
          })
        }
      }, awaitTime)
    }
  }

  async login(data) {
    try {
      const res = await request.post('dashboard/login', data)
      if (res.isAxiosError) {
        throw res.message
      }
      const tokenData = res.data
      localStorage.setItem('token', tokenData)
      localStorage.setItem('admin', btoa(JSON.stringify(data)))
    } catch (error) {
      if (error.response) {
        if (error.response.data.error.code === 0) Swal.error()
        if (error.response.data.error.code === 1) Swal.error('查無此帳號')
        if (error.response.data.error.code === 2) Swal.error('密碼輸入錯誤')
      }
      devErrorMessage({
        dir: '/src/admin',
        component: 'class Admin',
        func: 'login',
        message: error.message,
      })
      console.dir(error)
    }
    return await this.autoLogin()
  }

  async autoLogin() {
    const currentUrl = config.publicURL ? location.pathname.replace(config.publicURL, '') : location.pathname
    const lastPage = localStorage.getItem('lastPage')
    const tokenData = localStorage.getItem('token')
    const database = useDatabase()
    if (tokenData) {
      try {
        const jwtData = this.parseJwt(tokenData)
        if (!jwtData) {
          throw {
            status: 401,
            message: 'jwt limt time out.'
          }
        }
        this.isLogin.value = true
        this.reflashToken()
        this.allowPermissions(jwtData)
        this.user = jwtData.payload.profile
        database.login(this.permission)
        if (lastPage) {
          this.router.replace(lastPage)
        } else if (currentUrl && !['/login'].includes(currentUrl)) {
          this.router.replace(currentUrl)
        } else {
          if (currentUrl !== '/') {
            this.router.replace('/')
          }
        }
        localStorage.removeItem('lastPage')
      } catch (error) {
        devErrorMessage({
          dir: '/src/admin',
          component: 'class Admin',
          func: 'autoLogin',
          message: error.message,
        })
        localStorage.removeItem('token')
        if (currentUrl !== '/login') {
          localStorage.setItem('lastPage', currentUrl)
        }
        this.router.replace('/login')
      }
    } else {
      if (currentUrl !== '/login') {
        this.router.replace('/login')
      }
    }
  }

  logout() {
    this.user = null
    localStorage.removeItem('admin')
    localStorage.removeItem('token')
    localStorage.removeItem('tokenLimit')
    this.isLogin.value = false
    this.router.replace('/login')
  }
}