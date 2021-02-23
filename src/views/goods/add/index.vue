<template>
  <div>
    <el-card>
      <!-- 提示消息 -->
      <el-alert title="添加商品信息" type="info" show-icon center :closable="false"></el-alert>
      <!-- 步骤条 -->
      <div class="stepsBox">
        <el-steps :active="activeIndex-0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </div>
      <!-- tabs -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          @tab-click="tabClick"
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabsLeave"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="ruleForm.goods_cat"
                :options="cateList"
                :props="{ value:'cat_id',label:'cat_name',childern:'childern', expandTrigger: 'hover' }"
                @change="handleChange"
                prop="goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item v-for="i in manyList" :key="i.attr_id" :label="i.attr_name">
              <!-- 多选框组 -->
              <el-checkbox-group v-model="i.attr_vals">
                <el-checkbox border v-for="(item,index) in i.attr_vals" :key="index" :label="item"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item v-for="i in onlyList" :key="i.attr_id" :label="i.attr_name">
              <el-input v-model="i.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <!-- 上传图片控件 -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-success="handelSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="ruleForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img class="previewImg" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>

<script>
import {  ApiGetClassification,
  ApiGetCateClassList} from '@/api/cate'
import _ from 'lodash'
import { ApiAddGoods } from '@/api/goods'
export default {
  data () {
    return {
      activeIndex: '0',
      tabPosition: 'left',
      ruleForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        // 商品所属分类数组
        goods_cat: [],
        // 上传图片数组
        pics: [],
        // 商品内容详情
        goods_introduce: '',
        attrs: []
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选中商品分类', trigger: 'blur' },
        ]
      },
      // 商品分类数据
      cateList: [],
      // 商品参数 动态数据
      manyList: [],
      // 商品属性 静态数据
      onlyList: [],
      // 上传图片的地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 预览图片地址
      previewPath: '',
      // 上传图片的headers
      headerObj: {
        Authorization: this.$store.state.userInfo
      },
      fileList: [],
      // 图片预览窗口
      dialogVisible: false
    }
  },
  methods: {
    // 添加商品数据
    async getClass () {
      const { data: res } = await ApiGetClassification(this.$http, {
        params: ''
      })
      console.log(res, '111');
      this.cateList = res.data
    },
    // 获取商品参数 动态
    async getManyList () {
      const { data: res } = await ApiGetCateClassList(this.$http, this.cateId, {
        params: {
          sel: 'many'
        }
      })
      if (res.meta.status === 200) {
        // 改造数据 将attr_vals改造成数组
        res.data.forEach(item => {
          // 如果存在数据用split分割成数组 不存在返回空
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyList = res.data
        console.log(this.manyList);
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
      }
    },
    // 获取商品属性 静态
    async getOnlyList () {
      const { data: res } = await ApiGetCateClassList(this.$http, this.cateId, {
        params: {
          sel: 'only'
        }
      })
      if (res.meta.status === 200) {
        this.onlyList = res.data
        console.log(this.onlyList);
        this.$message({
          message: res.meta.msg,
          type: 'success'
        })
      }
    },
    // tab点击事件
    tabClick () {
      // 判断tabs index是不是等于1
      if (this.activeIndex === '1') {
        // 获取动态商品参数
        this.getManyList()
      } else if (this.activeIndex === '2') {
        // 商品属性 静态
        this.getOnlyList()
      }
    },
    // 级联选中项变化触发
    handleChange () {
      // 如果没有级联选择器没用选中不允许进下一级
      if (this.ruleForm.goods_cat.length !== 3) {
        this.ruleForm.goods_cat = []
      }
    },
    // TAB切换标签钩子
    beforeTabsLeave (activeName, oldActiveName) {
      // 判断当前的index是不是0 且级联选择器的长度是不是3
      if (oldActiveName === '0' && this.ruleForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 移除图片触发
    handleRemove (file, fileList) {
      console.log(file, fileList);
      // 移除图片的临时路径
      const filePath = file.response.data.tmp_path
      // 找到移除图片对象的下标
      const i = this.ruleForm.pics.findIndex(x => x.pic === filePath)
      // 从pics数组移除
      this.ruleForm.pics.splice(i, 1)
    },
    // 上传图片
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    // 监听图片上传成功
    handelSuccess (resonpe) {
      console.log(resonpe);
      // 拼接图片信息对象
      const picInfo = {
        pic: resonpe.data.tmp_path
      }
      this.ruleForm.pics.push(picInfo)
      console.log(this.ruleForm);
    },
    // 添加商品
    add () {
      // 表单预验证
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        // loodash.cloneDeep(obj)深拷贝
        const form = _.cloneDeep(this.ruleForm)
        // join将数组转成，分割的字符串
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态数据
        this.manyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          // 将处理的数据添加到attrs
          this.ruleForm.attrs.push(newInfo)
        })
        // 处理静态数据
        this.onlyList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          // 将处理的数据添加到attrs
          this.ruleForm.attrs.push(newInfo)
        })
        // form赋值
        form.attrs = this.ruleForm.attrs
        console.log(form, '55');
        // 发起请求添加商品 商品名称必须唯一
        const { data: res } = await ApiAddGoods(this.$http, {
          data: form
        })
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message({
          type: 'success',
          message: res.meta.msg
        })
        // 跳转会goods
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 计算分类id
    cateId () {
      // 判断级联选择器是否选中
      if (this.ruleForm.goods_cat.length !== 3) {
        return null
      }
      return this.ruleForm.goods_cat[2]
    }
  },
  created () {
    this.getClass()
  },
}
</script>

<style lang="less">
.stepsBox {
  margin: 20px;
}
.el-form-item {
  display: flex;
  flex-direction: column;
}
.el-form-item__label {
  text-align: start;
}
.el-checkbox-group {
  margin-top: 10px;
}
.previewImg {
  width: 100%;
}
.quill-editor {
  margin-bottom: 10px;
}
</style>
