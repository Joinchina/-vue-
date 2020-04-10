<template>
<el-dialog :class="{'dialog-form':true, 'w-wang':true, chargePop:true,hiddeAnmate:anmati}" :visible.sync="dialogPreview" :close-on-click-modal=false :before-close="closeCreate" @open="open">
    <div :class="{chargeBox:true, pcDevice:pcDevice}" v-loading="lodingF">
        <!-- <header>
            <p>致用户的一封信</br>——关于师训宝收费相关信息</p>
        </header> -->
        <img class="headerLogo" src="../../assets/img/charge/chargeHeader.png" alt="">
        <article class="modileArticle">
            
            <div class="detailText">
                <p class="hintText boldSize">尊敬的用户,您好!</p>
                <p class="infoText">
                    <span class="boldSize"> 由于研发及运营成本的不断上升，为了能够向您提供稳定的服务，师训宝将于近期开始向培训机构收取使用费。</span>
                    师训宝将划分免费版和VIP版，免费用户仍可使用师训宝的基础功能，部分高级功能（详见下表）将会受到限制。
                </p>
                <p class="infoText">感谢您一直以来对师训宝的支持与喜爱，由于此次调整给您带来的不便，我们深感歉意。</p>
                <p class="teamText">
                    <span>师训宝团队</span>
                    <span>2019年4月</span>
                </p>
                <p class="connectText">
                    <span>致电咨询如何升级为VIP客户</span>
                    <span>高老师：13301068776</span>
                    <span>刘老师：18601250775</span>
                    <i>附：师训宝版本功能区分表</i>
                </p>
                <!-- :span-method="objectSpanMethod" -->
                <el-table
                    :data="tableData"
                    :span-method="objectSpanMethod"
                    :cell-style="cellStyle"
                    border
                    style="width: 100%;margin-bottom: 20px;">
                    <el-table-column
                        prop="func"
                        label="功能">
                    </el-table-column>
                    <el-table-column
                        prop="funcItem"
                        label="具体功能点">
                    </el-table-column>
                    <el-table-column
                        prop="vip"
                        label="VIP版">
                    </el-table-column>
                    <el-table-column
                        prop="free"
                        label="免费版">
                    </el-table-column>
                </el-table>
            </div>
        </article>
        <footer>
            <form action="">
                <p class="attchText">如有疑问，请留下联系方式，我们会尽快跟您进行联系。</p>
                <el-input v-model="ajaxData.userName" placeholder="请输入姓名" class="inputWrite"></el-input>
                <el-input v-model="ajaxData.telephone" placeholder="请输入联系电话"></el-input>
                <el-button type="info" class="connectBtn" plain @click="submit">提交</el-button>
            </form>
        </footer>
    </div>
</el-dialog>
</template>

