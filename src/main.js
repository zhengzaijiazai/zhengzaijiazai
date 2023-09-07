import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, { Message,MessageBox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../src/assets/css/global.css'
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid'

Vue.use(ElementUI);
Vue.component('tree-table',TreeTable)
//  给axios设置默认地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 将axios写入vue的原型对象上面
Vue.prototype.$http = axios
axios.interceptors.request.use(config =>{
  config.headers.Authorization = sessionStorage.getItem('token');
  // console.log('@',config);
  return config
  },error=>{
    console.log(error);
    return error
  }
)

Vue.filter('dataFormat',function(oldtime){
  const dt = new Date(oldtime)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0');
  const d = (dt.getDate() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
});

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
