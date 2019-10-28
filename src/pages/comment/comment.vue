<template>
  <div class="comment">
    <h2>评论管理</h2>
    <div class="btns">
      <el-row>
        <!-- 左侧搜索 -->
        <!-- <el-col :span="21">
					<el-form :inline="true">
						<el-form-item>
							<el-input v-model="params.name" placeholder="请输入关键字"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button @click="initData">搜索</el-button>
						</el-form-item>
					</el-form>
				</el-col> -->
        <!-- /左侧搜索 -->
        <!-- 右侧按钮 -->
        <el-col :span="15">
          <el-button type="primary" size="mini" @click.prevent="openModel">添加</el-button>
          <el-button type="danger" size="mini" @click.prevent="batchdeleteHandler">批量删除</el-button>
        </el-col>
        <!-- /右侧按钮 -->
      </el-row>
    </div>
    <el-table :data="comments" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="编号" />
      <el-table-column prop="content" label="评论内容" />
      <el-table-column prop="commentTime" label="评论时间" />
      <el-table-column prop="orderId" label="订单号" />
      <el-table-column label="操作">
        <template v-slot:default="a">
          <el-button size="mini" @click.prevent="editHandler(a.row)">修改</el-button>
          <el-button size="mini" type="danger" @click.prevent="deleteHandler(a.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模态框 -->
    <el-dialog :title="title" :visible.sync="motaikuang" @close="guanbinmtk">
      <el-form ref="commentForm" :model="form" :rules="rules">
        <el-form-item label="评论内容" label-width="100px" prop="realname">
          <el-input v-model="form.content" autocomplete="off" />
        </el-form-item>
        <el-form-item label="评论时间" label-width="100px" prop="telephone">
          <el-input v-model="form.commentTime" autocomplete="off" />
        </el-form-item>
        <el-form-item label="订单号" label-width="100px">
          <el-select v-model="form.orderId" placeholder="请选择订单号">
            <el-option v-for="item in orders" :key="item" :label="item.id" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="订单号" label-width="100px" prop="password">
		      <el-input v-model="form.password" autocomplete="off"></el-input>
		    </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.prevent="closeModel">取 消</el-button>
        <el-button type="primary" @click.prevent="submitHandler">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /模态框 -->
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      ids: [],
      form: {},
      ruleForm: {
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
            		{ min: 2, message: '长度至少为 2 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('comment', ['motaikuang', 'comments', 'title', 'orders']),
    ...mapGetters('comment', ['countcomments', 'commentstatusFilter'])
  },
  methods: {
    ...mapActions('comment', ['findAllcomments', 'findAllorders', 'deletecomments', 'saveOrUpdatecomments', 'batchdeletecomments']),
    ...mapMutations('comment', ['openModel', 'closeModel', 'setTitle']),
    guanbinmtk() {
      this.$refs.commentForm.clearValidate()
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    batchdeleteHandler() {
      this.batchdeletecomments(this.ids)
        .then((response) => {
          this.$message({
            type: 'success',
            message: response.statusText
          })
        })
    },
    submitHandler() {
      this.$refs.commentForm.validate((valid) => {
        if (valid) {
          this.saveOrUpdatecomments(this.form)
            .then((response) => {
              this.$message({
                type: 'success',
                message: response.statusText
              })
            })
        } else {
          return false
        }
        this.findAllcomments()
        this.form = {}
      })
    },
    editHandler(row) {
      this.form = row
      this.openModel()
      this.setTitle('修改评论信息')
    },
    deleteHandler(id) {
      const promise = this.deletecomments(id)
      promise.then((response) => {
        this.$message({
          type: 'success',
          message: response.statusText
        })
      })
    }
  },
  created() {
    this.findAllcomments()
    this.findAllorders()
  }
}
</script>
<style scoped>

</style>
