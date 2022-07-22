<template>
	<view v-if="goodsInfo.goods_name">
		<!-- 轮播图区 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,index) in goodsInfo.pics" :key="item.pics_id">
				<image :src="item.pics_big" mode="heightFix" @click="preview(index)"></image>
			</swiper-item>
		</swiper>

		<!-- 商品描述区 -->
		<view class="good-info-box">
			<!-- 价格 -->
			<view class="price">￥{{goodsInfo.goods_price}}.00</view>
			<!-- 描述主体区 -->
			<view class="goods-info-body">
				<view class="goods-name">{{goodsInfo.goods_name}}</view>
				<view class="favi">
					<uni-icons type="star"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费区 -->
			<view class="yf">运费：免运费</view>
		</view>

		<!-- 商品详细信息 -->
		<!-- 在页面结构中，使用 rich-text 组件，将带有 HTML 标签的内容，渲染为小程序的页面结构 -->
		<view class="goods-detail-container">
			<rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
		</view>

		<!-- 商品导航组件 -->
		<view class="goods_nav">
			<!-- fill 控制右侧按钮的样式 -->
			<!-- options 左侧按钮的配置项 -->
			<!-- buttonGroup 右侧按钮的配置项 -->
			<!-- click 左侧按钮的点击事件处理函数 -->
			<!-- buttonClick 右侧按钮的点击事件处理函数 -->
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				// 保存商品详细信息
				goodsInfo: [],
				// 保存goods_id
				goods_id: 0,
				total:0,
				// 左侧按钮组的配置对象
				options: [{
					icon: 'shop',
					text: '店铺'
				}, {
					icon: 'cart',
					text: '购物车',
					info: ''
				}],
				// 右侧按钮组的配置对象
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			};
		},
		onLoad(options) {
			this.goods_id = options.goods_id || ''
			this.getGoodsInfo()
		},
		methods: {
			// 获取商品信息api
			async getGoodsInfo() {
				const result = await uni.$http.get('/api/public/v1/goods/detail', {
					goods_id: this.goods_id
				})
				// console.log('gooddetail res',result)
				if (result.statusCode === 200) {
					this.goodsInfo = result.data.message
				} else {
					uni.$showMsg()
				}
			},
			// 点击轮播图进行图片预览
			preview(index) {
				// 调用 uni.previewImage() 方法预览图片
				uni.previewImage({
					// 预览时，默认显示点击的图片
					current: index,
					// 要预览的所有url地址的数组
					urls: this.goodsInfo.pics.map(picbig => picbig.pics_big)
				})
			},
			// 将m_cart中的mutations中addToCart方法映射到此处
			...mapMutations('m_cart', ['ADDTOCART']),
			// 点击底部导航左侧两个（商家、购物车）点击事件处理函数
			onClick(e) {
				if (e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			// 点击底部导航右侧两个（加入购车、立即购买）按钮点击事件处理函数
			buttonClick(e) {
				if (e.content.text === '加入购物车') {
					// 从当前data中解构出想要的商品信息
					let {
						goods_id,
						goods_name,
						goods_price,
						goods_small_logo,
						goods_state
					} = this.goodsInfo
					// 整理商品信息
					// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
					let goodInfo = {
						goods_id,
						goods_name,
						goods_price,
						goods_count: 1,
						goods_small_logo,
						goods_state
					}
					//
					this.ADDTOCART(goodInfo)
				}
			}
		},
		computed: {
			...mapState({
				cart: (state) => {
					return state.m_cart.cart
				}
			}),
		},
		watch:{
			// cart发生变化,就需要判断是否改变详情页下方购物车数字标:显示的是当前商品在购物车中数量
			cart:{
				deep:true,
				immediate: true,
				handler(newValue){
					// 通过数组的 find() 方法，找到购物车按钮的配置对象
					let findResult = this.options.find((x) => x.text === "购物车");
					if(findResult.text === '购物车'){
						this.$nextTick(()=>{
							newValue.forEach(item => {
								// this.good_id时string,item.good_id时number
								if(item.goods_id === this.goods_id * 1){
									findResult.info = item.goods_count
								}
							})							
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.good-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
				padding-right: 10px;
			}

			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}

		.yf {
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}

	.goods-detail-container {
		padding-bottom: 50px;
	}

	// 底部导航栏吸底
	.goods_nav {
		position: sticky;
		bottom: 0;
		width: 100%;
	}
</style>
