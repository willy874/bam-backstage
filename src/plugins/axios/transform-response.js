export default function (data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      /* Ignore */
    }
  }
  return data
}
