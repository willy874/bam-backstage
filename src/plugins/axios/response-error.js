export default function (options) {
  return (err) => {
    const req = err.request
    const res = err.response
    // const config = err.config
    // console.log('response-error', req, res, config, options)
    if (!res) {
      return options.responseReject(err)
    }
    if (req.status === 401) {
      if (req.statusText === 'Unauthenticated') {
        console.log('Unauthenticated')
      }
      if (req.statusText === 'Unauthorized') {
        console.log('Unauthorized')
      }
    }
    if (options.responseError) options.responseError(err)
    return options.responseReject(err)
  }
}
