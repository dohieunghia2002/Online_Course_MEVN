<template>
    <section class="learning-view grid wide" v-if="curLesson.videoUrl.length > 0" :key="curLesson.index">
        <div class="row">
            <div class="col lg-8 md-12 col-12">
                <div class="learning__head">
                    <h2 class="heading">{{ name }}</h2>
                    <label for="course-content" class="nav__bars-btn">
                        <font-awesome-icon :icon="['fas', 'bars']" class="menu__icon" />
                    </label>
                </div>
                <div class="sidebar-course__player" :key="this.curLesson.videoUrl">
                    <vue-plyr ref="plyr" @ended="onVideoEnded">
                        <div class="plyr__video-embed">
                            <iframe class="player" :src="`${curLesson.videoUrl}`" allowfullscreen
                                allowtransparency></iframe>
                        </div>
                    </vue-plyr>

                    <h3 style="line-height: 3rem; font-style: italic;">{{ curLesson.title }}</h3>
                </div>
            </div>
            <input type="checkbox" hidden id="course-content">

            <div class="col lg-4 sidebar-course__content">
                <div class="course-content__frame">
                    <h3 class="heading">Nội dung khóa học</h3>
                    <div class="lessons">
                        <div class="lesson__item" v-for="(lesson, index) in lessons" :key="lesson._id"
                            @click="chooseEpisode(index)">
                            <h4 class="lesson__title">{{ (index + 1) + '. ' + lesson.title }}</h4>
                            <font-awesome-icon :icon="['fas', 'check-circle']" class="icon-checked"
                                style="color: #26f816;" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { useUserStore } from '../../stores/user.js';
import userService from '../../services/user.service.js';
import lessonService from '../../services/lesson.service.js';
import courseService from '../../services/course.service.js';

export default {
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            lessons: [],
            name: '',
            curLesson: {
                index: 0,
                title: '',
                videoUrl: ''
                // videoUrl: 'https://www.youtube.com/embed/j1oLC0XIT3c?si=3smL3eX-_wJJizO1'
            },
            process: {
                idxLessonLearning: 0,
                isFinished: false
            },
            updateProcess: {
                course: '',
                idStudent: '',
                ep: 0
            }
        }
    },
    methods: {
        async assignValues() {
            const idCourse = this.$route.params.id;
            const resInfo = await courseService.detailCourse(idCourse);
            if (resInfo.status === 200) {
                this.name = resInfo.data.name;
            }
            const res = await userService.currentProcess(this.userStore.account._id, idCourse);
            if (res.status === 200) {
                this.process.idxLessonLearning = res.data.lessonLearning;
                this.process.isFinished = res.data.isFinished;
            }
            const res1 = await lessonService.lessonList(idCourse);
            if (res1.status === 200) {
                this.lessons = res1.data.lessons;
            }
            this.curLesson.index = this.process.idxLessonLearning;
            this.curLesson.title = this.lessons[this.curLesson.index].title;
            this.curLesson.videoUrl = this.lessons[this.curLesson.index].urlVideo;
        },

        async activeCurLesson() {
            const active = document.getElementsByClassName('lesson__item')[this.curLesson.index];
            active.classList.add('active');
        },

        chooseEpisode(idx) {
            this.curLesson.index = idx;
            this.activeCurLesson();
            this.curLesson.title = this.lessons[this.curLesson.index].title;
            this.curLesson.videoUrl = this.lessons[this.curLesson.index].urlVideo;
        },

        async handleDisableLesson() {
            let temp = document.getElementsByClassName("lesson__item");
            let lessonItems = Array.from(temp);
            for (let i = this.process.idxLessonLearning + 1; i < lessonItems.length; i++) {
                lessonItems[i].classList.add('disabled');
            }
        },

        async onVideoEnded() {
            this.updateProcess.course = this.$route.params.id;
            this.updateProcess.idStudent = this.userStore.account._id;
            this.updateProcess.ep = this.curLesson.index + 1;
            const res = await courseService.updateLessonLearning(this.updateProcess, this.userStore.accessToken);
            if (res.status === 200) {
                this.process.idxLessonLearning = await res.data;

                this.curLesson.index = this.curLesson.index + 1;
                await this.activeCurLesson();
                this.curLesson.title = await this.lessons[this.curLesson.index].title;
                this.curLesson.videoUrl = await this.lessons[this.curLesson.index].urlVideo;
            }
        }
    },
    async created() {
        await this.assignValues();
    },
    async updated() {
        await this.activeCurLesson();
        await this.handleDisableLesson();
    }
}
</script>

<style lang="scss" scoped>
.learning-view {
    min-height: 78vh;
}

.nav__bars-btn {
    display: none;
}

.learning__head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .menu__icon {
        width: 32px;
        height: 32px;
    }
}

.lessons {
    max-height: 60vh;
    overflow-y: scroll;
}

.heading {
    line-height: 3rem;
}

.lesson__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid $gray-color;
    opacity: 1;
    cursor: pointer;

    &:hover {
        opacity: 0.6;
    }
}

.lesson__item.active {
    background-color: $primary-color;
    opacity: 0.85;
    color: $white-text-color;
}

.lesson__item.disabled {
    background-color: #ddd;

    .lesson__title {
        color: #888;
        font-style: italic;
        font-weight: 500;
    }

    .icon-checked {
        display: none;
    }
}

@media (max-width: 1023px) {
    .row {
        position: relative;

        .sidebar-course__content {
            display: none;
            position: absolute;
            right: 0;
            top: 10%;
        }
    }

    #course-content:checked~.sidebar-course__content {
        display: block;

        .course-content__frame {
            opacity: 1;
            text-align: center;
        }
    }

    .course-content__frame {
        background-color: #f7f7f7;
        opacity: 0;
        transition: opacity linear .6s;
    }

    .nav__bars-btn {
        display: block;
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    .lessons {
        max-height: 42vh;
    }
}

@media (max-width: 740px) {
    .row {
        .sidebar-course__content {
            top: 14%;
        }
    }

    .lessons {
        max-height: 32vh;
    }
}
</style>