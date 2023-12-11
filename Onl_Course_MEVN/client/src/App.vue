<template>
  <Header />
  <div class="separate">
    <router-view />
  </div>
  <Footer />
  <Loading :key="userStore.isLoading" />
</template>

<script>
import Header from './components/Header/Header.vue';
import Footer from './components/Footer/Footer.vue';
import Loading from './components/Loading/Loading.vue';

import { useUserStore } from './stores/user.js';

export default {
  components: {
    Header,
    Footer,
    Loading
  },
  setup() {
    const userStore = useUserStore();
    return {
      userStore
    }
  }
}
</script>
<style lang="scss">
@import './assets/styles/grid.scss';

.separate {
  margin-top: calc($height-header + 12px);
}

// change color of play button in learning page
// .plyr__control.plyr__control--overlaid {
//   background-color: yellowgreen !important;
// }
</style>