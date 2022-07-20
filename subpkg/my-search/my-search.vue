<template>
	<view class="">
		<!-- 搜索框区 -->
		<view class="search-box">
			<uni-search-bar :focus="true" v-model="searchValue"  @input="input" cancelButton="none" :radius="100">
			</uni-search-bar>
		</view>
		<!-- 搜索内容提示区 -->
		<view class="search-suggest" v-if="searchSuggestList.length !== 0">
			<view class="sugeest-item" v-for="item,index in searchSuggestList" :key="item.goods_id" @click="gotoDetail(item)">
				<view class="text">{{item.goods_name}}</view>
				<uni-icons type="forward" ></uni-icons>
			</view>
		</view>
		<!-- 搜索历史显示区 -->
		<view class="history-box" v-else>
			<view class="title">
				<text>搜索历史</text>
				<uni-icons type="trash-filled" size="22" @click="cleanHistory"></uni-icons>
			</view>
			<view class="historyList">
				<uni-tag :inverted="true" v-for="item,index in historyListToShow" :key="index" :text="item" @click="changeSearchValue(item)"/>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				// 搜索框输入内容
				searchValue: '',
				//	延时器
				timer:null,
				// 保存搜索建议
				searchSuggestList:[],
				// 保存搜索历史
				historyList:['电视','冰箱','洗衣机']
			};
		},
		onLoad() {
			// 从本地存储获取搜索历史记录
			this.historyList =JSON.parse(uni.getStorageSync('SEARCHHISTORY')||'[]'); 
		},
		methods: {
			// 搜索框输入内容处理函数
			input(value){
				clearTimeout(this.timer);
				// 输入框输入内容过700ms再处理（节流）  避免每次输入框内容变化都会请求服务器
				this.timer = setTimeout(()=>{
					this.getSearchSuggest();
					this.saveToHistoryList()
				},700)
			},
			// 搜索建议请求API
			async getSearchSuggest(){
				if(this.searchValue === ''){
					this.searchSuggestList = [];
					return
				}
				// 发起请求
				let result = await uni.$http.get('/api/public/v1/goods/qsearch?query=' + this.searchValue)
				if(result.statusCode === 200){
					this.searchSuggestList = result.data.message
				}else{
					return uni.$showMsg()
				}
			},
			// 点击搜索提示项跳转到详情页
			gotoDetail(item){
				uni.navigateTo({
					url:'/subpkg/goods-detail/goods-detail?goods_id=' + item.goods_id
				})
			},
			// 将搜索记录保存到historyList中
			saveToHistoryList(){
				if(this.searchValue !== ''){
					// 删除数组中已经有记录，将输入框的记录添加到数组末尾，保证每次输入最后输入的记录位于，搜索历史的第一个
					for(let i = 0; i < this.historyList.length ; i++){
						if(this.historyList[i] === this.searchValue){
							this.historyList.splice(i,1)
						}
					}
					this.historyList.push(this.searchValue);
					// 将historyList存储到本地，防止页面切换数据丢失
					uni.setStorageSync('SEARCHHISTORY',JSON.stringify(this.historyList));
				}
			},
			// 点击搜索历史中的记录，替换输入框的数据
			changeSearchValue(item){
				this.searchValue = item
			},
			// 清楚历史记录
			cleanHistory(){
				// 清空 data 中保存的搜索历史
				this.historyList = [];
				uni.removeStorageSync('SEARCHHISTORY')
			}
		},
		computed:{
			// 将原historyList逆置，让最后输入的出现在搜索历史的第一个
			historyListToShow:function(){
				// reverse会改变原数组，此处使用浅拷贝，防止原数组被改变
				return [...this.historyList].reverse()
			}
		}

	}
</script>

<style lang="scss">
.search-box{
	// 设置搜索框吸顶效果
	position: sticky;
	top: 0;
	z-index: 999;
}
.search-suggest{
	padding: 0 10px;
	.sugeest-item{
		display: flex;
		justify-content: space-between;
		font-size: 12px;
		border-bottom: 1px solid darkgray;
		padding: 13px 0;
		.text{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			
		}
	}
}

.history-box{
	.title{
		display: flex;
		justify-content: space-between;
		padding: 10px 5px;
		font-size: 14px;
		border-bottom:1px solid darkgray;
	}
	.historyList{
		padding: 10px 5px;
		.uni-tag {
			margin-right: 5px;
		}
	}
}
</style>
