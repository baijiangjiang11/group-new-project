import request, { post, post_array } from '@/utils/request'
export default {
  namespaced: true,
  state: {
    motaikuang: false,
    comments: [],
    orders: [],
    title: '添加评论信息'
  },
  mutations: {
    openModel(state, title) {
      state.motaikuang = true
      state.title = '添加评论信息'
    },
    closeModel(state) {
      state.motaikuang = false
    },
    // 需要接受一个参数，这个参数就是comments
    shuaxincomments(state, comments) {
      state.comments = comments
    },
    shuaxinorders(state, orders) {
      state.orders = orders
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  getters: {
    countcomments: (state) => {
      return state.comments.length
    },
    // 需要为获取器传递参数的写法
    commentstatusFilter: (state) => {
      return function(status) {
        if (status) {
          return state.comments.filter(item => item.status === status)
        } else {
          return state.comments
        }
      }
    }
  },
  actions: {
    // 1. 渲染数据
    async findAllcomments(context) {
      // 查询所有评论信息
      const response = await request.get('http://47.94.253.39:6677/comment/findAll')
      // 将查到的评论信息设置到state.comments中
      context.commit('shuaxincomments', response.data)
    },
    // 1. 渲染数据
    async findAllorders(context) {
      // 查询所有评论信息
      const response = await request.get('http://47.94.253.39:6677/order/findAll')
      // 将查到的评论信息设置到state.comments中
      context.commit('shuaxinorders', response.data)
    },
    // 2. 删除数据
    async deletecomments({ dispatch }, id) {
      // 删除数据
      const response = await request.get('http://47.94.253.39:6677/comment/deleteById?id=' + id)
      // 刷新页面
      dispatch('findAllcomments')
      // 提示成功
      return response
    },
    // 3. 保存更新数据
    async saveOrUpdatecomments({ dispatch, commit }, data) {
      // 提交保存或更新请求
      const response = await post('http://47.94.253.39:6677/comment/saveOrUpdate', data)
      // 关闭模态框
      commit('closeModel')
      // 更新数据
      dispatch('findAllcomments')
      // 提示成功 react
      return response
    },
    async batchdeletecomments(context, ids) {
      const response = await post_array('http://47.94.253.39:6677/comment/batchDelete', { ids })
      context.dispatch('findAllcomments')
      return response
    }
  }
}
