import request from '@/utils/request'
import {post,post_array} from '@/utils/request'
export default {
  namespaced:true,
  state:{
    addresses:[],
    visible:false,
    title:"添加顾客信息"
  },
  getters:{
    addressSize(state){
      return state.addresses.length;
    },
    orderAddress:(state)=>{
      return function(flag){
        state.addresses.sort((a,b)=>{
          if(a[flag] > b[flag]){
            return -1;
          } else {
            return 1;
          }
        })
        return state.addresses;
      }
    }
  },
  mutations:{
    showModal(state){
      state.visible = true;
    },
    closeModal(state){
      state.visible = false;
    },
    refreshAddresses(state,addresses){
      state.addresses = addresses;
    },
    setTitle(state,title){
      state.title = title;
    }
  },
  actions:{
    async batchDeleteAddress(context,ids){
      // 1. 批量删除
      let response = await request.post("/address/batchDelete",{ids})
      // 2. 分发
      context.dispatch("findAllAddresses");
      // 3. 返回结果
      return response;
    },
    async deleteAddressById(context,id){
      let response = await request.get("/address/deleteById?id="+id);
      context.dispatch("findAllAddresses");
      return response;
    },
    async findAllAddresses(context){
      // 1. ajax查询
      let response = await request.get("/address/findAll");
      console.log(response);
      // 2. 将查询结果更新到state中
      context.commit("refreshAddresses",response.data);
    },
    // payload 顾客信息
    async saveOrUpdateAddress({commit,dispatch},payload){
      // 1. 保存或更新
      let response = await request.post("/address/saveOrUpdate",payload)
      // 2. 刷新页面
      dispatch("findAllAddresses");
      // 3. 关闭模态框
      commit("closeModal");
      // 4. 提示
      return response;
    }
  }
}