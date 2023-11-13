<template>
  <div class="home">
    <van-nav-bar class="header">
        <template #right>
          <div class="btn-white" v-if="userinfo?.username">
            <span class="btn-white">{{userinfo?.username}}</span>
            <van-divider vertical :style="{ borderColor: '#ffffff' }" />
            <span class="btn-white" @click="logout">退出</span>  
          </div>
          <div v-else>
            <span class="btn-white" @click="show = true">登录</span>
            <van-divider vertical :style="{ borderColor: '#ffffff' }" />
            <span class="btn-white">注册</span>
          </div>
        </template>
        <template #left>
          <div class="btn-white">墨香待办</div>
        </template>
    </van-nav-bar>
    <!-- <van-button type="primary">home</van-button> -->
    <van-dialog v-model:show="show" title="登录" :showConfirmButton="false" :close-on-click-overlay="true">
      <van-form @submit="onSubmit"  label-width="50" colon validate-trigger="['onSubmit', 'onChange']">
        <van-cell-group inset>
          <van-field
            required
            v-model="username"
            name="username"
            label="账号"
            placeholder="请填写账号或者邮箱"
            :rules="[{ required: true, message: '请填写账号或者邮箱!' }]"
          />
          <van-field
            required
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-dialog>
    <van-notify></van-notify>
  </div>
</template>

<script setup lang="ts">
import Api from '@/api';
import { ref, onMounted, shallowRef } from 'vue';
// @ts-ignore
import CryptoJS from 'crypto-js';
import { secretPwKey } from '@/config/secret'; 
import { showNotify } from 'vant';
const show = ref(false)
const username = ref('');
const password = ref('');
const userinfo = shallowRef()
const onSubmit = async (values: any) => {
  try {
    const { username, password }  = values
    const encryptedPassword = CryptoJS.AES.encrypt(password, secretPwKey).toString();
    const { data } = await Api.login({ username,  password: encryptedPassword })
    userinfo.value = data
    show.value = false
    localStorage.setItem('token', data.token)
    localStorage.setItem('userid', data.id)
    localStorage.setItem('userinfo', JSON.stringify(data))
  } catch (error: any) {
    console.log(error, 'error')
    showNotify({ color: '#ad0000', background: '#ffe1e1', type: 'danger', message: error.message });
  }
}
const logout = () => {
  show.value = false
  username.value = ''
  password.value = ''
  localStorage.removeItem('token')
  localStorage.removeItem('userid')
  localStorage.removeItem('userinfo')
  userinfo.value = {}
}
onMounted(() => {
  let info = localStorage.getItem('userinfo')
  if (info) {
    info = JSON.parse(info)
    userinfo.value = info
  }
})
</script>

<style lang="scss" scoped>
.home {
  background-color: #fafbfc;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.header {
  width: 100vw;
  height: 44px;
  background-color: #a25158;
}
</style>