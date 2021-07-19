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
    children: [{
        title: '會員列表',
        route: {
          name: 'MemberList',
        },
      },
      {
        title: '分眾管理',
        route: {
          name: 'CategoriesList',
        },
      }
    ]
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
  {
    title: '訂單管理',
    icon: 'ShoppingList',
    route: {
      name: 'Order',
    },
  },
  {
    title: '客服管理',
    icon: 'Headphones',
    route: {
      name: 'Service',
    },
  },
  {
    title: '系統管理',
    icon: 'Settings',
    children: [{
        title: '系統管理者',
        route: {
          name: 'AdminList',
        },
      },
      {
        title: '角色管理',
        route: {
          name: 'RoleList',
        },
      }
    ]
  },
]