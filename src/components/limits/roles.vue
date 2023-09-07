<template> 
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/homepage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 权限列表 -->
        <el-card class="box-card">
            <el-button type="primary" style="text-align:start" @click="handleAddrole()">添加角色</el-button>
        </el-card>

        <!-- 角色添加对话框 -->
        <el-dialog
            title="添加角色"
            :visible.sync="addroleDialogVisible"
            width="50%"
        >
            <el-form :model="addroleForm" label-width="70px" ref="addroleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addroleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addroleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addrole(addroleForm)">确 定</el-button>
                <el-button type="warning" @click="addroleReset()">重置</el-button>
                <el-button @click="addroleDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 角色渲染列表 -->

        <el-table :data="rolesdata" stripe style="width: 100%;text-align:center" border>   
            <el-table-column type="expand">
                <!-- 一级渲染 -->
                <template v-slot="scope">
                    <el-row 
                        v-for="(item,index) of scope.row.children" 
                        :key="item.id"
                        class="listxun"
                        :class="[index === 0 ? 'botop':'','bobottom']"
                    >
                        <el-col :span="5">
                            <el-tag closable @close="removeRoleByid(scope.row,item.id)">{{item.authName}}</el-tag>
                        </el-col>
                        <!-- 二级渲染 -->
                        <el-col :span="19">
                            <el-row v-for="item1 of item.children" :key="item1.id"> 

                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRoleByid(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                </el-col>
                                <!-- 三级渲染 -->
                                <el-col :span="18">
                                    <el-tag 
                                        type="warning" 
                                        closable 
                                        @close="removeRoleByid(scope.row,item2.id)" 
                                        v-for="item2 of item1.children"
                                    >
                                    {{ item2.authName }}    
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="350"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="350"></el-table-column>
            <el-table-column prop="address" label="操作" width="350" v-slot="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="removerole(scope.row)">删除</el-button>
                <el-button type="warning" size="mini" icon="el-icon-more" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </el-table-column>
        </el-table>

        <!-- 分配权限区域 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setrightDialogVisible"
            width="50%"
            @close="setRightDialogClosed"
        >
            <el-tree    
                :data="rightlist" 
                :props="treeProps" 
                show-checkbox 
                node-key="id"
                :default-checked-keys="defKeys"
                ref="treeRef"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setrightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'roles',
    data(){
        return{
            // 角色权限信息
            rolesdata:[],
            // 角色权限设置区域弹出控制
            setrightDialogVisible: false,
            // 所有权限的数据
            rightlist:[],

            treeProps:{
                label:'authName',
                children:'children',
            },

            defKeys:[105,116],

            roleId:'',
            // 添加角色
            addroleForm:{
                roleName:'',
                roleDesc:''
            },
            // 添加角色控制
            addroleDialogVisible: false,      
        }
    },
    created(){
        this.getRoleList()
    },
    methods:{
        async getRoleList(){
            const {data:res} = await this.$http.get('roles');
            // console.log(res);
            this.rolesdata = res.data;
            console.log(this.rolesdata);
        },
        removeRoleByid(role,id){
            // console.log(role);
            // console.log(id);
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then( async() => {
                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${id}`)
                if(res.meta.status !== 200){
                    return  this.$message({type: 'info',message: '删除权限失败！'});          
                }
                this.$message({type: 'success',message: '删除权限成功!'});
                role.children = res.data
            }).catch(() => {
            this.$message({type: 'info',message: '已取消删除权限'});          
            });

        },
        async showSetRightDialog(role){
            this.roleId = role.id
            const {data:res} = await this.$http.get(`rights/tree`);
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error('获取权限列表失败');
            this.rightlist = res.data;
            this.setrightDialogVisible = true;
        },
        getLeafKeys(node,arr){
            if(!node.children){
                return arr.push(node.id);
            }

            node.children.forEach(e => {
                this.getLeafKeys(e,arr);
            });
        },
        setRightDialogClosed(){
            this.defKeys = []
        },
        async allotRights(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]
            const idStr = keys.join(',');
            const {data:res} = await this.$http.post(`roles/${this.roleId}}/rights`,{rids:idStr})
            console.log('@',idStr,res);
            if(res.meta.status !== 200){
                return this.$message.error("分配权限失败");
            }

            this.$message.success("分配权限成功！")
            this.getRoleList();
            this.setrightDialogVisible = false;
        },
        // 删除角色
        async removerole(roledata){
            if(confirm('确定删除该角色嘛')){
                const {data:res} = await this.$http.delete(`roles/${roledata.id}`);

                if (res.meta.status !== 200) {
                    return this.$message.error('角色删除失败');
                }
                this.$message.success("角色删除成功");
                this.getRoleList();
            }
        },
        // 添加角色
        handleAddrole(){
            this.addroleDialogVisible = true;
        },
        async addrole(){
            const {data:res} = await this.$http.post('roles',this.addroleForm);
            console.log(res);
            if(res.meta.status !== 201){
                return this.$message.error('角色添加失败');
            }
            
            this.$message.success('角色添加成功');
            this.getRoleList();

            this.addroleDialogVisible = false;
        },
        addroleReset(){
            this.$refs.addroleForm.resetFields();
        }
    }
}
</script>

<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .listxun{
        display: flex;
        align-items: center;
    }
    .botop{
        border-top: 1px solid #ccc;
    }
    .bobottom{
        border-bottom: 1px solid #eee;
    }
</style>