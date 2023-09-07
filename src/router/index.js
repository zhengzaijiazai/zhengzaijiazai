import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'Login',
      component: () => import('../components/Login.vue')
    },
    {
      path:'/homepage',
      name:'homepage',
      redirect: '/homepage/welcome',
      component: () => import('../views/homepage.vue'),
      children:[
        {path:'welcome',name:'welcome',component : () => import('../components/welcome.vue')},
        {path:'users',name:'users',component:() => import('../components/user/users.vue')},
        // 权限管理
        {path:'roles',name:'roles',component: () => import ('../components/limits/roles.vue')},
        {path:'rights',name:'rights',component: () => import ('../components/limits/rights.vue')},
        // 商品管理
        {path:'goods',name:'goods',component: () => import ('../components/commodity/goods.vue')},
        {path:'params',name:'params',component: () => import ('../components/commodity/params.vue')},
        {path:'categories',name:'categories',component: () => import ('../components/commodity/categories.vue')},
        // 订单管理
        {path:'orders',name:'orders',component: () => import ('../components/ordergoods/orders.vue')},
        // 数据报表
        {path:'reports',name:'reports',component: () => import ('../components/data/reports.vue')},

      ]
    },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{
  // console.log(to,from);
  if(to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token');
  if(!tokenStr) return next('/login');
  next();
})
export default router
