export class SubScriber {
  constructor() {
    this.steps = []
    this.end = async () => {
      return
    }
  }
  getErrorCallback() {
    return this.err
  }
  async runCompleteCallback(data) {
    return await this.end(data)
  }
  next(callback) {
    this.steps.push(callback)
  }
  error(callback) {
    this.err = callback
  }
  complete(callback) {
    this.end = callback
  }
}
export class Observable {
  constructor(init) {
    this.subscriber = new SubScriber()
    init(this.subscriber)
  }
  run(first) {
    const steps = this.subscriber.steps
    steps.push(async (data) => {
      return await this.subscriber.runCompleteCallback(data)
    })
    const errorCallback = this.subscriber.getErrorCallback()
    const action = (index = 0, data = first) => {
      if (steps[index]) {
        const promise = steps[index](data)
        promise
          .then((res) => {
            action(index + 1, res)
          })
          .catch((err) => {
            if (errorCallback)
              errorCallback(err)
          })
      }
    }
    action()
  }
}

export const awaitTime = async (t) => {
  return new Promise((resolve) => {
    setTimeout(resolve, t)
  })
}