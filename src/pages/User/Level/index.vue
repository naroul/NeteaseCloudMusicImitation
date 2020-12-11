<template>
	<!-- 用户等级 -->
	<div class="lv" v-if="info">
		<!-- 当前等级 -->
		<div class="n-lv">
			<div class="h3">
				当前等级：
				<span class="n-level-big">
					<i></i>
					{{ info.level }}
				</span>

				<span class="n-level-tips">等级数据每天下午2点更新</span>
			</div>

			<!-- 等级条 -->
			<div class="sub">
				<!-- 等级条背景 -->
				<div class="subbg">
					<div :style="{ width: `${lvWidth}px` }">
						<span></span>
					</div>
				</div>

				<!-- 等级条数字区 -->
				<div class="subnum">
					<!-- 白色分割区 -->
					<div class="divson">
						<span v-for="num of 9"></span>
					</div>

					<!-- 数字区 -->
					<div class="divnum">
						<ul>
							<li 
								:class="{
									'z-ov': info.level > num - 1,
									'z-on': info.level === num - 1,
								}" 
								v-for="num of 11"
							>
								{{ num - 1 }}
							</li>
						</ul>
					</div>
				</div>

			</div>
		</div>

		<!-- 等级特权 -->
		<div class="n-pow">
			<div class="h3">当前等级特权：</div>
			<ul class="powls">
				<li v-for="ls of powls">
					{{ ls }}
				</li>
			</ul>
		</div>

		<!-- 下一等级 -->
		<div class="n-nextlv">
			<div class="h4">
				{{ info.level === 10 ? "您已是最高等级：" : "距离下一个等级：" }}
				<span class="n-level" v-if="info.level !== 10">
					<i></i>
					{{ info.level + 1 }}
				</span>
			</div>

			<div class="uitl">
				<span class="tit">听歌：</span>
				<div class="bar">
					<div class="barbox">
						<span :style="{ width: `${(info.nowPlayCount / info.nextPlayCount) * 100}%` }"></span>
					</div>
				</div>
				还需听歌{{ info.nextPlayCount - info.nowPlayCount }}首
			</div>

			<div class="uitl">
				<span class="tit">登录：</span>
				<div class="bar">
					<div class="barbox">
						<span :style="{ width: `${(info.nextLoginCount / info.nowLoginCount) * 100}%` }">
						</span>
					</div>
				</div>
				还需登录{{ info.nextLoginCount - info.nowLoginCount }}天
			</div>
		</div>
	</div>
</template>

<script>
import { getLevel } from "@/apis/user";

export default {
	data() {
		return {
			info: null
		}
	},

	computed: {
		/**
		 * 等级条宽度固定为等级过半 比如：8级则为 85%
		 */
		lvWidth() {
			const { info: { level } } = this;

			return level === 10 ? 835 : 835 * (level + 0.5) / 10;
		},

		/**
		 * 等级特权说明列表
		 */
		powls() {
			return this.info.info.split("$");
		}
	},

	created() {
		getLevel().then(({ data }) => {
			this.info = data.data;
		})
	}
}
</script>

