export default function (options) {
  return (err) => {
    const req = err.request
    const res = err.response
    // const config = err.config
    // console.log('response-error', req, res, config, options)
    if (!res) {
      return options.responseReject(err)
    }
    if (req.status === 401 || req.status === 403) {
      if (req.statusText === 'Unauthenticated') {
        console.log('Unauthenticated', res)
      }
      if (req.statusText === 'Unauthorized') {
        console.log('Unauthorized', res)
      }
    }
    if (req.status === 404) {
      console.log('查無資料', res)
    }
    if (req.status === 500) {
      console.log('伺服器錯誤', res)
    }
    if (req.status === 504) {
      console.log('該請求等待回應時間過長', res)
    }
    if (req.status === 511) {
      console.log('使用者未登入', res)
    }
    if (options.responseError) options.responseError(err)
    return options.responseReject(err)
  }
}
