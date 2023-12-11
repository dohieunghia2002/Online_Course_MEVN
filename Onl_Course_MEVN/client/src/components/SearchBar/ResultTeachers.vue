<template>
    <h2 style="margin-top: 1rem;">Kết quả tìm kiếm</h2>
    <hr>
    <div class="result--teachers row">
        <div class="col lg-3 md-4 col-6" v-for="(teacher, index) in teachers" :key="teacher._id">
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
</template>

<script>
import userService from '../../services/user.service.js';
import { useUserStore } from '../../stores/user.js';

export default {
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            entire: [],
            teachers: []
        }
    },
    methods: {
        async assignValues() {
            const res = await userService.allTeacher();
            if (res.status === 200) {
                this.entire = res.data;
            }

            const filteredTeacher = this.entire.filter((teacher) => teacher.fullName.includes(this.userStore.contentSearch));
            this.teachers = [...filteredTeacher];
            console.log(this.teachers);
        },
    },
    async created() {
        await this.assignValues();
    }
}
</script>
<style lang="scss" scoped>
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
        height: 200px;
        margin-bottom: .5rem;
    }

    .avatar__wrapper {
        height: 63%;

        .teacher__avatar {
            width: 54%;
        }
    }

    .teacher__intro {
        height: 37%;

        .teacher__name {
            line-height: 1.2rem;
        }
    }
}
</style>