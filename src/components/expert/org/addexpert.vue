<template>
    <div class="addeditbox">
        <!-- Form -->      
        <el-dialog 
        title="新增/编辑专家" 
        :visible.sync="addeditshow"
        :before-close="close"
        :close-on-click-modal="false"
        width="60%"
        class="dialog-form"
        >  
            <div class="progress">
                <div class="progress_left">
                    <button :class="{setcoloe:true}">1</button>
                    <h1 :class="{setfontcolor:true}">专家基本信息</h1>
                </div>
                <div class="progress_right">
                    <button :class="{setcoloe:progress.btncolor}">2</button>
                    <h1 :class="{setfontcolor:progress.fontcolor}">新增专家课程</h1>
                </div>
                <p id="progressline"></p>
            </div> 
            <div class="form_one" v-if="formone==true">
                <el-form :model="form" :rules="rules_one" ref="form">                                                                      
                    <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：" :label-width="formLabelWidth" prop="sex">                        
                        <template>
                                <el-select v-model="form.sex" placeholder="请选择性别">
                                    <el-option
                                    v-for="item in gender"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item label="手机号：" :label-width="formLabelWidth" prop="phone">
                        <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号：" :label-width="formLabelWidth" prop="IDNumber">
                        <el-input v-model="form.idnumber " autocomplete="off" placeholder="请输入身份证号"></el-input>
                    </el-form-item>
                    <el-form-item label="所在地：" :label-width="formLabelWidth" prop="city">
                        <div class="citywidth">
                            <city @getcitydata="getcitydata"  ref="cleardata"></city>
                        </div>
                        
                    </el-form-item>
                    <el-form-item label="任教学段：" :label-width="formLabelWidth" prop="studySectionId">
                        <template>
                                <el-select v-model="form.studySectionId" placeholder="请选择学段"
                                @change="setstudent"
                                >
                                    <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                    >
                                    </el-option>
                                </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item label="任教学科：" :label-width="formLabelWidth" prop="subjectId">
                        <template>
                                <el-select v-model="form.subjectId " placeholder="请选择学科">
                                    <el-option
                                    v-for="item in options2"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                        </template>   
                    </el-form-item>
                    <el-form-item label="最高学历：" :label-width="formLabelWidth" prop="degree">
                        <template>
                                <el-select v-model="form.degree " placeholder="请选择最高学历">
                                    <el-option
                                    v-for="(item,index) in student"
                                    :key="index"
                                    :label="item"
                                    :value="item">
                                    </el-option>
                                </el-select>
                        </template> 
                    </el-form-item>
                    <el-form-item label="擅长领域：" :label-width="formLabelWidth" prop="curriculumFieldIds">                        
                            <el-checkbox-group v-model="form.curriculumFieldIds" size="small">
                                <el-checkbox :label="item.id" border v-for="item in clazzfield" :key="item.id">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="专家照片：" :label-width="formLabelWidth"  class="avatar-uploader">
                    
                            <label for="fileName" class="sel2" style="margin-left:0px"><span class="icon-dis-add"></span>添加照片</label>
                            <input class="sel1 select-file" multiple="true" id="fileName" type="file" accept="image/png,image/gif,image/jpeg"  @change="selAvatar($event)">
                            <div style="margin-top:40px;margin-left:40px;">
                                <ul v-if = "imageUrl.length != ''">
                                    <li v-for="(item,index) in imageUrl" :key="index">
                                        <img :src="item" class="avatar" style="width:150px;height: 150px;">
                                        <!-- <span class="icon-dis-error error" @click="deletePic(index,$event)"></span> -->
                                    </li>
                                </ul>
                            </div>

                    </el-form-item>
                    <el-form-item label="专家职称：" :label-width="formLabelWidth" prop="titleId">
                        <template>
                                <el-select v-model=" form.titleId" placeholder="请选择职称">
                                    <el-option
                                    v-for="item in options3"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                        </template>
                    </el-form-item> 
                    <el-form-item label="任职单位：" :label-width="formLabelWidth" prop="workPlace">
                        <el-input v-model="form.workPlace" autocomplete="off" placeholder="请输入任职单位名称"></el-input>
                    </el-form-item> 
                    <el-form-item label="专家简介：" :label-width="formLabelWidth"  prop="updatEditor">
                        <editor @updatEditor="updatEditor" :descont="descont"></editor>                        
                    </el-form-item>
                    <el-form-item label="" :label-width="formLabelWidth">
                        <button class="nextnext"  @click="nextdown">下一步</button>                        
                    </el-form-item>                 
                </el-form>
            </div>
            <div class="form_two" v-else>
                <div class="clazzbox" v-for="(item,index) in clazzform" :key="index">
                    <div class="clazz_top">
                        <h1>课程{{index+1}}：</h1>
                        <img src="../../../assets/img/expert/xxx.png" alt="" @click="deleteArr(index)" v-show="index!=0 || clazzform.length>1">
                    </div>
                    <p style="clear:both"></p>
                    <el-form :model="item" ref="clazzform" :rules="rules_two">                                                                      
                        <el-form-item label="课程名称：" :label-width="formLabelWidth">
                            <el-input v-model="item.name " autocomplete="off" placeholder="请输入课程名字"></el-input>
                        </el-form-item>
                        <el-form-item label="项目类型：" :label-width="formLabelWidth">
                            <el-input v-model="item.projectType " autocomplete="off" placeholder="请输入项目类型"></el-input>
                        </el-form-item>
                        <el-form-item label="课程人数：" :label-width="formLabelWidth" prop="studentCount">
                            <el-input v-model="item.studentCount " autocomplete="off" placeholder="请输入课程人数"></el-input>
                        </el-form-item>
                        <el-form-item label="受训学员类型：" :label-width="formLabelWidth">
                            <el-input v-model="item.studentType " autocomplete="off" placeholder="请输入受训学员类型"></el-input>
                        </el-form-item>                        
                        <el-form-item label="内容创新性：" :label-width="formLabelWidth" prop="novelty">
                            <el-input v-model="item.novelty " autocomplete="off" placeholder="请打分，分值为0-5"></el-input>
                        </el-form-item>
                                                                        
                        <el-form-item label="内容实用性：" :label-width="formLabelWidth" prop="practicability">
                            <el-input v-model="item.practicability " autocomplete="off" placeholder="请打分，分值为0-5"></el-input>
                        </el-form-item> 
                        <el-form-item label="课堂互动：" :label-width="formLabelWidth" prop="interaction">
                           <el-input v-model="item.interaction " autocomplete="off" placeholder="请打分，分值为0-5"></el-input>                          
                        </el-form-item>
                        <el-form-item label="授课技巧：" :label-width="formLabelWidth" prop="skill">
                           <el-input v-model="item.skill " autocomplete="off" placeholder="请打分，分值为0-5"></el-input>                           
                        </el-form-item>
                        <el-form-item label="学员评价：" :label-width="formLabelWidth">
                           <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="item.evaluate ">
                            </el-input>                           
                        </el-form-item>
                                       
                    </el-form>
                </div>
                <div class="addbtn">
                     <button type="primary" @click="gotop" class="gotop">上一步</button>
                    <button @click="addclazzinfo" class="addclazz"> 添加新的课程</button>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="close">关 闭</el-button>  
                    <el-button type="primary" @click="addfield">提 交</el-button>                              
                </div>
            </div>
            
        </el-dialog>
    </div>
