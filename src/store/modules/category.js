import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    categories: [],
    visible: false,
    title: '添加顾客信息',
    loading: false
  },
  getters: {
    categorySize(state) {
      return state.categories.length
    },
    orderCategory: (state) => {
      return function(flag) {
        state.categories.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.categories
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
    refreshCategories(state, categories) {
      state.categories = categories
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
    async batchDeleteCategory(context, ids) {
      // 1. 批量删除
      const response = await post_array('/category/batchDelete', { ids })
      // 2. 分发
      context.dispatch('findAllCategories')
      // 3. 返回结果
      return response
    },
    async deleteCategoryById(context, id) {
      const response = await request.get('/category/deleteById?id=' + id)
      context.dispatch('findAllCategories')
      return response
    },
    async findAllCategories({ dispatch, commit }) {
      // 1. ajax查询
      commit('beginLoading')
      const response = await request.get('/category/findAll')
      // 2. 将查询结果更新到state中
      commit('refreshCategories', response.data)
      setTimeout(() => {
        commit('endLoading')
      }, 1000)
    },
    // payload 顾客信息
    async saveOrUpdateCategory({ commit, dispatch }, payload) {
      // 1. 保存或更新
      const response = await post('/category/saveOrUpdate', payload)
      // 2. 刷新页面
      dispatch('findAllCategories')
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    }
  }
}
