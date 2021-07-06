/**
 * @interface
 * @property {Array<Navbar>} NavbarConfig
 * @property {*} Navbar
 * @property {String} Navbar.title
 * @property {String} Navbar.icon
 * @property {Route} Navbar.route 使用 VueRouter 傳遞
 * @property {Array<Navbar>} Navbar.children
 */
export default [
  {
    title: '最新消息',
    icon: 'News',
    route: {
      name: 'News',
    },
  },
  {
    title: '會員專區',
    icon: 'User',
    route: {
      name: 'Member',
    },
  },
  {
    title: '商品管理',
    icon: 'Product',
    route: {
      name: 'Product',
    },
  },
]
