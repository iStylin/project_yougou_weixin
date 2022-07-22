export default {
	namespaced:true,

	mutations:{
		saveCartToLocal(state){
			uni.setStorageSync('CART',JSON.stringify(state.cart))
		},
		ADDTOCART(state,goodInfo){
			// 查看当前物品是否已经在当前的cart中
			// 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
			let result = state.cart.find((x) => x.goods_id === goodInfo.goods_id)
			if(!result){
				// 购物车中还不存在
				state.cart.push(goodInfo)
			}else{
				// 购物车中已经存在,将此商品count+1
				result.goods_count += 1;
			}
			uni.$showMsg('加入购物车成功');
			// 持久化存储cart数据
			this.commit('m_cart/saveCartToLocal')
		}
	},
	
	state:()=>({
		// 购物车的数组，用来存储购物车中每个商品的信息对象 cart:[{goods_id, goods_name,...} , { }....]
		// 每个商品的信息对象，都包含如下 6 个属性：
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		cart:JSON.parse(uni.getStorageSync('CART')|| '[]'),
	}),
	getters:{
		// 购物车中商品总数量
		total:(state)=>{
			let count = 0;
			state.cart.forEach(item => {
				count += item.goods_count
			})
			return count
		}
	}
}