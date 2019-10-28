<template>
  <div class="category">
    <!-- 按钮 -->
    <div>
      <el-button size="small" type="primary" @click="toAddHandler">添加</el-button>
      <el-button size="small" type="danger" @click="batchDeleteHandler">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <div v-loading="loading">
      <el-table :data="categories.list" size="mini" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="编号" align="center" />
        <el-table-column prop="name" label="栏目名称" align="center" />
        <el-table-column prop="num" label="序号" align="center" />
        <el-table-column label="图标" align="center">
          <template v-slot:default="record">
            <img :src="record.row.icon" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="parentId" label="父栏目" align="center" />
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
      <el-form ref="categoryForm" :model="category" :rules="rules">
        <el-form-item label="栏目名称" label-width="100px" prop="name">
          <el-input v-model="category.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="序号" label-width="100px" prop="num">
          <el-input v-model="category.num" auto-complete="off" />
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
      :total="categories.total"
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
      category: {},
      ids: [],
      param: {
        name: '',
        page: 0,
        pageSize: 5
      },
      rules: {
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入序号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('category', ['categories', 'visible', 'title', 'loading']),
    ...mapGetters('category', ['orderCategory', 'categorySize'])
  },
  created() {
    this.findqueryCategory(this.param)
  },
  methods: {
    ...mapMutations('category', ['pageChangeHandler', 'showModal', 'closeModal', 'setTitle']),
    ...mapActions('category', ['findqueryCategory', 'findAllCategories', 'saveOrUpdateCategory', 'deleteCategoryById', 'batchDeleteCategory']),
    // 普通方法
    toDetailsHandler(category) {
      // 跳转到详情页面
      // this.$router.push("/categoryDetails")
      this.$router.push({
        path: '/category/details',
        query: { id: category.id }
      })
    },
    handleSelectionChange(val) {
      this.ids = val.map(item => item.id)
    },
    toAddHandler() {
      // 1. 重置表单
      this.category = {}
      this.setTitle('添加栏目信息')
      // 2. 显示模态框
      this.showModal()
    },
    submitHandler() {
      // 校验
      this.$refs.categoryForm.validate((valid) => {
        // 如果校验通过
        if (valid) {
          const promise = this.saveOrUpdateCategory(this.category)
          promise.then((response) => {
            // promise为action函数的返回值，异步函数的返回值就是promise的then回调函数的参数
            this.$message({ type: 'success', message: response.parentIdText })
          })
        } else {
          return false
        }
      })
    },
    dialogCloseHandler() {
      this.$refs.categoryForm.resetFields()
    },
    editHandler(row) {
      this.category = row
      this.setTitle('修改栏目信息')
      this.showModal()
    },
    deleteHandler(id) {
      this.deleteCategoryById(id)
        .then((response) => {
          this.$message({ type: 'success', message: response.parentIdText })
        })
    },
    batchDeleteHandler() {
      this.batchDeleteCategory(this.ids)
        .then((response) => {
          this.$message({ type: 'success', message: response.parentIdText })
        })
    },
    // 分页查询
    pageChangeHandler(page) {
      this.param.page = page - 1
      this.findqueryCategory(this.param)
    }

  }
}
</script>
<style scoped>

</style>
