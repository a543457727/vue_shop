<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearInput">
            <el-button slot="append" icon="el-icon-search" @click="getTableMes" />
          </el-input>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableMes" border>
        <el-table-column align="center" type="index" :index="indexMethod" label="#" width="50"></el-table-column>
        <el-table-column align="center" label="商品名称" prop="goods_name" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="商品价格(元)" prop="goods_price" width="120"></el-table-column>
        <el-table-column align="center" label="商品重量" prop="goods_weight" width="100"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="upd_time" width="180">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="goEditpage(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="delMes(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        // 分页相关参数
        query: '',
        pagenum: 1,
        pagesize: 10,
        total: 0
      },
      tableMes: [] // 遍历商品列表
    }
  },
  created() {
    this.getTableMes()
  },
  methods: {
    async getTableMes() {
      const { data: infoList } = await this.$http.get(`goods`, {
        params: this.queryInfo
      })
      this.tableMes = infoList.data.goods
      if (infoList.meta.status !== 200) {
        return this.$message.error(infoList.meta.status)
      }
      this.queryInfo.total = infoList.data.total
    },
    handleSizeChange(val) {
      // 每页页数发生变化时
      this.queryInfo.pagesize = val
      this.getTableMes()
    },
    handleCurrentChange(val) {
      // 当前页发生变化时回调的方法
      this.queryInfo.pagenum = val
      this.getTableMes()
    },
    indexMethod(index) {
      // 自定义索引方法
      return (this.queryInfo.pagenum - 1) * 10 + index + 1
    },
    clearInput() {
      // 清空输入框后回调函数
      this.getTableMes()
    },
    delMes(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: infoList } = await this.$http.delete(`goods/${id}`)
          if (infoList.meta.status !== 200) {
            return this.$http.error(infoList.meta.msg)
          }
          this.getTableMes()
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
    goAddpage() {
      this.$router.push('/goods/add')
    },
    goEditpage(rowMes) {
      this.$router.push('/goods/edit/' + rowMes.goods_id)
    }
  }
}
</script>

<style scoped>
.el-table {
  font-size: 15px;
  margin: 12px 0;
}
</style>
