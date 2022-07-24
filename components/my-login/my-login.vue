<template>
	<view>
	  <view class="login-container">
		<!-- 提示登录的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<!--  open-type="getUserInfo" @getuserinfo="getUserInfo" -->
		<button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">登录后尽享更多权益</view>
	  </view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		name:"my-login",
		data() {
			return {
				
			};
		},
		methods:{
			...mapMutations('m_user',['updateUserInfo','saveToken']),
			// 点击登录按钮获取用户信息
			// getUserInfo(e){
			// 	console.log(e)
			// }
			getUserProfile(){
				uni.getUserProfile({
				  desc: '你的授权信息',
				  success: (res) => {
					// 将信息存到 vuex 中
					this.updateUserInfo(res.userInfo)
					this.getToken(res)
				  },
				  fail: (res) => {
					return uni.$showMsg('您取消了登录授权')
				  }
				})
			},
			// 获取token值
			async getToken(info){
				// 由于获取token接口限制，此处将token定位一个死值
				const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
				
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				console.log(res)
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				
				// 整理参数
				const query = {
					code:res.code,
					encryptedData:info.encryptedData,
					rawData:info.rawData,
					iv:info.iv,
					signature:info.signature
				}
				// 接口限制此接口请求不到后台返回的token
				let result = await uni.$http.post('/api/public/v1/users/wxlogin',query)
				console.log('tokenresult',result)
				
				// 将token保存到vuex中
				this.saveToken(token)
			}
		}
	}
</script>

<style lang="scss">
.login-container{
	height: 750rpx;
	display: flex;
	flex-direction: column;
	// #f8f8f8
	background-color: #f8f8f8;
	justify-content: center;
	align-items: center;
	position: relative;
	overflow: hidden;
	.btn-login{
		width: 90%;
		border-radius: 100px;
		margin: 15px 0;
		background-color: #c00000;
	}
	  // 按钮下方提示消息的样式
	  .tips-text {
	    font-size: 12px;
	    color: gray;
	  }
	&::after{
		content: '';
		display: block;
		width: 100%;
		height: 40px;
		background-color: white;
		position: absolute;
		bottom: 0;
		left: 0;
		transform: translateY(50%);
		border-radius: 50%
	}
}
</style>