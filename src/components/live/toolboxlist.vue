<template>
<div class="z-content">
    <div class="sign">
        <div class="settingOuter">
            <div class="popInner">
                <header>
                    <i class="closeBtn" @click.stop="handleClose">&times;</i>
                </header>
                <div class="tableside">
                    <h1 @click="tablesideleft">未签到:{{userList.length}}人</h1>
                    <h2 @click="tablesideright">已签到:{{usersignlist.length}}人</h2>
                    <span></span>
                </div>
                <div class="signbox">
                    <!-- 未签到人数 -->
                    <div class="toollist" id="siginlist_1">
                        <ul>
                            <li v-for="(item,index) in userList" :key="index">
                                <img :src=item.miniAvatar alt="" v-if="item.miniAvatar">
                                <img src="../../assets/img/icon/moimg.png" alt="" v-else>
                                <h1>
                                    {{item.name}}
                                    <span v-show="item.absenceFlag==true">(请假)</span>
                                </h1>
                                <button @click="daigign(item)">代签</button>
                                <div class="clickdrop">
                                        <el-dropdown  trigger="click" placement="bottom">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-more"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item  @click.native="recordsCancel(item,'absence')" v-if="item.absenceFlag==true">取消请假</el-dropdown-item>
                                            <el-dropdown-item  @click.native="records(item,'absence')" v-else>请假</el-dropdown-item>
                                            <el-dropdown-item  @click.native="records(item,'comeLate')">迟到</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                
                            </li>                        
                        </ul>
                    </div>
                    <!-- 已签到人数 -->
                    <div class="toollist" id="siginlist_2" style="display:none">
                        <ul>
                            <li v-for="(item,index) in usersignlist" :key="index">
                                <img :src=item.miniAvatar alt="" v-if="item.miniAvatar">
                                <img src="../../assets/img/icon/moimg.png" alt="" v-else>
                                <h1>
                                    {{item.name}}
                                    <span v-show="item.cheatTagFlag==true">(作弊)</span>
                                    <span v-show="item.comeLateFlag==true">(迟到)</span>
                                    <span v-show="item.leaveEarlyFlag==true">(早退)</span>
                                </h1>
                                <div class="clickdrop">
                                        <el-dropdown  trigger="click" placement="bottom">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-more"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item  @click.native="recordsCancel(item,'cheat')" v-if="item.cheatTagFlag==true">取消作弊</el-dropdown-item>
                                            <el-dropdown-item  @click.native="records(item,'cheat')" v-else>作弊</el-dropdown-item>
                                            <el-dropdown-item  @click.native="recordsCancel(item,'comeLate')" v-if="item.comeLateFlag==true">取消迟到</el-dropdown-item>
                                            <el-dropdown-item  @click.native="records(item,'comeLate')" v-else>迟到</el-dropdown-item>
                                            <el-dropdown-item  @click.native="recordsCancel(item,'leaveEarly')" v-if="item.leaveEarlyFlag==true">取消早退</el-dropdown-item>
                                            <el-dropdown-item  @click.native="records(item,'leaveEarly')" v-else>早退</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                                
                            </li>                        
                        </ul>
                    </div>  
                </div>                
                <div class="buttonbox">
                    <button class="btn_1" @click="tixing">
                        <img src="../../assets/images/liveIcon/tixing.png" alt="">
                        <span>提醒</span>
                    </button>
                    <button class="btn_2" @click="endsign"> 结束签到</button>
                </div>
            </div>
        </div>
    </div>
</div>
    
    
</template>

