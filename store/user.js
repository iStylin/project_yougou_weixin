export default {
	namespaced:true,

	mutations:{
		// 持久化存储到本地
		saveToLocal(state){
			uni.setStorageSync('ADDRESSINFO',JSON.stringify(state.addressInfo))
		},
		updateAddress(state,value){
			state.addressInfo = value
			this.commit('m_user/saveToLocal')
		},
		// 用户信息
		updateUserInfo(state,userInfo){
			state.userInfo = userInfo
			this.commit('m_user/saveUserInfoToLocal');
		},
		// 保存token
		saveToken(state,token){
			state.token = token
			this.commit('m_user/saveTokenToLocal')
		},
		// 将用户信息存储到本地
		saveUserInfoToLocal(state){
			uni.setStorageSync('USERINFO',JSON.stringify(state.userInfo))
		},
		// 将token持久化存储到本地
		saveTokenToLocal(state){
			uni.setStorageSync('TOKEN',state.token)
		},
		// 清除用户信息、token、addressInfo,本地存储的信息
		cleanInfo(state){
			state.addressInfo = {};
			state.token = '';
			state.userInfo = {};
			this.commit('m_user/saveToLocal')
			this.commit('m_user/saveUserInfoToLocal');
			this.commit('m_user/saveTokenToLocal')
		}
	},
	
	state:()=>({
		addressInfo:JSON.parse(uni.getStorageSync('ADDRESSINFO')||'{}'),
		// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo
		token:uni.getStorageSync('TOKEN')||'',
		userInfo:JSON.parse(uni.getStorageSync('USERINFO')||'{}')
	}),
	getters:{
		addstr:(state)=>{
			if (!state.addressInfo.provinceName) return ''
			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return state.addressInfo.provinceName + state.addressInfo.cityName + state.addressInfo.countyName + state.addressInfo.detailInfo
		}
	}
}