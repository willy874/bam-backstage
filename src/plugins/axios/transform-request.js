import * as utils from './utils'

function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, (value, name) => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value
      delete headers[name]
    }
  })
}

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value
  }
}

export default function (data, headers) {
  normalizeHeaderName(headers, 'Accept')
  normalizeHeaderName(headers, 'Content-Type')
  if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
    return data
  }
  if (utils.isArrayBufferView(data)) {
    return data.buffer
  }
  if (utils.isURLSearchParams(data)) {
    setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8')
    return data.toString()
  }
  if (utils.isObject(data)) {
    setContentTypeIfUnset(headers, 'application/json;charset=utf-8')
    return JSON.stringify(data)
  }
  return data
}
