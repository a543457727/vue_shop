<template>
  <div>
    <!-- 添加弹出层 -->
    <el-dialog title="添加用户" :visible.sync="isAddShow">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="用户名称" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addUser('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加弹出层结束 -->
    <!-- 修改弹出层 -->
    <el-dialog title="修改信息" :visible.sync="ischange">
      <el-form :model="changMes" status-icon :rules="rules" ref="changMesRef">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="changMes.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱号" :label-width="formLabelWidth" prop="email">
          <el-input v-model="changMes.email" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="changMes.mobile" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="changeUserMes('changMesRef')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹出层结束 -->
    <!-- 分配角色弹出层 -->
    <el-dialog title="分配角色" :visible.sync="isEditPower" width="30%">
      <div>
        <p>当前用户:{{roleMes.username}}</p>
        <p>当前用户角色:{{roleMes.role_name}}</p>
        <p>
          分配新角色:
        <el-select v-model="thisRoleId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="EditPower">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色弹出层结束 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="page.query">
            <el-button slot="append" icon="el-icon-search" @click="getTableList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="isAddShow = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="index" label="#" width="55"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeUserStatus(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="getRoleMes(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页开始 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
      <!-- 分页结束 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var emailRule = (rule, value, callback) => {
      console.log('value', value)
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确的邮箱'))
    }
    var mobileRule = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      return callback(new Error('请输入正确的手机号'))
    }
    return {
      // 初始化所有用户的信息
      tableData: [],
      // 分页信息
      page: {
        qurey: '',
        pagenum: 1,
        pagesize: 2,
        total: null
      },
      isAddShow: false,
      ischange: false,
      isEditPower: false,
      formLabelWidth: '80px',
      // 添加用户的表单数据
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 选择框的选择值
      thisRoleId: '',
      // 当前用户的信息
      roleMes: {},
      changMes: {},
      roleList: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: emailRule, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileRule, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getTableList()
  },
  methods: {
    async handleEdit(index, row) {
      // 修改信息
      const { data: infoList } = await this.$http.get('users/' + row.id)
      if (infoList.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.ischange = true
      // this.changMes.username = infoList.data.username
      // this.changMes.email = infoList.data.email
      // this.changMes.mobile = infoList.data.mobile
      this.changMes = infoList.data
      // this.$forceUpdate()
    },
    handleDelete(index, row) {
      // 删除信息
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: infoList } = await this.$http.delete(`users/${row.id}`)
          if (infoList.meta.status !== 200) {
            return this.$message.error(infoList.meta.msg)
          }
          this.$message.success(infoList.meta.msg)
          this.getTableList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async getTableList() {
      // 获取用户信息
      const { data: infoList } = await this.$http.get('users', {
        params: this.page
      })
      this.tableData = infoList.data.users
      this.page.total = infoList.data.total
    },
    handleSizeChange(val) {
      // 分页限制条数改变时
      this.page.pagesize = val
      this.getTableList()
    },
    handleCurrentChange(val) {
      // 当前页发生改变时
      this.page.pagenum = val
      this.getTableList()
    },
    async changeUserStatus(row) {
      // 修改用户状态
      const { data: infoList } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (infoList.meta.status !== 200) {
        return this.$message.error('修改状态出错')
      }
      this.$message.success(infoList.meta.msg)
    },
    addUser(ruleForm) {
      // 添加用户
      this.$refs[ruleForm].validate(async valid => {
        if (valid) {
          const { data: infoList } = await this.$http.post('users', this.form)
          console.log(infoList)
          if (infoList.meta.status !== 201) {
            return this.$message.error(infoList.meta.msg)
          }
          this.$message.success(infoList.meta.msg)
          this.isAddShow = false
          this.getTableList()
          this.$refs[ruleForm].resetFields()
        } else {
          return false
        }
      })
    },
    changeUserMes(name) {
      // 修改用户信息
      this.$refs[name].validate(async valid => {
        if (valid) {
          const { data: infoList } = await this.$http.put(
            'users/' + this.changMes.id,
            this.changMes
          )
          console.log(infoList)
          if (infoList.meta.status !== 200) {
            return this.$message.error(infoList.meta.msg)
          }
          this.$message.success(infoList.meta.msg)
          this.getTableList()
          this.ischange = false
        } else {
          return false
        }
      })
    },
    async getRoleMes(role) {
      this.roleMes = role
      this.isEditPower = true
      const { data: infoList } = await this.$http('roles')
      if (infoList.meta.status !== 200) {
        return this.message.error(infoList.meta.msg)
      }
      this.roleList = infoList.data
      console.log(this.roleList)
    },
    cancel() {
      // 关闭弹出层
      this.isEditPower = false
      this.isAddShow = false
      this.ischange = false
    },
    async EditPower() {
      if (!this.thisRoleId) {
        return this.$message.info('角色信息没有改变')
      }
      const { data: infoList } = await this.$http.put(
        `users/${this.roleMes.id}/role`,
        {
          rid: this.thisRoleId
        }
      )
      if (infoList.meta.status !== 200) {
        return this.$message.error(infoList.meta.msg)
      }
      this.$message.success(infoList.meta.msg)
      this.cancel()
      this.getTableList()
    }
  }
}
</script>

<style>
.el-table {
  margin-top: 15px;
}
</style>
