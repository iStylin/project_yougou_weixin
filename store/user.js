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
		}
	},
	
	state:()=>({
		addressInfo:JSON.parse(uni.getStorageSync('ADDRESSINFO')||'{}')
	}),
	getters:{
		addstr:(state)=>{
			if (!state.addressInfo.provinceName) return ''
			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return state.addressInfo.provinceName + state.addressInfo.cityName + state.addressInfo.countyName + state.addressInfo.detailInfo
		}
	}
}