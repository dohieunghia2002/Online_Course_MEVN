<template>
    <div class="grid wide">
        <div class="detail-course row">
            <section class="side--left col lg-8 md-12 col-12">
                <h2 class="course__name">{{ infoCourse.name }}</h2>
                <p class="course__desc">{{ infoCourse.description }}</p>

                <h3 class="course__teacher">Giáo viên hướng dẫn: {{ infoCourse.teacherName }}</h3>

                <h3 class="course__results">Bạn sẽ học được gì?</h3>
                <div class="result__item" v-for="(effect) in infoCourse.benefits">
                    <font-awesome-icon :icon="['fas', 'chess-king']" style="color: rgb(250, 196, 19)" />
                    <span class="result__content">{{ effect }}</span>
                </div>

                <h2 class="date-launch">Đã ra mắt ngày: {{ infoCourse.createdDate }}</h2>
            </section>

            <section class="side--right col lg-4 lg-o-0 md-8 md-o-2 col-10 col-o-1">
                <div class="cover-photo" style="margin-top: 2rem;">
                    <img :src="infoCourse.coverPhoto.url" alt="cover photo" class="w-100 h-100">
                </div>

                <button type="button" class="btn--enroll" @click="enrollCourse()">
                    Đăng Ký Học
                </button>
                <p class="cnt">
                    <font-awesome-icon :icon="['fas', 'user-graduate']" />
                    Số học viên đã học: {{ infoCourse.quantityStudent }}
                </p>

                <p class="cnt">
                    <font-awesome-icon :icon="['fas', 'battery-full']" />
                    Tổng số bài học: {{ infoCourse.quantityLesson }} bài học
                </p>
            </section>
        </div>
    </div>
</template>

<script>
import courseService from '../../services/course.service.js';
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
            infoCourse: {
                _id: '',
                name: '',
                description: '',
                benefits: [],
                quantityStudent: 0,
                quantityLesson: 0,
                teacherName: '',
                coverPhoto: {},
                createdDate: ''
            },
            coursesStudent: []
        }
    },
    methods: {
        async assignValues() {
            const res = await courseService.detailCourse(this.$route.params.id);
            if (res.status === 200) {
                this.infoCourse._id = res.data._id;
                this.infoCourse.name = res.data.name;
                this.infoCourse.description = res.data.description;
                this.infoCourse.benefits = res.data.benefits;
                this.infoCourse.quantityLesson = res.data.quantityLesson;
                this.infoCourse.quantityStudent = res.data.quantityStudent;
                this.infoCourse.teacherName = res.data.teacherName;
                this.infoCourse.coverPhoto = res.data.coverPhoto;
                this.infoCourse.createdDate = res.data.createdDate.split('T')[0];
            }

            if (this.userStore.account.role == 'Student') {
                const resCouresStudent = await userService.coursesStudent(this.userStore.account._id);
                if (resCouresStudent.status === 200) {
                    this.coursesStudent = resCouresStudent.data.courses;
                }
            }
        },

        async enrollCourse() {
            if (this.userStore.account._id.length === 0) {
                this.$router.push('/login')
            }

            const res = await courseService.enrollCourse({ course: this.$route.params.id }, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Đăng ký khóa học thành công');
                this.$router.push({ name: 'learning', params: { id: this.infoCourse._id } });
            }
        },

        async disableEnroll() {
            const btnEnroll = document.getElementsByClassName('btn--enroll')[0];

            if (this.userStore.account.role === 'Teacher') {
                btnEnroll.disabled = true;
            }

            for (let i = 0; i < this.coursesStudent.length; i++) {
                if (this.coursesStudent[i]._id == this.$route.params.id) {
                    btnEnroll.disabled = true;
                    btnEnroll.innerHTML = 'Bạn đã đăng ký';
                    break;
                }
            }
        }
    },
    async created() {
        await this.assignValues();
    },
    async updated() {
        await this.assignValues();
        await this.disableEnroll();
    }
}
</script>

<style lang="scss" scoped>
.detail-course {
    min-height: 78vh;
}

.course__name {
    margin-top: 2rem;
}

.course__desc {
    margin: .5rem 0;
}

.course__teacher,
.course__results {
    line-height: 3.2rem;
}

.result__item {
    line-height: 2rem;

    .result__content {
        margin-left: 10px;
    }
}

.side--right {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.cover-photo {
    height: 244px;
    border-radius: 6px;
    overflow: hidden;
}

.btn--enroll {
    margin-top: .5rem;
    font-size: 1.35rem;
    padding: 10px 15px;
    border-radius: 25px;
    border: 1px solid #6ee126;
    width: 48%;
    background-color: $green-color;
    color: $white-text-color;
    opacity: 1;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }

    &:disabled {
        background-color: #777;
        border: 1px solid #555;
    }
}

.date-launch {
    margin-top: 4rem;
}

.cnt {
    margin-top: 15px;
}

@media (max-width: 1023px) {
    .detail-course {
        flex-direction: column-reverse;
    }

    .date-launch {
        margin-top: 1.5rem;
        margin-bottom: 2rem;
    }
}

@media (max-width: 739px) {
    .cover-photo {
        height: 200px;
    }

    .btn--enroll {
        font-size: 1.1rem;
        width: 50%;
    }
}
</style>