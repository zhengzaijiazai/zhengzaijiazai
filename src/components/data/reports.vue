<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--  -->
        <el-card class="box-card">
            <div id="main" style="width:800px;height:400px"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name:'datareportform',
    data() {
        return {
            option:{}
        }
    },
    methods:{
    },
    async mounted(){
        let myEchart = echarts.init(document.getElementById('main'));

        const {data:res} = await this.$http.get('reports/type/1')

        if(res.meta.status !== 200){
            return this.$message.error('获取折线图数据失败')
        }
        this.option = res.data

        myEchart.setOption(this.option);

    }
}
</script>

<style lang="less" scoped>
    #main{
        margin: 20px auto;
    }
</style>