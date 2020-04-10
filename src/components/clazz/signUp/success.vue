<template>
    <div class="successBox">
        <p class="successText" v-if="!Boolean(popView)"><img src="../../../assets/img/clazz/singupSuccess.png" alt=""><span>报名开启成功！</span></p>
        <p class="hint">请将下方二维码或链接，下发给需要报名的各个单位，学员扫码填写后，信息会自动录入到系统。</p>
        <img :src="setInfo.qrcodeUrl" alt="加载失败" class="qrCode" ref="qrCode">
        <el-button class="downQrCode" @click="downQrCode">下载二维码</el-button>
        <span class="or">或</span>
        <p class="qrCodeLink"><span>{{linkUrl}}</span><el-button class="copyBtn" :data-clipboard-text="linkUrl">复制链接</el-button></p>
    </div>
</template>

<script>
    import html2canvas from 'html2canvas'
    import httpFetch from '@/model/clazz/signUp'
    import {getToken} from '@/filters/userVerify'
    export default {
        data(){
            return {
                linkUrl:"",
                setInfo:{},
            }
        },
        props:["popView"],
        created(){
            if(location.hostname.indexOf('mgr.shixunbao.cn')>-1){
                //正式环境
                this.linkUrl="https://m.shixunbao.cn/signUp?clazzId="+this.$route.query.clazzId;
            }else{
                //测试环境
                this.linkUrl="https://10.98.24.67:10003/signUp?clazzId="+this.$route.query.clazzId;
            }
            this.hasSetInfo();
        },
        mounted(){
            let clipboard  = new ClipboardJS(".copyBtn");
            clipboard.on('success', (e)=>{
                e.clearSelection();
                this.$message.success('已复制到剪切板');
            });
            clipboard.on('error', (e)=>{
                this.$message.error('操作失败，当前浏览器不支持复制功能');
            });
        },
        methods:{
            downQrCode(){
                httpFetch.getQrCode({clazzId : this.$route.query.clazzId,token:getToken()});    
            },
            copyToClipboard(e) {
                console.log(e.originalEvent);
                 var clip = null;
                function $(id) { return document.getElementById(id); }
                function init() {
                clip = new ZeroClipboard.Client();
                clip.setHandCursor(true); 
                clip.addEventListener('mouseOver', function (client) {
                // update the text on mouse over
                clip.setText( $('fe_text').value );
                });
                    
                clip.addEventListener('complete', function (client, text) {
                //debugstr("Copied text to clipboard: " + text );
                alert("该地址已经复制，你可以使用Ctrl+V 粘贴。");
                });
                clip.glue('clip_button', 'clip_container' );
                }
            },
            //获取班级已设置的信息
            hasSetInfo(init=true){
                let data ={
                    clazzId: this.$route.query.clazzId,
                    includeFields:true,
                }
                httpFetch.viewInfo(data,res=>{
                    console.log(res);
                    this.fetching=false;
                    if(res.status==200){
                        this.setInfo= res.data;
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
        },

        components:{
            
        },
    }
</script>

<style lang="less" scoped>
    .successBox{
        margin-bottom: 40px;
        .successText{
            text-align: center;
            font-size: 24px;
            color: #333333;
            img{
                width: 60px;
                height: 60px;
                vertical-align: middle;
                margin-right: 20px;
                margin-top: -10px;
            }
        }
        .hint{
            font-size: 16px;
            color: #333333;
            margin-top: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        .qrCode{
            width: 260px;
            height: 260px;
            display: block;
            margin: 0 auto;
        }
        .downQrCode{
            display: block;
            margin: 20px auto;
        }
        .or{
            display: block;
            font-size: 16px;
            color: #333333;
            text-align: center;
        }
        .qrCodeLink{
            text-align: center;
            .el-button{
                margin-left: 20px;
            }
        }
    }
    
</style>
