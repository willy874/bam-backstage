export const debounce = (func, delay) => {
  let timeout = null
  return function () {
    const context = this
    const args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}

export const throttle = (func, delay) => {
  let inThrottle
  let timeout = null
  return function () {
    const context = this
    const args = arguments
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      console.log(inThrottle, timeout)
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        inThrottle = false
      }, delay)
    }
  }
}