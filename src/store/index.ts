import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
export const useCommonStore = defineStore('common-store', () => {
  const userid = ref(localStorage.getItem('userid'))
  const token = ref(localStorage.getItem('token'))
  const userinfo = ref(localStorage.getItem('userinfo'))
})