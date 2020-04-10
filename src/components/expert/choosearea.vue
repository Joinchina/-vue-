<template>
    <div class="citycontent">
       <el-cascader
            expand-trigger="hover"
            placeholder="专家所在地"
            :options="options"
            :props="optionProps"
            v-model="selectedOptions"
            @change="handleChange">
        </el-cascader>

    </div>    
</template>
<script>
// import  cityoptions from './city.js'
import model from'@/model/expert/expert'
export default {
    data () {
        return {
           selectedOptions:[],
           options:[],
           value:'',//省
           city:'',//市 
           optionProps: {
                value: 'code',
                label: 'name',
                children: 'chrilden'
            }
        }
    },
    // props:['citycode'],
    // watch:{
    //     citycode:{ 
    //         handler (newV, oldV) {
    //             this.selectedOptions=newV
    //             console.log("子组件获取的",newV,oldV)
    //         },
    //         deep:true
    //     }
    // },
    created(){
        // this.options=cityoptions;
        this.getcity();
    },
    methods:{

       handleChange(value) {
            this.$emit("getcitydata",value)
       },
       getcity(){
           let data={
               level:2,
           }
           model.getcity(data,(res=>{
              
               if(res.status==200){
                   this.options=res.data
                    console.log("地区====",this.options)
               }
           }))
       },
       deletedata(){
           this.selectedOptions=[];
       },
   } 
}
</script>
<style lang="less" scoped>
.citycontent{
    width:240px;
    // float:left;
    // margin: 8px 0 0 30px;
}
</style>


