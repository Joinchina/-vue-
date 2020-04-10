<template>

        <el-dialog
            title="提示"
            :visible.sync="screenVisible"
            :modal-append-to-body="false"
            :show-close="isshow"
            width="30%"
            :before-close="handleClose"
            :close-on-click-modal="false"
            >
            <span>{{passscreenfont}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="download('安装')" v-if="passscreenfont=='首次使用屏幕共享，需要安装插件'">去安装</el-button>  
                <el-button @click="download('下载')" v-else>下载</el-button>              
            </span>
        </el-dialog>

</template>
<script>
export default {
    data() {
      return {
          isshow:true
      };
    },
    props:["passscreenfont","screenVisible"],
    created(){
        this.isshowx();
    },
    methods: {
        handleClose(){
            this.$emit('update:screenVisible', false)
        },
        download(msg){
            if(msg=="安装"){
                //安装插件
                let {href} = this.$router.resolve({
                        path:"/live/plug_in",                        
                    }); 
                window.open(href, '_blank');
                this.$emit('update:screenVisible', false);
                
            }else{
                //系统判断，下载谷歌浏览器
                var version = navigator.userAgent;
                if(version.indexOf("Windows")!=-1) { 
                    console.log("这是window系统");
                    window.open('https://opensxb.oss-cn-beijing.aliyuncs.com/resource/static/ChromeSetup.zip','_black')
                }else{
                    console.log("这是苹果系统");
                    window.open('https://opensxb.oss-cn-beijing.aliyuncs.com/resource/static/googlechrome.dmg','_black')
                }               
            }
            
        },
        isshowx(){
            let xx=this.screenVisible;
            if(xx=="当前浏览器不支持此功能，请下载chrome" || "当前浏览器版本较低，请下载最新版chrome"){
                this.isshow=false
            }else{
                this.isshow=true
            }
        },
    }
}
</script>
<style lang="less" scoped>
.el-button{
    background-image: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);
    border-radius: 18px;
    width: 100px;
    height: 36px;
    font-size: 16px;
    color: #FFFFFF;
    padding: 0;
    border: 0;
    margin: 0 auto;
}
</style>


