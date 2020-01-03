<template>
  <div>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑地址" :visible.sync="isShowEdit" @close="clearForm('addressRef')">
      <el-form :model="addressForm" :rules="rules" ref="addressRef">
        <el-form-item label="省市区/县" prop="address1" :label-width="laberwidth">
          <el-cascader :options="cityData" v-model="addressForm.address1" expand-trigger="hover"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2" :label-width="laberwidth">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEdit = false">取 消</el-button>
        <el-button type="primary" @click="isShowEdit = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹出框结束 -->
    <!-- 查询物流弹出框 -->
    <el-dialog title="物流进度" :visible.sync="isProgressShow">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressList"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!-- 查询无聊弹出框结束 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table border :data="orderList">
        <el-table-column align="center" type="index" label="#" width="55"></el-table-column>
        <el-table-column align="center" label="订单编号" prop="order_number" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="订单价格" prop="order_price" width="80"></el-table-column>
        <el-table-column align="center" label="是否付款" prop="pay_status" width="80">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="danger" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否发货" prop="is_send" width="80"></el-table-column>
        <el-table-column align="center" label="下单时间" width="220">
          <template slot-scope="scope">{{scope.row.update_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="isShowEdit = true"></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="findProgressMes"></el-button>
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
import cityData from '@/views/order/citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        total: 0
      },
      laberwidth: '90px',
      orderList: [],
      isShowEdit: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      cityData,
      isProgressShow: false,
      rules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      // 获取订单列表
      const { data: infoList } = await this.$http.get(`orders`, {
        params: this.queryInfo
      })
      if (infoList.meta.status !== 200) {
        return this.$message.error(infoList.meta.msg)
      }
      this.orderList = infoList.data.goods
      this.queryInfo.total = infoList.data.total
    },
    handleSizeChange(size) {
      // 每页条数改变的回调函数
      this.queryInfo.pagesize = size
      this.getOrderList()
    },
    handleCurrentChange(num) {
      // 当前页改变的回调函数
      this.queryInfo.pagenum = num
      this.getOrderList()
    },
    clearForm(ref) {
      this.$refs[ref].resetFields()
    },
    async findProgressMes() {
      const { data: infoList } = await this.$http.get('/kuaidi/1106975712662')
      console.log(infoList)
      if (infoList.meta.status !== 200) {
        return this.$message.error(infoList.meta.msg)
      }
      this.progressList = infoList.data
      this.isProgressShow = true
    }
  }
}
</script>

<style>
.el-table {
  margin: 10px 0;
}
.el-cascader {
  width: 100%;
}
</style>
