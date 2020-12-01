<template>
	<!-- 画廊，用于展示图片 -->
	<div v-if="pics.length">
		<!-- 单张图片 -->
		<div 
			:class="[
				'pic', 
				{
					'pics': isMult
				}
			]" 
		>
			<img 
				v-for="pic of pics"
				:class="[
					`pic-${picType}`,
					`${ isMult ? 'mult' : 'single' }`
				]" 
				:src="isMult ? pic.pcSquareUrl : pic.originUrl" 
			/>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		/**
		 * 图片数据 可以为数组
		 */
		pics: {
			type: Array,
			required: true
		}
	},

	computed: {
		/**
		 * 图片是否是复数
		 */
		isMult() {
			return this.pics.length > 1;
		},

		/**
		 * 单图的类型，宽图还是长图
		 */
		picType() {
			const { pics } = this;

			if( pics.length > 1 ) {
				return 'mult'
			}

			return pics.width > pics.height ? 'wide' : 'high'
		}
	}
}
</script>

<style lang="scss" scoped>
.pic {
	font-size: 0;

	.single {
		display: block;
		margin: 4px 0 0 4px;
		max-width: 338px;
		max-height: 338px;
	}
	
	.pic-wide {
		min-height: 170px;
	}

	.pic-high {
		min-width: 170px;
	}
	
}

.pics {
	display: flex;

	.mult {
		display: block;
		margin: 4px 0 0 4px;
		width: 110px;
		height: 110px;
	}
}

</style>