<script>
    // import api from "../../axios/api.js"
    import http from '@/global/request'
    import fetch from '@/model/charge/charge'
    import {chargeData} from '@/model/charge/tableData'
    import { setTimeout } from 'timers';
    export default {
        data () {
            return {
                tableData: [],
                ajaxData:{
                    userName:"",
                    telephone:""
                },
                pcDevice:false,
                lodingF:false,
                dialogPreview: false,
                anmati:false,
            }
        },
        beforeCreate(){
            // http.get('../../../static/tableData.json', null, 'h1', res=>{
            //     this.tableData=res.data;
            //     console.log(res);
            //     console.log(this.tableData);
            //     setTimeout(()=>{this.hasData=true;},1000)
            // })
        },
        created(){
            if(!localStorage.exp_role||!localStorage.exp_userId) return
            let prosess=["ORGADMIN","PROJECTADMIN","CLAZZMANAGER"];
            let currentID = JSON.parse(localStorage.exp_userId).data;
            if(prosess.includes(JSON.parse(localStorage.exp_role).data)&&(!localStorage.viewCharge||(new Date().getTime()-JSON.parse(localStorage.viewCharge).time>86400000&&(!JSON.parse(localStorage.viewCharge).count||JSON.parse(localStorage.viewCharge).count<5)))){
                this.tableData=chargeData;
                this.dialogPreview=true;

                let obj = {};
                if(localStorage.viewCharge){
                    obj=JSON.parse(localStorage.viewCharge);
                    if(obj&&obj.count){
                        obj.count++;
                    }else{
                        obj.count=1;
                    }
                }else{
                    obj.count = 1
                    
                }
                obj.time = new Date().getTime();
                localStorage.setItem("viewCharge",JSON.stringify(obj))
            }
            
        },
        mounted(){
            //document.querySelector('.chargeBox').setAttribute('style',"height: "+document.documentElement.clientHeight+"px");
        },
        methods:{
            submit(){
                if(this.ajaxData.userName.trim()==""){
                    this.$alert('姓名不能为空', {
                        confirmButtonText: '确定',
                        type: 'error',
                    });
                    return
                }
                if(this.ajaxData.userName.trim().length>12){
                    this.$alert('姓名不得超过十二个字', {
                        confirmButtonText: '确定',
                        type: 'error',
                    });
                    return
                }
                if(this.ajaxData.telephone.trim()==""){
                    this.$alert('联系电话不能为空', {
                        confirmButtonText: '确定',
                        type: 'error',
                    });
                    return
                }
                if(!(/^1[0345789]\d{9}$/.test(this.ajaxData.telephone.trim()))) {
                    this.$alert('请输入正确的手机号', {
                        confirmButtonText: '确定',
                        type: 'error',
                    });
                    return
                }
                this.lodingF=true;
                console.log(this.ajaxData);
                let data = {telephone:this.ajaxData.telephone,userName:this.ajaxData.userName}
                fetch.saveBusiness(data,res=>{
                    console.log(res);
                    this.lodingF=false;
                    if(res.status==200){
                        this.$message.success("提交成功");
                        this.ajaxData.userName="";
                        this.ajaxData.telephone="";
                    }else{
                        this.$message.error(res.message);
                    }
                })
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                let returnObj = {}
                if (columnIndex === 0) {
                    if (row.colspan >0) {
                        returnObj.rowspan= row.colspan;
                        returnObj.colspan= 1;
                        return returnObj
                    }else{
                        returnObj.rowspan= 0;
                        returnObj.colspan= 0;
                        return returnObj
                    }
                }
                
            },
            cellStyle({ row, column, rowIndex, columnIndex }){
                let returnObj = {
                    borderColor:"#DFE6EC",
                    color: row.vip==row.free?"#333333":"#BF5A00",
                    backgroundColor:columnIndex === 0?"rgba(238,241,246,0.45)":"#fff",
                }
                return returnObj
            },
            open() {
                this.tableData=chargeData;
            },
            closeCreate () {
                // this.dialogPreview=false;
                this.anmati=true;
                setTimeout(()=>{this.dialogPreview=false;},300);
                setTimeout(()=>{this.anmati=false;},600);
                this.ajaxData.userName="";
                this.ajaxData.telephone="";
		    	// this.$emit('update:dialogPreview', false);
		    },
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/reset-element-ui/form.css";
    @keyframes mymove{
        from {
            overflow: hidden;
            left:0;
            width: 100%;
            height: 100%;
            margin-top: 0;
        }
        to{
            margin-top: -14vh;
            // bottom: 150%;
            left:70%;
            width: 0%;
            height: 0%;
        }
    }
    @media screen and (max-width: 1190px) {
        @keyframes mymove{
            from {
                overflow: hidden;
                left:0;
                width: 100%;
                height: 100%;
                margin-top: 0;
            }
            to{
                margin-top: -14vh;
                // bottom: 150%;
                left:80%;
                width: 0%;
                height: 0%;
            }
        }
    }
    .chargeBox{
        // overflow-y: scroll;
        height: 78vh;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .hiddeAnmate{
        animation: mymove .5s ease 0s 1 normal backwards;
        overflow: hidden !important;
        .modileArticle{
            overflow: hidden;
        }
        .headerLogo{
            display: none;
        }
        
    }
    header{
        text-align: center;
        flex:1;
        p{
            text-align: center;
            margin: 0 auto;
            width: 100%;
            font-size: 48px;
            color: #333333;
            font-family: PingFangSC-Regular;
            padding: 30px 0;
            text-indent: -270px;
        }
        border-bottom: 1px solid #F0F0F0;
    }
    article{
        overflow-y: scroll;
        flex:6;
    }
    .headerLogo{
        width: 300px;
        display: block;
        margin: 0 auto;
        margin-top: -12px;
    }
    .modileArticle{
        .hintText{
            margin: 20px 0; 
        }
        
        .detailText{
            padding: 0 30px;
        }
        .infoText{
            text-indent: 35px;
            font-size: 15px;
            color: #2A2A2A;
            letter-spacing: 0.04px;
            line-height: 26px;
            margin-bottom: 8px;
        }
        .teamText{
            font-size: 15px;
            color: #666666;
            letter-spacing: 0.4px;
            line-height: 20px;
            text-align: right;
            display: grid;
            margin-bottom: 16px;
            span:nth-child(2){
                letter-spacing: 1px;
            }
        }
        .connectText{
            // display: grid;
            overflow: hidden;
            margin-bottom: 10px;
            span{
                float: left;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #51607C;
                letter-spacing: 0.04px;
                padding-left: 20px;
                margin-bottom: 10px;
                height: 20px;
                line-height: 15px;
            }
            span:first-child{
                font-size: 15px;
                color: #333333;
                background: url(../../assets/img/charge/phoneIcon.png) left top no-repeat;
                background-size: 15px 15px;
            }
            i{
                float: left;
                width: 100%;
                font-size: 14px;
                color: #666666;
                letter-spacing: 0.04px;
                font-style: normal;
            }
        }
        .boldSize{
            text-align: left;
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #333333;
            font-weight: 600;
        }
    }
    footer{
        padding: 0 60px;
        flex:1;
        box-shadow: 0 2px 16px 0 rgba(0,0,0,0.14); /*no*/
        z-index: 10;
        .attchText{
            font-size: 14px;
            color: #666666;
        }
        background: #fff;
    }

</style>

<style lang="less">
    #app{
        width: 100%;
        max-width: none;
    }
    article .el-table .cell{
        font-size: 14px;
    }
    article .el-table th{
        color: #333333;
    }
    article .el-table thead th{
        background: #eef1f6;
        border: 1px solid #DFE6EC; /*no*/
        text-align: center;
        font-weight: normal;
    }
    footer{
        .el-input{
            width: 180px;
            height: 34px;
            margin-right: 10px;
            input{
                height: 100%;
            }
        }
        .inputWrite{
            width: 140px;
        }
    }
    
    .connectBtn{
        height: 60px;
        width: 110px;
        border-width: 0px;
        border-radius: 6px; /*no*/
        font-size: 26px;
    }
    .dialog-form .el-button.el-button--info.is-plain{
        height: 34px;
        width: 75px;
        background: #E2E8EE;
        padding: 0 0;
        vertical-align: middle; 
        padding-bottom: 10px;
        span{
            font-size: 14px;
            color: #333333;
        }
    }
    .dialog-form .el-button.el-button--info.is-plain:hover{
        background: #7687A7;
        span{
            color: #FFFFFF;
        }
    }
    .el-table__row{
        // td:first-child{
        //     background: #eef1f6;
        // }
    }
    .chargePop.dialog-form{
        .el-dialog__header{
            height: 0px;
            padding: 0;
        }
        .el-dialog__body{
            max-height: none;
            padding: 0;
            overflow-y: visible;
        }
        .el-dialog{
            max-width: 780px;
        }
        .el-table .cell{
            white-space: normal;
        }
    }
</style>

