<template>
    <div class="back">
        <a href="javascript:;" @click="goup" v-if="!type">
            <i class="icon-goback"></i>
            当前： {{passtitle}}
        </a>
        <a href="javascript:;" @click="goup" v-else>
            <i class="icon-goback"></i>
            {{passtitle}}
        </a>
    </div>
</template>
<script>
export default {
    methods:{
        goup(){
            if(!!this.path) {
                console.log(this.query);
                this.$router.push({
                    path: this.path,
                    query: this.query
                })
            } else {
                this.$router.back(-1);
            }
            
        },
    },
   props:['passtitle', 'path', 'query', 'type']
}   
</script>

<style lang="less" scoped>
.back{
    display: inline-block;
    // width: 300px;
    height: 40px;
    .icon-goback {
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url("../../assets/img/icon/icon-goback.png") 0 0 no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 3px;
    }
    a{
        font-size: 14px;
        color: #666666;
        line-height: 40px;
    }
}
</style>
