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
    title: '圖文選單',
    icon: 'Edit',
    children: [
      {
        title: '好友管理',
        route: {
          name: 'Friend',
        },
      },
      {
        title: '會員管理',
        route: {
          name: 'Member',
        },
      },
    ],
  },
  {
    title: '最新消息',
    icon: 'Edit',
    route: {
      name: 'News',
    },
  },
  {
    title: '上稿文章',
    icon: 'Edit',
    route: {
      name: 'Article',
    },
  },
]
