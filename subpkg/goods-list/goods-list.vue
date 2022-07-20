<template>
	<view>
		<view class="goods-list">
			<view class="goods-item" v-for="item,index in goodsList" :key="item.goods_id" @click="gotoDetail(item)">
				<view class="goods-item-left-image">
					<image :src="item.goods_small_logo||defaultPic" mode=""></image>
				</view>
				<view class="goods-item-right">
					<view class="title">
						{{item.goods_name}}
					</view>
					<view class="price">￥{{item.goods_price}}.00</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryParams:{
				  // 查询关键词
				  query: '',
				  // 商品分类Id
				  cid: '',
				  // 页码值
				  pagenum: 1,
				  // 每页显示多少条数据
				  pagesize: 10
				},
				// 列表数据
				goodsList:[],
				// 总数
				total:0,
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				// 上拉触底节流阀
				isLoading:false
				
			};
		},
		onLoad(options) {
			console.log('list页参数',options)
			this.queryParams.query = options.query || '';
			this.queryParams.cid = options.cid || ''
			// 页面一加载，请求数据
			this.getGoodsList();
		},
		methods:{
			// 获取商品列表数据
			async getGoodsList(cb){
				// 设置节流阀状态为true
				this.isLoading = true;
				// 解构data中的数据
				let {query,cid,pagenum,pagesize} = this.queryParams;
				let result = await uni.$http.get('/api/public/v1/goods/search',{query,cid,pagenum,pagesize})
				// 如果cb参数存在,网络请求完毕立即调用cb
				if(cb){
					cb();
				}
				if(result.statusCode === 200){
					console.log('goodslist',result)
					this.goodsList = [...this.goodsList,...result.data.message.goods];
					this.total = result.data.message.total;
					// 关闭节流阀
					this.isLoading = false
					return true
				}else{
					// 关闭节流阀
					this.isLoading = false
					uni.$showMsg();
				}
			},
			// 点击列表项跳转到对应的详情页
			gotoDetail(item){
				uni.navigateTo({
					url:'/subpkg/goods-detail/goods-detail?goods_id=' + item.goods_id
				})
			}
		},
		// 上拉触底函数，监听上拉触底事件
		onReachBottom() {
			// 如果正在请求数据，则不再发请求
			if(this.isLoading) return
			if(this.queryParams.pagenum*this.queryParams.pagesize >= this.total){
				return uni.$showMsg('朕也是有底线的！');
			} 
			// 请求成功当前页码加1
			this.getGoodsList().then(res=>{
				// console.log('@@@',res)
				// 只有网络请求成功才使当前页码加1
				if(res!==undefined){
					this.queryParams.pagenum += 1
				}
			})
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 置当前页为第一页
			this.queryParams.pagenum = 1;
			this.isLoading=false
			// 清空列表数据
			this.goodsList = [],
			this.total=0;
			// 重新发送请求获取数据
			this.getGoodsList(() => uni.stopPullDownRefresh());
			
		}
	}
</script>

<style lang="scss">
.goods-list{
	.goods-item{
		display: flex;
		border-bottom: 1px solid #D4D5D5;
		padding:10px;
		justify-content: space-between;
		.goods-item-left-image{
			margin-right: 5px;
			width: 100px;
			image{
			  width: 100px;
			  height: 100px;
			  display: block;
			}
		}
		.goods-item-right{
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title{
				font-size: 12px;
			}
			.price{
				color: #C00000;
			}
		}
	}
}
</style>
