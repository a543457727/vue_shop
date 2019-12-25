<template>
  <div>
    <!-- 分配权限弹出框 -->
    <el-dialog title="提示" :visible.sync="isRolesShow" width="50%" @close="setDefKeys">
      <el-tree
        :data="roleTree"
        show-checkbox
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="editList">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹出框结束 -->
    <!-- 添加角色弹框 -->
    <el-dialog title="添加角色" :visible.sync="isAdd" width="50%">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAdd">取 消</el-button>
        <el-button type="primary" @click="addRole('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色弹框结束 -->
    <!-- 编辑角色弹框 -->
    <el-dialog title="修改信息" :visible.sync="isEdit" @close="editClose('ruleForm')">
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="editRole('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色弹框结束 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-row :span="24">
          <el-button type="primary" @click="isAdd = true">添加角色</el-button>
        </el-row>
      </el-row>
      <el-table :data="rolesList" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item,index) in scope.row.children"
              :key="item.id"
              :class="['tgbotton','vcenter', index ===0?'bgtop':'']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item1,index1) in item.children"
                  :key="item1.id"
                  :span="5"
                  :class="['tgbotton','vcenter',index1 ===0?'bgtop':'']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item1.id)"
                    >{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row>
                      <el-col>
                        <el-tag
                          type="warning"
                          v-for="(item2) in item1.children"
                          :key="item2.id"
                          closable
                          @close="removeRightById(scope.row,item2.id)"
                        >{{item2.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editGet(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delRole(scope.row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="getRolesList(scope.row)"
            >修改权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 权限树信息
      roleTree: [],
      // 删除权限Id
      defKeys: [],
      // 分配权限弹框
      isRolesShow: false,
      // 添加角色弹框
      isAdd: false,
      // 修改角色弹框
      isEdit: false,
      // 当前角色id
      roleId: null,
      formLabelWidth: '80px',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesMes()
  },
  methods: {
    async getRolesMes() {
      // 获取角色信息
      const { data: infoList } = await this.$http.get('roles')
      if (infoList.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      } else {
        this.rolesList = infoList.data
      }
    },
    async removeRightById(role, itemId) {
      // 移除权限
      const Result = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (Result !== 'confirm') {
        return this.$message.info('取消了操作')
      } else {
        const { data: infoList } = await this.$http.delete(
          `roles/${role.id}/rights/${itemId}`
        )
        if (infoList.meta.status !== 200) {
          return this.$message.error(infoList.meta.msg)
        }
        this.$message.success(infoList.meta.msg)
        role.children = infoList.data
      }
    },
    cancel() {
      // 取消按钮
      this.isRolesShow = false
      this.isEdit = false
      this.isAdd = false
    },
    async getRolesList(role) {
      // 获取弹框中的树形结构
      this.roleId = role.id
      const { data: infoList } = await this.$http.get('rights/tree')
      if (infoList.meta.status !== 200) {
        return this.$message.error(infoList.meta.msg)
      }
      this.roleTree = infoList.data
      this.getLeafKeys(role, this.defKeys)
      this.isRolesShow = true
    },
    getLeafKeys(node, arr) {
      // 递归所选中的权限id
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setDefKeys() {
      // 在弹出框被关闭时触发事件----清空递归id的数组
      this.defKeys = []
    },
    async editList() {
      // 修改角色权限
      const arr = [
        ...this.$refs['treeRef'].getCheckedKeys(),
        ...this.$refs['treeRef'].getHalfCheckedKeys()
      ]
      const idStr = arr.join(',')
      const { data: infoList } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (infoList.meta.status !== 200) {
        return this.$message.error(infoList.meta.msg)
      }
      this.$message.success(infoList.meta.msg)
      this.isRolesShow = false
      this.getRolesMes()
    },
    delRole(role) {
      // 删除角色
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: infoList } = await this.$http.delete(`roles/${role.id}`)
          if (infoList.meta.status !== 200) {
            return this.$message.error(infoList.meta.msg)
          }
          this.$message.success(infoList.meta.msg)
          this.getRolesMes()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addRole(rule) {
      // 添加角色
      this.$refs[rule].validate(async value => {
        if (value) {
          const { data: infoList } = await this.$http.post('roles', this.form)
          if (infoList.meta.status !== 201) {
            return this.$message.error(infoList.meta.msg)
          }
          this.$refs[rule].resetFields()
          this.$message.success(infoList.meta.msg)
          this.getRolesMes()
          this.isAdd = false
        } else {
          return false
        }
      })
    },
    editGet(row) {
      this.form.roleName = row.roleName
      this.form.roleDesc = row.roleDesc
      this.roleId = row.id
      this.isEdit = true
    },
    editRole(rule) {
      this.$refs[rule].validate(async value => {
        if (value) {
          const { data: infoList } = await this.$http.put(
            `roles/${this.roleId}`,
            this.form
          )
          console.log(this.roleId)
          if (infoList.meta.status !== 200) {
            return this.$message.error(infoList.meta.msg)
          }
          this.getRolesMes()
          this.$message.success(infoList.meta.msg)
          this.isEdit = false
          this.$refs[rule].resetFields()
        } else {
          return false
        }
      })
    },
    editClose(rule) {
      // 清空修改获取的信息
      this.form.roleName = ''
      this.form.roleDesc = ''
    }
  }
}
</script>

<style>
.el-tag {
  margin: 12px;
}
.tgtop {
  border-top: 1px solid #eee;
}
.tgbotton {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
