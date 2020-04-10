<template>
    <div class="login-wrap">
        <!-- <div class="ms-title">后台管理系统</div> -->
        <div class="ms-login clearfix">
            <div class="left-login">
                <img class="" src="../../assets/img/login/bg_left.png" alt="">
            </div>

            <el-tabs v-model="activeName" class="login-tabs" @tab-
            click="handleClick">
            <!-- 手机号登录 -->
            <el-tab-pane label="手机号登录" name="first">
                <el-form :model="phoneForm" :rules="rules"  ref="phoneForm" label-width="0px" class="demo-phoneForm">
                    <el-form-item class="" prop="phone">
                        <i class="icon-phone"></i>
                        <el-input v-model="phoneForm.phone"
                        placeholder="请填写手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <i class="icon-authcode"></i>
                        <el-input type="text" class="authcode" placeholder="短信验证码" v-model="phoneForm.code" @keyup.enter.native="submitForm('phoneForm')"></el-input>
                        <el-button id="autoCodeBtn" class="btn-green1" type="primary"
                        @click="getCode($event)">获取验证码</el-button>
                    </el-form-item>
                    
                    <div class="login-btn">
                        <el-button type="primary" :loading="load" class="btn-login" @click="submitForm('phoneForm')">登录</el-button>
                    </div>
                    <!-- <div class="old">
                      <a target="_blank" href="http://old.shixunbao.cn" >切换至旧版</a>
                    </div> -->

                </el-form>
            </el-tab-pane>

            <!-- 账号登录 -->
            <el-tab-pane label="账号登录" name="second">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
                label-width="0px" class="" >
                <el-form-item prop="username">
                    <i class="icon-account"></i>
                    <el-input v-model="ruleForm.username" auto-complete="off"
                    placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <i class="icon-password"></i>
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" auto-complete="off" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" :loading="load" v-on:click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <div class="old">
                      <a target="_blank" href="http://old.shixunbao.cn" >切换至旧版</a>
                </div> -->
                <!-- <p style="font-size:12px;line-height:30px;color:#999;">Tips : 请输入用户名密码。</p> -->
            </el-form>
        </el-tab-pane>
    </el-tabs>

