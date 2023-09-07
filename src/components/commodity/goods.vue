<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card style="line-height:60px;">
            <!-- Layout 布局 设置行和列的数  span是宽度最大24 gutter是间隙 -->
            <el-row :gutter="20">
                <!-- 搜索与添加 -->
                <el-col :span="8">
                    <el-input 
                        placeholder="请输入内容" 
                        v-model="queryInfo.query" 
                        class="input-with-select"
                        clearable
                        @clear="getgoodsList()"
                    >
                        <el-button 
                            slot="append" 
                            icon="el-icon-search"
                            @click="getgoodsList()"
                            >
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
        </el-card>

        <el-table :data="goodsList" style="width: 100%;text-align:center;" stripe border id="ju">
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="640"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格" width="80"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
            <el-table-column prop="upd_time" label="创建时间" width="170">
                <template v-slot="scope">
                    {{ scope.row.add_time | dataFormat}}
                </template>
            </el-table-column>
            <!-- v-slot 还可以直接放在 el-table-column里面也可以访问数据-->
            <el-table-column 
                prop="mg_state" 
                label="操作" 
                width="185" 
                style="text-align:center"
                v-slot="scope"
            >
                <el-button 
                    type="primary" 
                    size="mini" 
                    icon="el-icon-edit" 
                >
                编辑
                </el-button>
                <el-button 
                    type="danger" 
                    size="mini" 
                    icon="el-icon-delete" 
                    @click="goodsdelete(scope.row.goods_id)"
                >
                删除
            </el-button>

            </el-table-column>
        </el-table>

        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="text-align:center"
    >
    </el-pagination>
    </div>
</template>

<script>
export default {
    name:'commodityList',
    data() {
        return {
            // 搜索商品
            goodsmessage:'',
            // 请求参数
            queryInfo:{
                // 搜索关键字和搜索框进行双向数据绑定
                query:'',
                // 当前的页面
                pagenum:1,
                // 当前每页显示多少条数据
                pagesize:6,
            },
            // 商品列表
            goodsList:[],
            // 商品总数
            total:0
        }
    },
    created(){
        this.getgoodsList()
    },
    methods:{
        async getgoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo});
            console.log(res.data);
            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表失败！');
            }
            this.goodsList = res.data.goods;
            this.total = res.data.total;
            console.log(this.goodsList);
        },        
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getgoodsList()
        },
        // 监听 页面值 改变事件 newpage为选择的页码 选择第几页就把页数作为参数传递给接口请求
        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage
            this.getgoodsList()
        },
        async goodsdelete(id){
            console.log(id);
            if(confirm('确定删除该商品嘛')){
                const {data:res} = await this.$http.delete(`goods/${+id}`);

                if(res.meta.status !== 200){
                    return this.$message.error('删除失败')
                }
                console.log('@',res);
                this.getgoodsList();
                this.$message.success('删除成功');
            }
        }
    }
}
</script>

<style lang="less" scoped>
    #ju{
        text-align: center !important;
    }
</style>