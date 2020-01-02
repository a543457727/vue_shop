<template>
  <div class="outBox">
    <!-- 图片预览弹窗 -->
    <el-dialog title="图片预览" :visible.sync="isPreviewShow" width="40%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
    <!-- 图片预览结束 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="stepIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          v-model="stepIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="ruleForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="ruleForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="ruleForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="ruleForm.goods_cat"
                :options="cateList"
                expand-trigger="hover"
                :props="{label:'cat_name',children:'children',value: 'cat_id',}"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item1" v-for="(item1,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="ruleForm.goods_introduce"></quill-editor>
            <!-- 富文本编辑器结束 -->
            <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      stepIndex: 0,
      tabPosition: 'left',
      ruleForm: {
        // 表单内数据
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 上传图片的Url地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      isPreviewShow: false, // 预览弹框
      previewPath: '', // 预览图的路径
      rules: {
        // 表单绑定规则
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      onlyTableData: [],
      manyTableData: []
    }
  },
  created() {
    this.getCasList()
  },
  computed: {
    cateId() {
      if (this.ruleForm.goods_cat.length === 3) {
        return this.ruleForm.goods_cat[2]
      }
      return null
    }
  },
  methods: {
    async getCasList() {
      const { data: infoList } = await this.$http.get(`categories`)
      this.cateList = infoList.data
    },
    handleChange() {
      if (this.ruleForm.goods_cat.length !== 3) {
        this.ruleForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.ruleForm.goods_cat.length !== 3) {
        this.$message.error('请先选择分类')
        return false
      }
    },
    async tabClick() {
      if (this.stepIndex === '1') {
        const { data: infoList } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'many' } }
        )
        infoList.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = infoList.data
      }
      if (this.stepIndex === '2') {
        const { data: infoList } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: 'only' } }
        )
        this.onlyTableData = infoList.data
      }
    },
    handlePreview(file) {
      // 点击缩略图时回调的函数
      this.previewPath = file.response.data.url
      this.isPreviewShow = true
      console.log(this.previewPath)
    },
    handleRemove(file) {
      console.log(file)
      // 预览位置移除文件的回调函数
      const filePath = file.response.data.tmp_path
      const i = this.ruleForm.pics.findIndex(x => x.pic === filePath)
      this.ruleForm.pics.splice(i, 1)
      console.log(this.ruleForm)
    },
    handleSuccess(response) {
      // 监听图片上传成功的事件
      const picInfo = {
        pic: response.data.tmp_path
      }
      this.ruleForm.pics.push(picInfo)
    },
    async addGoods() {
      // console.log(this.ruleForm)
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必填项')
        }
      })
      let form = _.cloneDeep(this.ruleForm)
      form.goods_cat = form.goods_cat.join(',')
      // 处理动态参数 静态属性
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.ruleForm.attrs.push(newInfo)
      })
      // 处理静态属性
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.ruleForm.attrs.push(newInfo)
      })
      form.attrs = this.ruleForm.attrs
      const { data: infoList } = await this.$http.post('goods', form)
      if (infoList.meta.status !== 201) {
        return this.$message.error(infoList.meta.msg)
      }
      this.$message.success(infoList.meta.msg)
      this.$router.push('/goods')
    }
  }
}
</script>

<style scoped>
.el-steps {
  margin: 20px 0 10px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
