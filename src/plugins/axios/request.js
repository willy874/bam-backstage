import Axios from 'axios'
import config from '@/config/index'
// import i18n from '../plugins/i18n'
// const lang = i18n.getLocale()
// const i18nMsg = i18n.messages[lang]

export const LoadingModels = {}

export const axiosInstance = (ops = {}) => {
  const axios = Axios.create(config.api)
  const requestSuccess = (req) => {
    // LoadingModels 紀錄
    LoadingModels[`${req.method}:${req.baseURL}${req.url}`] = ops.promiseResult
    // Token 檢查系統
    if (localStorage.getItem('token')) {
      try {
        const token = JSON.parse(localStorage.getItem('token'))
        req.headers.Authorization = `${token.token_type} ${token.access_token}`
        // req.headers.Language = lang
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.log('%cRequest Error', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
        }
      }
    }
    return req
  }
  const requesError = (err) => {
    return Promise.reject(err)
  }
  const responseSuccess = (res) => {
    LoadingModels[`${res.config.method}:${res.config.baseURL}${res.config.url}`] = res
    return res
  }
  const responseError = (err) => {
    const res = err.response
    if (!res) {
      return ops.reject(err)
    }
    // LoadingModels 重設
    if (res.config && res.config.method && res.config.baseUrl && res.config.url) {
      LoadingModels[`${res.config.method}:${res.config.baseUrl}${res.config.url}`] = null
    }
    // Token 檢查系統
    if (res.data.message === 'Unauthenticated') {
      // globalData.$router.replace('/login')
    }
    return ops.reject(err)
  }
  axios.interceptors.request.use(requestSuccess, requesError)
  axios.interceptors.response.use(responseSuccess, responseError)
  const AxiosRequest = function (...args) {
    return axios(...args)
  }
  Object.keys(axios).forEach((on) => {
    if (typeof axios[on] === 'function') {
      AxiosRequest[on] = async (...args) => {
        const promiseResult = axios[on](...args)
        ops.promiseResult = promiseResult
        return await new Promise((resolve, reject) => {
          ops.responseSuccess = resolve
          ops.responseError = reject
          promiseResult.then(resolve).catch(reject)
        })
      }
    }
  })
  return AxiosRequest
}

/**
 * @example
 * axiosRequest(options).method(url, data)
 */
export const request = axiosInstance()
