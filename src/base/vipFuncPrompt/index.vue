<template>
<el-dialog :class="{'dialog-form':true, 'w-wang':true, vipFuncPop:true}" :visible.sync="vipFuncPrompt" :close-on-click-modal=false :before-close="closeCreate">
    <div :class="{chargeBox:true}">
        <article class="modileArticle">
            <p class="title">尊敬的用户，您好！</p>
            <p class="detailText">您所点击的功能为VIP用户的高级功能，暂不支持使用，如有疑问请联系：</p>
            <p class="attchPeople">
                <span>高老师：13301068776</span>
                <span>刘老师：18601250775</span>
            </p>
            <em class="aboutUs" @click="toKnowAbout">点此了解如何开通VIP高级功能</em>
        </article>
    </div>
</el-dialog>
</template>

<script>
    export default {
        data () {
            return {
                dialogPreview: true,
            }
        },
        props:["vipFuncPrompt"],
        created(){
            
        },
        mounted(){
            //document.querySelector('.chargeBox').setAttribute('style',"height: "+document.documentElement.clientHeight+"px");
        },
        methods:{
            open() {
                this.dialogPreview=true;
            },
            closeCreate () {
                this.dialogPreview=false;
                // this.$emit("update:vipFuncPrompt" , false);
                this.$store.state.vipFuncPopFalg = false;
            },
            toKnowAbout(){
                let data = this.$store.getters.getOrgVipInfo
                let originUrl = "https://10.98.24.67:10003";
                if( window.location.href.indexOf("mgr.shixunbao.cn")>-1 ){
                    originUrl = "https://m.shixunbao.cn";
                }
                window.open(`${originUrl}/difference?orgId=${data.id}&isVip=${Number(data.vip)}`)
            }
        }
    }
</script>

<style lang="less" scoped>
    .chargeBox{
        padding: 20px 0px 20px;
        .title{
            font-size: 18px;
            color: #333333;
            text-align: center;
            font-weight: bold;
        }
        .detailText{
            margin-top: 20px;
            font-size: 16px;
            color: #333333;
        }
        .attchPeople{
            span{
                margin-left: 70px;
                font-size: 16px;
                color: #333333;
            }
            margin: 20px 0 40px;
        }
        .aboutUs{
            font-size: 16px;
            color: #1077D7;
            text-decoration: underline;
            display: block;
            text-align: center;
            cursor: pointer;
        }
    }

</style>
<style lang="less">
    .vipFuncPop{
        .el-dialog{
            width: 600px;
            .el-dialog__header{
                height: 0px;
                padding: 0 0;
            }
            .el-dialog__body{
                padding: 30px 20px 30px 20px;
            }
        }
    }
</style>
