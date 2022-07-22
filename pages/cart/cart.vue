<template>
	<view>
		cart
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import badgeMix from '@/mixins/tabbar-badge.js'
 	export default {
		data() {
			return {
				
			};
		},
		mixins:[badgeMix],
		onLoad() {
			// 调用mixins中的方法设置tabbar购物车徽标
			this.setBadge()
		},
		computed:{
			// 购物车中商品总数量
			...mapGetters('m_cart',['total'])
		},
	}
</script>

<style lang="scss">

</style>