<style lang="scss" scoped>
.lv {
	width: 980px;
	padding: 70px 68px;
	min-height: 700px;
	margin: 0 auto;
	box-sizing: border-box;
	background-color: #fff;
	border: 1px solid #d3d3d3;
	border-width: 0 1px;

	.n-lv {
		margin-bottom: 52px;
	}

	.h3 {
		position: relative;
		margin-bottom: 4px;
    height: 32px;
		line-height: 32px;
		z-index: 1;
		zoom: 1;
    color: rgb(51, 51, 51);
    font-size: 22px;
	}

	.n-level-big {
		position: relative;
    z-index: 1;
    height: 32px;
    line-height: 32px;
    margin-left: 30px;
    zoom: 1;
    font-family: Arial;
    font-size: 24px;
    font-weight: 700;
		color: rgb(224, 58, 36);
		font-style: italic;
		
		i {
			position: absolute;
			left: -30px;
			top: 0px;
			z-index: 1;
			width: 28px;
			height: 30px;
			background: url("~@/assets/images/Common/mylevel.png");
			background-position: left 5px;
		}
	}

	.n-level-tips {
		position: absolute;
    z-index: 1;
    left: 0px;
    top: 101px;
    font-size: 12px;
    color: rgb(153, 153, 153);
	}

	.sub {
		width: 100%;
    position: relative;
    z-index: 1;
    padding-top: 31px;
    height: 34px;
		overflow: hidden;
		
		.subbg {
			width: 835px;
			height: 10px;
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 2;
			border-radius: 10px;
			background: #dcdfe6;

			@keyframes subbar {
				0% {
					width: 0;
				}

				100% {
					width: 100%;
				}
			}

			span {
				background: url("~@/assets/images/Common/mylevelbar.png") 0 0 repeat-y;
				width: 100%;
				height: 10px;
				display: block;
				border-radius: 10px;
				animation: subbar 2s;
			}
		}

		.subnum {
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			z-index: 2;

			.divson {
				position: absolute;
				left: 13px;
				bottom: 0;
				width: 100%;
				height: 10px;

				span {
					float: left;
					display: inline;
					width: 1px;
					background: #fff;
					height: 10px;
					margin-left: 80px;
				}
			}

			.divnum {
				position: absolute;
				left: 0;
				top: 0;
				font-family: 'Microsoft YaHei';
				font-size: 18px;
				color: #c4c6cc;
				width: 980px;

				li {
					float: left;
					width: 25px;
					height: 28px;
					line-height: 24px;
					display: inline;
					margin-right: 56px;
					text-align: center;
				}

				@keyframes show {
					0% {
						color: #c4c6cc;
					}

					100% {
						color: #ed5757;
					}
				}

				.z-ov {
					color: #ed5757;
					animation: show 3s;
				}

				.z-on {
					color: #fff;
					animation: show1 2s;
					background: url("~@/assets/images/Common/mylevel.png");
					background-position: 0 -50px;
				}
			}
		}
	}

	.n-pow {
		border-bottom: solid 1px #ddd;
		margin-bottom: 36px;
		
		.powls {
			padding-bottom: 10px;

			li {
				height: 30px;
				line-height: 30px;
				color: #666;
				padding-left: 13px;
				background: url("~@/assets/images/Common/mylevel.png") no-repeat 0 9999px;
				background-position: -17px -82px;
				font-size: 14px;
			}
		}

	}

	.n-nextlv {
		.h4 {
			height: 22px;
			line-height: 22px;
			font-size: 14px;
			color: #333;
			margin-bottom: 20px;
		}

		.uitl {
			font-size: 12px;
			color: #999;
			height: 32px;
			line-height: 32px;

			tit {
				line-height: 32px;
    		color: #666;
			}

			.bar {
				display: inline-block;
				width: 160px;
				height: 12px;
				margin-right: 6px;
				position: relative;
				zoom: 1;
			}

			.barbox {
				position: absolute;
				top: 7px;
				left: 0;
				z-index: 1;
				width: 160px;
				height: 4px;
				line-height: 0;
				background: #dcdfe6;
				border-radius: 4px;

				span {
					height: 100%;
					background: #f75757;
					border-radius: 4px;
					display: block;
				}
			}
		}
	}

	.n-level {
		position: relative;
    margin-left: 25px;
    zoom: 1;
    font-family: Arial;
    font-size: 18px;
    font-weight: 700;
    color: #e03a24;
		font-style: italic;
		
		i {
			position: absolute;
			left: -25px;
			top: 0;
			width: 25px;
			height: 22px;
			background: url("~@/assets/images/Common/mylevel.png");
			background-position: 0 -25px;
		}
	}
}
</style>