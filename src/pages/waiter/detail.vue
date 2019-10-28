<template>
  <div class="detail">
    <div>
      姓名
      <span>{{ waiter.realname }}</span>
    </div>
    <div>
      密码
      <span>{{ waiter.password }}</span>
    </div>
    <div>
      状态
      <span>{{ waiter.status }}</span>
    </div>
    <div>
      性别
      <span>{{ waiter.gender }}</span>
    </div>
    <div>
      电话
      <span>{{ waiter.telephone }}</span>
    </div>
    <div>
      注册时间
      <span>{{ waiter.registerTime }}</span>
    </div>
    <div>
      分数
      <span>{{ waiter.score }}</span>
    </div>
    <div>
      订单数量
      <span>{{ waiter.orderQuantity }}</span>
    </div>
    <div>
      idCard
      <span>{{ waiter.idCard }}</span>
    </div>
    <div>
      idcardPhotoPositive
      {{ idcardPhotoPositive }}
    </div>
    <div>
      银行卡
      {{ bankCard }}
    </div>
    <div>
      银行卡照片
      {{ bankCardPhoto }}
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      waiter: {}
    }
  },
  // 数据加载完毕
  created() {
    this.getParams()
  },
  // 页面加载完毕
  mounted() {

  },
  methods: {
    getParams() {
      this.waiter = this.$route.query.waiter
    }

  }
}
</script>
<style scoped>

</style>
