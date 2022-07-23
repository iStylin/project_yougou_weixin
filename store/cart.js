export default {
	namespaced:true,

	mutations:{
		saveCartToLocal(state){
			uni.setStorageSync('CART',JSON.stringify(state.cart))
		},
		// 复选框状态变化
		updateGoodsState(state,goods){
			let findResult = state.cart.find(x => x.goods_id === goods.goods_id)

			if(findResult){
				// 1、修改state中cart中的goods_state状态
				findResult.goods_state = !goods.goods_state
				// 2、修改本地数据
				this.commit('m_cart/saveCartToLocal')
			}
		},
		// 数量变化
		updateGoodsNum(state,obj){
			let {value,goods} = obj;
			// 找到当前正在修改的项
			let findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if(findResult){
				// 1、修改state中cart的goods_count
				findResult.goods_count = value
				// 2、修改本地数据
				this.commit('m_cart/saveCartToLocal')
			}
			
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
		},
		// 修改商品选中状态
		updateAllGoodsState(state,newState){
			state.cart.forEach(item => {
				item.goods_state = newState
			})
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
		},
		// 计算选中的数量
		checkedCount:(state) => {
			let count = 0;
			state.cart.forEach(item => {
				if(item.goods_state === true){
					count += item.goods_count
				}
			})
			return count;
		},
		// 计算合计
		totalMoney(state){
			return state.cart.filter(item => item.goods_state===true).reduce((total,good) => total += good.goods_count*good.goods_price,0).toFixed(2)
			
		}
	}
}