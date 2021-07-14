/**
 * @interface
 * @property {Array<Navbar>} NavbarConfig
 * @property {*} Navbar
 * @property {String} Navbar.title
 * @property {String} Navbar.icon
 * @property {Route} Navbar.route 使用 VueRouter 傳遞
 * @property {Array<Navbar>} Navbar.children
 */
export default [{
    title: '文章管理',
    icon: 'Article',
    route: {
      name: 'Article',
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
  {
    title: '圖文選單管理',
    icon: 'Menu',
    route: {
      name: 'Richmenu',
    },
  },
  {
    title: '資源管理',
    icon: 'Image',
    route: {
      name: 'Asset',
    },
  },
]