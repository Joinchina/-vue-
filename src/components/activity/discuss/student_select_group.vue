<style scoped="">
  @import "../../../assets/reset-element-ui/form.css";
  .select_student{
    width: 576px;
    margin: 0 auto;
  }

</style>
<template>
  <div >
    <el-dialog class="dialog-form selectStudent" title="添加组员"
               :filter-method="filterMethod"
               :visible.sync="dialogStudentSelect"
               :close-on-click-modal="false"
               :before-close="close" >
      <div class="select_student">
        <el-transfer
          filterable
          filter-placeholder="请选择学员列表"
          v-model="value2"
          :data="data2"
          @change="handleChange"
          :titles="groupTitles">
          <!--:titles="['学员列表', '已选学员列表']">-->

        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import model from 'model/activity/result'
  import group from 'model/clazz/group'
  import bus from '../../../global/bus'
  export default {
    data() {
      return {
        newData:[],
        confirmData:[],
        studentIds:[],
        groupTitle:[],
        data2: [],
        value2: [],
        obj:{}
      };
    },
    created(){
      //清空
      var _this = this;
      //分组选择成员
      _this.getGroupList();

    },
    props:["dialogStudentSelect","groupTitles","clazzId","groupId",'groupTime'],
    methods:{
      getGroupList(){
        var _this = this;
        var clazzId = this.$route.query.clazzId;
        var data = {
          clazzId:clazzId
        }
        group.groupUngroupedNo(data, ( res => {
          _this.showSuccess(res);
        }))
      },
      submitForm(){
        //小组成员添加 - 选择成员
          var data = {
            clazzId:this.clazzId,
            groupId:this.groupId,
            ids:this.studentIds
          }
          group.groupUserAdd(data, (res => {
            if(res.status == 200) {
              this.$emit("StudentSelectData");

              //清空数据
              this.newData = [];
              this.confirmData =[];
              this.studentIds = [];
              this.data2=[];
              this.value2=[];
              this.obj = {};
              this.close();
            } else {
              this.$message.error(res.message);
            }
          }));



      },
      showSuccess(res){
        var _this = this;
        if( res.status == 200) {
          let data = res.data;
          data.forEach(function (item,index) {
            var obj = {
              name:item["name"],
              id:item["id"]
            }
            _this.newData.push(obj);
            _this.obj[obj.id]=obj.name
          })
          const cities =  _this.newData;
          const pinyin = _this.newData;
          cities.forEach((city, index) => {
            this.data2.push({
              label: city["name"],
              key: city["id"]
              //pinyin: pinyin[index]
            });
          });
        }else{
          this.$message.error(res.message);
        }

      },
      handleChange(value, direction, movedKeys) {
        this.confirmData = [];
        this.studentIds = [];
        for(var i=0,len=value.length;i<len; i++){
          var name = this.obj[value[i]];
          var objs = {
            name:name,
            id:value[i]
          }
          this.confirmData.push(objs);
          this.studentIds.push(value[i]);
        }

      },

      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      close() {
        this.$emit('update:dialogStudentSelect', false);
      },
      chooseGroup(){
        //清空数据
        this.newData = [];
        this.confirmData =[];
        this.studentIds = [];
        this.data2=[];
        this.value2=[];
        this.obj = {};
        this.getGroupList();
      }
    },
    watch:{
      groupTime:"chooseGroup"
    }

  }
</script>

