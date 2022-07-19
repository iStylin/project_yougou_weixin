<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧纵向导航 -->
			<scroll-view class="scroll-view-left" scroll-y="true" :style="{height:wh+'px'}">
				<view class='scroll-view-left-item' :class="[index===activeIndex?'active':'']"
					v-for="(navItem,index) in navList" :key="index" @click="navItemHandler(index,navItem)">{{navItem.cat_name}}</view>
			</scroll-view>

			<!-- 右侧宫格区 -->
			<scroll-view class="scroll-view-right" scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
				<view class='scroll-view-right-item' v-for="(nav2,index) in nav2List" :key="nav2.cat_id">
					<!-- 标题区 -->
					<view class="title">/{{nav2.cat_name}}/</view>
					<!-- 宫格内容区（图片+文字） -->
					<view class="grid-container">
						<view class="imgGrid" v-for="(nav3,index) in nav2.children" :key="nav3.cat_id" @click="gotoGoodList(nav3)">
							<image :src="nav3.cat_icon" mode="widthFix"></image>	
							<text>{{nav3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 滚动区高度
				wh: 0,
				// 保存左侧一级分类导航数据
				navList: [],
				// 保存二级分类数据
				nav2List:[],
				// 左侧导航栏点击索引
				activeIndex: 0,
				// 滚动条距离顶部位置
				scrollTop:0
			};
		},
		onLoad() {
			// 获取设备信息
			const sysInfo = uni.getSystemInfoSync();
			// 保存设备可用高度（屏幕高度减去底部tabbar和顶部navigator之后的）
			this.wh = sysInfo.windowHeight;

			//获取nav数据
			this.getNavList();
		},
		methods: {
			// 获取左侧导航栏数据
			async getNavList() {
				const result = await uni.$http.get('/api/public/v1/categories')
				if (result.statusCode === 200) {
					console.log('nav',result)
					this.navList = result.data.message;
					// 分类页加载默认显示第一个分类，所以此处将第一个一级分类的children赋值给二级分类，后续动态改变即可
					this.nav2List = result.data.message[0].children
				}else{
					return uni.$showMsg();
				}
			},
			//左侧导航栏点击事件处理函数
			navItemHandler(index,navItem){
				this.activeIndex = index;
				// 重新为二级分类赋值
				this.nav2List = this.navList[index].children;
				// 重置右侧滚动条距离顶部距离
				// 此处不能直接置为0，因为scrolltop值一样，不会生效，可以设置其值在0-1切换，用户察觉不到1px的偏差
				this.scrollTop = this.scrollTop===0?1:0;
			},
			// 点击三级分类，跳转到goodlist页面
			gotoGoodList(nav3){
				uni.navigateTo({
					url:'/subpkg/goods-list/goods-list?cid='+nav3.cat_id,
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;

		.scroll-view-left {
			width: 120px;

			.scroll-view-left-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				&.active {
					background-color: #FFFFFF;
					position: relative;

					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 40px;
						background-color: #c00000;
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}

		.scroll-view-right {
			.scroll-view-right-item {
				.title{
					width: 100%;
					line-height: 40px;
					// background-color: aqua;
					text-align: center;
				}
				.grid-container{
					  display: flex;
					  flex-wrap: wrap;
					.imgGrid{
						display: flex;
						flex-direction: column;
						width: 33.33%;
						margin-bottom: 10px;
						align-items: center;
						image{
							width: 60px;
							height: 60px;
						}
						text{
							font-size: 12px;
						}
					}	
				}
				
			}
		}
	}
</style>
