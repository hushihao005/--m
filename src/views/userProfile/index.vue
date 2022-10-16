<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
    ></van-nav-bar>

    <input type="file" hidden ref="file" @change="OnChange">

    <!-- 个人信息 -->
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        class="avator"
        fit="cover"
        round
        :src="user.photo"
      />
    </van-cell>
    <van-cell title="昵称" :value="user.name" is-link @click="isupdateNameShow = true"></van-cell>
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女' " is-link @click="isupdateGenderShow = true"></van-cell>
    <van-cell title="生日" :value="user.birthday" is-link @click="isupdateDateShow=true"></van-cell>

    <!-- 编辑昵称 -->
    <van-popup v-model="isupdateNameShow" style="height:30%;" position="bottom">
      <UpdateName v-if="isupdateNameShow" v-model="user.name" @close="isupdateNameShow=false" ></UpdateName>
    </van-popup>

    <!-- 编辑性别 -->
    <van-popup v-model="isupdateGenderShow" position="bottom">
      <UpdateGender v-if="isupdateGenderShow" @close="isupdateGenderShow=false" v-model="user.gender"></UpdateGender>
    </van-popup>

    <!-- 编辑生日 -->
    <van-popup v-model="isupdateDateShow" position="bottom">
      <updateDate v-if="isupdateDateShow" v-model="user.birthday" @close="isupdateDateShow=false"></updateDate>
    </van-popup>

    <!-- 编辑头像弹出层 -> 在选完文件后弹出 -->
    <van-popup v-model="isupdatePhotoShow" position="bottom" style="height:100%">
      <updatePhoto v-if="isupdatePhotoShow" :img="photoSrc" @close="isupdatePhotoShow=false" @updatePhoto = 'user.photo = $event'></updatePhoto>
    </van-popup>
  </div>
</template>

<script>
import { GetUserProfile } from '@/api/user'
import UpdateName from './components/updateName.vue'
import UpdateGender from './components/updateGender.vue'
import updateDate from './components/updateDate.vue'
import updatePhoto from './components/updatePhoto.vue'
export default {
  name: 'UserProfile',
  components: {
    UpdateName,
    UpdateGender,
    updateDate,
    updatePhoto
  },
  data () {
    return {
      user: {},
      isupdateNameShow: false,
      isupdateGenderShow: false,
      isupdateDateShow: false,
      isupdatePhotoShow: false,
      photoSrc: ''
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await GetUserProfile()
        this.user = data.data
        console.log(this.user)
      } catch (error) {
        this.$toast('获取信息失败, 请稍后再试')
      }
    },
    OnChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取blob数据
      const data = window.URL.createObjectURL(file)
      console.log(data)
      this.photoSrc = data
      this.isupdatePhotoShow = true

      // file-input如果重复选中一个文件 不会触发change事件
      // 解决方法就是每次清空file的value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile{
  .avator{
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}

</style>
