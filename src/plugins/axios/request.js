import Axios from 'axios'
import config from '@/config/index'
import requestSuccess from './request-success'
import requesError from './reques-error'
import responseSuccess from './response-success'
import responseError from './response-error'

export const LoadingModels = {}

/**
 * 
 * @param {InstanceAxios} axios 
 * @param {*} options 
 * @returns {AxiosRequest}
 */
export const getAbstractRequest = (axios, options = {}) => {
  options.LoadingModels = LoadingModels
  axios.interceptors.request.use(requestSuccess(options), requesError(options))
  axios.interceptors.response.use(responseSuccess(options), responseError(options))
  const AxiosRequest = function (...args) {
    return axios(...args)
  }
  Object.keys(axios).forEach((on) => {
    if (typeof axios[on] === 'function') {
      AxiosRequest[on] = async (...args) => {
        const promiseResult = axios[on](...args)
        options.promiseResult = promiseResult
        return await new Promise((resolve, reject) => {
          options.responseResolve = resolve
          options.responseReject = reject
          promiseResult.then(resolve).catch(reject)
        })
      }
    }
  })
  return AxiosRequest
}

/**
 *
 * @param {*} options
 * @param {*} options.LoadingModels
 * @param {Function} options.requestSuccess
 * @param {Function} options.requesError
 * @param {Function} options.responseSuccess
 * @param {Function} options.responseError
 * @param {Function} options.responseResolve
 * @param {Function} options.responseReject
 * @returns {AxiosRequest}
 */
export const axiosInstance = (options = {}) => {
  const axios = Axios.create(config.api)
  return getAbstractRequest(axios, options)
}

/**
 * @example
 * axiosRequest(options).method(url, data)
 */
export const request = axiosInstance()