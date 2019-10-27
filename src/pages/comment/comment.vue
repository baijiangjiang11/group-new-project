<template>
  <div class="comment">
    <!-- 按钮 -->
    <div>
      <el-button size="small" type="primary" @click="toAddHandler">添加</el-button>
      <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <div v-loading="loading">
      <el-table :data="comments" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="content" label="评论内容" />
        <el-table-column prop="commentTime" label="评论时间" />
        <el-table-column prop="orderId" label="订单Id" />
        <el-table-column label="操作">
          <template #default="record">
            <i class="el-icon-delete" href="" @click.prevent="deleteHandler(record.row.id)" /> &nbsp;
            <i class="el-icon-edit-outline" href="" @click.prevent="editHandler(record.row)" /> &nbsp;
            <a href="" @click.prevent="toDetailsHandler(record.row)">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="visible" @close="dialogCloseHandler">
      <el-form ref="commentForm" :model="comment" :rules="rules">
        <el-form-item label="评论内容" label-width="100px" prop="content">
          <el-input v-model="comment.content" auto-complete="off" />
        </el-form-item>
        <el-form-item label="评论时间" label-width="100px" prop="commentTime">
          <el-input v-model="comment.commentTime" auto-complete="off" />
        </el-form-item>
        <el-form-item label="订单Id" label-width="100px" prop="orderId">
          <el-input v-model="comment.orderId" auto-complete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeModal">取 消</el-button>
        <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      comment: {},
      ids: [],
      rules: {
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        commentTime: [
          { required: true, message: '请输入评论时间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('comment', ['comments', 'visible', 'title', 'loading']),
    ...mapGetters('comment', ['orderComment', 'commentSize'])
  },
  created() {
    this.findAllComments()
  },
  methods: {
    ...mapMutations('comment', ['showModal', 'closeModal', 'setTitle']),
    ...mapActions('comment', ['findAllComments', 'saveOrUpdateComment', 'deleteCommentById', 'batchDeleteComment']),
    // 普通方法
    toDetailsHandler(comment) {
      // 跳转到详情页面
      // this.$router.push("/commentDetails")
      this.$router.push({
        path: '/comment/details',
        query: { id: comment.id }
      })
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      // 1. 重置表单
      this.comment = {}
      this.setTitle('添加评论信息')
      // 2. 显示模态框
      this.showModal()
    },
    submitHandler() {
      // 校验
      this.$refs.commentForm.validate((valid) => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateComment(this.comment)
          promise.then((response) => {
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({ type: 'success', message: response.orderIdText })
          })
        } else {
          return false
        }
      })
    },
    dialogCloseHandler() {
      this.$refs.commentForm.resetFields()
    },
    editHandler(row) {
      this.comment = row
      this.setTitle('修改评论信息')
      this.showModal()
    },
    deleteHandler(id) {
      this.deleteCommentById(id)
        .then((response) => {
          this.$message({ type: 'success', message: response.orderIdText })
        })
    },
    batchDeleteHandler() {
      this.batchDeleteComment(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.orderIdText })
        })
    }

  }

}
</script>
<style scoped>

</style>
