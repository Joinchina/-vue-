<template>
	<p class="time">{{d}}天 {{h}}小时 {{m}}分 <i class="red">{{s}}</i>秒</p>
</template>
<script>

	export default {
		data() {
			return {
				time: '',
				d: 0,
				h: 0,
				m: 0,
				s: 0,
			}
		},
		props : {
           endTime : {
               type : String
           }
       	},
		mounted () {
            this.timeDown();
        },
        methods : {
            
           timeDown:function() {
                let time = setInterval(() => {
                    const endTime = new Date(this.endTime+' 23:59:59')
                    const nowTime = new Date();
                    let leftTime = parseInt((endTime.getTime()-nowTime.getTime())/1000)
                    let d = parseInt(leftTime/(24*60*60)) || 0
                    let h = parseInt(leftTime/(60*60)%24) || 0
                    let m = parseInt(leftTime/60%60) || 0
                    let s = parseInt(leftTime%60) || 0
                    // console.log("leftTime", leftTime);
                    if(leftTime <= 0){
                        clearInterval(time);
                        this.d = 0;
                        this.h = 0;
                        this.m = 0;
                        this.s = 0;
                        this.$emit('time-end')
                    } else {
                        this.d = d;
                        this.h = h;
                        this.m = m;
                        this.s = s;
                        this.time = `${d}天${h}小时${m}分${s}秒`
                    }
                }, 500);
               
               
           },
           formate:function(time) {
               if(time>=10){
                   return time
               }else{
                   return `0${time}`
               }
           }
        },

        watch: {
            endTime: 'timeDown'
        }

	}
</script>
<style scoped lang="less">
	.time {
		display: inline-block;
		margin:0;
		padding: 0;
		.red {
			color: red;
		}
	}
</style>