<template>
    <div class="grid wide">
        <h1 class="title-page text-center">Hệ Thống Quản Trị BeWater Mind Academia</h1>
        <div class="row">
            <div class="col lg-12 md-12 col-12">
                <div class="tabs" :key="idxCurTab">
                    <button class="tab__btn" type="button" @click="() => idxCurTab = 0">
                        Khóa học đã khóa
                    </button>
                    <button class="tab__btn" type="button" @click="() => idxCurTab = 1">
                        Người dùng đã khóa
                    </button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="tab__content col lg-12 md-12 col-12" v-if="idxCurTab == 0">
                <div class="row">
                    <LockedCourses />
                </div>
            </div>

            <div class="tab__content col lg-12 md-12 col-12" v-else>
                <div class="row">
                    <LockedUser />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import LockedCourses from './LockedCourses.vue';
import LockedUser from './LockedUser.vue';

export default {
    components: { LockedCourses, LockedUser },
    data() {
        return {
            idxCurTab: 0
        }
    },
    methods: {
        activeTab() {
            const tabsElement = document.getElementsByClassName('tab__btn');
            for (let i = 0; i < tabsElement.length; i++) {
                if (i === this.idxCurTab) {
                    tabsElement[i].classList.add('active');
                }
                else {
                    tabsElement[i].classList.remove('active');
                }
            }
        }
    },
    async mounted() {
        this.activeTab();
    },
    async updated() {
        this.activeTab();
    }
}
</script>
<style lang="scss" scoped>
@import './styles.scss';
</style>