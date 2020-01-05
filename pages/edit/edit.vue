<template>
	<view>
		<image :src="banner.coverUrl"></image>
		<view class="uni-padding-wrap uni-common-mt">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column">
					<input v-model="banner.title" class="uni-input" name="title" placeholder="请输入标题(不超过20字)" maxlength="20" focus />
				</view>
				<view class="uni-btn-v">
					<button class="primary" form-type="submit">{{ isEdit ? '保存' : '提交'}}</button>
					<button type="default" form-type="reset">重置</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	var graceChecker = require("../../common/graceChecker.js");
	export default {
		data() {
			return {
				banner: {
					coverUrl: '../../static/defaultCover.jpg',
					id: '',
					updateBy: 'system',
					title: ''
				},
				isEdit: true,
				rule: [{
					name: "title",
					checkType: "string",
					checkRule: "1,20",
					errorMsg: "标题不能为空"
				}]
			}
		},
		onLoad(event) {
			this.isEdit = event.type === 'edit'
			uni.setNavigationBarTitle({
				title: this.isEdit ? '编辑' : '新增'
			});
			try {
				if (this.isEdit) {
					this.banner = JSON.parse(decodeURIComponent(event.detail));
				}
			} catch (error) {
				uni.showToast({
					title: '数据解析失败',
					icon: 'none'
				});
				this.goBack()
			}
		},
		methods: {
			goBack() {
				setTimeout(() => {
					uni.navigateBack()
				}, 500)
			},
			goBackAndRefresh() {
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/index/index'
					});
				}, 500)
			},
			formSubmit(e) {
				console.log(JSON.stringify(e.detail))
				let isValid = graceChecker.check(e.detail.value, this.rule)
				if (isValid) {
					uni.showLoading({
						title: '处理中'
					});
					uni.request({
						url: this.CUSTOM_BASE_URL + '/swiper-item',
						method: this.isEdit ? 'PUT' : 'POST',
						data: this.banner,
						success: data => {
							uni.hideLoading()
							if (data.statusCode === (this.isEdit ? 204 : 201)) {
								uni.showToast({
									title: this.isEdit ? '数据更新成功' : '新增成功',
									icon: 'success'
								});
								this.goBackAndRefresh()
							} else {
								console.log('Error', data)
								uni.showToast({
									title: '系统错误',
									icon: 'none'
								});
							}
						},
						fail: (data, code) => {
							uni.hideLoading()
							console.log('fail' + JSON.stringify(data));
							uni.showToast({
								title: this.isEdit ? '数据更新失败' : '新增失败',
								icon: 'none'
							});
						}
					});
				} else {
					uni.showToast({
						title: '标题不能为空',
						icon: 'none'
					});
				}
			},
			formReset(e) {
				this.banner.title = ''
			}
		}
	}
</script>

<style>
	@import "../../common/uni.css";

	image {
		width: 100%;
	}

	.primary {
		background-color: #007AFF;
		color: #ffffff;
	}

	.primary:active {
		background-color: #0062ce;
	}
</style>
