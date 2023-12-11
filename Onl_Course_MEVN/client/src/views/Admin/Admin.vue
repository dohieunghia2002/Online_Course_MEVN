<template>
    <div class="grid wide">
        <h1 class="title-page text-center">Hệ Thống Quản Trị {{ courseStore.company }}</h1>
        <div class="row">
            <div class="col lg-12">
                <div class="tabs" :key="idxCurTab">
                    <button class="tab__btn" type="button" @click="() => idxCurTab = 0">
                        Danh sách khóa học
                    </button>
                    <button class="tab__btn" type="button" @click="() => idxCurTab = 1">
                        Danh sách giáo viên
                    </button>
                    <button class="tab__btn" type="button" @click="() => idxCurTab = 2">
                        Danh sách học viên
                    </button>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="tab__content col lg-12 md-12" v-if="idxCurTab == 0">
                <div class="row">
                    <EntireCourse />
                </div>
            </div>

            <div class="tab__content col lg-12 md-12" v-else-if="idxCurTab == 1">
                <div class="row">
                    <Teachers />
                </div>
            </div>

            <div class="tab__content col lg-12 md-12" v-else>
                <div class="row">
                    <Students />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EntireCourse from './EntireCourse.vue';
import Teachers from './Teachers.vue';
import Students from './Students.vue';
import { useUserStore } from '../../stores/user.js';
import { useCourseStore } from '../../stores/course.js';

export default {
    components: { EntireCourse, Teachers, Students },
    setup() {
        const userStore = useUserStore();
        const courseStore = useCourseStore();
        return {
            userStore,
            courseStore
        }
    },
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
        },
    },
    async created() {
        if (this.userStore.account.role !== 'Admin') {
            this.$router.push({ name: 'login' });
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
.title-page {
    padding: 2rem 0;
}

.tab__btn {
    padding: 8px 12px;
    font-size: 1.2rem;
    outline: none;
    cursor: pointer;
    opacity: 0.4;

    &.active {
        background-color: $primary-color;
        color: $white-text-color;
        opacity: 1;
    }
}
</style>