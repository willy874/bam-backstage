export default function (options) {
  return (err) => {
    if (options.requesError) options.requesError(err)
    return Promise.responseReject(err)
  }
}
