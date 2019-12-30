<template>
  <div>
    <!-- 添加弹出层 -->
    <el-dialog
      :title=" '添加'+ titleContext"
      :visible.sync="isShowAdd"
      width="30%"
      @close="handleClose('addDiaRef')"
    >
      <el-form :model="addDia" :rules="rules" ref="addDiaRef">
        <el-form-item :label="titleContext + ':'" prop="attr_name">
          <el-input v-model="addDia.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMes('addDiaRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹出层结束 -->
    <!-- 编辑弹出框 -->
    <el-dialog
      :title="titleType + titleContext"
      :visible.sync="isShowEdit"
      width="30%"
      @close="handleClose('addDiaRef')"
    >
      <el-form :model="addDia" :rules="rules" ref="addDiaRef">
        <el-form-item :label="titleContext + ':'" prop="attr_name">
          <el-input v-model="addDia.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMes('addDiaRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框结束 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon title="注意！只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="cat_opt"
            :options="CateMes"
            expand-trigger="hover"
            :props="casConfig"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisable"
            @click="isShowAdd = true;titleType='添加'"
          >添加参数</el-button>
          <el-table :data="manyTableData" border>
            <!-- 动态参数表格 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="table-tag"
                  :key="tag"
                  v-for="(tag,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="delTag(index,scope.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDia(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delMes(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisable" @click="isShowAdd = true">添加属性</el-button>
          <el-table :data="onlyTableData" border>
            <!-- 动态参数表格 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  class="table-tag"
                  :key="tag"
                  v-for="(tag,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="delTag(index,scope.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDia(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="delMes(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      CateMes: [], // 级联选择框数据
      activeName: 'many', // 标签页的激活状态
      titleType: '',
      casConfig: {
        // 级联选择框配置
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cat_opt: [],
      addDia: {
        attr_name: ''
      },
      rules: {
        attr_name: [
          { required: true, message: '请填写参数名称', trigger: 'blur' }
        ]
      },
      manyTableData: [], // 动态参数的数据
      onlyTableData: [], // 静态属性的数据
      isShowAdd: false,
      isShowEdit: false
    }
  },
  created() {
    this.getCateMes()
  },
  computed: {
    isDisable() {
      if (this.cat_opt.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.cat_opt.length === 3) {
        return this.cat_opt[2]
      }
      return null
    },
    titleContext() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async getCateMes() {
      const { data: infoList } = await this.$http.get('categories')
      if (infoList.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.CateMes = infoList.data
    },
    handleChange() {
      if (this.cat_opt.length !== 3) {
        this.cat_opt = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      this.getParams()
    },
    async getParams() {
      // 获取参数的列表数据
      const { data: infoList } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (infoList.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      infoList.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 控制文本框的显示和隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = infoList.data
      } else {
        this.onlyTableData = infoList.data
      }
    },
    handleClick(tab, event) {
      // 标签页发生变化回调函数
      this.getParams()
    },
    handleClose(rule) {
      // 清空添加数据
      this.$refs[rule].resetFields()
    },
    async showEditDia(data) {
      this.titleType = '修改'
      this.isShowEdit = true
      const { data: infoList } = await this.$http.get(
        `categories/${data.cat_id}/attributes/${data.attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      if (infoList.meta.status !== 200) {
        return this.$message.error(infoList.meta.msg)
      }
      this.addDia = infoList.data
    },
    addMes(rule) {
      // 添加事件
      this.$refs[rule].validate(async value => {
        if (value) {
          console.log(this.addMes.attr_name)
          const { data: infoList } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            { attr_name: this.addDia.attr_name, attr_sel: this.activeName }
          )
          if (infoList.meta.status !== 201) {
            return this.$message.error(infoList.meta.msg)
          }
          this.getParams()
          this.isShowAdd = false
          this.$message.success('添加成功')
        }
        return false
      })
    },
    editMes(rule) {
      // 修改事件
      this.$refs[rule].validate(async value => {
        if (value) {
          console.log({ ...this.addMes, attr_sel: this.activeName })
          const { data: infoList } = await this.$http.put(
            `categories/${this.addDia.cat_id}/attributes/${this.addDia.attr_id}`,
            this.addDia
          )
          if (infoList.meta.status !== 200) {
            return this.$message.error(infoList.meta.msg)
          }
          this.getParams()
          this.isShowEdit = false
          this.$message.success('修改成功')
        }
        return false
      })
    },
    delMes(data) {
      // 删除事件
      this.$confirm('是否删除此条数据', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: infoList } = await this.$http.delete(
            `categories/${data.cat_id}/attributes/${data.attr_id}`
          )
          if (infoList.meta.status !== 200) {
            return this.$message.error(infoList.meta.msg)
          }
          this.$message.success(infoList.meta.msg)
          this.getParams()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async handleInputConfirm(rowMes) {
      if (rowMes.inputValue.trim().length === 0) {
        rowMes.inputValue = ''
        return (rowMes.inputVisible = false)
      }
      rowMes.attr_vals.push(rowMes.inputValue.trim())
      rowMes.inputValue = ''
      this.saveAttrVals(rowMes)
      rowMes.inputVisible = false
    },
    showInput(rowMes) {
      rowMes.inputVisible = true
      // $nextTick方法---当页面元素被重新渲染之后,才会回调函数内的代码
      // ----》即如果页面没有被渲染出来 无法通过this.$refs获取对应的input
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async saveAttrVals(rowMes) {
      // 将对attr_val
      const { data: infoList } = await this.$http.put(
        `categories/${rowMes.cat_id}/attributes/${rowMes.attr_id}`,
        {
          attr_name: rowMes.attr_name,
          attr_sel: this.activeName,
          attr_vals: rowMes.attr_vals.join(' ')
        }
      )
      if (infoList.meta.status !== 200) {
        return this.$message.error('修改失败')
      }
    },
    delTag(index, rowMes) {
      // 删除对应的参数可选项
      rowMes.attr_vals.splice(index, 1)
      this.saveAttrVals(rowMes)
    }
  }
}
</script>

<style>
.cat_opt {
  margin: 15px 0;
}
.table-tag {
  margin: 5px;
}
.input-new-tag {
  width: 7rem;
}
</style>
