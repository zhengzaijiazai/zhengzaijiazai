<template> 
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 权限列表 -->
        <el-card class="box-card">
            <el-table 
                :data="rightlist" 
                stripe 
                style="width: 100%;margin-top: 15px;height:78vh;overflow-y:scroll;" 
                border
            >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="authName" label="权限名称" width="366"></el-table-column>
                <el-table-column prop="path" label="路径" width="366"></el-table-column>
                <el-table-column prop="level"  label="权限等级" width="366">
                    <template v-slot="data">
                        <el-tag v-if="data.row.level == 0">一级</el-tag>
                        <el-tag type="success" v-if="data.row.level == 1">二级</el-tag>
                        <el-tag type="warning" v-if="data.row.level == 2">三级</el-tag>  
                    </template>
                    
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
    name:'rights',
    data() {
        return {
            // 权限数据
            rightlist:[],
        }
    },
    created(){
        this.getRoleList();
    },
    computed:{
        total(){
            return this.rightlist.length;
        }
    },
    methods:{
        // 获取权限数据
        async getRoleList(){
            const {data:res} = await this.$http.get('rights/list');
            
            if(res.meta.status !== 200){
                this.$message.error('获取权限列表失败，请稍后再试');
            }
            // console.log('@',res);
            this.rightlist = res.data
        },
    }
}
</script>

<style lang="less" scoped>

</style>