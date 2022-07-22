import Vue from 'vue'
import Vuex from 'vuex'

// 导入购物车模块
 import cart from '@/store/cart.js'

Vue.use(Vuex)

// 创建store实例对象
const store = new Vuex.Store({
	modules:{
		m_cart:cart
	}
})

export default store