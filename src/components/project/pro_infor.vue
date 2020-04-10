<template>
  <section class="pro-info">
    <h2 :title="proInfo.name">{{proInfo.name}}</h2>
    <!-- <span class="pro-man"  v-if = "role == 'ADMIN' || role == 'ORGADMIN' || role == 'PROJECTADMIN'">
			<i class="icon-people"></i>
			项目成员
		</span> -->
    <span class="pro-more" v-if = "role == 'ADMIN' || role == 'ORGADMIN'">
			<el-dropdown class="more" trigger="click" placement="bottom-start" @command="handleCommand">
				<span class="el-dropdown-link">
					<i class="el-icon-more"></i>
					更多
				</span>
				<el-dropdown-menu class="more-menu" slot="dropdown">
					<el-dropdown-item command="edit">
						<i class="icon-edit"></i>
						编辑项目
					</el-dropdown-item>
					<el-dropdown-item command="delete" v-if="role == 'ADMIN'">
						<i class="el-icon-delete2"></i>
						删除项目
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</span>

    <!-- 编辑项目 -->
    <el-dialog class="dialog-form w-wang" title="编辑项目" :visible.sync="dialogEditPro" :close-on-click-modal=false  :before-close="close" @open="open">
      <el-form :model="editProForm" :rules="rulesPro" ref="editProForm"
            v-loading="loading"
            element-loading-text="拼命加载中">
        <el-form-item label="项目名称：" :label-width="labelWidth" prop="name">
          <el-input v-model.trim="editProForm.name" placeholder="请填写项目名称" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item label=" 项目简介：" :label-width="labelWidth" prop="desc">
          <!-- <el-input type="textarea" v-model="editProForm.desc" ></el-input> -->
          <div id="edit_menup2" class="toolbar"></div>
          <div id="edit_contentp2" class="text"></div> 
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="!loading && savePro('editProForm')">保存</el-button>
        <el-button  @click="close">关闭</el-button>
      </div>
    </el-dialog>
    <!-- /编辑项目 -->

  </section>
</template>

