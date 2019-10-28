import request from '@/utils/request'
import { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    addresses: {
      list: []
    },
    customers: [],
    visible: false,
    title: '添加顾客信息'
  },
  getters: {
    addressSize(state) {
      return state.addresses.length
    },
    orderAddress: (state) => {
      return function(flag) {
        state.addresses.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.addresses
      }
    }
  },
  mutations: {
    refreshAddress(state, addresses) {
      state.addresses = addresses
    },
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    refreshCustomers(state, customers) {
      state.customers = customers
    },
    setTitle(state, title) {
      state.title = title
    },
    pageChangeHandler(state, params, currentPage) {
      console.log(params.page)
    }

  },
  actions: {
    async findAllCustomers({ dispatch, commit }) {
      // 1. ajax查询
      const response = await request.get('/customer/findAll')
      // 2. 将查询结果更新到state中
      commit('refreshCustomers', response.data)
    },
    // 分页查询数据
    async findqueryAddress(context, param) {
      // 1.ajax查询
      const response = await post('/address/query', param)
      // 2.将查询结果更新到state中
      context.commit('refreshAddress', response.data)
    },
    // 删除
    async  deleteAddressHandler(context, id) {
      const response = await request.get('/address/deleteById?id=' + id)
      context.dispatch('findqueryAddress')
      return response
    },
    // 保存或更新
    async saveOrUpdateAddress({ commit, dispatch }, playload) {
      const response = await post('/address/saveOrUpdate', playload)
      // 刷新页面
      dispatch('findqueryAddress')
      // 关闭模态框
      commit('closeModal')
      // 提示
      return response
    },
    // 批量删除
    async batchDeleteAddress(context, ids) {
      const response = await post_array('/address/batchDelete', { ids })
      // 分发
      context.dispatch('findqueryAddress')
      // 返回结果
      return response
    }
  }
}
