<template>
  <div class="product_Details">
    <el-button size="small" type="text" @click="backHandler">返回</el-button>
    <p><strong>产品名称：</strong>{{ product.name }}</p>
    <p><strong>产品单价：</strong>{{ product.price }}</p>
    <p><strong>产品介绍：</strong>{{ product.details }}</p>
    <p><strong>产品主图：</strong>
      <img :src="product.photo" alt="">
    </p>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      activeName: 'info'
    }
  },
  created() {
    const id = this.$route.query.id
    console.log(id)
    // 通过id查询产品详细信息
    this.findProductById(id)
  },
  computed: {
    ...mapState('product', ['product'])
  },
  methods: {
    ...mapActions('product', ['findProductById']),
    backHandler() {
      // this.$router.push("/customer")
      this.$router.go(-1)
    }
  }

}
</script>
<style scoped>

</style>
