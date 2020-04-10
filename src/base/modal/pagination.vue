<template>
    <div class="pagebox">
        <el-pagination
            layout="prev, pager, next"
            :page-size="pagesize" 
            :total="totalElements"
            @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data () {
        return {
            
        }
    },
    props:[
        'pagesize',//每页显示数
        'totalElements',//总数
    ],
    methods:{
        handleCurrentChange(val){
            this.$emit('getpagedata',val)
        }
    },
}
</script>
<style lang="less">
.pagebox{
    width: 1190px;
    margin: 0 auto;
    text-align: right;
    margin-bottom: 20px;
    .el-pagination{
        padding: 0
    }
    .el-pager li.active {
    border-color: #35a69d;
    background-color: #35a69d;
    color: #fff!important;
    }
    .el-pager li.hover {    
    color: #35a69d!important;
    }

}
</style>


