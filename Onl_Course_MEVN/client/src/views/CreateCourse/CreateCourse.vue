<template>
    <section class="grid wide">
        <router-link :to="{ name: 'teacher-courses', params: { id: userStore?.account._id } }" class="comeback__link">
            Quay lại
        </router-link>
        <h2 class="title-page">Thêm Khóa Học Mới</h2>
        <hr>
        <br>
        <div class="row">
            <div class="col lg-8 lg-o-2 md-12 md-o-0 col-12 col-o-0">
                <form method="POST" class="form" @submit.prevent="handleCreateCourse()">
                    <div class="form__group">
                        <label class="form-group__label" for="name">Tên khóa học</label>
                        <input class="form__input" type="text" id="name" required v-model="formCreate.name">
                    </div>

                    <div class="form__group">
                        <label class="form-group__label" for="desc">Phần mô tả</label>
                        <textarea rows="10" class="form__input" id="desc" required
                            v-model="formCreate.description"></textarea>
                    </div>

                    <div class="form__group">
                        <label class="form-group__label" for="results">Kiến thức nhận được</label>
                        <textarea rows="10" class="form__input" id="results" required v-model="resultsTextarea"></textarea>
                    </div>

                    <div class="form__group">
                        <label style="font-weight: 600;" for="category">Chọn Danh mục:</label>
                        <select name="category" id="category" class="form__select" v-model="formCreate.category">
                            <option value="web">Lập trình web</option>
                            <option value="ml">Machine Learning</option>
                            <option value="algorithm">Cấu trúc dữ liệu và giải thuật</option>
                            <option value="other">Danh mục khác</option>
                        </select>
                    </div>

                    <div class="form-group__photo">
                        <label class="label-upload" for="photo">Upload ảnh bìa</label>
                        <span>Khóa học bắt buộc cần có ảnh bìa</span>
                        <input class="form__input photo__file" type="file" id="photo" hidden>
                    </div>

                    <div class="form__group--btn">
                        <button type="submit" class="btn--submit">Tạo</button>
                        <button type="reset" class="btn--cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../../stores/user.js';
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
            resultsTextarea: '',
            formCreate: {
                name: '',
                teacher: '',
                description: '',
                category: '',
                benefits: [],
                coverPhoto: {}
            }
        }
    },
    methods: {
        submitNotValid() {
            const btnSubmit = document.getElementsByClassName('btn--submit')[0];
            const photo = document.getElementsByClassName('photo__file')[0].files.length;
            this.formCreate.benefits = this.resultsTextarea.split('\n');
            if (this.formCreate.name.length === 0 || this.formCreate.description.length === 0
                || this.formCreate.benefits.length === 0) {
                alert('Thiếu thông tin, tạo khóa học mới thất bại!');
            }
        },

        async handleUploadCloud() {
            const photo = document.getElementsByClassName('photo__file')[0].files[0];
            if (!photo) {
                window.alert('Ảnh bìa cho khóa học là bắt buộc');
            }

            const form = new FormData();
            const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
            const PRESET_NAME = import.meta.env.VITE_PRESET_NAME;
            const FOLDER_COURSE = import.meta.env.VITE_FOLDER_COURSE;

            form.append('upload_preset', PRESET_NAME);
            form.append('folder', FOLDER_COURSE);
            form.append('file', photo);
            const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

            const res = await axios.post(api, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            this.formCreate.coverPhoto.id = res.data.public_id;
            this.formCreate.coverPhoto.url = res.data.secure_url;
        },

        async handleCreateCourse() {
            this.submitNotValid();
            await this.handleUploadCloud();
            this.formCreate.teacher = this.userStore.account._id;

            const res = await courseService.newCourse(this.formCreate, this.userStore.accessToken);
            if (res.status == 201) {
                this.formCreate.name = '';
                this.formCreate.description = '';
                this.formCreate.teacher = '';
                this.formCreate.benefits = [];
                this.formCreate.coverPhoto = {};
                this.resultsTextarea = '';
            }
            else {
                alert('Lỗi!!! tạo khóa học không thành công');
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.comeback__link {
    color: blue;
    font-size: 1.1rem;
}

.title-page {
    text-align: center;
    font-size: 1.4rem;
    line-height: 3.4rem;
}

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

.form__select {
    margin-left: 10px;
}

.form-group__photo {
    display: flex;
    align-items: center;

    .label-upload {
        display: block;
        margin: 1.5rem .5rem 1.5rem 0;
        width: 18%;
        background-color: #222;
        text-align: center;
        color: $white-text-color;
        padding: 10px;
        border-radius: 25px;
    }
}

.btn--submit,
.btn--cancel {
    margin-bottom: 2rem;
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

@media (max-width: 1023px) {
    .form__group {
        font-size: 1rem;
    }

    .form-group__photo {
        .label-upload {
            width: 22%;
        }
    }

    .btn--submit,
    .btn--cancel {
        font-size: 1.2rem;
        padding: 10px 15px;

    }
}

@media (max-width: 739px) {
    .form-group__label {
        flex: 1;
    }

    .form__input {
        flex: 2.5;
    }

    .form-group__photo {
        .label-upload {
            width: 34%;
        }
    }
}
</style>