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
		<view class="btn-settle">
			结算({{checkedCount}})
		</view>
		
	</view>
</template>

<script>
	import {mapGetters,mapMutations} from 'vuex'
	export default {
		name:"my-settle",
		data() {
			return {
				
			};
		},
		computed:{
			...mapGetters('m_cart',['checkedCount','total','totalMoney']),
			// 是否全选
			isCheckAll(){
				return this.total===this.checkedCount
			}
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			// 
			changeAllState(){
				this.updateAllGoodsState(!this.isCheckAll)
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container{
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
	.amount-box{
		text{
			color: #C00000;
		}
	}
	.btn-settle{
		line-height: 50px;
		background-color: #C00000;
		min-width: 100px;
		color: white;
		text-align: center;
	}
}
</style>