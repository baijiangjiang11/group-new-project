<template>
  <div class="address">
    <!-- 按钮 -->
    <el-row>
      <el-col :span="17">
        <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
      </el-col>
      <el-col :span="7">
        <el-form :inline="true">
          <el-form-item label="省份">
            <el-input v-model="param.province" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-button type="primary" @click="searchHandler">查询</el-button>
        </el-form>
      </el-col>
    </el-row>
    <!-- /按钮 -->
    <!-- 表格 -->
    <el-table :data="addresses.list" @selection-change="handlerSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="telephone" label="手机号" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="customerId" label="顾客id" />
      <el-table-column prop="area" label="地区" />
      <el-table-column label="操作">
        <template #default="record">
          <i class="el-icon-delete" href="" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
          <i class="el-icon-edit-outline" href="" @click.prevent="editorHandler(record.row)" /> &nbsp;
        </template>
      </el-table-column>
    </el-table>
    <!-- /表格 -->
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="addressForm" :model="address" :rules="rules">
        <el-form-item label="省份" label-width="100px" prop="province">
          <el-input v-model="address.province" auto-complete="off" />
        </el-form-item>
        <el-form-item label="市" label-width="100px" prop="city">
          <el-input v-model="address.city" auto-complete="off" />
        </el-form-item>
        <el-form-item label="地区" label-width="100px" prop="area">
          <el-input v-model="address.area" auto-complete="off" />
        </el-form-item>
        <el-form-item label="手机号" label-width="100px" prop="telephone">
          <el-input v-model="address.telephone" auto-complete="off" />
        </el-form-item>
        <el-form-item label="顾客id" label-width="100px">
          <el-select v-model="address.customerId" placeholder="请选择顾客id">
            <el-option v-for="c in customers" :label="c.id" :value="c.id" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
    <!-- 分页 -->
    <el-pagination
      small
      layout="prev, pager, next"
      :current-page="param.page+1"
      :page-size="param.pageSize"
      :total="addresses.total"
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
      address: {},
      ids: [],
      param: {
        name: '',
        page: 0,
        pageSize: 5
      },
      rules: {
        realname: [
          { required: false, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' }
        ],
        telephone: [
          { required: false, message: '请输入电话', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('address', ['addresses', 'visible', 'title', 'customers'])
  },
  created() {
    this.findqueryAddress(this.param)
    this.findAllCustomers()
  },
  methods: {
    ...mapMutations('address', ['pageChangeHandler', 'showModal', 'closeModal', 'setTitle']),
    ...mapActions('address', ['findAllCustomers', 'findqueryAddress', 'deleteAddressHandler', 'saveOrUpdateAddress', 'batchDeleteAddress']),
    // 跳转到详情页面
    toDetailsHandler(address) {
      this.$router.push({
        path: './Details',
        query: { id: address.id }
      })
    },
    // 删除
    deleteHandler(id) {
      this.deleteAddressHandler(id)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    // 提交
    submitHandler() {
      // 校验
      this.$refs.addressForm.validate((valid) => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateAddress(this.address)
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
      this.$refs.addressForm.resetFields()
    },
    editorHandler(row) {
      this.address = row
      this.setTitle('修改顾客信息')
      this.showModal()
    },
    toAddHandler() {
      // 重置表单
      this.address = {}
      this.setTitle('添加顾客信息')
      // 显示模态框
      this.showModal()
    },
    batchDeleteHandler() {
      this.batchDeleteAddress(this.ids)
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
      this.findqueryAddress(this.param)
    },
    searchHandler() {
      this.findqueryAddress(this.param)
    }
  }
}
</script>

<style>

</style>
