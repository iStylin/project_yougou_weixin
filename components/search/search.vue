<template>
	<view class="search-container">
		<view class="search-box" @click="$emit('click')">
			<uni-icons type="search" size="17" ></uni-icons>
			<text class="palceholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"search",
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.search-container{
	height: 50px;
	background-color: #464B5D;
	padding: 0 10px;
	display: flex;
	align-items: center;
	.search-box{
		height: 36px;
		background-color: #fff;
		border-radius: 18px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.palceholder{
			margin-left: 5px;
			font-size: 15px;
		}
	}
}
</style>