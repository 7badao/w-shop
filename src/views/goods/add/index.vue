<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :myinfo="rolesBread"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="添加商品信息" center show-icon type="info" :closable="false"></el-alert>
      <!-- 步骤条区域 -->
      <div class="stepsBox">
        <el-steps :space="200" :active="tabsIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <!-- tabs区域 -->
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="tabsIndex"
          @tab-click="tabClick"
          :tab-position="tabPosition"
          :before-leave="beforLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="categotriesList"
                :props="{value:'cat_id',label:'cat_name',children: 'children',expandTrigger:'hover'}"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="i.attr_name" v-for="i in manyTabData" :key="i.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="i.attr_vals">
                <el-checkbox border :label="i" v-for="(i,index) in i.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="i in onlyTabData" :key="i.attr_id" :label="i.attr_name">
              <el-input v-model="i.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <!-- action 图片上传的api地址 -->
            <!-- on-preview 预览事件  on-remove 移除图片 list-type 文件预览样式 -->
            <el-upload
              :action="uploadUrl"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览区域 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewUrl" class="previewImg" alt />
    </el-dialog>
  </div>
</template>

<script>
// 导入lodash
import _ from 'loadsh'
import breadcrumb from '@/components/breadcrumb'
import { apiGetCategoriesList } from '@/api/cate'
import { ApiGtAttributes, ApiAddGoods } from '@/api/goods'
// import stepsStatus from './components/stepsStatus'
// import myTabs from './components/myTabs'
export default {
  components: {
    breadcrumb,
    // stepsStatus,
    // myTabs
  },
  data () {
    return {
      rolesBread: {
        a: "商品管理",
        b: "添加商品"
      },
      // 上传图片url地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传图片请求头
      headerObj: {
        Authorization: this.$store.state.userInfo
      },
      // 预览图片地址
      previewUrl: '',
      dialogVisible: false,
      // tab左侧显示
      tabPosition: 'left',
      // 默认下标
      tabsIndex: '0',
      // 新增表单
      addFrom: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品内容详情 富文本
        goods_introduce: '',
        attrs: []
      },
      // 表单验证规则
      addFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类数据
      categotriesList: [],
      // 动态参数列表数据
      manyTabData: [],
      // 静态参数列表数据
      onlyTabData: []
    }
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await apiGetCategoriesList(this.$http, {
        params: ''
      })
      console.log(res);
      this.categotriesList = res.data
    },
    // 级联选择器选中项变化触发
    handleChange () {
      console.log(this.addFrom.goods_cat[2])
      // 判断数组长度是否是3
      if (this.addFrom.goods_cat.length !== 3) {
        // 不是第三级清空
        this.addFrom.goods_cat = []
      }
    },
    // 阻止标签页的切换
    beforLeave (activeName, oldActiveName) {
      // 如果tab在0且级联选择器的长度不在3 阻止切换页标
      if (oldActiveName === '0' && this.addFrom.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类!')
        return false
      }
    },
    // tab切换事件
    async tabClick () {
      console.log(this.tabsIndex);
      // 访问商品参数
      if (this.tabsIndex === '1') {
        const { data: res } = await ApiGtAttributes(this.$http, this.cateId, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        // 遍历attr_vals 改造成数组 split分割成数组
        res.data.forEach(item => {
          // 判断这个数据是否为空 空返回空数组 有数据返回分割成数组
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTabData = res.data
        console.log(res);
      }
      // 访问商品属性
      if (this.tabsIndex === '2') {
        const { data: res } = await ApiGtAttributes(this.$http, this.cateId, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }
        this.onlyTabData = res.data
        console.log(res);
      }
    },
    // 移除图片
    handleRemove (file, fileList) {
      console.log(file, fileList);
      // 获取将要删除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 根据索引值找到图片 从pics数组中查找
      this.addFrom.pics.findIndex(x => x.pic === filePath)
      // 从pics数组删除 splice
      this.addFrom.pics.splice(1)
      console.log(this.addFrom, '222');
    },
    // 图片预览事件
    handlePreview (file) {
      console.log(file);
      this.previewUrl = file.response.data.url
      this.dialogVisible = true
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      console.log(response);
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 图片信息对象push到pics数组
      this.addFrom.pics.push(picInfo)
      console.log(this.addFrom);
    },
    // 添加商品
    addGoods () {
      // 表单验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 将goods_cat数组改成逗号分割的字符串
        // lodash cloneDeep(obj) 深拷贝
        var from = _.cloneDeep(this.addFrom)
        from.goods_cat = from.goods_cat.join(',')
        // 处理动态参数
        this.manyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addFrom.attrs.push(newInfo)
        })
        // 静态属性
        this.onlyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addFrom.attrs.push(newInfo)
        })
        from.attrs = this.addFrom.attrs
        // 发起请求添加商品
        const { data: res } = await ApiAddGoods(this.$http, {
          data: from
        })
        console.log(res, '55');
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
          return false
        }
        this.$message({
          message: '添加商品成功',
          type: 'success'
        })
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 计算分类id
    cateId () {
      // 如果分类数组长度为三 说明选中
      if (this.addFrom.goods_cat.length === 3) {
        // 返回分类id
        return this.addFrom.goods_cat[2]
      }
      // 长度没有
      return null
    }
  },
  created () {
    this.getCateList()
  },
}
</script>

<style lang="less" scoped>
.stepsBox {
  margin: 15px 0;
  /deep/.el-step__title {
    font-size: 13px;
  }
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
