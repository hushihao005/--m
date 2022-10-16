<template>
  <div class="updatephoto">
    <img class="img" :src="img" alt="" ref="image"/>
    <div class="toobar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="OnConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'update-photo',
  data () {
    return {
      cropper: null
    }
  },
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    OnConfirm () {
      this.$toast.loading({
        message: '修改中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
      // 有两种获取裁剪结果的方法
      // 1. 基于服务器的裁剪使用 用getData来获取裁剪参数
      // this.cropper.getData()
      // 2. 纯前端裁剪使用 getCroppedCanvas 获取裁剪文件对象
        this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        // 接口要求是 multipart/form-data 就代表要传的是formdata对象格式的
        // 按照接口要求转换成formdata对象
          const formData = new FormData()
          formData.append('photo', blob)
          // 调用接口
          const { data } = await updateUserPhoto(formData)
          console.log(data)
          this.$emit('close')
          this.$emit('updatePhoto', data.data.photo)
          this.$toast.success('修改成功')
        })
      } catch (error) {
        this.$toast.fail('更新失败, 请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.updatephoto {
    background-color: #000;
    height: 100%;
    .toobar{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        .confirm, .cancel {
            width: 90px;
            height: 90px;
            font-size: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
    }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
