<template>
    <div class="nav"  v-loading="loading2"
                :element-loading-text='this.$globalParam.loadText'
                :element-loading-spinner='this.$globalParam.loadSpinner'
                :element-loading-background='this.$globalParam.loadBg'>
        <transition name="slide-fade">
            <div class="choose" v-if="showbtn">
                    <div>               
                    <button v-for="(item5,index5) in fieldword" :key="index5">{{item5.name}}<i class="close_btn" @click="deletebtn('课程领域',item5.name,index5)"></i></button>
                    </div>  
                    <div>
                    <button v-for="(item6,index6) in Learningword" :key="index6">{{item6.name}}<i class="close_btn" @click="deletebtn('学段',item6.name,index6)"></i></button>
                    </div>  
                    <div>
                    <button v-for="(item7,index7) in disciplineword" :key="index7">{{item7.name}}<i class="close_btn" @click="deletebtn('学科',item7.name,index7)"></i></button>
                    </div>  
                    <div>
                    <button v-for="(item8,index8) in thetitleword" :key="index8">{{item8.value}}<i class="close_btn" @click="deletebtn('职称',item8.value,index8)"></i></button>                
                    </div>  
            </div>
        </transition>
        <div class="choose_list">
            <ul>
                <li id="field">
                    <h1>课程领域：</h1>
                    <div class="spanbox" id="fontheight">
                        <span @click="click_field('全部','')" :class="{allcolor:allcolor1}">全部</span>
                        <span v-for="(fie,index) in clazzfield" :key="index" @click="click_field(fie.name,fie.id)" class="spancolor">{{fie.name}}</span>
                    </div>
                    <div class="morenav" v-if="morenav" @click="morefont('更多')">
                        更多...
                    </div>
                    <div class="morenav" v-else @click="morefont('收起')">
                        收起...
                    </div>
                </li>
                <li id="learnld">
                    <h1>学<i class="h1space">程领</i>段：</h1>
                    <div class="spanbox">
                        <span @click="click_learn('全部','')" :class="{allcolor:allcolor2}">全部</span>
                        <span v-for="(learn,index2) in options" :key="index2" @click="click_learn(learn.name,learn.id)" class="spancolor">{{learn.name}}</span>
                    </div>
                </li>
                <li id="discild">
                    <h1 >学<i class="h1space">程领</i>科：</h1>
                    <div class="spanbox">
                        <span @click="discild('全部','')" :class="{allcolor:allcolor3}">全部</span>
                        <span v-for="(disci,index3) in options2" :key="index3" @click="discild(disci.name,disci.id)" class="spancolor">{{disci.name}}</span>
                    </div>                   
                </li>
                <li id="theid">
                    <h1 >职<i class="h1space">程领</i>称：</h1>
                    <div class="spanbox">
                        <span @click="theid('全部','')" :class="{allcolor:allcolor4}">全部</span>
                        <span v-for="(the,index4) in options3" :key="index4" @click="theid(the.value,the.id)" class="spancolor">{{the.value}}</span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import model from'@/model/expert/expert'
