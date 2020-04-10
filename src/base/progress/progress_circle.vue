<template>
	<div class="progress-circle">
		<svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" :style="{ stroke: bgColor }"/>
			<circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset" :style="{ stroke: barColor }" />
		</svg>
		<slot></slot>
	</div>
</template>
<script>
	export default {
		props: {
			radius: {
				type: Number,
				default: 100
			},
			percent: {
				type: Number,
				default: 0
			},
			barColor: {
				type: String,
				default: '#00bcbe'
			},
			bgColor: {
				type: String,
				default: '#d0e8ea'
			}
		},

		data() {
			return {
				dashArray: Math.PI * 100
			}
		},

		computed: {
			dashOffset() {
				return (1-this.percent)*this.dashArray
			}
		}
	}
</script>
<style scoped lang="less">
	.progress-circle {
		position: relative;
		circle {
			stroke-width:13px;
			transform-origin: center;
			transition: all 0.5s;
			&.progress-background {
				transform: scale(0.88);
				// stroke: #d0e8ea; 
			}
			&.progress-bar {
				transform: scale(0.88) rotate(-90deg);
        		// stroke: #00bcbe;
			}
		}
	}
</style>