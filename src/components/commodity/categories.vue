<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>
       
            <!-- 表格 -->
            <tree-table :data="cateList" :columns="columns" 
            :selection-type="false" :expand-type="false" 
            show-index index-text="#" border  :show-row-hover="false">
            <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" ></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" v-else>三级</el-tag>
                </template>
                <template slot="button">
                    <el-button type="primary" icon="el-icom-edit">编辑</el-button>
                    <el-button type="danger" icon="el-icom-delete">删除</el-button>
                </template>
            </tree-table>
        </el-card>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pagenum"
            :page-sizes="[1, 2, 4, 6]"
            :page-size="querInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                querInfo:{
                    // 搜索关键字和搜索框进行双向数据绑定
                    query:'',
                    // 当前的页面
                    pagenum:1,
                    // 当前每页显示多少条数据
                    pagesize:6,
                },
                                    
                cateList:[],//商品分类的数据列表，默认为空
                total:0,  //总数居条
                columns:[ 
                    {
                        label:'分类名称',
                        prop:'cat_name'
                    },
                    {
                        label:'是否有效',
                        // 表示，将当前列定义为模板列
                        type:'template',
                        //表示当前这一列使用模板名称
                        template:'isok'
                    },
                    {
                        label:'排序',
                        // 表示，将当前列定义为模板列
                        type:'template',
                        //表示当前这一列使用模板名称
                        template:'order'
                    },
                    {
                        label:'操作',
                        // 表示，将当前列定义为模板列
                        type:'template',
                        //表示当前这一列使用模板名称
                        template:'button'
                    }
                    
                ]
                    
            }

        },

        created(){
            this.grtCateList()
        },

        methods:{
            //获取商品分类数据
            async grtCateList(){
                const {data:res} = await this.$http.get('categories',{params:this.querInfo})

                if(res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败！')
                }
                console.log(res.data);
                //把数据列表，赋值给cateList
                this.cateList = res.data.result
                //为总数居条赋值
                this.total = res.data.total

            },
            handleSizeChange(newSize){
                this.querInfo.pagesize = newSize;
                this.grtCateList();
            },
            handleCurrentChange(newpage){
                this.querInfo.pagenum = newpage;
                this.grtCateList();
            }
        }
    }
</script>
<style lang="less" scoped>

</style>