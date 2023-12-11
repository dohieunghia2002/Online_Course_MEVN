<template>
    <section class="side--left col lg-8 md-12 col-12">
        <form method="POST" class="form-edit--info" @submit.prevent="submitFormEdit()">
            <div class="form__group">
                <label class="form-group__label" for="name">Tên khóa học</label>
                <input class="form__input" type="text" id="name" v-model="formEdit.name">
            </div>

            <div class="form__group">
                <label class="form-group__label" for="desc">Phần mô tả</label>
                <textarea rows="8" class="form__input" id="desc" v-model="formEdit.description"></textarea>
            </div>

            <div class="form__group">
                <label class="form-group__label" for="results">Kiến thức nhận được</label>
                <textarea rows="8" class="form__input" id="results" v-model="resultsTextarea"></textarea>
            </div>

            <div class="form__group">
                <label style="font-weight: 600;" for="category">Chọn Danh mục:</label>
                <select name="category" id="category" class="form__select" v-model="formEdit.category">
                    <option value="web">Lập trình web</option>
                    <option value="ml">Machine Learning</option>
                    <option value="algorithm">Cấu trúc dữ liệu và giải thuật</option>
                    <option value="other">Danh mục khác</option>
                </select>
            </div>

            <div class="form__group--btn">
                <button type="submit" class="btn--submit">Lưu</button>
                <button type="reset" class="btn--cancel">Hủy</button>
            </div>
        </form>
    </section>
    <section class="side--right text-center col lg-4 lg-o-0 md-8 md-o-2 col-10 col-o-1">
        <div class="cover-photo" style="margin-top: 1.5rem;">
            <img :src="formEdit.coverPhoto.url" alt="cover photo" class="w-100">
        </div>
        <h3>{{ formEdit.name }}</h3>
        <p class="info--bonus">Trạng thái: {{ formEdit.isCompleted ? 'Hoàn thiện' : 'Chưa hoàn thiện' }}</p>
        <p class="info--bonus">Tổng số bài học: {{ formEdit.quantityLesson }}</p>
        <p class="info--bonus">Số lượng học viên: {{ formEdit.quantityStudent }}</p>

        <button type="button" class="btn--marked-completed" @click="toggleCompleted()" v-if="!formEdit.isCompleted">
            Đánh dấu khóa học đã hoàn thiện
        </button>
        <button type="button" class="btn--cancel-completed" @click="toggleCompleted()" v-else>
            Hủy đánh dấu khóa học hoàn thiện
        </button>
    </section>
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
            resultsTextarea: '',
            formEdit: {
                _id: '',
                name: '',
                description: '',
                benefits: [],
                category: '',
                coverPhoto: {},
                isCompleted: false,
                quantityStudent: 0,
                quantityLesson: 0
            }
        }
    },
    methods: {
        async assignValues() {
            const res = await courseService.detailCourse(this.$route.params.id);
            console.log(res.data);
            this.formEdit._id = res.data._id;
            this.formEdit.name = res.data.name;
            this.formEdit.description = res.data.description;
            this.formEdit.benefits = res.data.benefits;
            this.formEdit.category = res.data.category;
            this.formEdit.coverPhoto = res.data.coverPhoto;
            this.formEdit.isCompleted = res.data.isCompleted;
            this.formEdit.quantityStudent = res.data.quantityStudent;
            this.formEdit.quantityLesson = res.data.quantityLesson;

            this.formEdit.benefits.forEach((result) => {
                const entry = result + '\n';
                this.resultsTextarea += entry;
            })
        },

        async submitFormEdit() {
            this.formEdit.benefits = this.resultsTextarea.split('\n');
            const res = await courseService.editInfo(this.formEdit, this.userStore.accessToken);
            if (res.status === 200) {
                this.resultsTextarea = '';
                alert('Thay đổi đã được cập nhật!');
                await this.assignValues();
            }
        },
        async toggleCompleted() {
            const res = await courseService.toggleCompleted({ id: this.$route.params.id }, this.userStore.accessToken);
            if (res.status == 200) {
                window.location.reload();
            }
        }
    },
    async created() {
        await this.assignValues();
    }
}
</script>

<style lang="scss" scoped>
.form__group {
    display: flex;
    margin-top: 1.5rem;
    font-size: 1.3rem;
}

.form-group__label {
    flex: 0.5;
    font-weight: 600;
}

.form__input {
    margin-left: 5px;
    flex: 2.5;
}

.form__group--btn {
    margin-top: 2rem;

    .btn--submit,
    .btn--cancel {
        margin-bottom: 1.8rem;
        font-size: 1.2rem;
        padding: 8px 10px;
        color: white;
        border-radius: 4px;
        float: right;
        opacity: 1;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }

    .btn--submit {
        background-color: rgb(3, 166, 3);
        border: 1px solid rgb(92, 152, 2);
        margin-left: 10px;

        &:disabled {
            background-color: rgb(91, 89, 89);
            border: 1px solid #888;
            pointer-events: none;
        }
    }

    .btn--cancel {
        background-color: rgb(153, 153, 153);
        border: 1px solid #888;
    }
}

.info--bonus {
    line-height: 2.2rem;
}

.btn--marked-completed,
.btn--cancel-completed {
    padding: 12px 15px;
    margin-top: .5rem;
    color: $white-text-color;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 700;
    box-shadow: 3px 2px 2px rgba(0, 0, 0, 0.3);
    cursor: pointer;

    &:hover {
        transform: scale(1.2);
    }
}

.btn--marked-completed {
    background-color: $green-color;
}

.btn--cancel-completed {
    background-color: $red-color;
}

@media (max-width: 1023px) {
    .side--right {
        margin-bottom: 2rem;
    }
}

@media (max-width: 739px) {
    .form__group {
        margin-top: 1rem;
        font-size: 1rem;
    }

    .form-group__label {
        flex: 1;
    }

    .form__input {
        flex: 2.5;
    }
}
</style>