<template>
	<view>
		<view class="address-choose-box" v-if="!addressInfo.cityName">
			<button type="primary" size="mini" @click="chooseAddress">请选择收获地址+</button>
		</view>
		<!-- 地址列表 -->
		<view class="address-list" v-else @click="chooseAddress">
			<view class="person">
				<view class="name">
					收货人：{{addressInfo.userName}}
				</view>
				<view class="number">
					联系电话：{{addressInfo.telNumber}}
					<uni-icons type="forward"></uni-icons>
				</view>
			</view>
			<view class="address">
				收货地址：{{addstr}}
			</view>
		</view>
		<!-- 底部边框线 -->
		<image src="../../static/cart_border@2x.png" mode=""></image>
	</view>
</template>

<script>
	import {mapMutations,mapState,mapGetters} from 'vuex'
	export default {
		name:"my-address",
		data() {
			return {
			};
		},
		computed:{
			...mapState('m_user',['addressInfo']),
			// 拼接收货地址
			...mapGetters('m_user',['addstr'])
		},
		methods:{
			...mapMutations('m_user',['updateAddress']),

			// 点击选择地址按钮回调函数
			async chooseAddress(){
				// 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
				//    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
				let [err,success] = await uni.chooseAddress()
				if(err === null && success.errMsg === 'chooseAddress:ok'){
					// this.addresInfo = success
					this.updateAddress(success)
				}else{
					return uni.$showMsg(err.errMsg)
				}
			}
		}
	}
</script>

<style lang="scss">
.address-choose-box{
	height: 90px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.address-list{
	padding: 10px;
	font-size: 12px;
	.person{
		display: flex;
		justify-content: space-between;
		.number{
			uni-icons{
				margin-left: 10px;
			}
		}
	}
	.address{
		margin-top: 10px;
	}
}

image{
	display: block;
	width: 100%;
	height: 5px;
}
</style>