import {
  DataModel
} from '../index'

class DashboardMember {
  constructor(args) {
    const entity = args || {}
    this.member = entity.member || 0
    this.verification = entity.verification || 0
    this.block = entity.block || 0
    this.new_register = entity.new_register || 0
  }
}

class DashboardPushMessages {
  constructor(args) {
    const entity = args || {}
    if (entity.last_month) {
      this.last_month = {
        success: entity.last_month.success || 0,
        fail: entity.last_month.fail || 0
      }
    }
    if (entity.this_month) {
      this.this_month = {
        success: entity.this_month.success || 0,
        fail: entity.this_month.fail || 0
      }
    }
    if (entity.total) {
      this.total = {
        success: entity.total.success || 0,
        fail: entity.total.fail || 0
      }
    }
  }
}

class DashboardMemberChart {
  constructor(args) {
    const entity = args || {}
    this.register_count = entity.register_count || 0
    this.block_count = entity.block_count || 0
  }
}

/**
 * @extends DataModel
 */
export default class DashboardModel extends DataModel {
  constructor(args) {
    super(args)
    const entity = args || {}
    this.member = new DashboardMember(entity.member)
    this.pushMessages = new DashboardPushMessages(entity.pushMessages)
    this.memberChart = entity.memberChart && entity.memberChart.length >= 12 ?
      entity.memberChart.map(p => new DashboardMemberChart(p)) :
      new Array(12).fill(new DashboardMemberChart())
    // proto set
    this.api = entity.api || 'dashboard'
  }

  readData(options = {}) {
    return new Promise((resolve) => {
      Promise.all([
        this.request({
          options,
          default: {
            method: 'GET',
            url: `${this.api}/members`
          }
        }),
        this.request({
          options,
          default: {
            method: 'GET',
            url: `${this.api}/push-messages`
          }
        }),
        this.request({
          options,
          default: {
            method: 'GET',
            url: `${this.api}/members-chart`
          }
        })
      ]).then(response => {
        const [{
            data: member
          },
          {
            data: pushMessages
          },
          {
            data: memberChart
          },
        ] = response
        this.member = new DashboardMember(member)
        this.pushMessages = new DashboardPushMessages(pushMessages)
        this.memberChart = memberChart && memberChart.length >= 12 ?
          memberChart.map(p => new DashboardMemberChart(p)) :
          new Array(12).fill(new DashboardMemberChart())
        resolve(response)
      })
    })

  }
}