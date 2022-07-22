<template>
	<view>
		my
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		data() {
			return {
				
			};
		},
		mixins:[badgeMix],
		onLoad() {
			// 调用mixins中设置购物车徽标的方法
			this.setBadge()
		}
	}
</script>

<style lang="scss">

</style>
