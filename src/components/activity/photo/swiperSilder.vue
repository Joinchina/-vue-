<template>
  <div>
    <div class="swiper-slide">
      <img :src = "itemurl" class = "imageFullScreen"/>
      <input type = "hidden" :value = "content" class="content_h"/>
      <input type = "hidden" :value = "praise" class="praise_h"/>
      <input type = "hidden" :value = "avatar" class="avatar_h"/>
      <input type = "hidden" :value = "name" class="name_h"/>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
     // url:"/photowall/getPictureList.json",

    }
  },
  props: ["itemurl","content","praise","avatar","name"],
}
</script>
<style type="text/css" scoped="">

</style>
