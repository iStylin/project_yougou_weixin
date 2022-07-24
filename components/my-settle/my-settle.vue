<template>
	<view class="my-settle-container">
		<!-- 全选框 -->
		<label class="radio" @click="changeAllState">
			<radio value="" :checked="isCheckAll" color="#C00000" /><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计：<text>￥{{totalMoney}}</text>
		</view>
		<!-- 结算 -->
		<view class="btn-settle" @click="settlement">
			结算({{checkedCount}})
		</view>

	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-settle",
		data() {
			return {};
		},
		computed: {
			...mapGetters('m_cart', ['checkedCount', 'total', 'totalMoney']),
			...mapGetters('m_user', ['addstr']),
			...mapState('m_user', ['token']),
			...mapState('m_cart',['cart']),
			// 是否全选
			isCheckAll() {
					return this.total === this.checkedCount
			}
		},
		methods: {
			...mapMutations('m_cart', ['updateAllGoodsState']),
			// 
			changeAllState() {
				this.updateAllGoodsState(!this.isCheckAll)
			},
			// 点击结算按钮
			settlement() {
				// 1、判断是否勾选了要结算的商品
				if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
				// 2、再判断用户是否选择了收货地址
				if (!this.addstr) return uni.$showMsg('请选择收货地址！')
				// 3、最后判断用户是否登录
				if (!this.token) return uni.$showMsg('请先登录！')
				
				// 4、实现微信支付
				this.payOrder();
			},
			// 微信支付
			async payOrder(){
				// 1. 创建订单
				// 1.1 组织订单的信息对象
				const orderInfo = {
					// 订单总价（此处写死￥0.01）
					// order_price:this.totalMoney,
					order_price:0.01,
					// 收货地址
					consignee_addr:this.addstr,
					// 订单数组goods_id、goods_number、goods_price
					goods:this.cart.filter(x => x.goods_state).map(x => ({goods_id:x.goods_id,goods_number:x.goods_number,goods_price:x.goods_price}))
				}
				// 1.2 发起请求创建订单
			    let result = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
				console.log(result)
				// 1.3 得到服务器响应的“订单编号”
				

			},
			// 显示倒计时
			showTips(n) {
				uni.showToast({
					// 不展示任何图标
					icon: 'none',
					// 提示的消息
					title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
					// 为页面添加透明遮罩，防止点击穿透
					mask: true,
					// 1.5 秒后自动消失
					duration: 1500
				})
			},
			// 延迟
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		// 底部固定定位
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #efefef;
		padding-left: 5px;
		background-color: white;

		.amount-box {
			text {
				color: #C00000;
			}
		}

		.btn-settle {
			line-height: 50px;
			background-color: #C00000;
			min-width: 100px;
			color: white;
			text-align: center;
		}
	}
</style>
