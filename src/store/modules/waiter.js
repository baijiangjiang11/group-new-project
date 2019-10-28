import request from '@/utils/request'
import { post, post_array } from '@/utils/request'

export default {
  namespaced: true,
  state: {
    visible: false,
    Waiters: [],
    title: '添加服务员信息',
    params: {
      page: 0,
      pageSize: 5
    }
  },
  getters: {

  },
  mutations: {
    showModal(state) {
      state.visible = true
    },
    closeModal(state) {
      state.visible = false
    },
    // 需要接受一个参数，这个参数就是Waiters
    refreshWaiters(state, Waiters) {
      state.Waiters = Waiters
    },
    setTitle(state, title) {
      state.title = title
    }
  },
  actions: {
    async batchDeleteWaiters(context, ids) {
      const response = await post_array('http://47.95.6.207:6677/waiter/batchDelete', { ids })
      context.dispatch('findAllWaiters')
      return response
    },
    // async findAllWaiters({commit,dispatch,getters,state}){
    async findAllWaiters({ dispatch, commit, state }) {
      // 1. 查询所有服务员信息
      const response = await post('http://47.95.6.207:6677/waiter/query', state.params)
      // 2. 将服务员信息设置到state.Waiters中
      commit('refreshWaiters', response.data)
    },
    async deletewaiterById({ dispatch }, id) {
      // 1. 删除服务员信息
      const response = await request.get('http://47.95.6.207:6677/waiter/deleteById?id=' + id)
      // 2. 刷新
      dispatch('findAllWaiters')
      // 3. 提示成功
      return response
    },
    async saveOrUpdatewaiter({ dispatch, commit }, waiter) {
      // 1. 提交请求
      const response = await post('http://47.95.6.207:6677/waiter/saveOrUpdate', waiter)
      // 2. 关闭模态
      commit('closeModal')
      // 3. 刷新页面
      dispatch('findAllWaiters')
      // 4. 提示成功 react
      return response
    }
  }
}
