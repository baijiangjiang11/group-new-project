import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    comments: [],
    visible: false,
    title: '添加评论信息',
    loading: false
  },
  getters: {
    commentSize(state) {
      return state.comments.length
    },
    orderComment: (state) => {
      return function(flag) {
        state.comments.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.comments
      }
    }
  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    refreshComments(state, comments) {
      state.comments = comments
    },
    setTitle(state, title) {
      state.title = title
    },
    beginLoading(state) {
      state.loading = true
    },
    endLoading(state) {
      state.loading = false
    }
  },
  actions: {
    async batchDeleteComment(context, ids) {
      // 1. 批量删除
      const response = await post_array('/comment/batchDelete', { ids })
      // 2. 分发
      context.dispatch('findAllComments')
      // 3. 返回结果
      return response
    },
    async deleteCommentById(context, id) {
      const response = await request.get('/comment/deleteById?id=' + id)
      context.dispatch('findAllComments')
      return response
    },
    async findAllComments({ dispatch, commit }) {
      // 1. ajax查询
      commit('beginLoading')
      const response = await request.get('/comment/findAll')
      // 2. 将查询结果更新到state中
      commit('refreshComments', response.data)
      setTimeout(() => {
        commit('endLoading')
      }, 1000)
    },
    // payload 评论信息
    async saveOrUpdateComment({ commit, dispatch }, payload) {
      // 1. 保存或更新
      const response = await post('/comment/saveOrUpdate', payload)
      // 2. 刷新页面
      dispatch('findAllComments')
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    }
  }
}