<script>
    import live from 'model/live/live';
    import model from 'model/clazz/signin'
	import { startsign } from '@/sw/utils/sig';
    import { setTimeout } from 'timers';
    import { delTipSign} from '@/global/open'
    export default{
        data(){
            return{
               userList:[],
               usersignlist:[],
            }
        },
        computed:{
            courseId(){
				return this.$route.query.courseId
            },
            clazzId(){
                return this.$route.query.clazzId
            },
        },
        created(){
           
           
        },
        mounted(){
            this.getunSignUserList()
            this.getsignlise()
            this.detescreen()
        },
        // watch:{
        //     signpassdata: {
        //         handler(val, oldVal) {
        //             this.getunSignUserList()
        //             this.getsignlise()
        //         },
        //         deep: true
        //     },
        // },
        props:["Toolboxlistdialog","liveController","signpassdata"],
        methods:{
            tablesideleft(){
                $(".tableside span").animate({left:"0%",marginLeft:"-1px"},200);
                $(".tableside h1").css("color","#ffffff")
                $(".tableside h2").css("color","#cccccc")
                this.getunSignUserList();
                this.getsignlise();
                $("#siginlist_2").hide();
                $("#siginlist_1").show();
            },
            tablesideright(){
                $(".tableside span").animate({left:"50%",marginLeft:"2px"},200);
                $(".tableside h1").css("color","#cccccc")
                $(".tableside h2").css("color","#ffffff")
                this.getunSignUserList();
                this.getsignlise();
                $("#siginlist_1").hide();
                $("#siginlist_2").show();
            },
            handleClose(){
                this.$emit("update:Toolboxlistdialog",false);
                this.$emit("hiddertoolbox")
            },
            // 未签到人员列表
            getunSignUserList(){
                let data={
                    signId:this.signpassdata.id
                };
                model.unSignUserList(data,(res=>{
                    if(res.status==200){
                        console.log("w我是未签到人员列表",res.data);     
                        this.userList=res.data;
                    }
                }))
            },       
            //查询当前列表下已签到人员列表
            getsignlise(){
                let data={
                    signId:this.signpassdata.id
                };
                model.signUserList(data,(res=>{
                    if(res.status==200){                                              
                        this.usersignlist=res.data;
                        console.log("当前班级下以前到学员列表",res.data)
                    }
                }))
            },
            //代签
            daigign(m){
                this.handleEdit(m) 
            },
            handleEdit(row){
                this.rowId = row.userId;
                let str = "";
                if(row.absenceFlag){
                str = "该学员已请假，是否取消请假直接帮学员代签到";
                }else{
                str = "是否确认该学员已到，并替他签到";
                }
            
                delTipSign(this, str, this.delUser);

            },
            delUser(){
                var _this = this;
                var data = {
                    signId:this.signpassdata.id,
                    userId:this.rowId
                }
                model.agentSign(data, (res => {
                if(res.status == 200) {
                    this.$message({
                    type: 'success',
                    message: '代签成功',
                    duration: 1000,
                    onClose() {
                       //回调未签到和已签到列表
                        _this.getunSignUserList()
                        _this.getsignlise()
                    }
                    });
                    
                } else {
                    this.$message.error(res.message);
                }
                }));
            },
            //请假
            recordsCancel(scope,type){
                // console.log("取消请假");
                let msg = "";
                let data = {
                    signId :this.signpassdata.id,
                    userId:scope.userId,
                    signTag:type 
                }
                model.delSignTag(data, (res => {
                if(res.status == 200) {
                    
                    switch(type){
                    case "comeLate":
                    msg = "取消该学员迟到";
                    break;

                    case "absence":
                    msg = "取消该学员请假";
                    break;

                    case "leaveEarly":
                    msg = "取消该学员早退";
                    default:

                    case "cheat":
                    msg = "取消该学员作弊";
                    break;
                    }
                    this.msgTip(msg);

                } else {
                    this.$message.error(res.message);
                }
                }));
            },

            msgTip(msg){
                let _this = this;
                this.$message({
                    type: 'success',
                    message: msg,
                    duration: 1000,
                    onClose() {
                        _this.getunSignUserList()
                        _this.getsignlise()
                    }
                });
            },
            //迟到

            records(scope,type){
                console.log(scope,type)
                if(type == "comeLate"){
                    //请假
                    if(scope.absenceFlag){
                        let str = "确定将请假的考勤记录变更为迟到";
                        delTipSign(this, str,(res)=>{
                            console.log(res);
                            if(res==undefined){
                                this.delAbsence(scope,type);
                            }
                        });
                        return;
                    }
                }
                this.delAbsence(scope,type);
            },
            delAbsence(scope,type){
                let msg = "";
                let data = {
                    signId :this.signpassdata.id,
                    userId:scope.userId,
                    signTag:type 
                }
                model.addSignTag(data, (res => {
                if(res.status == 200) {
                
                    switch(type){
                    case "comeLate":
                    msg = "该学员已记录为迟到";
                    break;

                    case "absence":
                    msg = "该学员请假申请成功";
                    break;

                    case "leaveEarly":
                    msg = "该学员已记录为早退";
                    break;

                    case "cheat":
                    msg = "该学员已记录为作弊";
                    break;

                    default:
                    }
                    this.msgTip(msg);

                } else {
                    this.$message.error(res.message);
                }
                }));
                
            },        
            //手动关闭签到    
            endsign(){
                // console.log(this.signpassdata)
                let data={
                    id:this.signpassdata.id
                };
                live.liveendsignin(data,(res=>{
                    if(res.status==200){
                        // console.log("点击结束签到",res.data);
                        // 发送结束签到信道
                        this.liveController.sendChannelMsg(startsign("OVER_TASK","SIGN",this.signpassdata.id,''));
                        this.handleClose();//点击结束签到关闭弹窗
                    }else{
                        this.$message.error(res.message);
                        
                    }
                }))
            },
            //点击提醒发送一个提醒签到
            tixing(){
                 this.liveController.sendChannelMsg(startsign("PUBLISH_TASK","SIGN", this.signpassdata.id,'tixing'));
            },
            //检测屏幕高度，在小于960的屏幕下将弹窗高度上移至5vh，保证不会被压到下面的按钮
            detescreen(){
                let screenheight=$(window).height();            
                if(screenheight<=768 ){
                    $(".sign").css({"top":"5vh"})
                }
            },
             
        }
    }
</script>

