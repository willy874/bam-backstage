import {
  ListModel
} from '../index'

export default class RichmenusListModel extends ListModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.listModelType = RichmenusListModel
  }

  // syncMenu() {
  //   return new Promise((resolve, reject) => {})
  // }
}