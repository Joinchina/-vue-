<template>
    <el-dialog
    title=""
    :visible.sync="cameraDialogVisible"
    width="40vw"
    @open="opend"
    :show-close="false"
    custom-class="customdialog"
    :before-close="handleClose">
        <div class="settingOuter">
            <div class="popInner">
                <header>
                    <span>摄像头设置</span>
                    <i class="closeBtn" @click.stop="handleClose">&times;</i>
                </header>
                <div class="cameraShow" ref="previewBox" id="camerapreShow"></div>
                <el-form ref="form" label-width="80px" class="myElForm">
                    <el-form-item label="设备">
                        <el-select v-model="camearId" placeholder="请选择" @change="previewHandler">
                            <el-option
                                v-for="(item,index) in cameraArr"
                                :key="index"
                                :label="item.label"
                                :value="item.deviceId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="分辨率">
                        <el-select v-model="hostQuality" placeholder="请选择">
                            <el-option
                                v-for="(item,index) in hostQualityArr"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                </el-form>

                <div class="btnGroup">
                    <el-button round class="confirm" @click.stop="confirmHandle">确定</el-button>
                    <el-button round class="cancel" @click.stop="handleClose">取消</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
    
</template>

<script>
    import SxbRTC from "@/sw/controllers/conclient";
import { setTimeout } from 'timers';
    export default{
        data(){
            return{
                hostQualityArr:[
                    {label:'1280*720',value:"720p"},
                    {label:'848*480',value:"480p_8"},
                ],
                hostQuality:null,
                camearId:null,
                previewStream:[],
                previewIng:null
            }
        },
        created(){
            // this.controller = new SxbRTC();
        },
        props:["cameraDialogVisible",'cameraArr','initCamearId','currentResolution',"controller"],
        methods:{
            handleClose(){
                this.$emit("update:cameraDialogVisible",false);
            },
            confirmHandle(){
                this.$emit('switchCamera',{deviceId:this.camearId,resolution:this.hostQuality});
                this.handleClose();
            },
            previewHandler(){
                this.controller.cameraPreview(this.camearId)
            },
            opend(){
                this.camearId = this.initCamearId;
                this.hostQuality = this.currentResolution;
                this.previewHandler();
                console.log(this.cameraArr)
            }
        }
    }
</script>

<style lang="less" scoped>
    // .settingOuter{
    //     position: fixed;
    //     z-index: 66;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     background: url(../../assets/img/liveIcon/popBg.png) center center no-repeat;
    // }
    .popInner{
        // position: absolute;
        // top: 0;
        // left: 0;
        // bottom: 0;
        // right: 0;
        margin: auto;
        // width: 53vw;
        // height: 63.5vh;
        background: #212833;
        border-radius: 10px;
        overflow: hidden;
        header{
            text-align: center;
            margin-top: 3.3vh;
            position: relative;
            span{
                display: inline-block;
                padding: 0 40px;
                background: url(../../assets/img/liveIcon/titleLeft.png) center left no-repeat,
                            url(../../assets/img/liveIcon/titleRight.png) center right no-repeat;
                background-size: 20*54/36px 20px;
                font-size: 18px;
                color: #FFFFFF;
                letter-spacing: 0;
                line-height: 18px;
                height: 20px;
    
            }
            .closeBtn{
                position: absolute;
                top: -2vh;
                right: 1vw;
                width: 30px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                background: #000;
                color: rgb(144,144,144);
                border-radius: 50%;
                font-size: 30px;
                cursor: pointer;
                // font-weight: 700;
            }
        }
        .btnGroup{
            // position: absolute;
            // bottom: 0;
            // left: 0;
            background: rgba(216, 216, 216, 0.08);
            border-radius: 0 0 10px 10px;
            width: 100%;
            height: 9vh;
            text-align: center;
            line-height: 9vh;
            .confirm{
                background: #009791;
                font-size: 16px;
                color: #FFFFFF;
                letter-spacing: 2.24px;
                border: 0 none;
                width: 6.4vw;
            }
            .cancel{
                background: #000000;
                font-size: 16px;
                color: #CCCCCC;
                letter-spacing: 2.24px;
                border: 0 none;
                width: 6.4vw;
            }
        }
        .cameraShow{
            width: 24.5*16/9vh;
            height: 24.5vh;
            background: rgba(216, 216, 216, 0.08);
            margin: 3.4vh auto;
        }
        .myElForm{
            width: 27vw;
            margin: 0 auto;
        }
    }
    // .customdialog{
    //     background:rgba(255,255,255,0);
    //     -webkit-box-shadow:0 1px 3px rgba(0,0,0,0);
    //     box-shadow:0 1px 3px rgba(0,0,0,0);
    //     .el-dialog__body{
    //         padding: 30px 0;
    //         max-height: 100%;
    //     }
    // }
</style>

