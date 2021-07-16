import {
  DataModel,
} from '../index'

export default class SearchModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.allow = entity.allow || []
    this.search = entity.search || (this.allow[0] && this.allow[0].value) || false
    this.type = entity.type || 'keyword'
    this.keyword = ''
    this.category = ''
    this.filterRules = []
  }

  keywordSearch(model) {
    try {
      const keywordRegExp = this.keyword ? new RegExp(this.keyword) : false
      if (keywordRegExp) {
        return keywordRegExp.test(model[this.search])
      } else {
        return true
      }
    } catch (error) {
      return true
    }
  }

  categorySearch(model) {
    if (this.category) {
      if (this.category === 'all') {
        return true
      } else {
        return model[this.search.search] === this.category
      }
    } else {
      return true
    }
  }

  searchFilter() {
    return (list, native) => {
      list.set({
        model: list.modelType,
        primaryKey: list.primaryKey,
        ...list,
      })
      list.data = native.data.filter((model, index) => {
        this.type = (() => {
          if (typeof this.search === 'function') {
            return 'handle'
          }
          if (typeof this.search === 'string') {
            return 'keyword'
          }
          if (typeof this.search === 'object') {
            return this.search && this.search.type || 'keyword'
          }
        })()
        const defaultSearch = (() => {
          switch (this.type) {
            case 'handle':
              return this.search
            case 'keyword':
              return this.keywordSearch.bind(this)
            case 'category':
              return this.categorySearch.bind(this)
            default:
              return this.keywordSearch.bind(this)
          }
        })()
        return [defaultSearch, ...this.filterRules].every(method => method(model, index, list))
      })
      return list
    }
  }
}