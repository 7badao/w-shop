<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
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
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
  </div>
</template>

<script>
// 导入面包屑
import breadcrumb from '@/components/breadcrumb'
// 导入与角色相关的请求
import { apiGetRoles, apiDelRoles, apiSetRoles } from '@/api/roles'
// 导入获取所有权限列表数据
import { apiGetRights } from '@/api/rights'
export default {
  data () {
    return {
      rolesBread: {
        a: "权限管理",
        b: "角色列表"
      },
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
      console.log(res, '请求角色权限');
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
      console.log(keys);
      // 将得到的数组拼接 与逗号形式
      const idStr = keys.join(',')
      // 发起角色授权请求
      const { data: res } = await apiSetRoles(this.$http, {
        url: `roles/${this.roleId}/rights`,
        data: {
          rids: idStr
        }
      })
      console.log(res, '分配权限');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message({
        message: res.meta.msg,
        type: 'success'
      })
      // 重新请求角色权限数据
      this.getRolesList()
      // 关闭对话框
      this.showSetDialogVisible = false
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