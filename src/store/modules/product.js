import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    products: [],
    visible: false,
    title: '添加栏目信息',
    loading: false,
    product: {} // 当前产品信息
  },
  getters: {
    productSize(state) {
      return state.products.length
    },
    orderProduct: (state) => {
      return function(flag) {
        state.products.sort((a, b) => {
          if (a[flag] > b[flag]) {
            return -1
          } else {
            return 1
          }
        })
        return state.products
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
    refreshProducts(state, products) {
      state.products = products
    },
    setTitle(state, title) {
      state.title = title
    },
    beginLoading(state) {
      state.loading = true
    },
    endLoading(state) {
      state.loading = false
    },
    refreshProduct(state, product) {
      state.product = product
    }
  },
  actions: {
    // 通过id查询产品详细信息
    async findProductById(context, id) {
      const response = await request.get('/product/findById?id=' + id)
      context.commit('refreshProduct', response.data)
    },
    async batchDeleteProduct(context, ids) {
      // 1. 批量删除
      const response = await post_array('/product/batchDelete', { ids })
      // 2. 分发
      context.dispatch('findAllProducts')
      // 3. 返回结果
      return response
    },
    async deleteProductById(context, id) {
      const response = await request.get('/product/deleteById?id=' + id)
      context.dispatch('findAllProducts')
      return response
    },
    async findAllProducts({ commit }) {
      // 1. ajax查询
      commit('beginLoading')
      const response = await request.get('/product/findAll')
      // 2. 将查询结果更新到state中
      commit('refreshProducts', response.data)
      setTimeout(() => {
        commit('endLoading')
      }, 1000)
    },
    // payload 栏目信息
    async saveOrUpdateProduct({ commit, dispatch }, payload) {
      // 1. 保存或更新
      const response = await post('/product/saveOrUpdate', payload)
      // 2. 刷新页面
      dispatch('findAllProducts')
      // 3. 关闭模态框
      commit('closeModal')
      // 4. 提示
      return response
    }
  }
}
