import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    customers: {
      list: []
    },
    visible: false,
    title: '添加顾客信息'
  },
  getters: {

  },
  mutations: {
    refreshCustomer(state, customers) {
      state.customers = customers
    },
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    setTitle(state, title) {
      state.title = title
    }

  },
  actions: {
    // 分页查询数据
    async findqueryCustomer(context, param) {
      // 1.ajax查询
      const response = await post('/customer/query', param)
      // 2.将查询结果更新到state中
      context.commit('refreshCustomer', response.data)
    },
    // 删除
    async  deleteCustomerHandler(context, id) {
      const response = await request.get('/customer/deleteById?id=' + id)
      context.dispatch('findqueryCustomer')
      return response
    },
    // 保存或更新
    async saveOrUpdateCustomer({ commit, dispatch }, playload) {
      const response = await post('/customer/saveOrUpdate', playload)
      // 刷新页面
      dispatch('findqueryCustomer')
      // 关闭模态框
      commit('closeModal')
      // 提示
      return response
    },
    // 批量删除
    async batchDeleteCustomer(context, ids) {
      const response = await post_array('/customer/batchDelete', { ids })
      // 分发
      context.dispatch('findqueryCustomer')
      // 返回结果
      return response
    }
  }
}
