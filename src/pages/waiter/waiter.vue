<template>
  <div class="waiter">
    <h2>服务员管理</h2>
    <!-- 按钮 -->
    <div class="btns">
      <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
      <el-button type="danger" size="small" @click="batchDeleteHandler">批量删除</el-button>
    </div>
    <!-- 表单 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="waiterForm" :model="form" :rules="rules">
        <el-form-item label="姓名" label-width="100px" prop="realname">
          <el-input v-model="form.realname" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="status">
          <el-input v-model="form.status" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" label-width="100px" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" label-width="100px" prop="telephone">
          <el-input v-model="form.telephone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="注册时间" label-width="100px" prop="registerTime">
          <el-input v-model="form.registerTime" autocomplete="off" />
        </el-form-item>
        <el-form-item label="分数" label-width="100px" prop="score">
          <el-input v-model="form.score" autocomplete="off" />
        </el-form-item>
        <el-form-item label="订单数量" label-width="100px" prop="orderQuantity">
          <el-input v-model="form.orderQuantity" autocomplete="off" />
        </el-form-item>
        <el-form-item label="idCard" label-width="100px" prop="idCard">
          <el-input v-model="form.idCard" autocomplete="off" />
        </el-form-item>
        <el-form-item label="idcardPhotoPositive" label-width="100px" prop="idcardPhotoPositive">
          <el-input v-model="form.idcardPhotoPositive" autocomplete="off" />
        </el-form-item>
        <el-form-item label="银行卡" label-width="100px" prop="bankCard">
          <el-input v-model="form.bankCard" autocomplete="off" />
        </el-form-item>
        <el-form-item label="银行卡照片" label-width="100px" prop="bankCardPhoto">
          <el-input v-model="form.bankCardPhoto" autocomplete="off" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button type="primary" size="small" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="Waiters.list" size="small" @selection-change="idsChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="realname" label="姓名" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="gender" label="性别" />
      <!-- <el-table-column prop="idCard" label="idcard"></el-table-column> -->
      <el-table-column prop="telephone" label="电话" />
      <el-table-column label="操作" width="100px" align="center">
        <template #default="record">
          <a href="" class="el-icon-delete" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
          <a href="" class="el-icon-edit-outline" @click.prevent="editHandler(record.row)" /> &nbsp;
          <a href="" @click.prevent="toDetailhandler(record.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :current-page="Waiters.page+1"
      :page-size="Waiters.pageSize"
      :total="Waiters.total"
      @current-change="pagechangeHandler"
    />
    <!--/分页 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      ids: [],
      form: {

      },
      gender: '男',
      rules: {
        realname: [
          { required: true, message: '请输入服务员名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.findAllWaiters(this.params)
  },
  computed: {
    ...mapState('waiter', ['Waiters', 'visible', 'title', 'params']),
    ...mapGetters('waiter', ['countWaiters', 'waiterStatusFilter'])
    // 普通属性

  },
  methods: {
    ...mapActions('waiter', ['findAllWaiters', 'deletewaiterById', 'saveOrUpdatewaiter', 'batchDeleteWaiters']),
    ...mapMutations('waiter', ['showModal', 'closeModal', 'setTitle']),
    // 普通方法
    toDetailhandler(waiter) {
      this.$router.push({
        path: '/waiter/Detail',
        query: { waiter: waiter }
        // params:{id:1}
      })
    },
    batchDeleteHandler() {
      this.batchDeleteWaiters(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.statusText })
        })
    },
    idsChangeHandler(val) {
      this.ids = val.map(item => item.id)
    },
    dialogCloseHandler() {
      this.$refs.waiterForm.clearValidate()
    },
    toAddHandler() {
      this.form = {}
      this.setTitle('添加服务员信息')
      this.showModal()
    },
    submitHandler() {
      // 1.表单验证
      this.$refs.waiterForm.validate((valid) => {
        if (valid) {
          // 2.提交表单
          this.saveOrUpdatewaiter(this.form)
            .then((response) => {
              this.$message({ type: 'success', message: response.statusText })
            })
        } else {
          return false
        }
      })
    },
    deleteHandler(id) {
      const promise = this.deletewaiterById(id)
      promise.then((response) => {
        this.$message({ type: 'success', message: response.statusText })
      })
    },
    editHandler(row) {
      this.form = row
      this.setTitle('修改服务员信息')
      this.showModal()
    },
    pagechangeHandler(currentPage) {
      this.params.page = currentPage - 1
      this.findAllWaiters(this.params)
    }
  }
}
</script>
<style scoped>

</style>