</div><!-- /ms-login -->
</div>
</template>
<script>
    import model from 'model/login/login'
    import { Base64 } from 'js-base64'
    import storage from '@/global/storage'
    import { setToken } from '@/filters/userVerify'
    export default {
        data: function(){
            let checkPhone = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入手机号'));
                }
                setTimeout(() => {
                    if(!(/^1[0345789]\d{9}$/.test(value))) {
                        callback(new Error('请输入正确的手机号'));
                    } else {
                        callback();
                    }
                }, 1000)
            };
            return {
                activeName: 'first',
                countTime: '60',
                ruleForm: {
                    username: '',
                    password: ''
                },
                phoneForm: {
                    phone: '',
                    code: ''
                },

                rules: {
                    username: [
                    { required: true, message: '请输入用户名', trigger:'blur' }
                    ],
                    password: [
                    { required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    phone: [
                    { validator: checkPhone, trigger: 'blur'}
                    ],
                    code: [
                    { required: true, message: '请输入验证码', trigger:'blur'}
                    ]
                },

                load:false

            }
        },
        created () {
            // console.log('111111111', storage);
        },
        methods: {
              handleClick(tab, event) {
              // console.log(tab, event);
              },
              getCode($event){

                  let self = $event.currentTarget;
                  // console.log('self',self);
                  if(!this.phoneForm.phone) {
                      this.$message.error("请输入手机号");
                      return false;
                  } else if (!(/^1[0345789]\d{9}$/.test(this.phoneForm.phone))){
                      this.$message.error("请输入正确的手机号");
                      return false;
                  } else {
                      let data = {
                          'phone' : this.phoneForm.phone,
                          'type' : 3
                      }
                      this.getSms(data);
                      
                  }

              },

              getSms(data){
                
                  model.getSms(data, (res => {
                      // console.log("获取验证码",res);
                      if(res.status == 200) {
                          this.countDown();
                          console.log('发送成功');
                      } else {
                          this.$message.error(res.message);
                      }
                  }));

              },
              countDown() {
                  let o = document.getElementById('autoCodeBtn');
                  // console.log("o",o);
                  if (this.countTime == 0) {
                      o.removeAttribute("disabled");
                      o.innerHTML="获取验证码";
                      o.style.backgroundColor="#2abaa1";
                      o.style.cursor="pointer";
                  } else {
                      o.setAttribute("disabled", true);
                      o.innerHTML = this.countTime+"秒后重新获取";
                      o.style.backgroundColor="#2abaa1";
                      o.style.cursor="default";
                      this.countTime--;
                      setTimeout(() => {
                          this.countDown(o)
                      }, 1000)
                  }
              },
              submitForm(formName) {
                  const _this = this;

                  //加载中
                  _this.load = true;

                  _this.$refs[formName].validate((valid) => {
                      // console.log( "valid", valid);
                      if (valid) {
                          let data;
                          // console.log("submitForm", formName, valid);
                          if(formName == 'ruleForm'){
                            
                              //区分手机号和账号登录
                              let obj = {
                                 type:"username",
                                 username:_this.ruleForm.username
                              }
                              storage.set("loginType",obj);

                              data = {
                                  'username': _this.ruleForm.username,
                                  'password': _this.ruleForm.password
                              }
                              
                              this.doLogin(data)
                          } else {

                              //区分手机号和账号登录
                              let obj = {
                                 type:"phone",
                                 username:""
                              }
                              storage.set("loginType",obj);

                              data = {
                                  phone: _this.phoneForm.phone,
                                  code: _this.phoneForm.code
                              }
                              this.doLoginPhone(data)
                          }



                      //_this.$router.push('/home');
                  } else {
                      console.log('error submit!!');
                      return false;
                  }
              });
              },

              doLogin(data) {
                  model.login(data, (res => {
                      this.loginSucc(res)
                  }))

              },
              doLoginPhone(data) {
                  const _this = this;
                  model.loginPhone(data, (res => {
                      this.loginSucc(res)
                  }))

              },
              loginSucc(res) {
                  // console.log("res",res);
                  if(res.status === 205){
                      this.load = false;

                      this.$message.error(res.message);
                  } else if (res.status === 505){
                      this.load = false;

                      this.$message.error(res.message);
                  } else if (res.status === 200) {
                        // console.log("data",res.data);
                        this.load = false;

                        let encode_token_last,
                        decode_token,
                        name,
                        userId,

                        //获取当前账号对应的name、角色、机构id
                        curUserName,
                        curRole,
                        curOrgId,
                        //curUserId,
                        _this,
                        role;
                        //console.log(loginType);
                        // 获取最后一个账号
                        for (let i in res.data) {
                            //权限测试
                             var all = JSON.parse(Base64.decode(res.data[i].split(".")[1]));
                             if(this.ruleForm.username == all.userName){
                                curRole = all.role;
                                curOrgId = all.orgId;
                                //curUserId = all.sub;
                             }                        
                            encode_token_last = res.data[i];
                        }



                        encode_token_last = encode_token_last.split(".")[1];
                        decode_token = Base64.decode(encode_token_last);

                        
                        name = JSON.parse(decode_token)['name'];
                        role = JSON.parse(decode_token)['role'];
                        userId = JSON.parse(decode_token)['sub'];
                        let token_json = JSON.stringify(res.data);



                        let day30 = 60*60*24*30;
                        storage.set("token_json", token_json, day30);    //token
                        //console.log(token_json);
                        storage.set("name", name, day30);  // 姓名
                        storage.set("role", role, day30);    // 角色
                        storage.set("userId", userId, day30);

                         
                        setToken();    // 设置authorization 身份

                        console.log("我是" , curRole);
                        console.log("我是",role)

                        if(role == 'ADMIN') {
                            this.$router.push('/organization/list');

                        }else if(curRole == "ORGADMIN"){

                            this.$router.push('/project/objnav');
                            
                        }else{

                            this.$router.push('/project/prolist');
                        }


                  }else{
                    
                      this.load = false;
                      this.$message.error(res.message);
                  }
              }
        }
}
</script>
<style lang="less" scoped>
    @import "../../assets/reset-element-ui/login-tabs.css";
    @import "../../assets/less/icon.less";
    @img:"../../assets/img/login";


    .login-wrap{
        position: absolute;
        width:100%;
        height:100%;
        background: url("@{img}/bg_login.png") center center no-repeat;
        background-size: 100% 100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:772px;
        height:531px;
        margin:-265px 0 0 -386px;
        background: #fff;
    }
    .left-login {
        width: 50%;
        float: left;
        height: 531px;
        >img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .login-tabs {
        box-sizing: border-box;
        width: 50%;
        float: left;
        padding: 70px 22px;
        border: 1px solid #eaeaea;
        border-left: 0;
        box-shadow: 1px 1px 3px #eaeaea;
        height: 531px;
    }
    .el-form-item {
        position: relative;
        clear: both;

        margin-bottom: 30px;

        &:first-child {
            margin-top: 60px;
        }
    }
    .authcode {
        width: 200px;
    }
    .icon-phone,
    .icon-authcode,
    .icon-account,
    .icon-password {
        position: absolute;
        z-index: 1;
        top: 11px;
        left: 10px;
    }
    .icon-authcode {
        top: 13px;
    }
    .btn-green1 {
        position: absolute;
        z-index: 1;
        top: 0px;
        right: 0;
        width: 140px;
        height: 44px;
        border-radius: 2px;
        background-color: #2abaa1;
        border: 1px solid #2abaa1;
    }

    .login-btn{
        text-align: center;
        margin-top: 50px;
    }
    .old{
       float: right;
       margin-top: 15px;
       margin-right: 5px;
       font-size: 12px;
       color: #444;
    }
    .old a, .old a:hover{
      color: #444;
      text-decoration: underline;
      font-size:16px;
      display: inline-block;
      padding-left: 5px;
      color: #444;
    }
    .login-btn button{
        width:100%;
        height:50px;
        color: #fff;
        font-size: 18px;
        background-color: #2abaa1;
        border: 1px solid #2abaa1;
    }
</style>
