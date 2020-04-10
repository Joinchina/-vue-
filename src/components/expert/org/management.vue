<template>
    <div class="z-content">
        <div class="handle clearfix">
			<Goback passtitle="课程领域管理"></Goback>
			<button class="add-clazz" type="button" @click="addfielddata">
				<i class="icon-circle-add"></i>
				新增
			</button>
		</div>
        <div class="man_list">
            <template>
                <el-table
                :data="tableData"
                :stripe="true"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="名称"
                    width="300">                   
                </el-table-column>
                <el-table-column
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button type="text" @click.native="editfield(scope.row)">编辑</el-button>
                        <el-button type="text" @click.native="deletefield(scope.row)">删除</el-button> 
                    </template>
                </el-table-column>                
                </el-table>
            </template>
        </div>
        <!-- 分页组件 -->
        <pagination @getpagedata="getpagedata" :pagesize="pagesize" :totalElements="totalElements"></pagination>
        <!-- 新增和编辑组件 -->
        <addfield :addfieldshow.sync="addfieldshow" :addfiedlname="addfiedlname" @getfiledname="getfiledname"></addfield>
    </div>
</template>
<script>
import Goback from 'base/goback/goback'
import pagination from '@/base/modal/pagination'
import addfield from './addfield'
import model from'@/model/expert/expert'
export default {
    data () {
        return {
            tableData: [],
            number:1,//当前页数
            pagesize:20,//每页显示
            totalElements:0,//总数
            newname:'',//创建名字
            addfieldshow:false,//控制编辑新增课程领域显示隐藏
            addfiedlname:'',//编辑时传递给组件的名字
            editinfo:"",//编辑时的信息
        }
    },
    created(){
        this.getfield();
    },
    methods:{
        //获取页数组件返回的点击页面
        getpagedata(val){
            this.number=val;
            this.getfield()
        },
        //获取课程领域
        getfield(){
            let data={
                number:this.number,
                size :this.pagesize,
            };
            model.getclazzfield(data,(res)=>{
                if(res.status==200){
                    // console.log(res)
                    this.tableData=res.data.content;
                    this.totalElements=res.data.totalElements
                }
            })
         
        },
        //新增课程领域
        addfielddata(){
            this.addfieldshow=true;
        },
        //获取课程领域组件传递过来的名字和是编辑/新增
        getfiledname(val){
            if(this.addfiedlname){
                //编辑
                this.addfiedlname=val;
                this.editfielddata();
            }else{
                //新增
               this.addfield(val) 
            }
        },
        //新增课程领域
        addfield(val){
            let data={
                name:val
            };
            model.addclazzfield(data,(res)=>{
                if(res.status==200){
                    console.log(res)
                    this.getfield();

                }else{
                    this.$message.error(res.message);
                }
                
            })
        },
        //编辑课程领域
        editfield(info){
            this.addfieldshow=true;
            this.addfiedlname=info.name; 
            this.editinfo=info;           
        },
        editfielddata(){
            let data={
                name:this.addfiedlname,
                id:this.editinfo.id,
            };
            model.editclazzfield(data,(res)=>{
                if(res.status==200){
                    console.log(res);
                     this.getfield();
                     this.addfiedlname="";
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        //删除课程领域
        deletefield(val){
            this.$confirm('您确定要删除当前课程领域吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deletedata(val)
            }).catch(() => {
                         
            });

        
        },
        deletedata(val){
            let data={
                id:val.id
            };
            model.deleteclazzfield(data,(res)=>{
                if(res.status==200){
                    console.log(res.data)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getfield();
                }else{
                    this.$message.error(res.message);
                }
                
            })
        },
    },
    components:{
       Goback,
       pagination,
       addfield, 
    }
}
</script>

<style lang="less" scoped>
@import "../../../assets/less/icon.less";
@import "../../../assets/less/btn-search.less";
 @import "../../../assets/reset-element-ui/user-table.css";
 .man_list{
     margin-bottom: 20px;
 }
</style>

