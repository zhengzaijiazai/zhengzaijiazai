<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
            <el-row>
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="selectedCateKeys" @change="handleChange"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini">添加参数</el-button>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="only">
                    <el-button type="primary" size="mini">添加属性</el-button>
                </el-tab-pane>
            </el-tabs>
            <el-table :data="manyTableData" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit-outline">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //权限列表
            catelist: [],
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            selectedCateKeys:[],
            activeName:'many',
            manyTableData:[],
            onlyTableData:[]
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get("categories")
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品列表失败!")
            }
            this.catelist = res.data
            console.log('@',this.catelist);
        },
        async handleChange(id){
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = []
                return
            }
            // console.log(this.selectedCateKeys)
            const {data:res} = await this.$http.get(
                `categories/${id}/attributes`,{
                    params:{sel:this.activeName}  
                },
            )
            if(res.meta.status !==200){
                return this.$message.error('获取参数列表失败！')
            }
            console.log(res.data);
            if(this.activeName === 'many'){
                this.manyTableData = res.data
            }else{
                this.onlyTableData = res.data
            }
        },
        handleTabClick(){
            console.log(this.activeName);
            this.getParamsData()
        },
        async getParamsData(){
            if(this.selectedCateKeys.length !== 3){
                this.selectedCateKeys = []
                return
            }
        }
    },
}
</script>

<style lang="less" scoped>

</style>