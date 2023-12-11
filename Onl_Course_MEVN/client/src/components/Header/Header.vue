<template>
    <header class="header">
        <div class="h-100" v-if="!isUrlAdmin">
            <HeaderPC />
            <HeaderMobile />
        </div>
        <div class="h-100" v-else>
            <HeaderAdmin />
        </div>
    </header>
</template>

<script>
import HeaderPC from './HeaderPC.vue';
import HeaderAdmin from './HeaderAdmin.vue';
import HeaderMobile from './HeaderMobile.vue';
import { useUserStore } from '../../stores/user.js';

export default {
    components: {
        HeaderPC,
        HeaderAdmin,
        HeaderMobile
    },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    computed: {
        isUrlAdmin() {
            const temp = JSON.parse(localStorage.getItem('user'));
            if (temp) {
                const isAdmin = temp.account?.role == 'Admin';
                if (isAdmin) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else return false;
        }
    }
}
</script>
<style lang="scss" scoped>
.header {
    height: $height-header;
    background-color: rgb(223, 240, 247);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
}
</style>