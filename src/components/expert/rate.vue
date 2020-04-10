<template>
<div class="ratestar">
  <el-rate
        v-model="ratedata"
        disabled
        show-score
        text-color="#ff9900"
        :colors="['#FD7E23','#FD7E23','#FD7E23']"
        score-template="{value}">
    </el-rate>
</div>    
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    props:['ratedata'],
    mounted(){
      
    },
    methods:{
       
    }
  }
</script>
<style lang="less" scope>
.ratestar{
  .el-rate__icon {
      font-size:14px;
  }
  .el-rate__text{
      font-size:12px;
  }
}
</style>

