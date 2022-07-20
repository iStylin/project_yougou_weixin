<template>
	<view>
		<!-- 搜索框区 -->
		<view class="searchContainer">
			<search @click='toSearch'></search>
		</view>
		<!-- 轮播图区 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index" @click="toGoodsDetail(item.goods_id)">
				<view class="swiper-item"><img :src="item.image_src" alt=""></view>
			</swiper-item>
		</swiper>
		<!-- 分类导航区 -->
		<view class="navContainer">
			<view class="navItem" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
				<image :src="item.image_src" mode=""></image>
			</view>
		</view>
		<!-- 楼层数据 -->
		<view class="floorListContainer" v-for="item,index in floorList" :key="index">
			<!-- 标题 -->
			<view class="floor_title">
				<image :src="item.floor_title.image_src" mode=""></image>
			</view>
			<!-- 图片展示区 -->
			<view class="floor_images">
				<!-- 左侧大图区 -->
				<navigator class="left_bigImage" :url="item.product_list[0].url">
					<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
				</navigator>
				<!-- 右侧四个小图区 -->
				<view class="right_smallImage">
					<navigator :url="item2.url" class="right-img-item" v-for="item2,index in item.product_list" :key="index" v-if="index !== 0">
						<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
					</navigator>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		name:'home',
		data() {
			return {
				// 保存轮播图
				swiperList:[],
				// 分类导航区数据
				navList:[],
				// 保存楼层数据
				floorList:[],
			};
		},
		onLoad() {
			//获取轮播图数据
			this.getSwiperList();
			// 获取分类导航数据
			this.getNavList();
			// 获取楼层数据
			this.getFloorList();
		},
		methods:{
			// 获取轮播图数据的接口函数
			async getSwiperList(){
				try{
					let result = await uni.$http.get('/api/public/v1/home/swiperdata');
					// console.log("home",result);
					this.swiperList = result.data.message;
				}catch(e){
					return Promise.reject(new Error("faile!"))
				}
			},
			// 跳转到详情页
			toGoodsDetail(goodsId){
				uni.navigateTo({
					url:`/subpkg/goods-detail/goods-detail?goods_id=${goodsId}`
				})
			},
			// 获取首页分类导航区数据
			async getNavList(){
				let result = await uni.$http.get('/api/public/v1/home/catitems');
				if(result.statusCode === 200){
					this.navList = result.data.message;
				}else{
					return uni.$showMsg();
				}
			},
			// 首页导航栏点击事件处理函数
			navClickHandler(item){
				// 如果点击的分类就跳转到分类页面
				if(item.name === '分类'){
					uni.switchTab({
						url:'/pages/cate/cate'
					})
				}
			},
			// 获取首页楼层数据
			async getFloorList(){
				let result = await uni.$http.get('/api/public/v1/home/floordata');
				if(result.statusCode === 200){
					// 改造数据
					// console.log(result.data.message);
					result.data.message.forEach((floor)=>{
						floor.product_list.forEach((prod)=>{
							prod.url = '/subpkg/goods-list/goods-list?'+prod.navigator_url.split('?')[1];
						});
					})
					this.floorList = result.data.message;
				}else{
					uni.$showMsg();
				}
			},
			// 点击搜索框跳转到搜索页面
			toSearch(){
				uni.navigateTo({
					url:'/subpkg/my-search/my-search'
				})
			}
			
		}
	}
</script>

<style lang="scss">
swiper{
	height: 330rpx;
	.swiper-item,
	img{
		width: 100%;
		height: 100%;
	}
}
.searchContainer{
	// 设置搜索框吸顶效果
	position: sticky;
	top: 0;
	z-index: 99999;
}
.navContainer{
	display: flex;
	justify-content: space-around;
	margin: 30rpx 0;
	.navItem{
		width: 20%;
		height: 160rpx;
		// background-color: aquamarine;
		text-align: center;
		image{
			width: 100%;
			height: 150rpx;
			margin-bottom: 10rpx;
		}
	}
}
.floorListContainer{
	margin-bottom: 25rpx;
	.floor_title{
		height: 50rpx;
		image{
			height: 100%;
		}
	}
	.floor_images{
		width: 98%;
		height: 400rpx;
		// background-color: aqua;
		border-radius: 5rpx;
		margin: 0 auto;
		display: flex;
		.left_bigImage{
			margin-right: 10rpx;
		}
		.right_smallImage{
			display: flex;
			flex-wrap: wrap;
			justify-content: space-around;
		}
		
	}
}

</style>