<script>
  import Model from 'model/project/pro_infor'
  import { delTip } from '@/global/open'
  import storage from '@/global/storage'

  import aliyunDir from 'model/organization/list'
  import E from 'wangeditor'
  import ailiyunUpload from 'model/aliyun/index'

  export default {
    data() {
      return {
        role:"",
        proInfo:"",

        dialogEditPro: false,
        editProForm: {
          name: "",
          desc: ""
        },
        rulesPro: {
          name:[
            { required: true, message: '请填写项目名称', trigger: 'blur'},
            { max: 50, message: '项目名称不能超过50字', trigger: 'blur' }
          ],
          desc: [
            { max: 20000, message: '项目简介不能超过20000字', trigger: 'blur'}
          ]
        },
        labelWidth: "120px",
        loading: false,

          // 阿里云上传
          editorpro2: {},
          percentage: 0,
          aliyunName: '',
          originalUrl: '',
          loadingText:0,
      }
    },

    props: ['proId'],

    created() {
      this.menuRole();
      this.getProInfor();
    },

    methods: {
      
      wangEditp2() {
        let editorpro2 = new E('#edit_menup2', '#edit_contentp2')
            
            editorpro2.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'foreColor',  // 文字颜色
                'link',  // 插入链接
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'video',  // 插入视频
                'undo',  // 撤销
                'redo'  // 重复
            ]

            // 配置服务器端地址
            editorpro2.customConfig.customUploadImg = (files, insert) => {
                // aliyun 上传图片
                aliyunDir.getAliyunImg({}, (res => {
                    if(res.status == 200) {
                      ailiyunUpload.aliyunUpload(res.data,files,(percentage, cpt)=>{
                        this.loadingText = Math.round(percentage*100);
                      }).then((results)=>{
                        // 上传完成
                        this.aliyunName = results.name.split("/").pop();
                        this.originalUrl = decodeURI(results.res.requestUrls[0]).split('?')[0];                                   
                        insert(this.originalUrl);                                                              

                      }).catch((err)=>{
                        this.$message.error('上传错误'+err);

                      });
                    } else {
                        this.$message.error(res.message);
                    }
                }))
            };

            editorpro2.customConfig.onchange = (html) => {
                this.editProForm.desc = html
            };
            editorpro2.customConfig.zIndex = 1;
            editorpro2.create();
            this.editorpro2 = editorpro2;

      },
      open() {
        this.loading = false;
      },
      menuRole(){
        var role = storage.get("exp_role");
        // console.log("更多信息role" + role);
        this.role = role;
      },
      getProInfor () {
        if(!!this.proId) {
          let data = {
            id: this.proId
          };
          Model.getProInfor(data, (res => {
            // console.log("getProInfor", res);
            if(res.status == 200) {
              this.proInfo = res.data;
              this.menuRole();
            }
          }));
        }
      },


      handleCommand(command) {

         //清空当前项目id
        //this.$store.state.curProId = "";

        if(command == 'edit') {

          this.editProForm.name = this.proInfo.name;
          this.editProForm.desc = this.proInfo.description;
         
          this.dialogEditPro = true;

          this.$nextTick(() => {
              if(this.editorpro2.id) {
                this.editorpro2.txt.html(this.editProForm.desc);
              } else {
                this.wangEditp2();
                this.editorpro2.txt.html(this.editProForm.desc);
              }
             
          })

        }

        if(command == 'delete') {

          // 删除提示消息
          let str = "删除项目会将项目下的所有班级都删除，确定要删除吗？";
          delTip(this, str, this.delPro);


        }
      },
      delPro() {
        let _this = this;
        console.log("proId-del", this.proId);
        // 删除操作
        let data = {
          id: this.proId
        }
        Model.delPro(data, (res => {
          // console.log("delete",res);
          if(res.status == 200) {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 1000,
              onClose() {
                 _this.$store.dispatch("deletePro",_this.proId);

              }
            });
            // this.$router.go(0);
          }
        }));
      },
      savePro(formName) {
        let _this = this;
        // console.log("refs",this.$refs);
        this.$refs[formName].validate((valid) => {
          if(valid) {

            let data = {
              id: this.proId,
              name: this.editProForm.name,
              description: this.editProForm.desc
            }
            this.loading = true;
            Model.editPro(data, (res => {
              // console.log("edit",res);
              if(res.status == 200) {
                _this.dialogEditPro = false;
                _this.getProInfor();

                 console.log("编辑当前项目成功" + this.proId);
                _this.$store.dispatch("editPro",this.proId);
                
                _this.loading = false;
              } else {
                _this.$message.error(res.message);
                _this.loading = false;
              }
            }));
          } else {
            console.log('save project error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      close () {
        this.dialogEditPro = false;
        this.resetForm('editProForm');
      },
    },

    watch: {
      proId: 'getProInfor'
    }

  }

</script>

<style scoped lang="less">
  @import "../../assets/less/icon.less";
  @import "../../assets/reset-element-ui/form.css";
  .w-wang {
      .text {
          width: 100%;
          height: 200px;
          border: 1px solid #F2F0F0;
      }
      .toolbar {
          width: 100%;
          background: #FCFDFF;
          border: 1px solid #F2F0F0;
          height: 50px;
      }
      .w-e-toolbar{
          .w-e-menu{
              padding: 17px 10px;
          }
      } 
  }
  .pro-info {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 68px;
    border-bottom: 1px solid #e6e6e6;
    padding: 23px 16px;
    >h2 {
      font-size: 18px;
      color: #000;
      border-left: 3px solid #319c95;
      line-height: 1.2em;
      padding-left: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 90%;
    }
    .pro-man{
      right: 108px;
    }
    .pro-more {
      right: 50px;
    }
    >span {
      position: absolute;
      right: 0;
      top: 18px;
      color: #666;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      > i {
        display: block;
        margin: 0 auto;
      }
    }
    .el-icon-more {
      display: block;
      margin: 0 auto;
    }
  }

  .more-menu {
    font-size: 14px;
    color: #666;
    border-radius: 4px;

    .el-dropdown-menu__item {
      border-bottom: 1px solid #ddd;

      &:last-child {
        border-bottom: 0;
      }

      .icon-edit {
        width: 12px;
        height: 12px;
        vertical-align: middle;
        margin-left: 2px;
      }
    }
  }

</style>
