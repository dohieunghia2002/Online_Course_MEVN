<template>
    <div class="grid wide" v-if="teacher._id.length > 0">
        <div class="row" style="min-height: 78vh;">
            <div class="sidebar--left col lg-3 lg-o-0 md-4 md-o-4 col-8 col-o-2" style="margin-top: 1.5rem;">
                <div class=" teacher__info">
                    <div class="teacher__avatar">
                        <img :src="teacher.avatar.url" alt="avatar" class="w-100">
                    </div>

                    <div class="info__general">
                        <h3 class="teacher__name">Họ tên: {{ teacher.fullName }}</h3>
                        <h4 class="info__email">Email: {{ teacher.email }}</h4>
                        <h4 class="info__phone">Số điện thoại: {{ spacePhoneNumber() }}</h4>
                        <p class="info__join-date" style="margin-top: 1rem;">Đã tham gia từ ngày {{
                            teacher?.joinDate.split('T')[0] }}</p>
                    </div>
                </div>
            </div>

            <div class="sidebar--right col lg-8 lg-o-1 md-10 md-o-1 col-10 col-o-1" style="margin-top: 1.5rem;">
                <h2 class="heading">Các khóa học của {{ teacher.fullName }}</h2>
                <section class="courses row">
                    <div class="col lg-6 md-6 col-12"
                        v-for="(course) in courseStore.coursesTeacher.slice(startSliceCourses(), endSliceCourses() + 1)"
                        :key="course._id">
                        <div class="course__item">
                            <router-link :to="{ name: 'course-detail', params: { id: course._id } }" class="course__link">
                                <div class="course-photo__wrapper w-100 h-100">
                                    <img :src="course.coverPhoto.url" style="border-radius: 5px;" class="w-100  h-100"
                                        alt="ảnh bìa khóa học">
                                </div>
                                <h3>{{ course.name }}</h3>
                            </router-link>
                        </div>
                    </div>
                </section>
                <Pagination v-if="courseStore.coursesTeacher.length > 0" />
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from '../../components/Pagination/Pagination.vue';
import userService from '../../services/user.service.js';
import { useUserStore } from '../../stores/user.js';
import { useCourseStore } from '../../stores/course.js'
import { usePaginationStore } from '../../stores/pagination.js';

export default {
    components: { Pagination },
    setup() {
        const userStore = useUserStore();
        const courseStore = useCourseStore();
        const paginationStore = usePaginationStore();
        return {
            userStore,
            courseStore,
            paginationStore
        }
    },
    data() {
        return {
            teacher: {
                _id: '',
                fullName: '',
                gender: true,
                email: '',
                role: '',
                phone: '',
                avatar: {},
                joinDate: Date.now()
            },
            coursesTeacher: []
        }
    },
    methods: {
        async assignValues() {
            if (this.userStore.account._id == this.$route.params.id) {
                this.teacher = this.userStore.account;
            }
            else {
                const res = await userService.detailTeacher(this.$route.params.id)
                this.teacher = res.data;
            }
            await this.courseStore.allCourseTeacher(this.teacher._id);

            // pagination
            this.paginationStore.totalQuantityItems = this.courseStore.coursesTeacher.length;
            this.paginationStore.quantityItemsPage = 4;
        },
        spacePhoneNumber() {
            const temp = this.teacher.phone.replace(/\s/g, '')
            return temp.replace(/(\d{3})(?=\d)/g, ' $1');
        },

        startSliceCourses() {
            return this.paginationStore.indexFirstItemPage();
        },
        endSliceCourses() {
            return this.paginationStore.indexLastItemPage();
        }
    },
    async created() {
        await this.assignValues();
        console.log(this.courseStore.coursesTeacher.slice(this.startSliceCourses(), this.endSliceCourses() + 1));
    }
}
</script>

<style lang="scss" scoped>
.heading {
    line-height: 3rem;
    border-bottom: 4px solid red;
}

.course__item {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    height: 200px;
    opacity: 1;

    &:hover {
        opacity: .8;
    }
}

.course__link {
    text-decoration: none;
    color: $black-text-color;
}

.teacher__avatar {
    width: 100%;
}

@media (max-width: 1023px) {
    .course__item {
        height: 150px;
    }

    .teacher__info {
        text-align: center;
    }

    .info__email,
    .info__phone,
    .info__join-date {
        font-size: .8rem;
    }
}

@media (max-width: 739px) {
    .teacher__avatar {
        width: 70%;
        margin-left: 15%;
    }

    .heading {
        font-size: 1.1rem;
        line-height: 2rem;
    }

    .row {
        margin-bottom: 1rem;
    }
}
</style>