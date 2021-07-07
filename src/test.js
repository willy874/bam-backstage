import {
  Observable,
  awaitTime
} from '@/utility/async'

const observable = new Observable(subscriber => {
  [1, 2, 3].forEach(index => {
    subscriber.next(async (data) => {
      console.log('start', data)
      await awaitTime(1000)
      console.log(index, 1)
      await awaitTime(1000)
      console.log(index, 2)
      await awaitTime(1000)
      console.log(index, 3)
      await awaitTime(1000)
      return data + 'x'
    })
  })
  subscriber.complete(data => {
    console.log('end', data)
  })
})
observable.run('x')