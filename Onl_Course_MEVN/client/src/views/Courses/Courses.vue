<template>
    <div class="courses grid wide">
        <SearchBar :categorySearch="'course'" />
        <section v-if="userStore.isActiveSearch === false">
            <h2 class="heading" style="border-bottom: 5px solid red;">Khóa học lập trình web</h2>
            <div class="courses--web row">
                <div class="col lg-3 md-5 col-8" v-for="(course, index) in coursesWeb" :key="course._id">
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

            <h2 class="heading" style="border-bottom: 5px solid blue;">Khóa học Machine learning</h2>
            <div class="courses--ml row">
                <div class="col lg-3 md-5 col-8" v-for="(course, index) in coursesML" :key="course._id">
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

            <h2 class="heading" style="border-bottom: 5px solid green;">Khóa học Cấu trúc dữ liệu và Giải thuật</h2>
            <div class="courses--algorithm row">
                <div class="col lg-3 md-5 col-8" v-for="(course, index) in coursesAlgorithm" :key="course._id">
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

            <h2 class="heading" style="border-bottom: 5px solid orange;">Các khóa học khác</h2>
            <div class="courses--other row">
                <div class="col lg-3 md-5 col-8" v-for="(course, index) in coursesOther" :key="course._id">
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

            <br />
            <br />
            <hr />
            <h2 class="heading">Khóa học dự kiến sắp ra mắt</h2>
            <div class="courses--comming row">
                <div class=" col lg-3 md-5 col-8" v-for="(course, index) in coming" :key="course._id">
                    <div class="course__item course__item--coming-soon">
                        <img :src="course.coverPhoto.url" alt="ảnh khóa học"
                            class="course__img course__img--coming-soon h-100">

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
        </section>
    </div>
</template>
  
<script>
import SearchBar from '../../components/SearchBar/SearchBar.vue';

import courseService from '../../services/course.service.js';
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
            coursesWeb: [],
            coursesML: [],
            coursesAlgorithm: [],
            coursesOther: [],
            coming: [],
            resultsSearch: []
        }
    },
    methods: {
        async assignValues() {
            const res = await courseService.coursesCategory('web');
            this.coursesWeb = res.data;
            const res1 = await courseService.coursesCategory('ml');
            this.coursesML = res1.data;
            const res2 = await courseService.coursesCategory('algorithm');
            this.coursesAlgorithm = res2.data;
            const res3 = await courseService.coursesCategory('other');
            this.coursesOther = res3.data;
            const resComingSoon = await courseService.allComingSoon();
            this.coming = resComingSoon.data;
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
.courses {
    min-height: 78vh;
}

.heading {
    margin-top: 2rem;
    line-height: 2.6rem;
}

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

    &.course__item--coming-soon {
        opacity: 0.6;
        pointer-events: none;
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

.course__img {
    object-fit: cover;
    width: 100%;
    border-radius: 6px;
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

.course__footer {
    color: #555;
}

.courses--web,
.courses--ml,
.courses--algorithm,
.courses--other,
.courses--comming {
    flex-wrap: nowrap;
    overflow-x: auto;
}

.courses--comming {
    margin-bottom: 1.5rem;
}

@media (max-width: 1023px) {
    .courses--comming {
        margin-bottom: 1rem;
    }
}

@media (max-width: 739px) {
    .heading {
        font-size: 1.2rem;
        line-height: 2rem;
    }
}
</style>