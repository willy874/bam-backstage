function getQueryStringUrl(url, params) {
  const query = params
    ? Object.keys(params)
        .map((key) => `${key}=${params[key].toString()}`)
        .join('&')
    : ''
  if (/\?/.test(url)) {
    return url + '&' + query
  }
  return query ? url + '?' + query : url
}

export default function (options) {
  return (req) => {
    // console.log('request-success', req, options)
    req.responseURL = getQueryStringUrl(`${req.baseURL}${req.url}`, req.params)
    // LoadingModels 紀錄
    options.LoadingModels[req.responseURL] = {
      request: options.promiseResult,
    }
    // Token 檢查系統
    if (localStorage.getItem('token')) {
      try {
        const token = JSON.parse(localStorage.getItem('token'))
        req.headers.Authorization = `${token.token_type} ${token.access_token}`
        // req.headers.Language = lang
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.log('%cRequest Token Error', 'color: #f00;background: #ff000011;padding: 2px 6px;border-radius: 4px;')
        }
      }
    }
    if (options.requestSuccess) options.requestSuccess(req)
    return req
  }
}
