<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 面包屑 -->

        <!-- 卡片 -->
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
                        @clear="getUserList()"
                    >
                        <el-button 
                            slot="append" 
                            icon="el-icon-search"
                            @click="getUserList()"
                            >
                        </el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="success" @click="addDialogVisible = true">添加用户</el-button>

                </el-col>
            </el-row>
        </el-card>
        <!-- 用户添加弹弹窗表单 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="50%"
        >
            <el-form :model="addForm" label-width="70px" :rules="addruleForm" ref="addForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addUser(addForm)">确 定</el-button>
                <el-button type="warning" @click="addUserReset()">重置</el-button>
                <el-button @click="addDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 用户数据区域 -->
        <el-table :data="userdata" style="width: 100%;" stripe border>
            <el-table-column type="index" label="#" width="100"></el-table-column>
            <el-table-column prop="username" label="姓名" width="100"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column prop="mg_state" label="状态">
                <!-- 作用域插槽 -->
                <template v-slot="scope">
                    <!-- v-slot 可以拿到table的数据 然后.row 就可以获取当行的数据 然后进行v-model的绑定
                    table :data="userdata" 的一行数据 -->
                    <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <!-- v-slot 还可以直接放在 el-table-column里面也可以访问数据-->
            <el-table-column prop="mg_state" label="操作" width="180" v-slot="user">
                <el-button 
                    type="primary" 
                    size="mini" 
                    icon="el-icon-edit" 
                    @click="editchange(user.row.id)"
                >
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="userRemove(user.row.id)"></el-button>
                <el-button type="info" size="mini" icon="el-icon-more" @click="setRole(user.row)"></el-button>
            </el-table-column>
        </el-table>

        <!-- 编辑框弹出 -->

        <el-dialog title="编辑用户用户" :visible.sync="editDialogVisible" width="40%">
            <el-form :model="editForm" label-width="70px" :rules="editruleForm" ref="editForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editUser(editForm)">确 定</el-button>
                <el-button @click="editDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="40%"
        >
            <div>
                <p>当前的用户:{{userinfo.username}}</p>
                <p>当前的角色:{{userinfo.role_name}}</p>
                <p>
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option 
                            v-for="item of rolesList" 
                            :key="item.id" 
                            :label="item.roleName"
                            :value="item.id"
                        >

                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogClosed()">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 分页区域 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 4, 10]"
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
    name:'users',
    data() {
        return {
            queryInfo:{
                // 搜索关键字和搜索框进行双向数据绑定
                query:'',
                // 当前的页面
                pagenum:1,
                // 当前每页显示多少条数据
                pagesize:4,
            },
            // 返回用户数据存储
            userdata:[],
            input3:'',
            // 显示几条数据
            total:0,
            // 添加用户对话框 
            addDialogVisible:false,
            //添加用户内容区
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加用户内容区验证
            addruleForm:{
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
                email:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                mobile:[
                    { min: 11, max: 11, message: '长度在 11 个数字', trigger: 'blur' }
                ]
            },
            // 编辑区按钮
            editDialogVisible:false,
            // 编辑区数据
            editForm:{
                username:'',
                email:'',
                mobile:'',
            },
            //编辑区验证
            editruleForm:{
                username:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                ],
                email:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
                mobile:[
                    { min: 11, max: 11, message: '长度在 11 个数字', trigger: 'blur' }
                ]
            },
            // 分配角色
            setRoleDialogVisible:false,
            userinfo:{},
            // 所有校色的数据列表
            rolesList:[],
            //已选中的角色Id值
            selectedRoleId:''
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        // 获取列表数据
        async getUserList(){
            const {data:res} = await this.$http.get('users',{
                params:this.queryInfo
            })
            if(res.meta.status !== 200){
                return this.$message.error('获取用户列表失败！');
            }
            // console.log(res.data);
            this.userdata = res.data.users;
            // console.log(this.userdata);
            this.total = res.data.total
        },
        // 更行用户信息
        async userStateChange(userinfo){
            console.log(userinfo);
            const {data:res} = await this.$http.put(
                // 发送请求
                `users/${userinfo.id}/state/${userinfo.mg_state}`
            ); 
            if(res.meta.status !== 200){
                userinfo.mg_state  = !userinfo.mg_state
                return this.$message.error('更新用户状态失败')
            }
            return this.$message.success("更新用户状态更新")
        },
        // 监听 下拉页码  改变事件 newsize为条数 选择几条就把这几个数据作为参数传到请求
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听 页面值 改变事件 newpage为选择的页码 选择第几页就把页数作为参数传递给接口请求
        handleCurrentChange(newpage){
            this.queryInfo.pagenum = newpage
            this.getUserList()
        },
        // 添加用户对话框重置
        addUserReset(){
            this.$refs.addForm.resetFields();
        },
        // 发送网络请求 数据库添加数据(用户)
        async addUser(){
            this.$refs.addForm.validate( vaild => {
                if(!vaild) return

            })
            const {data:res} = await this.$http.post('users',this.addForm);
            // console.log(res);
            this.$refs.addForm.resetFields();
            this.getUserList();
            if(res.meta.status !== 201){
                this.$message.error('添加失败')
            }else{
                this.$message.success("添加成功");
            }
            this.addDialogVisible = false;
        },
        // 删除用户
        async userRemove(data){
            // console.log(data);confirm('你确定要删除该用户嘛')
            // if(confirm('你确定要删除该用户嘛')){
            //     const {data:res} = await this.$http.delete(`users/${data}`)
            //     this.$message.success('删除成功');
            //     this.getUserList();
            //     console.log(res);
            // }
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then( async() => {
                const {data:res} = await this.$http.delete(`users/${data}`)
                this.$message({type: 'success',message: '删除成功!'});
                this.getUserList();
            }).catch(() => {
            this.$message({type: 'info',message: '已取消删除'});          
            });
        },
        // 对话框弹出函数
        async editchange(data){
            // console.log(data);
            const {data:res} = await this.$http.get(`users/${data}`);
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('获取编辑失败')
            this.editForm = res.data
            console.log(this.editForm);
            this.editDialogVisible = true;
        },
        // 编辑用户
        editUser(){
            this.$refs.editForm.validate(async valid =>{
                if(!valid) return
                const {data:res} = await this.$http.put(`users/${this.editForm.id}`,this.editForm);
                this.getUserList();
                this.editDialogVisible = false
            })
        },
        // 分配角色
        async setRole(userinfo){
            this.userinfo = userinfo;

            const {data:res} = await this.$http.get('roles');
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败!');
            }

            this.rolesList = res.data

            this.setRoleDialogVisible = true;
        },
        // 点击按钮，分配角色
        async saveRoleInfo(){
            if(!this.selectedRoleId){
                return this.$message.error('请选择要分配的角色');
            }

            const {data:res} = await this.$http.put(`users/${this.userinfo.id}/role`,{rid:this.selectedRoleId});

            if(res.meta.status !== 200){
                return this.$message.error("更行角色失败");
            }

            this.$message.success("更新角色成功");
            this.getUserList()
            this.setRoleDialogVisible = false;
        },
        setRoleDialogClosed(){
            this.selectedRoleId = '',
            this.userinfo = {};
            this.setRoleDialogVisible = false;
        }
    },
}
</script>

<style lang="less" scoped>
    .el-breadcrumb{
        margin-bottom: 20px;
    }
</style>