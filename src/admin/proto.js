import {
  useDatabase
} from '@/database/index'
import {
  request
} from '@/plugins/axios/request'
import config from '@/config/index'

export default class Admin {
  constructor(args) {
    const entity = args || {}
    this.router = entity.router
    this.store = entity.store
    this.user = null
    this.auth = []
  }

  async login(data) {
    const tokenData = (await request.post('admin/login', data)).data
    localStorage.setItem('token', tokenData)
    // const token = JSON.parse(atob(tokenData.split('.')[1]))
    // console.log(token)
    return await this.autoLogin()
  }

  async autoLogin() {
    const currentUrl = config.publicURL ? location.pathname.replace(config.publicURL, '') : location.pathname
    const lastPage = localStorage.getItem('lastPage')
    const tokenData = localStorage.getItem('token')
    const database = useDatabase()
    if (tokenData) {
      try {
        const res = await request.get('admin/profile')
        if (res.isAxiosError) {
          console.log('profile isAxiosError')
          throw res.message
        }
        this.user = res.data
        database.login()
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
        if (process.env.NODE_ENV === 'development') {
          console.log('%c[admin/proto] Error: autoLogin', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
          console.dir(error)
        }
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
    return {}
  }
}