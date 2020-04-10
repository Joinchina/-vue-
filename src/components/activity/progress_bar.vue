<style scoped lang="less">
#wbar {
	height: 100%;
}
.x-ques .progress-out {
  width: 80%;
  height: 14px;
  float: left;
}
.x-ques .progress-in {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #ebebeb;
}
.x-ques .progress-bar {
  display: block;
  height: 100%;
  transition: width .5s;
	-moz-transition: width .5s;	
	-webkit-transition: width .5s;	
	-o-transition: width .5s;
}
.x-ques .progress-bar.blue {
  background-color: #4fbeea;
}
.x-ques .progress-bar.cyan {
  background-color: #a9ca77;
}
.x-ques .progress-bar.yellow {
  background-color: #fec457;
}
.x-ques .progress-num {
  box-sizing: border-box;
  width: 20%;
  float: left;
  padding-left: 18px;
  font-size: 20px;
  color: #999;
  line-height: 1em;
  margin-top: -4px;
}
.x-ques .progress-num .blue {
  color: #7dcfef;
}
.x-ques .progress-num .cyan {
  color: #c0d89c;
}
.x-ques .progress-num .yellow {
  color: #fed68a;
}

</style>
<template>
	<div id = "wbar">
		<span class="progress-in" :data-perc="precent">
			<span :style="styleObj" class="progress-bar"></span>
		</span>
	</div>
</template>
<script>
export default {
	props: ["selectedCounts","submitNum","bgColor"],
	computed: {
		precent: function() {
			
			if(!this.selectedCounts) {
				return 0;
			}else {
				return Math.round(this.selectedCounts / this.submitNum * 100);
				
			}
		},
		styleObj: function() {
			return {
				backgroundColor:this.bgColor,
				width:this.precent+'%'
			}
		}
	}
}
</script>