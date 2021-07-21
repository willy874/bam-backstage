import ArticleView from '../views/Article/Index.vue'
import ArticleListView from '../views/Article/List.vue'
import ArticleListProps from '../views/Article/list'
import MemberListProps from '../views/Member/list'
import CategoriesListProps from '../views/Member/Category/list'
import ProductListProps from '../views/Product/list'
import RichmenuListProps from '../views/Richmenu/list'
import AssetListView from '../views/Asset/List.vue'
import AssetImageProps from '../views/Asset/image.js'
import AdminListProps from '../views/System/list.js'
import RoleListProps from '../views/System/Role/list.js'

const routes = [{
    name: 'Article',
    path: '/article',
    redirect: '/article/list',
    component: ArticleView,
    props: {
      routeTitle: '文章管理',
    },
    children: [{
      name: 'ArticleList',
      path: 'list',
      component: ArticleListView,
      props: ArticleListProps,
    }, ],
  },
  {
    name: 'Member',
    path: '/member',
    redirect: '/member/list',
    component: ArticleView,
    props: {
      routeTitle: '會員專區',
    },
    children: [{
        name: 'MemberList',
        path: 'list',
        component: ArticleListView,
        props: MemberListProps,
      },
      {
        name: 'CategoriesList',
        path: 'categories',
        component: ArticleListView,
        props: CategoriesListProps,
      },
    ],
  },
  {
    name: 'Product',
    path: '/product',
    redirect: '/product/list',
    component: ArticleView,
    props: {
      routeTitle: '商品管理',
    },
    children: [{
      name: 'ProductList',
      path: 'list',
      component: ArticleListView,
      props: ProductListProps,
    }, ],
  },
  {
    name: 'Richmenu',
    path: '/richmenu',
    redirect: '/richmenu/list',
    component: ArticleView,
    props: {
      routeTitle: '圖文選單管理',
    },
    children: [{
      name: 'RichmenuList',
      path: 'list',
      component: ArticleListView,
      props: RichmenuListProps,
    }, ],
  },
  {
    name: 'Asset',
    path: '/asset',
    redirect: '/asset/image',
    component: ArticleView,
    props: {
      routeTitle: '資源管理',
    },
    children: [{
      name: 'AssetList',
      path: 'image',
      props: AssetImageProps,
      component: AssetListView,
    }, ],
  },
  {
    name: 'Order',
    path: '/order',
    redirect: '/order/list',
    component: ArticleView,
    props: {
      routeTitle: '訂單管理',
    },
    children: [{
      name: 'OrderList',
      path: 'list',
      component: ArticleListView,
      // props: MemberListProps,
    }, ],
  },
  {
    name: 'Service',
    path: '/service',
    redirect: '/service/list',
    component: ArticleView,
    props: {
      routeTitle: '服務管理',
    },
    children: [{
      name: 'ServiceList',
      path: 'list',
      component: ArticleListView,
      // props: MemberListProps,
    }, ],
  },
  {
    name: 'Admin',
    path: '/admin',
    redirect: '/admin/list',
    component: ArticleView,
    props: {
      routeTitle: '系統管理',
    },
    children: [{
        name: 'AdminList',
        path: 'list',
        component: ArticleListView,
        props: AdminListProps,
      },
      {
        name: 'RoleList',
        path: 'roles',
        component: ArticleListView,
        props: RoleListProps,
      }
    ],
  },
]

export default function addRoutePermissions(permissions) {
  permissions.forEach(auth => {
    const route = routes.find(r => r.name === auth)
    if (route) {
      this.addRoute(route)
    }
  })
}