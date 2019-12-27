<template>
  <div>
    <!-- 添加弹框 -->
    <el-dialog
      :title="titleType"
      :visible.sync="isShowAdd"
      width="40%"
      @close="clearAddDia('addDiaRef')"
    >
      <el-form :model="addForm" :rules="rules" ref="addDiaRef">
        <el-form-item label="分类名称:" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" :label-width="formLabelWidth">
          <el-cascader
            v-model="CasValue"
            :options="CateSel"
            expand-trigger="hover"
            :props="casConfig"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearAddDia('addDiaRef')">取 消</el-button>
        <el-button type="primary" @click="addCate('addDiaRef')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加弹框结束 -->
    <!-- 编辑弹框 -->
    <el-dialog title="编辑" :visible.sync="isShowEdit">
      <el-form :model="editForm" :rules="rules">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editMes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹框结束 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" id="addBtn" @click="openAdd">添加分类</el-button>
          <table-tree
            :data="tableData"
            :columns="columnConfig"
            :selection-type="false"
            :expand-type="false"
            show-index
            border
            class="tableTree"
          >
            <template slot-scope="scope" slot="status">
              <i
                class="el-icon-success"
                v-if="scope.row.cat_deleted === false"
                style="color:lightgreen"
              ></i>
              <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <template slot-scope="scope" slot="order">
              <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
            </template>
            <template slot-scope="scope" slot="opt">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="openEdit(scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="saveDelMes(scope.row)"
              >删除</el-button>
            </template>
          </table-tree>
          <el-pagination
            :current-page="pageMes.pagenum"
            :page-sizes="[5, 10, 15, 20,25,30,35,40]"
            :page-size="pageMes.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageMes.total"
            @size-change="sizeChange"
            @current-change="currentChange"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      titleType: '', // 弹框的标题名字
      isShowAdd: false,
      isShowEdit: false,
      formLabelWidth: '6.2rem',
      CasValue: [], // 级联选择器选中的存储点
      addForm: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      }, // 添加框/编辑绑定对象
      CateSel: [], // 添加框级联选择器的数据
      casConfig: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      rowMes: {}, // 当前行的数据
      columnConfig: [
        // 树状表格列属性说明
        {
          label: '分类名称', // th行名
          prop: 'cat_name' // 绑定对应对象名称
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'status'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      editForm: {},
      pageMes: {
        // 分页参数/查询条件
        type: 3,
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      // 获取列表数据
      const { data: infoList } = await this.$http.get('categories', {
        params: this.pageMes
      })
      if (infoList.meta.status !== 200) {
        return this.$message.error('服务器开小差了,请稍后再试')
      }
      console.log(infoList)
      this.tableData = infoList.data.result
      this.pageMes.total = infoList.data.total
    },
    sizeChange(val) {
      this.pageMes.pagesize = val
      this.getCateList()
    },
    currentChange(val) {
      this.pageMes.pagenum = val
      this.getCateList()
    },
    async getCateDate() {
      const { data: infoList } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      console.log(infoList)
      if (infoList.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.CateSel = infoList.data
    },
    openAdd() {
      this.titleType = '添加'
      this.getCateDate()
      this.isShowAdd = true
    },
    handleChange(value) {
      console.log(value)
      if (this.CasValue.length > 0) {
        this.addForm.cat_pid = this.CasValue[this.CasValue.length - 1]
        this.addForm.cat_level = this.CasValue.length
      } else {
        this.addForm.cat_pid = ''
        this.addForm.cat_level = ''
      }
      console.log(this.addForm)
    },
    addCate(refs) {
      this.$refs[refs].validate(async value => {
        if (value) {
          const { data: infoList } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (infoList.meta.status !== 201) {
            return this.$message.error('添加数据失败')
          }
          this.getCateList()
          this.isShowAdd = false
        } else {
          return false
        }
      })
    },
    clearAddDia(refs) {
      // 清空添加表单的数据
      this.isShowAdd = false
      this.$refs[refs].resetFields()
      this.CasValue = []
      this.addForm.cat_level = 0
      this.addForm.cat_pid = 0
    },
    saveDelMes(val) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          console.log(val)
          const { data: infoList } = await this.$http.delete(
            `categories/${val.cat_id}`
          )
          if (infoList.meta.status !== 200) {
            return this.$message.error('删除数据失败')
          }
          this.getCateList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async openEdit(row) {
      const { data: infoList } = await this.$http.get(
        `categories/${row.cat_id}`
      )
      if (infoList.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.editForm = infoList.data
      this.isShowEdit = true
    },
    async editMes() {
      const { data: infoList } = await this.$http.put(
        `categories/${this.editForm.cat_id}`,
        this.editForm
      )
      console.log(infoList)
      if (infoList.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.$message.success('修改成功')
      this.isShowEdit = false
      this.getCateList()
    }
  }
}
</script>

<style scoped>
.tableTree {
  margin: 0.7rem;
}
.el-cascader {
  width: 100%;
}
</style>
