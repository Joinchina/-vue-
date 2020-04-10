<template>
    <div class="z-content">
        <!-- Form -->       
        <el-dialog 
        title="新增/编辑课程领域" 
        :visible.sync="addfieldshow"
        :before-close="close"
        :close-on-click-modal="false"
        width="40%"
        class="dialog-form"
        >
            <el-form :model="form">                              
                                
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="commit">提 交</el-button>
                <el-button @click="close">关 闭</el-button>            
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data () {
        return {
           form:{
               name:'',
           },
           formLabelWidth:'90px', 
        }
    },
    props:['addfieldshow','addfiedlname'],
    watch:{
      addfiedlname:"setadd"  
    },
    methods:{
        //判断是编辑还是新增
        setadd(){
            if(this.addfiedlname){
                //编辑
                this.form.name=this.addfiedlname
            }else{
                //新增
                this.form.anem='';
            }
        },
        close(){
            this.$emit('update:addfieldshow',false)
        },
        //将结果提交给父组件
        commit(){
           
            this.$emit("getfiledname",this.form.name)
            this.close();
        }
    }
}
</script>
<style lang="less" scoped>
@import "../../../assets/reset-element-ui/form.css";
</style>


