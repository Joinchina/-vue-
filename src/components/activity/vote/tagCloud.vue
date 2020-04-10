<template>
	<div>
		<svg :width='width' :height='height' @mousemove='listener($event)'>
            <a :href="tag.href" :id="tag.id" v-for='tag in tags' @mouseover="mouserMove" @mouseout="mouseLeave">
                <text :x='tag.x' :y='tag.y' :font-size='28 * (height*2/(800-tag.z))' :fill-opacity='((400+tag.z)/600)' :fill="tag.color">{{tag.text}}</text>
            </a>
        </svg>
	</div>
</template>
<script>
	export default{
        props:["keyWords"],
		data() {
			return {
				width:800,
                height:600,
                tagsNum:20,
                RADIUS:300,
                speedX:Math.PI/600,
                speedY:Math.PI/600,
                tags: [],
                colorArr:['#2DB0FF','#FE5556','#FFB74A','#D741FF','#87F76C','#E46F32','#0ED5D0'],
                intervalFlag:false
			}
        },
		computed: {
			CX(){
                return this.width/2;
            },
            CY(){
               return this.height/2;
            }
		},
		created() {
            // this.width = document.documentElement.clientWidth * .42;
            this.height = document.documentElement.clientHeight *.6;
            this.RADIUS = document.documentElement.clientHeight * .27
			// let tags=[];
   //          for(let i = 0; i < this.tagsNum; i++){
   //              let tag = {};
   //              let k = -1 + (2 * (i + 1) - 1) / this.tagsNum;
   //              let a = Math.acos(k);
   //              let b = a * Math.sqrt(this.tagsNum * Math.PI)
   //              tag.text = i + 'tag';
   //              tag.x = this.CX +  this.RADIUS * Math.sin(a) * Math.cos(b);
   //              tag.y = this.CY +  this.RADIUS * Math.sin(a) * Math.sin(b); 
   //              tag.z = this.RADIUS * Math.cos(a);
   //              tag.color = this.colorArr[Math.floor(this.colorArr.length*Math.random())];
   //              tag.href = 'https://imgss.github.io'
   //              tags.push(tag)
   //          }
   //          this.tags = tags;
                
               //tags
                let tags=[];
                let len = this.keyWords.length;
                console.log("key======",this.keyWords);
                for(let i = 0; i < len; i++){
                    let tag = {};
                    let k = -1 + (2 * (i + 1) - 1) / len;
                    let a = Math.acos(k);
                    let b = a * Math.sqrt(len * Math.PI)
                    tag.text = this.keyWords[i];
                    tag.x = this.CX +  this.RADIUS * Math.sin(a) * Math.cos(b);
                    tag.y = this.CY +  this.RADIUS * Math.sin(a) * Math.sin(b); 
                    tag.z = this.RADIUS * Math.cos(a);
                    tag.color = this.colorArr[Math.round(this.colorArr.length*Math.random())%7];
                    console.log("colos===========",Math.floor(this.colorArr.length*Math.random()));
                    tag.href = 'javascript:void(0)';
                    tag.class = "tags";
                    tags.push(tag);
                }
                this.tags = tags;
		},
		mounted() {
			this.intervalFlag = setInterval(()=>{
                this.rotateX(this.speedX);
                this.rotateY(this.speedY);
            }, 17)
		},
		methods: {
            mouserMove(){
                clearInterval(this.intervalFlag);
            },
            mouseLeave(){
                this.intervalFlag = setInterval(()=>{
                    this.rotateX(this.speedX);
                    this.rotateY(this.speedY);
                }, 17)
            },
            onmouseStop(){
                console.log("mounshhhh");
            },
            rotateX(speedX){
                var cos = Math.cos(speedX);
                var sin = Math.sin(speedX);
                for(let tag of this.tags){
                    var y1 = (tag.y- this.CY) * cos - tag.z * sin  + this.CY;
                    var z1 = tag.z * cos + (tag.y- this.CY) * sin;
                    tag.y = y1;
                    tag.z = z1;
                } 
            },
            rotateY(speedY){
                var cos = Math.cos(speedY);
                var sin = Math.sin(speedY);
                for(let tag of this.tags){
                    var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
                    var z1 = tag.z * cos + (tag.x - this.CX) * sin;
                    tag.x = x1;
                    tag.z = z1;
                } 
            },
            listener(event){//响应鼠标移动
                var x = event.clientX - this.CX;
                var y = event.clientY - this.CY;
                this.speedX = x*0.0001>0 ? Math.min(this.RADIUS*0.00002, x*0.0001) : Math.max(-this.RADIUS*0.00002, x*0.0001);
                this.speedY = y*0.0001>0 ? Math.min(this.RADIUS*0.00002, y*0.0001) : Math.max(-this.RADIUS*0.00002, y*0.0001); 
            }
        }
	}
</script>

<style scoped>
    svg{
        overflow: visible;
        padding-top: 10px;
    }
</style>
