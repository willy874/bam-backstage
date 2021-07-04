import globalConfig from '@/config/index'

export const handleApiConfig = (options = {}) => {
  const { model, baseURL, method, url, data, headers, _method, params } = options
  const config = {}
  config.headers = {
    ...globalConfig.api.headers,
    ...headers,
  }
  if (baseURL || baseURL === '') config.baseURL = baseURL
  if (params) config.params = params
  if (url) {
    config.url = url
  } else {
    config.url = options.default.url
  }
  if (data) {
    config.data = data
    if (!method && (options.default.method === 'GET' || options.default.method === 'DELETE')) {
      Object.keys(data).forEach((key) => {
        config.params[key] = data[key]
      })
    }
  } else {
    config.data = model.requesHandler(options)
  }
  if (method) {
    config.method = method
  } else {
    if (config.data instanceof FormData) {
      config.method = 'POST'
      if (options.default.method !== 'POST') {
        config.data.append('_method', options.default.method)
        config.headers['Content-Type'] = headers['Content-Type'] || 'multipart/form-data'
      }
    } else {
      config.method = options.default.method
    }
  }
  if (_method) {
    if (config.data instanceof FormData) {
      config.data.append('_method', _method)
    } else {
      config.data._method = _method
    }
  }
  return config
}
