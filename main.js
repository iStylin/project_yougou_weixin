import App from './App';

// 导入网络请求的包
import {$http} from "@escook/request-miniprogram";
uni.$http = $http;
// 配置请求根路径
$http.baseUrl = "https://www.uinav.com";
// 请求开始前（请求拦截器）
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}
// 请求结束后（响应拦截器）
$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title="请求数据失败",duration=1500){
	uni.showToast({
		title:title,
		duration:duration,
		icon:'none'
	})
}

// #ifndef VUE3
import Vue from 'vue'
import store from '@/store/store.js'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store:store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif