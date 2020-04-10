<!-- <template>
<div>

<ul>
	<li>
		<router-link :to = "{path:'/gentopic/courseeval',query:{type:'course',level:'EVALUATION'}}">课程评价</router-link>
	</li>
	<li>
		<router-link :to = "{path:'/gentopic/courseeval',query:{type:'course',level:'INTROSPECTION'}}">课程反思</router-link>
	</li>
	<li>
		<router-link :to = "{path:'/gentopic/courseeval',query:{type:'clazz',level:'EVALUATION'}}">项目评价</router-link>
	</li>
	<li>
		<router-link :to = "{path:'/gentopic/courseeval',query:{type:'clazz',level:'INTROSPECTION'}}">项目反思</router-link>
	</li>
</ul>

			
</div>

</template>

<script>
	export default{
		data(){
			return{

			}
		},
		methods:{
		},
	}
</script>

<style scoped="" lang="less">

</style>
 -->

 <template>
    <div class="pro-menu" >

        <ul class="menu-list">

            <template>
                <li v-for="(item,index) in orgItems"  @click="menu(orgItems,index)" :class="{'icon-active':index==currentIndex}" :key="index"> 
                    <router-link :to ="{ path:item.paths,query:{type: item.type,level:item.level}}" :class="item.class">{{item.name}}</router-link>
                </li>
            </template>
        </ul>

    </div>

</template>
<script>
// import bus from '@/global/bus'
import { getCurRole } from '@/filters/userVerify'
import bus from '@/global/bus'

export default {
    data(){
            return {
                role: getCurRole(),
                path:"/comtopic/courseeval",
                orgItems:[
                    {"name":"课程评价","class":"icon-evaluate","paths":this.path,"type":'evaluation',"level":"course","active":true},
                    {"name":"课程反思","class":"icon-reflect","paths":this.path,"type":'introspection',"level":"course","active":false},
                    {"name":"项目评价","class":"icon-evaluate","paths":this.path,"type":'evaluation',"level":"clazz","active":false},
                    {"name":"项目反思","class":"icon-reflect","paths": this.path,"type":'introspection',"level":"clazz","active":false}
                ],
            }
    },
    computed:{
        routerType () {
            return this.$route.query.type
        },
        routerLevel () {
            return this.$route.query.level
        },
        //通过计算属性得到当前是哪个导航
        currentIndex () {
            if(this.routerType=='evaluation'&&this.routerLevel=='clazz'){
                //当前为项目评价
                return 2
            }else if(this.routerType=='introspection'&&this.routerLevel=='course'){
                //当前为课程反思
                return 1
            }else if(this.routerType=='introspection'&&this.routerLevel=='clazz'){
                //当前为项目反思
                return 3
            }else{
                //当前为课程评价
                return 0
            }
        }
    },
    created(){
        this.menuRole();
    },
    methods:{
        menuRole () {
            this.refreshActive(this.orgItems);
        },
        menu(items,index){
            items.forEach(function (item,index) {
                item.active = false;
            })
            items[index]["active"] = true;
        },
        refreshActive(items){
            let thisrouter = this.$route.query;
            let level = thisrouter["level"];
            let type = thisrouter["type"];
            if(level&&type){
            	 items.forEach(function(item,index){
	             item.active = false;
	            	if(item.level == level && item.type == type){
	            		item.active = true;
	            	}
	            })
            }
        }
    },

}
</script>
<style scoped="" lang="less">
    @img:"../../assets/img/icon";
    @import "../../assets/less/icon.less";
    @import "../../assets/reset-element-ui/form.css";
    @borderColor: #f0f0f0;
    .pro-menu {
        float: left;
        width: 168px;
        background-color: #37323e;
        border-radius: 10px;
        color: #fff;
        height: auto;
        min-height: 621px;
        height: 621px;
        overflow: hidden;
        .menu-list {
            width: 100%;
            li {
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                cursor: pointer;
                border-bottom:1px solid #312d37;
                height: 60px;
                line-height: 60px;

            }


            li a:hover{
                background-color: #35a69d;
            }
            li a{
                color: #fff;
                text-decoration: none;
            }
            a.icon-evaluate {
                background:url("../../assets/img/template/courseeval.png") no-repeat 20px center;
                display: inline-block;
                padding-left: 46px;
                height: 60px;
                line-height: 60px;
                width: 100%;
                height: 100%;
            }
            a.icon-reflect {
                background:url("../../assets/img/template/coursereflect.png") no-repeat 20px center;
                height: 20px;
                padding-left: 46px;
                display: inline-block;
                height: 60px;
                line-height: 60px;
                width: 100%;
                height: 100%;
            }
            // a.icon-man {
            //     background:url("@{img}/icon-user-1.png") no-repeat 20px center;
            //     height: 20px;
            //     padding-left: 46px;
            //     display: inline-block;
            //     height: 60px;
            //     line-height: 60px;
            //     width: 100%;
            //     height: 100%;
            // }
            // a.icon-professor {
            //     background:url("@{img}/icon-user-5.png") no-repeat 20px center;
            //     height: 20px;
            //     padding-left: 46px;
            //     display: inline-block;
            //     height: 60px;
            //     line-height: 60px;
            //     width: 100%;
            //     height: 100%;
            // }
            // a.icon-student {
            //     background:url("@{img}/icon-user-4.png") no-repeat 20px center;
            //     height: 20px;
            //     padding-left: 46px;
            //     display: inline-block;
            //     height: 60px;
            //     line-height: 60px;
            //     width: 100%;
            //     height: 100%;
            // }
            .icon-active{
                background-color: #35a69d;
            }

            .icon-active-f{
                background: #35a69d;
                border-top-left-radius:10px;
                border-top-right-radius:10px;
            }
            li {
                &:first-child {
                    a {
                        border-top-left-radius:10px;
                        border-top-right-radius:10px;
                    }

                }
            }
        }
    }
    .clazz-list-comp {
        float: left;
        margin-left: 20px;
    }
</style>