</template>
<script>
import editor from '@/base/wangedit/editor'
import city from '../choosearea'
import model from'@/model/expert/expert'
import { constants } from 'fs';
import ailiyunUpload from 'model/aliyun/index'

export default {
   data () {
        var fenval= (rule, value, callback)=>{
            	if(value != ''){
                    if(isNaN(Number(value))){  //当输入不是数字的时候，Number后返回的值是NaN;然后用isNaN判断。
                        return callback(new Error('只能输入小于5的数字，可以有一位小数'));
                    }else{
                        if(value>5){
                           return callback(new Error('只能输入小于5的数字，可以有一位小数')); 
                        }else if(!(/^\d+(\.\d{1})?$/.test(value))){
                                return callback(new Error('只能输入小于5的数字，可以有一位小数'));
                        }
                        
                    }
                    
                }else{
                    callback()
                }
        }
        var fenvalphone=(rule,value,callback)=>{
            if(!(/^1(3|4|5|7|8|6|9)\d{9}$/.test(value))){               
                return callback(new Error('手机号码有误，请重新输入'));                  
                    
            }else{
                    callback()
                }
        }
         var numberall=(rule, value, callback)=>{
            	if(value != ''){
                    if(isNaN(Number(value))){  //当输入不是数字的时候，Number后返回的值是NaN;然后用isNaN判断。
                        return callback(new Error('只能输入数字'));
                    }
                    
                }else{
                    callback()
                }
        }  
       return {
           //任教学段
            options: [],//学段
            options2: [],//学科            
            options3:[],//专家职称
            progress:{
                btncolor:false, //控制进度颜色
                fontcolor:false,
            },
            rules_one: {
                name: [
                    { required: true, message: '请输入名字', trigger: 'blur' },
                    { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' }
                ],
                phone:[
                    {validator: fenvalphone,trigger: 'blur'}
                ]                
            },
            rules_two:{
                studentCount:[
                    {validator: numberall,trigger: 'blur'}
                ],
                novelty: [
                   {validator: fenval,trigger: 'blur'}
                ],
                practicability: [
                   {validator: fenval,trigger: 'blur'}
                ],
                interaction: [
                   {validator: fenval,trigger: 'blur'}
                ],
                skill:[
                    {validator: fenval,trigger: 'blur'}
                ]   
            },
            gender:[{
                id:true,
                name:'男'
            },{
                id:false,
                name:'女'
            }],
            student:['专科','本科','硕士','博士','博士后'],    
            form: {
                name:"",  //姓名              
                sex:"",//性别 
                phone: '',//电话
                idnumber:'',//身份证号
                areaCode:'',//地址编码
                studySectionId:'',//学段id
                subjectId:'',//任教学科id
                degree:'',//学历
                curriculumFieldIds:[],//擅长领域
                avatar:'',//专家照片file【0】
                titleName:'',//专家职称名称
                workPlace:'',//任职单位
                description:'',//简介
            },
            clazzform:[{
                name :'',//课程名称
                projectType :'',//项目类型
                studentCount :'',//课程人数
                studentType :'',//受训学员类型
                novelty :'',//内容创新性得分
                practicability :'',//内容使用性得分
                interaction :'',//课堂互动得分
                skill :'',//授课技巧得分
                evaluate :'',//课堂评价
            }],
            curriculum:"",//选择的课程领域
            curriculumFieldIdsname:[],
            formLabelWidth: '150px',
            descont:'',//富文本编辑信息
            clazzfield:[],//接口获取的课程领域
            imageUrl:[],//头像展示
            imagename:'',
            formone:true,//控制显示上一步下一步
            citycode:[],//城市选择的code
       }
   },
   props: ['addeditshow'],
   mounted(){
       this.getfield();
       this.gettitleinfo();
       this.getstudentinfo();
   },
   methods:{
      //富文本编辑器获取的信息
      updatEditor(val){
          this.form.description=val;
          this.descont=val;
          console.log(val)
      },
      //获取领域列表
      getfield(){
          let data={
                number:1,
                size :1000,
            };
            model.getclazzfield(data,(res)=>{
                if(res.status==200){
                     console.log(res)
                   this.clazzfield=res.data.content
                }
            })
      },
      //获取职称
      gettitleinfo(){
          let data={
              type:"PROFESSIONALTITLE"
          }
          model.getexperttitle(data,(res)=>{
              console.log("options3",res)
              if(res.status==200){
                  this.options3=res.data;
              }
          })
      },
      //获取学段学科
      getstudentinfo(){
          model.getstudentinfo('',(res)=>{
              if(res.status==200){
                  //学段处理
                  this.options=res.data;
              }
          })
      },
      //设置学科
      setstudent(){
          let xueduan=this.form.studySectionId;

          this.options.forEach(ele=>{
              if(ele.id==xueduan){
                  
                  this.options2=ele.subjects
              }
          })
      },
      uniq(array){
        var result = [];
        var obj = {};
        for(var i =0; i<array.length; i++){
            if(!obj[array[i].id]){
                result.push(array[i]);
                obj[array[i].id] = true;
            }
        }
        this.options2=result
      },
      //添加照片
      selAvatar(event){
            let extend = event.target.value.substr(event.target.value.lastIndexOf(".") + 1).toLowerCase();
            if (extend == "jpg" || extend == "png" || extend == "gif" || extend == "jpeg") {
                const files = document.getElementById("fileName")
                let imginput=files.files[0].size;
                if(imginput>300*1024){
                    this.$message.error('上传图片大小不能超过300k~');
                    return
                }
                this.imageUrl=[];
                model.postimg({}, (res => {
                    if(res.status == 200) {
                        const client = new OSS.Wrapper({
                            region: res.data.region,
                            accessKeyId: res.data.accessKeyId,
                            accessKeySecret: res.data.accessKeySecret,
                            stsToken: res.data.securityToken,
                            bucket: res.data.bucket
                        });
                        console.log(res.data)
                        // 获取图片input选取的图片信息
                        let _this=this
                        
                        let file = event.target.files[0];                    
                        let name = file.name
                        //创建图片获取图片宽高
                        
                        let myimg = URL.createObjectURL(file);    
                        let img = new Image();
                        img.src = myimg;
                        img.onload = function(){
                            //如果图片的高度大于360宽度大于440，则压缩图片
                            if(img.width>440 && img.height>360){
                                let newwidth=img.width/2
                                let newheight=img.height/2;
                                console.log(img.width,img.height)
                                console.log(440,newheight)
                                let reader = new FileReader();  //异步读取计算机文件信息
                                let imgFile;
                                reader.readAsDataURL(file);
                                reader.onload = function (event) {
                                    imgFile = event.target.result;
                                    _this.getImgToBase64(imgFile, function (data) {
                                    var myFile = _this.dataURLtoFile(data, name);
                                        // this.submit(myFile)
                                        resumeUpload(myFile)
                                    },newwidth,newheight);
                                };
                            }else{
                                resumeUpload(file)
                            }
                            
                        }
                                                                       
                        const dir = res.data.objectDir;	//上传路径
                        const timestamp = new Date().getTime();
                        let file_name = dir + timestamp + '.png';
                        let checkpoint;                          
                        async function resumeUpload(myFile) {
                            for (let i = 0; i < 5; i++) {
                                try {
                                    const result = await client.multipartUpload(file_name , myFile, {
                                            checkpoint,
                                        async progress(percentage, cpt) {
                                            //上传进度
                                            checkpoint = cpt;
                                        },
                                    });
                                    //上传后返回的结果
                                    _this.imageUrl.push(result.res.requestUrls[0].split('?').shift());
                                    _this.form.avatar=result.res.requestUrls[0].split('?').shift();
                                    console.log(result);
                                    
                                    break; // break if success
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                        }                                                                                                                               
                    } else {
                        this.$message.error(res.message);
                    }
                }))         
            }
        },
        //使用canvas压缩图片并转换base64
        getImgToBase64(url, callback, width, height, ratio) {
        //将图片转换为Base64并压缩
        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d"),
            img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = function () {
                canvas.height = height;  //转换图片像素大小
                canvas.width = width;
                ctx.drawImage(img, 0, 0, width, height);
                var dataURL = canvas.toDataURL("image/png", ratio);  //通过canvas获取图片的base64的URL
                callback(dataURL);
                canvas = null;
            };
            img.src = url;
        },
        // base64转换文件
        dataURLtoFile(dataurl, filename) {
            //将base64转换为文件
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),  //base64解码JS API(还有一个JS API做base64转码：btoa())
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {  //将base64转成文件
                type: mime
            });
        },
        //获取省市信息
        getcitydata(val){
            console.log("获取选择的所在省份",val)
            // this.citycode=val;
            this.form.areaCode=val[1];
        },
        //关闭模态框
        close () {
          this.$emit('update:addeditshow', false);
          this.progress.btncolor=false;
          this.progress.fontcolor=false;
          this.formone=true;
          this.imageUrl="";
          //关闭当前组件清空数组
          this.form={};
          this.clazzform=[];
          this.curriculum='';
          let newform={
                name:"",  //姓名              
                sex: '', //性别
                phone: '',//电话
                areaCode:'',//地址编码
                studySectionId:'',//学段id
                subjectId:'',//任教学科id
                degree:'',//学历
                curriculumFieldIds:[],//擅长领域
                avatar:'',//专家照片file【0】
                titleName:'',//专家职称名称
                workPlace:'',//任职单位
                description:'',//简介
            };
            let newclazzform=[{
                name :'',//课程名称
                projectType :'',//项目类型
                studentCount :'',//课程人数number
                studentType :'',//受训学员类型
                novelty :'',//内容创新性得分
                practicability :'',//内容使用性得分
                interaction :'',//课堂互动得分
                skill :'',//授课技巧得分
                evaluate :'',//课堂评价
            }];
            this.form=newform;
            this.clazzform=newclazzform;
            this.$refs.cleardata.deletedata()
            this.descont=""
      },
      //下一步
      nextdown(){
          this.progress.btncolor=true;
          this.progress.fontcolor=true;
          this.formone=false;
      },
        gotop(){
           this.progress.btncolor=false;
          this.progress.fontcolor=false;
          this.formone=true; 
        },
      //点击删除评价信息
      deleteArr(index){
          this.clazzform.splice(index,1)
      },
      //点击添加信息
      addclazzinfo(){
          let newobg={
                name :'',//课程名称
                projectType :'',//项目类型
                studentCount :'',//课程人数
                studentType :'',//受训学员类型
                novelty :'',//内容创新性得分
                practicability :'',//内容使用性得分
                interaction :'',//课堂互动得分
                skill :'',//授课技巧得分
                evaluate :'',//课堂评价
            };
         this.clazzform.push(newobg)   
      },
      //新增专家信息
      addfield(){
            if(!this.form.name){
                this.$message.error('请输入姓名');
                return
            }    
          let data=this.form;
          data.expertCourses=this.clazzform;
          data=JSON.stringify(data)
         
            model.addexpert(data,(res)=>{
            if(res.status==200){
                console.log(res)
                //添加成功调用父组件刷新列表
                this.$emit("updatalist")
                this.close()
                
            }else{
                this.$message.error(res.message);
            }
            
        })

          
      }
   },
   components:{
       editor,
       city,
   } 
}
</script>
<style lang="less">
@import "../../../assets/reset-element-ui/form.css";
.addeditbox{
    .el-dialog__body{
        padding: 14px 42px 20px 15px;
        
    }
    .progress{
        width: 70%;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 20px;
        position: relative;
        overflow: hidden;
        .progress_left,.progress_right{
            width: 50%;
            float: left;
            position: relative;
            z-index: 1;
            .setcoloe{
              background: #67B6FF;  
            }
            .setfontcolor{
               color: #1279D8 
            }
            button{
                width: 32px;
                height: 32px;
                border-radius: 32px;
                margin: 0 auto;
                color: #ffffff;
                // background: #67B6FF;
                font-size:18px;
                display: block;
               background: #E2E1E1;
            }
            h1{
                text-align: center;
                font-size: 16px;
                // color: #1279D8;
                letter-spacing: 0;
                line-height: 40px;
            }
        }
        p{
            position: absolute;
            top: 15px;
            left:25%;
            background: #EFEFEF;
            width: 50%;
            border-radius: 2px;
            height: 2px;
            z-index: 0;
        }
       
    }
    .form_one{
        .el-checkbox.is-bordered+.el-checkbox.is-bordered {
            margin-left: 0;
            margin-right: 10px;
        }
        .el-checkbox+.el-checkbox {
            margin-right: 10px;
        }
        .el-checkbox.is-bordered.el-checkbox--small {
            margin-right: 10px;
        }
        .nextnext{
            width: 90px;
            height: 26px;
            background: #35a69d;
            border: 1px solid #35a69d;
            font-size: 14px;
            color: #ffffff;
            border-radius: 4px;
            line-height: 24px;
        }
        .citywidth{
             overflow: hidden;
        }
    }
    .form_two{
        .clazzbox{
            .clazz_top{
                margin-bottom: 20px;
                overflow: hidden;
                h1{
                    background: #EBF6FD;
                    border-radius: 11.5px;
                    padding: 2px 8px;
                    font-size: 16px;
                    color: #4A90E2;
                    float: left;
                    letter-spacing: 3.3px;
                }
                img{
                    width: 30px;
                    height: 30px;
                    float: right;
                    cursor: pointer;
                }
            }
           
        }
        .addbtn{
            width: 100%;
            overflow: hidden;
            .gotop{
               width: 90px;
                height: 26px;
                background: #35a69d;
                border: 1px solid #35a69d;
                font-size: 14px;
                color: #ffffff;
                border-radius: 4px;
                margin-left: 150px;
                line-height: 24px;
            }
            .addclazz{
                width: 114px;
                height: 26px;
                background: rgba(51, 191, 169, 0.06);
                border: 1px solid #84CAC3;
                font-size: 14px;
                color: #009791;
                border-radius: 4px;
                line-height: 24px;
                margin-left: 10px;
            }
        }
        .dialog-footer{
            width: 100%;
            overflow: hidden;
            margin-top: 20px;
            button{
                float: right;
                margin-left:20px;
            }
        }
    }
}
</style>


