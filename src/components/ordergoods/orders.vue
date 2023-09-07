<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
                        @clear="getorderList()"
                    >
                        <el-button 
                            slot="append" 
                            icon="el-icon-search"
                            @click="getorderList()"
                        >
                        </el-button>
                    </el-input>
                </el-col>
            </el-row>
        </el-card>

        <el-table :data="ordersList" style="width: 100%;" stripe border >
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="600"></el-table-column>
            <el-table-column prop="order_price" label="订单价格(元)" width="105"></el-table-column>
            <el-table-column prop="pay_status" label="是否付款" width="100">
                <template v-slot="scope">
                    
                    <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                    <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="update_time" label="下单时间">
                <template v-slot="scope">
                    {{ scope.row.update_time | dataFormat}}
                </template>
            </el-table-column>
            <!-- v-slot 还可以直接放在 el-table-column里面也可以访问数据-->
            <el-table-column prop="mg_state" label="操作" width="180" v-slot="user">
                <el-button type="primary" size="mini" icon="el-icon-edit" ></el-button>
                <el-button type="success" size="mini" icon="el-icon-map-location" @click="inquiry(user.row.id)"></el-button>
            </el-table-column>
        </el-table>

        <el-pagination
            @size-change="ordersHandleSizeChange"
            @current-change="ordersHandleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 4, 8]"
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
    name:'orderGoods',
    data() {
        return {
            ordersmessage:'',
            ordersList:[],
            queryInfo:{
                // 搜索关键字和搜索框进行双向数据绑定
                query:'',
                // 当前的页面
                pagenum:1,
                // 当前每页显示多少条数据
                pagesize:4,
            },
            total:0,
        }
    },
    created(){
        this.getorderList();
    },  
    methods:{
        async getorderList(){
            const {data:res} = await this.$http.get('orders',{params:this.queryInfo});
            // console.log('@',res,this.queryInfo);

            if(res.meta.status !== 200){
                return this.$message.error('获取订单列表失败！');
            }
            // this.ordersList = res.data;
            this.ordersList = res.data.goods;
            this.total = res.data.total
        },
        ordersHandleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getorderList()
        },
        ordersHandleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage
            this.getorderList();
        },
        async inquiry(id){
            const {data:res} = await this.$http.get(`/kuaidi/${id}`);
            console.log(res);
        }
    }
}
</script>

<style lang="less" scoped>

</style>