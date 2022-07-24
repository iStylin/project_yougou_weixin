<template>
	<view class="container">
		<!-- 用户未登录 -->
		<my-login v-if="!token"></my-login>
		<!-- 用户已登录 -->
		<my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	import badgeMix from '@/mixins/tabbar-badge.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {

			};
		},
		mixins: [badgeMix],
		computed: {
			...mapState('m_user', ['token'])
		},
		onLoad() {
			// 调用mixins中设置购物车徽标的方法
			this.setBadge()
		}
	}
</script>

<style lang="scss">
	page,
	.container {
		height: 100%;
	}
</style>
