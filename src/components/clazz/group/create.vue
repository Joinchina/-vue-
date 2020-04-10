<template>
  <div>
    <el-dialog class="dialog-form" title="新建小组"
               :visible.sync="dialogCreateGroup"
               :close-on-click-modal="false"
               :before-close="close"
               @open="open">

    <el-form :model="ruleAddGroup" :rules="rules" ref="ruleAddGroup" 	v-loading="loading"
             element-loading-text="拼命加载中">
      <el-form-item label="小组名：" :label-width="labelWidth" prop="name">
        <el-input v-model.trim="ruleAddGroup.name" placeholder="" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="指定小组成员：" :label-width="labelWidth" prop="member">
        <!--<el-input v-model="ruleAddGroup.member" placeholder="" auto-complete="off"></el-input>-->
        <a href="javascript:void(0)" class="icon-dis-choose" @click="studentSelect = true">点击选择成员</a>
        <div class="selectStudent" v-if="selectData.length != 0">
          <ul class="clearfix" >
            <li v-for="(item,index) in selectData" :key="index">{{item.name}}（{{item.id}}）</li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="!loading &&submitForm('ruleAddGroup')">确定</el-button>
      <el-button @click="close">关闭</el-button>
    </div>
    </el-dialog>
    <!--选择学员_start-->
    <student-select
      :dialogStudentSelect.sync = "studentSelect"
      :groupTitles = "groupTitle"
      @StudentSelectData="selectDataMthod"
      :createGroupStudent = "1"
    ></student-select>
    <!--选择学员_end-->
  </div>
</template>
<script>
  import studentSelect from 'components/activity/discuss/student_select'
  import model from '@/model/clazz/group';
  import bus from '@/global/bus';
  export default {
      props:["dialogCreateGroup","groupCeates"],
      created(){
        this.clazzId = this.$route.query.clazzId;
      },
      data(){
        return{
          studentSelect:false,
          loading:false,
          clazzId:"",
          groupTitle:["未分组学员","已选择学员"],
          selectData:[],
          selectIds:[],
          ruleAddGroup: {
            name: "",
            member: ""
          },
          rules: {
            name: [
              { required: true, message: '请填写小组名', trigger: 'blur'},
              { max: 12, message: '小组名不能超过12字'}
            ],
            member: [
              { required: false, message: '请指定小组成员', trigger: 'blur'}
            ],
          },
          labelWidth: "150px"
        }
      },
      methods:{
        open() {
          this.loading = false;
        },
        close () {
          this.$emit('update:dialogCreateGroup', false);
        },
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if(valid) {
             this.groupCreate();
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        },
        groupCreate(){
          this.loading = true;
          var _this = this;
          // 所选学员id 数组
          this.selectData.forEach((item,index) => {
            this.selectIds.push(item["id"]);
          });
          var data = {
            name:this.ruleAddGroup.name,
            clazzId:this.clazzId,
            ids:this.selectIds
          }
          model.groupCustom(data, (res => {
            if(res.status == 200) {
                this.loading = false;
                //空页面自定义分组
                if(this.groupCeates  ==  "1"){
                   bus.$emit("GroupCreate","1")
                  //新建自定义分组
                }else{
                  this.$emit("dialogSignSuccessData");
                }


                //清空
                this.ruleAddGroup.name = "";
                this.selectData = [];
                this.selectIds = [];

                //选择学员清空数据
                bus.$emit("studentEmpty","1");

                this.close();
            } else {
              this.loading = false;
              this.$message.error(res.message);
            }
          }));
        },
        selectDataMthod(data){
          this.selectData = data;
        }

      },
      components:{
        studentSelect
      }
  }
</script>
<style scoped="" lang="less">
  @import "../../../assets/reset-element-ui/form.css";
  @import "../../../assets/less/icon.less";
  @import "../../../assets/less/activity.less";
</style>
