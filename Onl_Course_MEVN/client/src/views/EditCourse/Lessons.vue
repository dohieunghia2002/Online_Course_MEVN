<template>
    <section class="lessons col lg-12 md-12 col-12" :key="idxBtnActive">
        <form method="POST" class="lesson__form" @submit.prevent="submitForm()">
            <button type="submit" class="btn--submit">Cập nhật</button>
            <div class="lesson__container">
                <div class="lesson__item" v-for="(lesson, index) in lessons" :key="index">
                    <button type="button" class="lesson__btn" @click="() => idxBtnActive = index">
                        {{ (index + 1) + '. ' + lesson.title }}
                    </button>
                </div>
                <div class="lesson__item">
                    <button type="button" class="lesson__btn btn--add" @click="addLesson()">
                        <font-awesome-icon :icon="['fas', 'plus']" />
                        Thêm bài học
                    </button>
                </div>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="name">Tiêu đề</label>
                <input class="form__input" type="text" id="name" v-model="lessons[idxBtnActive].title">
            </div>
            <div class="form__group">
                <label class="form-group__label" for="path">Đường dẫn video</label>
                <input class="form__input" type="url" id="path" v-model="lessons[idxBtnActive].urlVideo">
            </div>
            <div class="form__group form__group--btn">
                <button type="button" class="btn--remove" @click="deleteLesson(idxBtnActive)">Xóa</button>
            </div>
        </form>
    </section>
</template>

<script>
import lessonService from '../../services/lesson.service.js';
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
            idxBtnActive: 0,
            lessons: [{
                title: '',
                urlVideo: ''
            }]
        }
    },
    methods: {
        addLesson() {
            this.lessons.push({ title: '', urlVideo: '' });
            const len = this.lessons.length;
            this.idxBtnActive = len - 1;
        },
        deleteLesson(idx) {
            this.lessons.splice(idx, 1);
            this.idxBtnActive -= 1;
        },

        async assignValues() {
            const res = await courseService.entireLesson(this.$route.params.id);
            this.lessons = res.data.lessons;
        },
        activeBtn() {
            const btnElements = document.getElementsByClassName('lesson__btn');
            const size = btnElements.length;
            for (let i = 0; i < size; i++) {
                if (i === this.idxBtnActive) {
                    btnElements[i].classList.add('active');
                }
                else {
                    btnElements[i].classList.remove('active');
                }
            }
        },
        async submitForm() {
            const formPost = {
                course: this.$route.params.id,
                lessons: this.lessons
            }
            const res = await lessonService.updateLesson(formPost, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Cập nhật danh sách bài học thành công!');
                window.location.reload();
            }
        }
    },
    async created() {
        await this.assignValues();
    },
    async updated() {
        this.activeBtn();
    }
}
</script>

<style lang="scss" scoped>
.lessons {
    min-height: 64.3vh;
}

.lesson__container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 3rem;
    margin-bottom: 2rem;
}

.lesson__item {
    margin-top: .5rem;
    margin-right: .5rem;
}

.lesson__btn {
    padding: .5rem 1rem;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    &.active {
        background-color: $primary-color;
        opacity: 0.85;
        color: $white-text-color;
        font-weight: 700;
    }

    &.btn--add {
        background-color: transparent;
        border-style: dashed;
        border-color: $primary-color;
    }
}

.lesson__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.form__group {
    display: flex;
    font-size: 1.4rem;
    margin-top: 1rem;
    width: 60%;

    &.form__group--btn {
        justify-content: end;
    }
}

.form-group__label {
    flex: 1;
    font-weight: 600;
}

.form__input {
    margin-left: 5px;
    flex: 2.5;
}

.btn--submit,
.btn--remove {
    font-size: 1.2rem;
    padding: 8px 10px;
    margin-bottom: 1rem;
    color: white;
    border-radius: 4px;
    opacity: 1;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
}

.btn--remove {
    background-color: $red-color;
    border: 1px solid red;
    float: right;
}

.btn--submit {
    position: absolute;
    left: 0;
    z-index: 1;
    background-color: rgb(3, 166, 3);
    border: 1px solid rgb(92, 152, 2);
}

@media (max-width: 1023px) {
    .lesson__form {
        margin-top: 1rem;
    }

    .form__group {
        width: 100%;
    }
}

@media (max-width: 739px) {
    .lesson__btn {
        font-size: .8rem;
    }

    .form__group {
        font-size: 1rem;
    }

    .form-group__label {
        flex: 1;
    }

    .form__input {
        margin-left: 5px;
        flex: 3;
    }
}
</style>