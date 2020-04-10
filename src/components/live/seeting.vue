<template>
    <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="53vw"
    custom-class="customdialog"
    :show-close="false"
    :before-close="handleClose">
        <div class="settingOuter">
            <div class="popInner">
                <header>
                    <span>设置</span>
                    <i class="closeBtn" @click.stop="handleClose">&times;</i>
                </header>
                <p class="hints"><span v-if="inclass">直播中不能修改直播参数</span></p> 
                <el-form ref="form" label-width="100px" class="myElForm">
                    <el-form-item label="主播分辨率">
                        <el-select v-model="hostQuality" placeholder="请选择" :disabled="inclass">
                            <el-option
                                v-for="(item,index) in hostQualityArr"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="连线分辨率">
                        <el-select v-model="connectQuality" placeholder="请选择" :disabled="inclass">
                            <el-option
                                v-for="(item,index) in connectQualityArr"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="帧率">
                        <el-select v-model="frameRate" placeholder="请选择" :disabled="inclass">
                            <el-option
                                v-for="(item,index) in frameRateArr"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="镜像模式">
                        <el-checkbox v-model="mirror" label="" name="type" :disabled="inclass"></el-checkbox>
                    </el-form-item>
                </el-form>

                <div class="btnGroup">
                    <el-button round class="confirm" @click.stop="confirmHandle" :disabled="inclass">确定</el-button>
                    <el-button round class="cancel" @click.stop="handleClose">取消</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
    
</template>

<script>
    export default{
        data(){
            return{
                hostQualityArr:[
                    {label:'1280*720',value:720},
                    {label:'848*480',value:480},
                ],
                connectQualityArr:[
                    {label:'320*240',value:"240p"},
                    {label:'240*180',value:"180p_4"},
                ],
                frameRateArr:[15,30],
                hostQuality:720,
                connectQuality:"240p",
                frameRate:15,
                finalQuality:null,
                mirror: false,
            }
        },
        created(){
            // this.dialogVisible = dialogVisible
        },
        watch: {
            hostQuality(newval,oldval){
                if(newval==720){
                    this.frameRateArr = [15,30];
                }else if(newval==480){
                    this.frameRateArr = [15];
                    this.finalQuality = "480p_8";
                    this.frameRate = 15;
                }
            }
        },
        props:["dialogVisible","inclass"],
        methods:{
            handleClose(){
                this.$emit("update:dialogVisible",false);
            },
            confirmHandle(){
                if(this.hostQuality==720&&this.frameRate==15){
                    this.finalQuality = "720p"
                }else if(this.hostQuality==720&&this.frameRate==30){
                    this.finalQuality = "720p_3"
                }
                // console.warn(this.finalQuality)
                this.$emit('setQuality',{finalQuality:this.finalQuality,mirror:this.mirror});
                this.$emit('setConnectQuality',this.connectQuality);
                this.handleClose();
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
    //     //background: url(../../assets/img/liveIcon/popBg.png) center center no-repeat;
    // }
    .popInner{
        position: relative;
        // top: 0;
        // left: 0;
        // bottom: 0;
        // right: 0;
        // margin: auto;
        width: 40vw;
        // height: 56vh;
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
        .hints{
            height: 10vh;
            text-align: center;
            line-height: 10vh;
            color:rgb(218,184,83);
        }
    }
</style>
<style lang="less">
    .popInner .myElForm{
        width: 26vw;
        margin: 0vh auto;
        .el-form-item__label{
            color: #fff;
        }
        .el-input--suffix .el-input__inner{
            background: rgba(255,255,255,0.34);
            border: 1px solid #979797;
            border-radius: 2px;
            color: #fff;
            width: 18.7vw;
            height: 3.4vh;
            font-weight: normal;
            font-size: 14px;
        }
        .el-form{
            width: 30vw;
            margin: 10vh auto;
        }
        .el-button.is-round{
            padding: 8px 23px;
        } 
    }
    .customdialog{
        background:rgba(255,255,255,0);
        -webkit-box-shadow:0 1px 3px rgba(0,0,0,0);
        box-shadow:0 1px 3px rgba(0,0,0,0);
        .el-dialog__body{
            padding: 30px 0;
            max-height: 100%;
        }
    }
</style>

