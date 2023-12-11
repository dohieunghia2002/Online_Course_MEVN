<template>
  <div class="grid wide">
    <BannerIntro />
    <BannerSkill />
  </div>
</template>

<script>
import BannerIntro from './BannerIntro.vue';
import BannerSkill from './BannerSkill.vue';
import { useUserStore } from '../../stores/user.js';

export default {
  components: { BannerIntro, BannerSkill },
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    }
  },
  async created() {
    if (this.userStore.account.role == 'Admin') {
      this.$router.push('/admin');
    }
  }
}
</script>
<style lang="scss" scoped></style>