export default function (options) {
  return (err) => {
    const req = err.request
    const res = err.response
    // const config = err.config
    // console.log('response-error', req, res, config, options)
    if (process.env.NODE_ENV === 'development') {
      if (req.status === 401 || req.status === 403) {
        console.log('無使用者權限', res)
      }
      if (req.status === 404) {
        console.log('查無資料', res)
      }
      if (req.status === 422) {
        console.log('驗證錯誤', res.data)
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
    }
    if (options.responseError) options.responseError(err)
    if (options.responseReject) options.responseReject(err)
    return err
  }
}