<style lang="less" >
.el-dropdown-menu{
    height: auto!important;
}
.z-content{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.64);
    z-index: 10;
    .sign{
        width: 540px;        
        height: 598px;
        position: absolute;
        top:15vh;
        left: 50%;
        margin-left: -270px; 
        /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
        ::-webkit-scrollbar
        {
            width: 8px;
            height: 8px;
        background-color: #37323e;
        }
        
        /*定义滚动条轨道 内阴影+圆角*/
        ::-webkit-scrollbar-track
        {
            // -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
            border-radius: 6px;
            background-color: #37323e;
        }
        
        /*定义滑块 内阴影+圆角*/
        ::-webkit-scrollbar-thumb
        {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: rgba(255, 255, 255,0.4);
        }
        .settingOuter{           
            width: 100%;
            height: 100%;
            background:rgba(0,0,0,0);
        }
        .popInner{            
            margin: auto;
            width: 540px;
            height: 598px;
            background: #2c2c2c;
            border-radius: 10px;
            overflow: hidden;
            z-index: 70;
            header{
                text-align: center;
                margin-top: 3.3vh;
                position: relative;            
                .closeBtn{
                    position: absolute;
                    top: -2vh;
                    right: 1vw;
                    width: 1.8vw;
                    height: 1.8vw;
                    text-align: center;
                    line-height: 1.6vw;
                    background: #000;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 1.25vw;
                    cursor: pointer;
                }
            }
            .tableside{
                width: 370px;
                height: 37px;
                margin: 0 auto;
                border: 2px solid #666666;
                border-radius: 33px;
                position: relative;
                h1,h2{
                    width: 50%;
                    font-size: 16px;
                    color: #CCCCCC;
                    letter-spacing: 0.87px;
                    line-height: 37px;
                    text-align: center;
                    cursor: pointer;
                };
                h1{
                    position: absolute;
                    z-index: 2; 
                    top: -2px;
                    left: -1px;
                    color: #ffffff;
                }
                h2{
                    position: absolute;
                    z-index: 2; 
                    top: -2px;
                    left: 50%;
                    margin-left: -1px;
                }
                span{
                    width: 50%;
                    height: 37px;
                    border-radius: 33px;
                    position: absolute;
                    top:-2px;
                    left: 0%;
                    margin-left:-1px;
                    background: #FF7E00;                
                }
            }
            .signbox{
                width: auto;
                overflow: hidden;
                .toollist{
                    width: 400px;
                    margin: 0 auto;
                    margin-top: 30px;
                    height:409px;
                    overflow: hidden;
                    ul{
                        width: 100%;
                        height:409px;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        li{
                            width: 100%;
                            overflow: hidden;
                            margin-bottom: 14px;
                            img{
                                width: 26px;
                                height: 26px;
                                border-radius: 26px;
                                float: left;
                            }
                            h1{
                                width: 240px;
                                float: left;
                                margin-left: 10px;
                                overflow:hidden;
                                text-overflow:ellipsis;
                                white-space:nowrap;
                                font-size: 16px;
                                color: #FFFFFF;
                                line-height: 24px;
                                span{
                                    font-size: 14px;
                                    color: #FF7E00;
                                }
                            }
                            button{
                                background: rgba(0,0,0,0.74);
                                border-radius: 14.5px;
                                width: 55px;
                                height: 27px;
                                float: left;
                                border: none;
                                font-size: 14px;
                                color: #FFFFFF;
                                margin-left: 10px;
                            }
                            .clickdrop{
                                width: auto;
                                overflow: hidden;
                                cursor: pointer;
                                .el-dropdown{
                                    width: 26px;
                                    height: 27px;
                                    float: right;
                                    span{
                                        padding-top: 6px;
                                            display: block;
                                        i{
                                            color: #ffffff;
                                        }
                                    }
                                }
                                
                            }
                            
                        }
                    }
                }
            }
            
            .buttonbox{
                width: 100%;
                box-shadow:0px 5px 30px 10px rgba(0, 0, 0, 0.1);
                background-color: rgba(0, 0, 0,0);
                height: 76px;
                position: absolute;
                bottom: 0;
                left: 0;
                .btn_1{
                    width: 100px;
                    height: 36px;
                    background:none;
                    border: 1px solid #F5A623;
                    border-radius: 36px;
                    color: #F5A623;
                    font-size: 16px;
                    float: left;
                    margin: 20px 36px 20px 144px;
                    img{
                        float: left;
                        height: 19px;
                        margin-left: 20px;
                        margin-top: 5px;
                    }
                    span{
                        float: left;
                        line-height: 30px;
                        margin-left: 10px;
                    }
                }
                .btn_2{
                    width: 107px;
                    height: 36px;
                    background-image: linear-gradient(90deg, #248D53 0%, #51ECCE 100%);
                    border-radius: 18px;
                    font-size: 16px;
                    color: #FFFFFF;
                    float: left;
                    margin: 20px 36px 20px 0; 
                }
            }
        }
    }    
    .el-dropdown-menu{
        height: 94px!important;                           
    }    
}    
</style>


