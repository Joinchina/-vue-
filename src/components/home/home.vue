<template>
    <div class="home">
        <!-- <v-head></v-head> -->
      
        <transition name="move" mode="out-in"><router-view></router-view></transition>

    </div>
</template>

<script>
    // import vHead from 'components/header/header';
    import storage from '@/global/storage'
    export default {
        data:function () {
            return {
              flag:true
            }
        },
        created() {

            //console.log("homeuemian");
            // 判断是否登录状态（备注，否则访问home直接显示页面）
            let name = storage.get("exp_name");
            let role = storage.get("exp_role");
            let token_json = storage.get("exp_token_json");

            // console.log("home",role);
            if (!name && !role && !token_json){
                this.$router.push('/login');
            }

        },
        components:{
            // vHead
        }
    }
</script>
<style>

</style>
