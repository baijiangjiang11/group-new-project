<template>
  <div class="customer">
    <!-- 按钮 -->
    <el-row>
      <el-col :span="17">
        <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>
      <el-col :span="7">
        <el-form :inline="true">
          <el-form-item label="顾客姓名">
            <el-input v-model="param.realname" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-button type="primary" @click="searchHandler">查询</el-button>
        </el-form>
      </el-col>
    </el-row>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table :data="customers.list" @selection-change="handlerSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="id" label="编号" align="center" />
      <el-table-column prop="realname" label="姓名" align="center" />
      <el-table-column prop="telephone" label="电话" align="center" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="status" label="状态" />
      <el-table-column label="详情">
        <template #default="scope">
          <a href="" @click.prevent="toDetailsHandler(scope.row)">查看</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template #default="scope">
          <i class="el-icon-delete" @click="deleteHandler(scope.row.id)" /> &nbsp;
          <i class="el-icon-edit-outline" @click="editorHandler(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="customerForm" :model="customer" :rules="rules">
        <el-form-item label="姓名" label-width="100px" prop="realname">
          <el-input v-model="customer.realname" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="customer.password" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="电话" label-width="100px" prop="telephone">
          <el-input v-model="customer.telephone" autocomplete="off" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button type="primary" size="small" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 分页 -->
    <el-pagination
      small
      layout="prev, pager, next"
      :current-page="param.page+1"
      :page-size="param.pageSize"
      :total="customers.total"
      @current-change="pageChangeHandler"
    />
    <!-- /分页 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      customer: {},
      ids: [],
      param: {
        name: '',
        page: 0,
        pageSize: 5
      },
      rules: {
        realname: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('customer', ['customers', 'visible', 'title'])
  },
  created() {
    this.findqueryCustomer(this.param)
  },
  methods: {
    ...mapMutations('customer', ['showModal', 'closeModal', 'setTitle']),
    ...mapActions('customer', ['findqueryCustomer', 'deleteCustomerHandler', 'saveOrUpdateCustomer', 'batchDeleteCustomer']),
    // 跳转到详情页面
    toDetailsHandler(customer) {
      this.$router.push({
        path: './Details',
        query: { id: customer.id }
      })
    },
    // 删除
    deleteHandler(id) {
      this.deleteCustomerHandler(id)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    // 提交
    submitHandler() {
      // 校验
      this.$refs.customerForm.validate((valid) => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateCustomer(this.customer)
          promise.then((response) => {
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({ type: 'success', message: response.statusText })
          })
        } else {
          return false
        }
      })
    },
    dialogCloseHandler() {
      this.$refs.customerForm.resetFields()
    },
    editorHandler(row) {
      this.customer = row
      this.setTitle('修改顾客信息')
      this.showModal()
    },
    toAddHandler() {
      // 重置表单
      this.customer = {}
      this.setTitle('添加顾客信息')
      // 显示模态框
      this.showModal()
    },
    batchDeleteHandler() {
      this.batchDeleteCustomer(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    handlerSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    // 分页查询
    pageChangeHandler(page) {
      this.param.page = page - 1
      this.findqueryCustomer(this.param)
    },
    searchHandler() {
      this.findqueryCustomer(this.param)
    }
  }
}
</script>

<style>

</style>
