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
export default class Admin {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.user = null
    this.permission = permission
    /**
     * 是否開放全部權限
     * @type {Boolean} 
     */
    this.allow = false
  }

  allowPermissions(jwt) {
    // console.log(this.router)
    Object.keys(this.permission).forEach(key => {
      const auth = this.permission[key]
      if (jwt.payload.profile.permissions.includes(auth.name) || this.allow) {
        auth.allow = true
      }
    })

    // 用 Router name 來設定權限
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

  async login(data) {
    try {
      const res = await request.post('dashboard/login', data)
      if (res.isAxiosError) {
        throw res.message
      }
      const tokenData = res.data
      localStorage.setItem('token', tokenData)
    } catch (error) {
      devErrorMessage({
        dir: '/src/admin',
        component: 'class Admin',
        func: 'login',
        message: error.message,
      })
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
        if (error.request.status === 401 || error.request.status === 403) {
          localStorage.removeItem('token')
          if (currentUrl !== '/login') {
            localStorage.setItem('lastPage', currentUrl)
          }
          this.router.replace('/login')
        }
      }
    } else {
      if (currentUrl !== '/login') {
        this.router.replace('/login')
      }
    }
  }

  logout() {
    this.user = null
    localStorage.removeItem('token')
    this.router.replace('/login')
  }

  getAuth(name) {
    Object.keys(this.permission).map(key => {
      return this.permission[key]
    })
    return {}
  }
}