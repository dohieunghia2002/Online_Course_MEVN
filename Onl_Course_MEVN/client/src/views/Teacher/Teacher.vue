<template>
    <div class="teacher__wrapper grid wide">
        <SearchBar :categorySearch="'teacher'" />
        <section v-if="userStore.isActiveSearch === false" style="margin-top: 1rem;">
            <div class="row">
                <div class="col lg-3 md-4 col-6" v-for="(teacher) in teachers" :key="teacher._id">
                    <div class="teacher__item text-center">
                        <router-link :to="{ name: 'teacher-detail', params: { id: teacher._id } }" class="teacher__link">
                            <div class="avatar__wrapper">
                                <img :src="teacher.avatar.url" alt="avatar" class="teacher__avatar">
                            </div>
                            <div class="teacher__intro">
                                <h4 class="teacher__name">{{ teacher.gender ? 'Thầy' : 'Cô' }} {{ teacher.fullName }}</h4>
                                <h5 class="teacher__course" style="margin-top: 4px;">khóa học phổ biến:</h5>
                                <p>{{ teacher.coursesPopular }}</p>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
  
<script>
import SearchBar from '../../components/SearchBar/SearchBar.vue';
import userService from '../../services/user.service.js';
import { useUserStore } from '../../stores/user.js';

export default {
    components: { SearchBar },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            teachers: []
        }
    },
    methods: {
        async assignValues() {
            const res = await userService.allTeacher();
            if (res.status === 200) {
                this.teachers = res.data;
            }
        }
    },
    async created() {
        await this.assignValues();
    }
}
</script>
<style lang="scss" scoped>
.teacher__wrapper {
    min-height: 78vh;
}

.teacher__item {
    margin-top: .5rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    height: 280px;
    border: 1px solid rgb(31, 31, 37);
    border-radius: 8px;
    overflow: hidden;
}

.teacher__link {
    display: block;
    height: 100%;
    text-decoration: none;
    opacity: 1;

    &:hover {
        opacity: .8;
    }
}

.avatar__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(225, 234, 246);
    height: 72%;

    .teacher__avatar {
        object-fit: cover;
        width: 64%;
        border-radius: 50%;
        box-shadow: 1px 3px 3px rgba(0, 0, 0, .4);
    }
}

.teacher__intro {
    height: 28%;
    background-color: $primary-color;
    opacity: 0.75;
    color: $white-text-color;

    .teacher__name {
        line-height: 1.6rem;
    }
}

@media (max-width: 1023px) {
    .teacher__item {
        height: 216px;
    }

    .avatar__wrapper {
        height: 66%;
    }

    .teacher__intro {
        height: 34%;

        .teacher__name {
            line-height: 1.2rem;
        }
    }
}
</style>