<template>
	<view style="padding-bottom: 40upx;">
		<uni-swiper-dot :info="listData" :current="current" :dots-styles="dotsStyles" :mode="mode" field="title">
			<swiper class="swiper-box" autoplay="true" @change="change">
				<swiper-item v-for="(item, index) in listData" :key="index">
					<image class="image" :src="item.coverUrl" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in listData" :key="key">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" :src="value.coverUrl"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{ value.title }}</view>
						<view class="uni-media-list-text-bottom">
							<text style="float: left;">{{ value.updateTime }} 更新</text>
							<text style="margin-right: 40upx;" @click="toDelete(value)">删除</text>
							<text @click="toEdit(value)">编辑 »</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-fab" @click="toAdd()">
			<view class="uni-fab__content">
				<view class="uni-fab__item uni-fab__item--first" />
			</view>
			<view class="uni-fab__circle uni-fab__plus">
				<view class="fab-circle-v"></view>
				<view class="fab-circle-h"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSection from '@/components/uni-section/uni-section.vue'
	import uniSwiperDot from '@/components/uni-swiper-dot/uni-swiper-dot.vue'
	var dateUtils = require('../../common/util.js').dateUtils;
	export default {
		components: {
			uniSection,
			uniSwiperDot
		},
		data() {
			return {
				listData: [],
				modeIndex: -1,
				styleIndex: -1,
				current: 0,
				mode: 'nav',
				dotsStyles: {
					backgroundColor: 'rgba(0, 0, 0, .4)',
					border: '1px rgba(0, 0, 0, .4) solid',
					color: '#fff',
					selectedBackgroundColor: 'rgba(0, 0, 0, .9)',
					selectedBorder: '1px rgba(0, 0, 0, .9) solid'
				}
			}
		},
		onLoad() {
			uni.setEnableDebug({
			    enableDebug: true
			})
			this.getList();
    },
		methods: {
			change(e) {
				this.current = e.detail.current
			},
			getList() {
				uni.showLoading({
					title: '加载中'
				});
				var data = {
					column: 'id,title,coverUrl,updateTime' //需要的字段名
				};
				uni.request({
					url: this.CUSTOM_BASE_URL + '/swiper-item/list',
					data: data,
					success: data => {
						if (data.statusCode == 200) {
							this.listData = this.getFormattedData(data.data)
						}
						uni.hideLoading()
					},
					fail: (data, code) => {
						console.log('fail' + JSON.stringify(data));
						uni.hideLoading()
						uni.showToast({
							title: '数据加载失败',
							icon: 'none'
						});
					}
				});
				if (this.listData) {
					console.log('this.listData', this.listData)
				}
			},
			getFormattedData(items) {
				var newItems = [];
				items.forEach(e => {
					newItems.push({
						id: e.id,
						coverUrl: e.coverUrl,
						title: e.title,
						updateTime: dateUtils.format(e.updateTime)
					});
				});
				return newItems;
			},
			toDelete(e) {
				let _this = this
				uni.showModal({
					title: '温馨提示',
					content: '确定删除该项内容？',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '删除中'
							});
							uni.request({
								url: this.CUSTOM_BASE_URL + '/swiper-item/' + e.id,
								method: 'DELETE',
								success: data => {
									if (data.statusCode == 204) {
										_this.getList()
										uni.showToast({
											title: '已删除',
											icon: 'success'
										});
									} else {
										uni.showToast({
											title: '系统错误',
											icon: 'none'
										});
									}
									uni.hideLoading()
								},
								fail: (data, code) => {
									console.log('fail' + JSON.stringify(data));
									uni.hideLoading()
									uni.showToast({
										title: '删除失败',
										icon: 'none'
									});
								}
							});
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			toEdit(e) {
				let detail = {
					coverUrl: e.coverUrl,
					id: e.id,
					createTime: e.createTime,
					title: e.title
				};
				uni.navigateTo({
					url: '/pages/edit/edit?detail=' +
						encodeURIComponent(JSON.stringify(detail)) + '&type=edit' // 斜杠全都不能少
				});
			},
			toAdd() {
				uni.navigateTo({
					url: '/pages/edit/edit?type=add' // 斜杠全都不能少
				});
			}
		}
	}
</script>

<style>
	@import "../../common/uni.css";
	@import "../../common/index.css"
</style>
