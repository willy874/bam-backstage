export default function (options) {
  return (res) => {
    const { config, request } = res
    // console.log('response-success', res, options)
    options.LoadingModels[request.responseURL] = {
      request: options.promiseResult,
      [config.method]: res,
    }
    if (options.responseSuccess) options.responseSuccess(res)
    return res
  }
}