import { connect } from 'net';
export default {
    data(){
        return {
            fieldword:[],//课程领域选择的数组
            Learningword:[],//学段选择的数组           
            disciplineword:[],//学科选择的数组
            thetitleword:[],//职称选择的数组
            isclore:false, //点击导航添加颜色
            showbtn:false,
            clazzfield:[],//领域
            options3:[],//职称
            options:[],//学段学段学科
            options2:[],//所有学科
            learnsubject:[],//未经处理的学段学科集合
            learnArr:[],//存储变更的学科
            allxueduan:[],//全部的学段
            allcolor1:true,
            allcolor2:true,
            allcolor3:true,
            allcolor4:true,
            loading2:true,
            morenav:false,
        }
    },
    created(){
       this.getfield();
       this.gettitleinfo(); 
       this.getstudentinfo();
    },
    mounted(){
    },
    watch:{
      clazzfield: function() {
        this.$nextTick(function(){
          this.setmore()
        })
      }
    },
    methods:{
        //设置更多显示
        setmore(){
            let fontheight=$("#fontheight").height();
            if(fontheight>64){
                this.morenav=true;
                $("#fontheight").css({'height':'64px'});
            }
            console.log(fontheight)
        },
        morefont(val){
            if(val=='更多'){
                $("#fontheight").css({'height':'auto'});
                this.morenav=false;
            }else{
                this.morenav=true;
                 $("#fontheight").css({'height':'64px'});
            }
            
        },       
        //课程领域点击
        click_field(n,d){            
            let newObj={};
            if(d==undefined || d==''){
                d=''
            };
            newObj.id=d;
            newObj.name=n;
            //添加前判断当前数组中是否存在对象
            if(this.whether(this.fieldword,d)!=true){
                this.fieldword.push(newObj)
            }
            //如果点击的是全部则清空数组
            if(n==="全部"){
                //点击全部时将其他选项颜色添加为绿色
               this.fieldword=[];
               this.fieldword.push(newObj);
               this.orrallspan("field")
            }else{
                //重置全部颜色
                for (let i = 0; i < this.fieldword.length; i++) {
                    if(this.fieldword[i].name==="全部"){
                        this.fieldword.splice(i,1)                        
                    }                    
                }
                this.deleteallspan(this.fieldword)
                this.setallcolor("field")
                
            }         
            this.showbtn=true;
            //点击添加颜色
            $("#field").on('click','span', function () {
                $(this).css('color','#009791')               
            }); 

            this.returndata();        
        },
        //判断当前数组中是佛已经存在对阿宁
        whether(arr,d){
            let result = arr.some(function(item) {
                if (item.id == d) {
                    return true;
                }
            })
            return result;//result 为true时表示数组内已存在 false表示不存在
        },

        //学段点击
        click_learn(n,d){
            let newObj={};
            if(d==undefined || d==''){
                d=''
            };
            newObj.id=d;
            newObj.name=n;
            //添加前判断当前数组中是否存在对象
            if(this.whether(this.Learningword,d)!=true){
                this.Learningword.push(newObj)
            }
            //如果点击的是全部则清空数组
            if(n==="全部"){
               this.Learningword=[];
               this.Learningword.push(newObj);
               this.orrallspan("learnld")
            }else{                
                this.deleteallspan(this.Learningword)
                this.setallcolor("learnld")
            }         
            this.showbtn=true;
            //根据电机的学段变更学科，学科应该是学段点击后合并去重的结果
            if(d!=''){
                this.learnsubject.forEach(ele=>{
                    if(ele.id===d){
                        
                        this.learnArr=this.learnArr.concat(ele.subjects)
                    }
                });
                let result = [];
                let obj = {};
                
                for(let i =0; i<this.learnArr.length; i++){
                    if(!obj[this.learnArr[i].id]){
                        result.push(this.learnArr[i]);
                        obj[this.learnArr[i].id] = true;
                    }
                }
                // console.log(this.learnArr)
                this.learnArr=result;                
                this.options2=result;
                // console.log(result)
            }
            //点击添加颜色
           $("#learnld").on('click','span', function () {
                $(this).css('color','#009791')               
            });
            this.returndata();
        },
        //学科点击
        discild(n,d){
           let newObj={};
           if(d==undefined || d==''){
                d=''
            };
            newObj.id=d;
            newObj.name=n;
            //添加前判断当前数组中是否存在对象
            if(this.whether(this.disciplineword,d)!=true){
                this.disciplineword.push(newObj)
            }
            //如果点击的是全部则清空数组
            if(n==="全部"){
               this.disciplineword=[];
               this.disciplineword.push(newObj)
                this.orrallspan("discild")                
            }else{
                this.deleteallspan(this.disciplineword)
                this.setallcolor("discild")
            }         
            this.showbtn=true;
             //点击添加颜色
           $("#discild").on('click','span', function () {
                $(this).css('color','#009791')               
            });
            this.returndata(); 
        },
        //职称点击
        theid(n,d){
            let newObj={};
            newObj.id=d;
            newObj.value=n;
            if(d==undefined || d==''){
                d=''
            };
            //添加前判断当前数组中是否存在对象
            if(this.whether(this.thetitleword,d)!=true){
                this.thetitleword.push(newObj)
            }
            //如果点击的是全部则清空数组
            if(n==="全部"){
               this.thetitleword=[];
               this.thetitleword.push(newObj)
               this.orrallspan("theid")
            }else{                
                this.deleteallspan(this.thetitleword)
                 this.setallcolor("theid")
            }
             //点击添加颜色
           $("#theid").on('click','span', function () {
                $(this).css('color','#009791')               
            });         
            this.showbtn=true;
            this.returndata();
        },
        //选择结果删除函数
        deletebtn(info,name,val){
            // console.log(info,val)
            if(info=="课程领域"){
                this.fieldword.splice(val,1);
                //删除的是领域
                let parfield=document.getElementById("field").children[1].children;                               
                
                //获取$field下所有的span标签                
                for (let i = 0; i < parfield.length; i++) {
                    if(parfield[i].innerText==name){
                        parfield[i].style.color="#666666" 
                    }                    
                };
                 //删除到最后时改变全部颜色
                if(val==0){
                    for (let i = 0; i < parfield.length; i++) {
                        if(parfield[i].innerText=="全部"){
                            parfield[i].style.color="#009791" 
                        }                    
                    }
                }

            }else if(info=="学段"){
                //变更学科内容                 
                let morenArr=this.options;//原始的数组，
                let nowchoose=this.Learningword;//当前选择的学段数组
                let newArr=[];//没有经过去重的原始数组
                nowchoose.forEach(ele=>{
                    morenArr.forEach(val=>{
                        if(ele.id==val.id){
                            newArr.push(val)
                        }
                    })
                });

                //根据点击的key值删除新生成的数组，并且合并去重展示
                newArr.splice(val,1);
                this.Learningword.splice(val,1);
                // console.log(newArr)
                let endArr=[];//用来存储合并的数组
                newArr.forEach(num=>{
                    endArr=endArr.concat(num.subjects)
                });
                // console.log(endArr)
                // //去重
                let result = [];
                let obj = {};
                for(let i =0; i<endArr.length; i++){
                    if(!obj[endArr[i].id]){
                        result.push(endArr[i]);
                        obj[endArr[i].id] = true;
                    }
                }
                endArr=result;
                // if(nowchoose.length==0){
                //     this.options2=this.allxueduan
                // }else{
                //     this.options2=endArr;
                // }
                this.options2=endArr;
                console.log("我是执行删除后的数组",this.options2)
                //获取$field下所有的span标签
                let parfield=document.getElementById("learnld").children[1].children;
                for (let i = 0; i < parfield.length; i++) {
                    if(parfield[i].innerText==name){
                       parfield[i].style.color="#666666" 
                    }
                    
                }
                //删除到最后时改变全部颜色
                if(this.Learningword.length==0){
                    for (let i = 0; i < parfield.length; i++) {
                        if(parfield[i].innerText=="全部"){
                            parfield[i].style.color="#009791"
                            this.options2=this.allxueduan
                            this.learnArr=[]
                        }                    
                    }
                }
                               
            }else if(info=="学科"){
                this.disciplineword.splice(val,1)
                 //获取$field下所有的span标签
                let parfield=document.getElementById("discild").children[1].children;
               
                for (let i = 0; i < parfield.length; i++) {
                    if(parfield[i].innerText==name){
                       parfield[i].style.color="#666666" 
                    }
                    
                }
                 //删除到最后时改变全部颜色
                if(val==0){
                    console.log(parfield)
                    for (let i = 0; i < parfield.length; i++) {
                        if(parfield[i].innerText=="全部"){
                            parfield[i].style.color="#009791" 
                        }                    
                    }
                }
            }else if(info=="职称"){
                this.thetitleword.splice(val,1)
                // 获取$field下所有的span标签
                let parfield=document.getElementById("theid").children[1].children;
                for (let i = 0; i < parfield.length; i++) {
                    if(parfield[i].innerText==name){                       
                       parfield[i].style.color="#666666" 
                    }                    
                }
                 //删除到最后时改变全部颜色
                if(val==0){
                    console.log(parfield)
                    for (let i = 0; i < parfield.length; i++) {
                        if(parfield[i].innerText=="全部"){
                            parfield[i].style.color="#009791" 
                        }                    
                    }
                }
            }
            this.returndata()
        },
        //重置xuanze
        deletechoose(){
            this.fieldword=[]
            this.Learningword=[]         
            this.disciplineword=[]
            this.thetitleword=[]
            //颜色全部重置到全部
            this.allcolor1=true
            this.allcolor2=true
            this.allcolor3=true
            this.allcolor4=true
            this.orrallspan("field");
            this.orrallspan("learnld")
            this.orrallspan("discild")
            this.orrallspan("theid")
            let spanbox=document.getElementsByClassName("spanbox")
            for (let i = 0; i < spanbox.length; i++) {
                spanbox[i].children[0].style.color="#009791"
                
            }
        },
        //重置全部颜色
        setallcolor(name){
            let parfield=document.getElementById(name).children[1].children;
            for (let i = 0; i < parfield.length; i++) {
                if(parfield[i].innerText=="全部"){
                    parfield[i].style.color="#666666" 
                }                   
            }
        },
        deleteallspan(arr){
            //删除全部
            for (let i = 0; i < arr.length; i++) {
                if(arr[i].name==="全部"){
                    arr.splice(i,1) 
                }
                
            }
        },
        orrallspan(name){
            //点击全部时将所有非全部变为灰色
            let children=document.getElementById(name).children[1].children;
            for (let i = 0; i < children.length; i++) {
                if(children[i].innerText!="全部" || children[i].innerText!="学程领科："){
                    children[i].style.color="#666666" 
                }                   
            } 
        },
        //将选择的结果返回给父组件
        returndata(){
            let endArr=[];
            endArr.push(this.fieldword)
            endArr.push(this.Learningword)
            endArr.push(this.disciplineword)
            endArr.push(this.thetitleword)
            this.$emit('getdata',endArr)
            // console.log("传递出去的搜索结果",endArr)
        },
        //获取学段学科课程领域
        //获取领域列表
        getfield(){
            let data={
                    number:1,
                    size :1000,
                };
                model.getclazzfield(data,(res)=>{
                    if(res.status==200){
                        this.clazzfield=res.data.content; 
                        this.closeloding() ;                    
                    }
                })
        },
        //获取职称
        gettitleinfo(){
            let data={
                type:"PROFESSIONALTITLE"
            }
            model.getexperttitle(data,(res)=>{               
                if(res.status==200){
                    this.options3=res.data;
                     this.closeloding()                    
                }
            })
        },

        //获取学段学科
        getstudentinfo(){
            model.getstudentinfo('',(res)=>{
                if(res.status==200){
                    //学段处理
                    this.options=res.data; 
                     this.closeloding()                                        
                    let newArr=[];
                    res.data.forEach(element => {
                        if(!!element.subjects){
                            newArr=newArr.concat(element.subjects) 
                        };                      
                    });
                    //将数据深拷贝一份避免共享内存
                    this.learnsubject=Object.assign(this.learnsubject,  this.options);
                    this.uniq(newArr)
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
                this.options2=result;
                this.allxueduan=result;                
        },
        //关闭loading
        closeloding(){
            if(this.clazzfield.length>0 && this.options3.length>0 && this.options.length>0){
                this.loading2=false
            }
        }
    },
        
}
</script>
<style lang="less" scoped>
.nav{
    .allcolor{
        color:#0eb7b0;
    };
    width: 1190px;
    overflow: hidden;
    margin: 0 auto;
    background-color: #ffffff;
    .slide-fade-enter-active {
    transition: all .3s ease;
    }
    
    .slide-fade-enter{
    transform: translateY(-10px);
    opacity: 0;
    }
    .choose{
        width: 1190px;
        overflow: hidden;
        div{
            float: left;
        }       
        .close_btn{
            display: inline-block;
            width: 11px;
            height: 11px;
            background: url('../../assets/img/expert/close.png') center center no-repeat;
            background-size: 100% 100%;
            margin-left: 7px;
        }
        button{
          padding: 4px 15px;
          background: rgba(51,191,169,0.06);
          border: 1px dashed #84CAC3;
          font-size: 16px;
            color: #009791;
            margin-top: 20px;
            margin-right: 10px;  
        }
    }
    .choose_list{
        width: 1190px;
        overflow: hidden;
        margin: 5px 0 14px 0;
        ul{
            width: 100%;
            overflow: hidden;
            li{
                width: 100%;
                overflow: hidden;
                margin-top: 12px;
                position: relative;
                .h1space{
                    opacity: 0;
                }
                h1{
                    font-size: 16px;
                    color: #333333;
                    letter-spacing: 0;
                    float: left;
                    line-height: 32px;
                    font-weight: 600;
                }
                span{
                    cursor: pointer;
                }
                .spancolor{
                    font-size: 16px;
                    color: #666666;
                    letter-spacing: 0;
                    margin-left: 20px;
                    cursor: pointer;
                    line-height: 32px;
                }
                .addclore{
                    color: #009791; 
                }
                .spanbox{
                    width: 1050px;
                    overflow: hidden;
                    float: left;
                    line-height: 32px;                
                }
                .morenav{
                    position: absolute;
                    bottom: 7px;
                    right: 0;
                    font-size: 14px;
                    cursor: pointer;
                    color: #0eb7b0;
                }               
            }
        } 
    }
}
</style>


