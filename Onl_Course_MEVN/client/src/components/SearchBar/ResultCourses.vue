<template>
    <h2 style="margin-top: .5rem;">Kết quả tìm kiếm</h2>
    <hr>
    <div class="result--courses row">
        <div class="col lg-3 md-4 col-6" v-for="(course, index) in courses" :key="course._id">
            <div class="course__item">

                <img :src="course.coverPhoto.url" alt="ảnh khóa học" class="course__img h-100">

                <div class="course__content text-center">
                    <h4 class="course__name">{{ course.name }}</h4>
                    <button type="button" class="btn--link" @click="routerLearningPage(course._id)">
                        Xem khóa học
                    </button>
                    <h5 class="course__teacher">Giáo viên: {{ course.teacherName }}</h5>
                </div>
                <h3 class="course__footer">{{ course.name }}</h3>
            </div>
        </div>
    </div>
</template>

<script>
import courseService from '../../services/course.service.js';
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
            courses: []
        }
    },
    methods: {
        async assignValues() {
            const res = await courseService.allCourses();
            if (res.status === 200) {
                this.entire = res.data;
            }

            const filteredCourses = this.entire.filter((course) => course.name.includes(this.userStore.contentSearch));
            this.courses = [...filteredCourses];
        },

        async routerLearningPage(id) {
            let flag = false;
            if (this.userStore.account.role === 'Student') {
                await this.userStore.getCoursesEnrolled(this.userStore.account._id);
                this.userStore.coursesStudent.forEach((course) => {
                    if (course._id == id) {
                        flag = true;
                        this.$router.push({ name: 'learning', params: { id: id } });
                    }
                })
            }
            if (!flag) {
                this.$router.push({ name: 'course-detail', params: { id: id } });
            }
        }
    },
    async created() {
        await this.assignValues();
    }
}
</script>
<style lang="scss" scoped>
.course__item {
    position: relative;
    height: 170px;
    margin-top: 1.5rem;
    margin-bottom: 2.5rem;
    border: 1px solid #777;
    border-radius: 6px;
    cursor: pointer;

    &:hover .course__content {
        display: flex;
    }
}

.course__content {
    position: absolute;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: $white-text-color;
    border-radius: 6px;
}

.course__name {
    font-size: 1.2rem;
    line-height: 3.2rem;
    color: $white-text-color;
}

.course__teacher {
    font-size: 1.1rem;
    line-height: 3rem;
}

.btn--link {
    padding: 5px 10px;
    border-radius: 25px;
    font-size: 1.05rem;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: $green-color;
        color: $white-text-color;
    }
}

.course__img {
    object-fit: cover;
    width: 100%;
    border-radius: 6px;
}

@media (max-width: 1023px) {
    .course__item {
        height: 138px;
        margin-bottom: 1.5rem;
    }

    .course__name,
    .course__teacher {
        display: none;
    }

    .course__footer {
        font-size: .9rem;
    }

    .btn--link {
        padding: 8px 14px;
        font-size: 1.2rem;
    }
}
</style>