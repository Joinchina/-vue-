<template>
<div class="expertsuccess">
    <el-dialog
    title="提示"
    :visible.sync="dialogsuccessVisible"
    width="40%"
    :show-close="false"
    :before-close="handleClose">

    <div class="mydialog">
        <i></i>
        <span>提交成功！我们将尽快反馈给专家并跟您进行联系</span>
    </div>

    <span slot="footer" class="dialog-footer">        
        <el-button type="primary" @click="handleClose ">确 定</el-button>
    </span>
    </el-dialog>
</div>
        
</template>
<script>
export default {
    data () {
        return {
            
        }
    },
    props:['dialogsuccessVisible'],
    methods:{
       handleClose(){
           this.$emit('update:dialogsuccessVisible', false)
       } 
    }
}
</script>
<style lang="less">
.expertsuccess{
.el-button--primary:focus, .el-button--primary:hover{

    border:none;
    color: #fff;
    background-image: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);

}
.el-button--primary {
    color: #fff;
    background-image: linear-gradient(90deg, #4AC9AA 0%, #1CB6C8 100%);
    border:none;
    width: 100px;
    height: 36px;
    line-height: 0px;
}
.el-button{
    border: none;
    border-radius: 18px;
    font-size: 16px;
}
.mydialog{
    width: 100%;
    overflow: hidden;
    i{
        background: url('../../assets/img/clazz/singupSuccess.png');
        background-size: 100% 100%;
        width: 36px;
        height: 38px;
        float: left;
    }
    span{
        font-size: 18px;
        color: #333333;
        letter-spacing: 0;
        line-height: 42px;
        margin-left: 10px;
    }
}
}

</style>


