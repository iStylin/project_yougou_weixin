import App from './App';

// 导入网络请求的包
import {
	$http
} from "@escook/request-miniprogram";
uni.$http = $http;
// 配置请求根路径
$http.baseUrl = "http://www.uinav.com";
// 请求开始前（请求拦截器）
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
	})
	//   // 判断请求的是否为有权限的 API 接口
	if(options.url.indexOf('/my/') !== -1) {
		options.header = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization: store.state.m_user.token,
		}
	}
}
// 请求结束后（响应拦截器）
$http.afterRequest = function() {
	uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title = "请求数据失败", duration = 1500) {
	uni.showToast({
		title: title,
		duration: duration,
		icon: 'none'
	})
}

// #ifndef VUE3
import Vue from 'vue'
import store from '@/store/store.js'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store: store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
