<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="setUserVisibleShow" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table v-loading="isLoading" :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <!-- 通过for循环 渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6 ">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              @click="editUser(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              @click="deleteUser(scope.row)"
              icon="el-icon-delete"
              size="mini"
            >删除</el-button>
            <el-button
              type="warning"
              @click="showSetDialog(scope.row)"
              icon="el-icon-setting"
              size="mini"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showSetDialogVisible"
      width="50%"
      @close="setRightDialogClose"
    >
      <!-- 树形控件 default-expand-all是否默认展开 -->
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        node-key="id"
        show-checkbox
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色按钮 -->
    <el-dialog
      title="添加角色"
      @close="closeSetUserVisibile"
      :visible.sync="setUserVisible"
      width="50%"
    >
      <el-form
        :model="setUserForm"
        :rules="setUserRules"
        ref="setUserFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="setUserForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="setUserForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="编辑角色"
      @close="closeEditUserVisibile"
      :visible.sync="editUserVisible"
      width="50%"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserRules"
        ref="editUserFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editUserForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editUserForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
// 导入与角色相关的请求
import { apiGetRoles, apiDelRoles, apiSetRoles, apiAddRoles } from '@/api/roles'
// 导入与用户相关的
import { apiDelUser, apiSearchUsers, apiEditUserState } from '@/api/user'
// 导入获取所有权限列表数据
import { apiGetRights } from '@/api/rights'
export default {
  data () {
    return {
      // 添加角色验证规则
      setUserRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      // 添加角色数据
      setUserForm: {
        // 角色名称
        roleName: "",
        // 角色描述
        roleDesc: ""
      },
      // 编辑角色
      editUserRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
      // 添加角色数据
      editUserForm: {
        // 角色名称
        roleName: "",
        // 角色描述
        roleDesc: ""
      },
      // 添加角色对话框
      setUserVisible: false,
      // 编辑角色对话框
      editUserVisible: false,
      rolesBread: {
        a: "权限管理",
        b: "角色列表"
      },
      // 添加角色数据
      ruleForm: {},
      // 编辑角色数据
      editFrom: {},
      // 表格数据
      rolesList: [],
      // 分配权限对话框的显示与隐藏
      showSetDialogVisible: false,
      // 权限数据
      rightsList: [],
      // 树形控件属性绑定对象
      treeProps: {
        //  父子嵌套
        children: 'children',
        // 属性名称
        label: 'authName'
      },
      // 默认选择的节点id值数组
      defKeys: [],
      // 加载效果 默认为false
      isLoading: false,
      // 点击分配权限的角色id
      roleId: ""
    }
  },
  methods: {
    // 获取所有角色列表
    async getRolesList () {
      this.isLoading = true
      const { data: res } = await apiGetRoles(this.$http)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.rolesList = res.data
      this.isLoading = false
    },
    // 根据id删除对应权限
    removeRightById (row, id) {
      // 弹框提示用户是否删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await apiDelRoles(this.$http, {
          url: `roles/${row.id}/rights/${id}`
        })
        this.$message({
          type: 'success',
          message: res.meta.msg
        });
        // 重新请求页面
        // this.getRolesList()
        row.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 展示分配权限对话框
    async showSetDialog (role) {
      // 开启加载
      this.showSetDialogVisible = true
      // 将id保存
      this.roleId = role.id
      // 获取所有权限列表数据
      const { data: res } = await apiGetRights(this.$http, {
        url: 'rights/tree'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      // 递归获取三级节点id  getLeafKeys(node) node传角色 
      this.getLeafKeys(role, this.defKeys)
      this.rightsList = res.data
    },
    // 通过递归形式获取所有三级权限的Id 并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 判断是否有children属性来判定是否是三级节点 有代表不是 没有就是三级节点
      if (!node.children) {
        // 是三级节点 将这个id添加到数组中
        return arr.push(node.id)
      }
      // 不是三级节点
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限关闭事件
    setRightDialogClose () {
      this.defKeys = []
    },
    // 点击确定分配角色
    async allotRights () {
      // 两个数组合并
      const keys = [
        // 获取所有选中的
        ...this.$refs.treeRef.getCheckedKeys(),
        // 半选中的
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将得到的数组拼接 与逗号形式
      const idStr = keys.join(',')
      // 发起角色授权请求
      const { data: res } = await apiSetRoles(this.$http, {
        url: `roles/${this.roleId}/rights`,
        data: {
          rids: idStr
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      // 重新请求角色权限数据
      this.getRolesList()
      // 关闭对话框
      this.showSetDialogVisible = false
    },
    // 添加角色按钮
    async setUserVisibleShow () {
      // 开启对话框
      this.setUserVisible = true
    },
    // 关闭添加角色对话框
    closeSetUserVisibile () {
      // 清空表单验证规则
      this.$refs.setUserFormRef.resetFields()
      // 清空输入框
      this.setUserForm.roleDesc = ''
    },
    // 添加角色
    addUser () {
      // 开启表单验证
      this.$refs.setUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await apiAddRoles(this.$http, {
          data: this.setUserForm
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
        // 关闭弹框
        this.setUserVisible = false
        // 请求列表数据
        this.getRolesList()
      })
    },
    // 删除角色
    deleteUser (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await apiDelUser(this.$http, {
          url: `roles/${row.id}`
        })

        this.$message({
          type: 'success',
          message: res.meta.msg
        });
        this.getRolesList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 编辑用户
    async editUser (row) {
      this.roleId = row.id
      // 弹框显示
      this.editUserVisible = true
      const { data: res } = await apiSearchUsers(this.$http, {
        url: `roles/${this.roleId}`,
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      this.editUserForm = res.data
    },
    // 编辑确认按钮
    editUserSure () {
      // 进行表单验证提交
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await apiEditUserState(this.$http, {
          url: `roles/${this.roleId}`,
          data: this.editUserForm
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
        this.editUserVisible = false
        this.getRolesList()
      })
    },
    // 编辑对话框关闭事件
    closeEditUserVisibile () {
      this.$refs.editUserFormRef.resetFields()
    }
  },
  created () {
    // 获取所有角色列表
    this.getRolesList()
  },
  components: {
    breadcrumb
  }
}
</script>

<style lang="less" scope>
.el-tag {
  margin-bottom: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>