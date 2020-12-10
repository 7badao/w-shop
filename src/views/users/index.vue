<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 输入框区域  -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="queryInfo.query" @clear="getUserList" clearable placeholder="请输入内容">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table border :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="changeUserState(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              @click="showEditDialog(scope.row.id)"
              size="mini"
              icon="el-icon-edit"
              circle
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              @click="deleteUser(scope.row.id)"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
            <el-tooltip enterable effect="dark" content="修改" placement="top-start">
              <el-button type="warning" size="mini" icon="el-icon-star-off" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体 -->
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRes" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <!-- :rules 验证规则  res当前表单引用对象 -->
    <el-dialog
      title="修改用户信息"
      @close="editDialogClose"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form :model="editUserFrom" :rules="editRules" ref="editUserFromRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮组 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入请求用户相关的接口
import { apiGetUserList, apiSetUserState, apiAddUsers, apiSearchUsers, apiEditUserState, apiDelUser } from '@/api/user'
export default {
  data () {
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 用户数据对象
      userList: [],
      // 搜索请求
      userSearch: "",
      // 总条数
      total: 0,
      // 对话框显示
      dialogVisible: false,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      // 修改用户验证
      editRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      // 修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询用户信息对象
      editUserFrom: {}
    }
  },
  methods: {
    // 请求用户数据列表
    async getUserList () {
      const { data: res } = await apiGetUserList(this.$http, {
        params: this.queryInfo
      })
      console.log(res, '请求用户数据');
      // 成功获取
      if (res.meta.status === 200) {
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
        // 将数据保存起来
        this.userList = res.data.users
        // 总条数
        this.total = res.data.total
      } else {
        this.$message.error('获取失败')
      }
    },
    // 设置显示条数
    handleSizeChange (newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 点击页码触发
    handleCurrentChange (pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getUserList()
    },
    // 改变用户状态
    async changeUserState (value) {
      const { data: res } = await apiSetUserState(this.$http, {
        url: `/users/${value.id}/state/${value.mg_state}`,
        data: this.userList
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      console.log(res);
    },
    // 关闭dialog 重置操作
    addDialogClose () {
      this.$refs.ruleFormRes.resetFields()
    },
    // 添加用户
    addUser () {
      // 表单验证
      this.$refs.ruleFormRes.validate(async valid => {
        if (!valid) return
        const { data: res } = await apiAddUsers(this.$http, {
          data: this.ruleForm
        })
        console.log(res, '添加用户');
        // 添加是否成功
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
        // 关闭对话框
        this.dialogVisible = false
        // 重新请求页面
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (row) {
      const { data: res } = await apiSearchUsers(this.$http, {
        url: `users/${row}`,
      })
      if (res.meta.status !== 200) return this.$message.error('查询用户数据失败')
      console.log(res, '查询用户');
      this.editUserFrom = res.data
      // 弹框显示
      this.editDialogVisible = true
    },
    // 监听修改用户表单操作
    editDialogClose () {
      this.$refs.editUserFromRef.resetFields()
    },
    // 修改用户信息提交
    editUserInfo () {
      this.$refs.editUserFromRef.validate(async valid => {
        console.log(valid);
        if (!valid) return
        // 发起用户信息请求
        const { data: res } = await apiEditUserState(this.$http, {
          url: `users/${this.editUserFrom.id}`,
          data: {
            email: this.editUserFrom.email,
            mobile: this.editUserFrom.mobile
          }
        })
        console.log(res, '修改');
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
        // 关闭对话框
        this.editDialogVisible = false
        // 重新请求页面
        this.getUserList()
      })
    },
    // 删除用户
    deleteUser (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await apiDelUser(this.$http, {
          url: `users/${id}`
        })
        console.log(res, '删除');
        this.$message({
          type: 'success',
          message: res.meta.msg
        });
        // 重新请求页面
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  created () {
    this.getUserList()
  },
}
</script>

<style>
</style>