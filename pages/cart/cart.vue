<template>
	<view>
		<block v-if="cart.length!==0">
			<!-- 收货地址区 -->
			<my-address></my-address>
			<!-- 购物车列表标题区 -->
			<view class="cart-title">
				<!-- 图标 -->
				<uni-icons type="shop" size="18"></uni-icons>
				<text>购物车</text>
			</view>
			<!-- 商品列表区 -->
			<view class="goodsList-container">
				<uni-swipe-action>
					<block  v-for="(goods,index) in cart" :key="index">	
						<uni-swipe-action-item :options="options" @click="handler">
							<view class="goodsItem">
									<!-- 左侧图片和复选框区 -->
									<view class="goods-item-left">
										<radio :checked="goods.goods_state" color="#C00000" @click="radioChangeHandler(goods)"></radio>
										<image :src="goods.goods_small_logo" mode=""></image>
									</view>
									<!-- 右侧商品文本描述区 -->
									<view class="goods-item-right">
										<text>{{goods.goods_name}}</text>
										<view class="price-check">
											<!-- 价格区 -->
											<view class="price">￥{{goods.goods_price}}.00</view>
											<!-- 数量增减区 -->
											<uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler($event,goods)"></uni-number-box>
										</view>
									</view>
							</view>
						</uni-swipe-action-item>
					</block>
				</uni-swipe-action>
			</view>
			<!-- 底部结算区 -->
			<my-settle></my-settle>
		</block>
		
		<!-- 购物车中没有数据时展示 -->
		<view class="empty-cart" v-else>
			<image src="../../static/cart_empty@2x.png" mode=""></image>
			<text class="tip-text">空空如也~</text>
		</view>
	</view>
</template>

<script>
	import { mapGetters , mapState , mapMutations} from 'vuex'
	import badgeMix from '@/mixins/tabbar-badge.js'
 	export default {
		data() {
			return {
				options: [{
				  text: '删除', // 显示的文本内容
				  style: {
					backgroundColor: '#C00000' // 按钮的背景颜色
				  }
				}]
			};
		},
		mixins:[badgeMix],

		computed:{
			// 购物车中商品总数量
			...mapGetters('m_cart',['total']),
			// 购物车数据
			...mapState('m_cart',['cart'])
		},
		methods:{
			// 映射store中mutation中的方法
			...mapMutations('m_cart',['updateGoodsState','updateGoodsNum']),
			// 复选框点击事件处理函数
			radioChangeHandler(goods){
				// console.log(!goods.goods_state)
				// 修改store中的cart状态为相反的状态
				this.updateGoodsState(goods)
			},
			 // 数量变化处理函数
			numChangeHandler(value,goods){
				this.updateGoodsNum({value,goods});
			},
			handler(){
				console.log('滑动')
			}
		}
	}
</script>

<style lang="scss">
.cart-title{
	height: 40px;
	display: flex;
	align-items: center;
	padding-left:10px;
	font-size: 14px;
	border-bottom: 1px solid #efefef;
	text{
		margin-left: 10px;
	}
}
.goodsList-container{
	padding-bottom: 50px;
	.goodsItem{
		display: flex;
		border-bottom: 1px solid #D4D5D5;
		padding:10px;
		justify-content: space-between;
		.goods-item-left{
			display: flex;
			align-items: center;
			margin-right: 10px;
			image{
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		.goods-item-right{
			display: flex;
			flex-direction: column;
			font-size: 12px;
			justify-content: space-between;
			.price-check{
				display: flex;
				justify-content: space-between;
				.price{
					color: #C00000;
					font-size: 16px;
				}
			}
		}
	}
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  image {
    width: 90px;
    height: 90px;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
