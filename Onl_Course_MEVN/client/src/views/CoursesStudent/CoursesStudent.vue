<template>
    <section class="courses-student__container grid wide">
        <InfoPersonalUser />

        <h2 class="heading">Khóa học đã đăng ký</h2>
        <div class="courses row">
            <div class="col lg-4 md-6 col-12" v-for="(course, index) in userStore.coursesStudent" :key="course._id">
                <div class="course__item">
                    <div class="cover-photo__wrapper">
                        <div class="warning-locked" v-if="course.deleted">
                            <div>Đã bị khóa</div>
                            <font-awesome-icon :icon="['fas', 'lock']" />
                        </div>
                        <img :src="course.coverPhoto.url" alt="ảnh khóa học" class="course__img w-100 h-100">
                        <div class="btn-play">
                            <router-link :to="{ name: 'learning', params: { id: course._id } }" class="btn__link">
                                <font-awesome-icon :icon="['fas', 'play-circle']" class="icon-play" />
                            </router-link>
                        </div>
                    </div>
                    <h3>{{ course.name }}</h3>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import InfoPersonalUser from '../../components/InfoPersonalUser/InfoPersonalUser.vue';
import { useUserStore } from '../../stores/user.js';
import userService from '../../services/user.service.js';

export default {
    components: { InfoPersonalUser },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            user: {
                _id: '',
                fullName: '',
                gender: '',
                joinDate: Date.now(),
                role: '',
                avatar: {
                    url: ''
                }
            },
        }
    },
    methods: {
        async assignValues() {
            if (this.userStore.account._id == this.$route.params.id) {
                this.user = this.userStore.account;
            }
            else {
                const res = await userService.detailStudent(this.$route.params.id);
                this.user._id = res.data._id;
                this.user.fullName = res.data.fullName;
                this.user.gender = res.data.gender;
                this.user.joinDate = res.data.joinDate;
                this.user.role = res.data.role;
                this.user.avatar = res.data.avatar;
            }

            if (this.user.role === 'Student') {
                await this.userStore.getCoursesEnrolled(this.user._id);
            }
        },
        async lockedCourse() {
            const courseItems = document.getElementsByClassName('course__item');
            this.userStore.coursesStudent.forEach((course, index) => {
                if (course.deleted) {
                    courseItems[index].classList.add('locked');
                }
                else {
                    courseItems[index].classList.remove('locked');
                }
            })
        },
        async removeBtnPlay() {
            const btnPlays = document.getElementsByClassName('btn-play');
            for (let i = 0; i < btnPlays.length; i++) {
                btnPlays[i].remove();
            }
        }
    },
    async created() {
        await this.assignValues();
    },
    async updated() {
        await this.lockedCourse();
        if (this.userStore.account.role === 'Admin') {
            await this.removeBtnPlay();
        }
    }
}
</script>

<style lang="scss" scoped>
.courses-student__container {
    min-height: 78vh;
}

.heading {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    line-height: 3rem;
    border-bottom: 4px solid $red-color;
    width: 19.8%;
}

.cover-photo__wrapper {
    position: relative;
    height: 224px;
    border-radius: 8px;
    overflow: hidden;
}

.btn-play {
    display: none;
    position: absolute;
    inset: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
}

.btn__link {
    display: contents;
}

.icon-play {
    color: #0ab6f0;
    background-color: $white-color;
    width: 15%;
    height: auto;
    border-radius: 50%;
}

.course__item {
    margin-bottom: 1rem;
}

.course__item.locked {
    pointer-events: none;
}

.cover-photo__wrapper {
    cursor: pointer;

    .warning-locked {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        color: $white-text-color;
        font-weight: 700;
    }

    &:hover .btn-play {
        display: flex;
    }
}

@media (max-width: 1023px) {
    .cover-photo__wrapper {
        height: 180px;
    }

    .course__item {
        margin-bottom: 1.5rem;
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    .heading {
        width: 37%;
    }
}

@media (max-width: 739px) {
    .heading {
        width: 50%;
        font-size: 1.1rem;
        line-height: 2rem;
    }

    .course__item {
        width: 80%;
        margin-left: 10%;
    }
}
</style>