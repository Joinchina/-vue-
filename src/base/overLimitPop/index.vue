<template>
<el-dialog :class="{'dialog-form':true, 'w-wang':true, vipFuncPop:true}" :visible.sync="overLimitDialog" :close-on-click-modal=false :before-close="closeCreate">
    <div :class="{chargeBox:true}">
        <article class="modileArticle">
            <p class="title">尊敬的用户，您好！</p>
            <p class="detailText">{{text}}。如有疑问请联系：</p>
            <p class="attchPeople">
                <span>高老师：13301068776</span>
                <span>刘老师：18601250775</span>
            </p>
            
            <a href="javascript:;"  class="linkto" @click="linkUrl">
                <em class="aboutUs">
                    点此了解如何{{footerText}}
                </em>
            </a>
            
        </article>
    </div>
</el-dialog>
</template>

<script>
    export default {
        data () {
            return {
                dialogPreview: true,
                vipInfo : {},
            }
        },
        props:["overLimitDialog" , "text" , "footerText" , "param"],
        created(){
            this.vipInfo = this.$store.getters.getOrgVipInfo;
        },
        mounted(){
            //document.querySelector('.chargeBox').setAttribute('style',"height: "+document.documentElement.clientHeight+"px");
        },
        methods:{
            open() {
                this.dialogPreview=true;
            },
            closeCreate () {
                this.$emit("update:overLimitDialog" , false);
            },
            linkUrl () {
                let path = this.$router.resolve({
                    path: "/orgAccount/dealFunc",
                    query: {orgId:this.vipInfo.id,type:this.param},
                });
                window.open(path.href, '_blank');
            },
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
            text-align: center;
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
