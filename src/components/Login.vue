<template>
  <div class="login_continer">
    <!-- 登录区域 -->
    <div class="login_box animate__animated animate__fadeInDownBig" >
        <!-- 头部区域 -->
        <div class="login_box_header">
            <img src="../assets/imgs/用户头像.png" alt="">
        </div>
        <!-- 下方使用区域 -->
        <div class="login_box_footer">
            <!-- rules 存放规则   prop是必填项   -->
            <!-- <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm"> -->
            <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="rulesForm" class="demo-ruleForm">
                <!-- 姓名 -->
                <!-- <el-form-item label="姓名" prop="username" class="demo_text"> -->
                <el-form-item label="姓名" class="demo_text" prop="username">
                    <el-input v-model="ruleForm.username" class="input" prefix-icon="el-icon-s-custom"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <!-- <el-form-item label="密码" prop="password" class="demo_text"> -->
                <el-form-item label="密码" class="demo_text" prop="password">
                    <el-input v-model="ruleForm.password" class="input" type="password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item>
                  <!-- <el-button type="primary" @click="submitForm('ruleForm')" class="button">登录</el-button> -->
                  <el-button type="primary" class="button" @click="login()">登录</el-button>
                  <!-- <el-button @click="resetForm('ruleForm')" class="button">重置</el-button> -->
                  <el-button class="button" @click="reset()">重置</el-button>

                </el-form-item>
            </el-form>
        </div>
    </div>
  </div>
</template>

<script>
import 'animate.css';
export default {
    data() {
        return {
            // 这是登录表单的数据绑定对象 存储需要绑定的数据 用于登录验证
            ruleForm:{
                username:'',
                password:'',
            },
            rules:{
                username:[
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
      login(){
        this.$refs.rulesForm.validate(async vaild => {
            if(!vaild) return;
            const {data:res} = await this.$http.post('login',this.ruleForm);
            if(res.meta.status !== 200) return this.$message.error('登录失败');
            this.$message.success('登录成功！');
            console.log(res);
            sessionStorage.setItem('token',res.data.token);
            this.$router.push('/homepage');
        })
      },
      reset(){
        this.$refs.rulesForm.resetFields();
      }
    }
}
</script>

<style lang="less" scoped>
    .login_continer{
        height: 100%;
        background-color: #058acd74;
        background-image: url(../assets/imgs/backimg.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        position: relative;
        text-align: center;
    }
    .login_box{
        width: 40%;
        height: 350px;
        background-color: rgba(255, 255, 255, 0.264);
        position: absolute;
        left: 30%;
        top: 25%;
        transition: 1s;
        animation-duration: 1.5s;
        transform: translate(-50%,-50%);
        border-radius: 5px;
    }
    .login_box_header{
        width: 100%;
        height: 25%;
        position: relative;
        box-shadow: 1px 0 10px rgba(0, 0, 0, 0.456);
        img{
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform: translate(-50%,20%);
        }
    }
    .login_box_footer{
        position: relative;
        left: -4%;
        text-align: center;
        .demo-ruleForm{
            margin: 5% auto;
            .demo_text{
                margin: 5% auto;
                width: 70%;
                position: relative;
                left: -15px;
            }
        }
    }
    .button{
        margin: auto 5%;
        position: relative;
        left: -6%;
    }
</style>