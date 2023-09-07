<template>
  <el-container>
    <el-header class="animate__animated animate__fadeInDownBig">
      <div>
        <img src="../assets//imgs/后台系统.png" alt="">
        <span>海纳百川后台管理系统</span>
      </div>
      <el-button type="info" class="exit" @click="logout()">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="collapse ? '66px' : '200px'" style="transition: 1.5s;margin:0px">
        <div class="conAside" @click="asideexpand()" ref="conAside">
          <img src="../assets/imgs/列表.png" alt="" :class="{conAsidedonghua:isconAsidedonghua}" >
        </div>
        <el-menu
          :collapse='collapse'
          :collapse-transition="false"
          :unique-opened="true"
          default-active="5"
          class="el-menu-vertical-demo"
          background-color="rgb(6 94 54 / 77%)"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :default-active="$router.fullPath"
        >
          <el-submenu 
            v-for="item of menulist" 
            :key="item.id" 
            :index="item.id+''"
            style="text-align:start"
            >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
              <template slot="title"></template>
                <el-menu-item 
                :index="'/homepage/'+subitem.path" 
                v-for="subitem in item.children" 
                :key="subitem.id"
                style="padding-left: 40px;"
                >
                  <i :class="iconObj[subitem.id]"></i>
                  <span>{{subitem.authName}}</span>
                </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import 'animate.css';
export default {
  name: "homepage",
  data() {
    return {
      menulist:[],
      // 控制侧边栏是否收起
      collapse:false,
      //动画
      isconAsidedonghua:true,
      iconObj:{
        '125':'el-icon-user',
        '103':'el-icon-open',
        '101':'el-icon-shopping-bag-1',
        '102':'el-icon-document-checked',
        '145':'el-icon-notebook-1',
        '110':'el-icon-s-custom',
        '111':'el-icon-s-check',
        '112':'el-icon-sell',
        '104':'el-icon-shopping-bag-1',
        '115':'el-icon-orange',
        '121':'el-icon-switch-button',
        '107':'el-icon-news',
        '146':'el-icon-coin',

      }
    }
  },
  created(){
    this.getMenuList();
  },  
  methods:{
    logout(){
        if(confirm("确定退出嘛")){
          sessionStorage.removeItem('token');
          this.$router.push('/login');
          this.$message.error('退出成功');
        }
    },
    async getMenuList(){
      const {data:res}= await this.$http.get("menus")
      // 获取失败
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data;
      // console.log(this.menulist);
    },
    asideexpand(){
      this.collapse = !this.collapse
      this.isconAsidedonghua = !this.isconAsidedonghua
    }
  },  
};
</script>

<style lang="less" scoped>
  .el-header,
  .el-footer {
    display: flex;
    background-color: #569f86ba;
    color: #333;
    text-align: center;
    line-height: 60px;
    transition: 2s;
    animation-duration: 800ms;
  }
  .el-aside {
    height: 92vh;
    color: #333;

    background-color: #356a5ec2;
  }
  .el-main {
    background-color: #259f7654;
    color: #333;
    padding-bottom: 0px !important;
    
  }
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-header>div{
    height: 100%;
    width: 20%;
    position: relative;
    text-align: start;
    >img{
      width: 10%;
      height: 50%;
      margin-top: 5%;
    }
    >span{
      font-size: large;
      color: white;
      position: relative;
      top: -15%;
      margin-left: 5%;
    }
  }
  .exit{
    position: relative;
    right: -70%;
    margin-top: 0.8%;
    height: 60%;
  }
  .exit:hover{
    background-color: red;
  }
  .el-aside{
    .el-menu{
      border-right: 0px;
    }
  }
  .conAside{
    width: 100%;
    height: 50px;
    cursor: pointer;
    text-align: start;
    transition: all 1s;
    background-color: #356a5ec2;
  }
  .conAside>img{
    transition: 1.5s;
    margin: 13px 20px;
  }
  .conAsidedonghua{
    transform: rotateZ(270deg);
  }
  .el-submenu{
    padding-left: 0px;
  }
  .el-submenu__title{
    text-align: left !important;
    padding-left: 0px !important;
  }
  .el-card{
    background-color: #d2e4d2;
  }
</style>