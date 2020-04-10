<template>
    <div class="empty_box">
        <div class="empty">
            <img src="../../assets/img/clazz/emptyState.png" class="emptyStateImg">
		    <p class="emptyStateText">{{emptytext}}</p>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            
        }
    },
    props:['emptytext'],

}
</script>
<style lang="less" scoped>
.empty_box{
    width: 100%;
    overflow: hidden;
    .empty{
        background-color: #ffffff;
        overflow: hidden;
        .emptyStateImg{
            width: 120px;
            height: 140px;
            margin: 0 auto;
            margin-top: 80px;
            display: block;
        }
        .emptyStateText{
            margin-top: 20px;
            margin-bottom: 16px;
            text-align: center;
            font-size: 16px;
            color: #999999;
        }
    }
}
</style>


