export default function (options) {
  return (err) => {
    if (options.requesError) options.requesError(err)
    if (options.requesReject) options.requesReject(err)
    return err
  }
}