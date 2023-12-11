<template>
    <div class="overlay-add-teacher"></div>

    <section id="add-teacher" class="modal--create text-center">
        <font-awesome-icon :icon="['fas', 'times']" class="icon--close" @click="toggleModal()" />
        <h2 class="modal__heading">Thêm giáo viên mới</h2>
        <hr>
        <form method="POST" class="form--create" @submit.prevent="handleAddTeacher()">
            <div class="form__group">
                <label class="form-group__label" for="name">Họ tên</label>
                <input class="form__input" type="text" id="name" v-model="newTeacher.fullName" required>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="sex">Giới tính</label>

                <div class="sex__input">
                    <div class="gender--male">
                        <input class="form__input" style="margin-right: 6px;" type="radio" id="male" value="true"
                            v-model="newTeacher.gender">
                        <label class="form-group__label" for="male">Nam</label>
                    </div>

                    <div class="gender--female">
                        <input class="form__input" style="margin-right: 6px;" type="radio" id="female" value="false"
                            v-model="newTeacher.gender">
                        <label class="form-group__label" for="female">Nữ</label>
                    </div>
                </div>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="phone">Số điện thoại</label>
                <input class="form__input" type="text" id="phone" v-model="newTeacher.phone" required>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="email">Email</label>
                <input class="form__input" type="email" id="email" v-model="newTeacher.email" required>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="username">Username</label>
                <input class="form__input" type="text" id="username" v-model="newTeacher.username" required>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="pwd">Password</label>
                <input class="form__input" type="password" id="pwd" v-model="newTeacher.password" required>
            </div>
            <div class="form__group">
                <label class="form-group__label upload" for="upload-photo">Upload ảnh đại diện</label>
                <input class="form__input" type="file" hidden id="upload-photo">
            </div>

            <div class="form__group--btn">
                <button type="submit" class="btn--create">Thêm</button>
                <button type="reset" class="btn--cancel">Hủy</button>
            </div>
        </form>
    </section>
</template>

<script>
import axios from 'axios';
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
            newTeacher: {
                fullName: '',
                gender: true,
                email: '',
                phone: '',
                username: '',
                password: '',
                avatar: {
                    id: '',
                    url: ''
                }
            }
        }
    },
    methods: {
        toggleModal() {
            const modalNewTeacher = document.getElementById('add-teacher');
            const overlayNewTeacher = document.getElementsByClassName('overlay-add-teacher')[0];
            modalNewTeacher.classList.toggle('show');
            overlayNewTeacher.classList.toggle('show');
        },
        async submitNotValid() {
            const btnSubmit = document.getElementsByClassName('btn--create')[0];
            const photo = document.getElementById('upload-photo').files.length;
            if (this.newTeacher.fullName.length === 0 || this.newTeacher.email.length === 0 || this.newTeacher.phone.length === 0 ||
                this.newTeacher.password.length === 0 || this.newTeacher.username.length === 0 || photo === 0) {
                alert('Thiếu thông tin, tạo khóa học mới thất bại!');
            }
        },

        async handleUploadCloud() {
            const form = new FormData();
            const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
            const PRESET_NAME = import.meta.env.VITE_PRESET_NAME;
            const FOLDER_TEACHER = import.meta.env.VITE_FOLDER_TEACHER;

            const photo = await document.getElementById('upload-photo').files[0];
            form.append('upload_preset', PRESET_NAME);
            form.append('folder', FOLDER_TEACHER);
            form.append('file', photo);
            const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

            const res = await axios.post(api, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            this.newTeacher.avatar.id = res.data.public_id;
            this.newTeacher.avatar.url = res.data.secure_url;
        },

        async handleAddTeacher() {
            await this.submitNotValid();
            await this.handleUploadCloud();
            await this.userStore.addNewTeacher(this.newTeacher);
            this.toggleModal();
            window.location.reload();
        }
    }
}
</script>
<style lang="scss" scoped>
.overlay-add-teacher {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);

    &.show {
        display: block;
    }
}

#add-teacher {
    display: none;
    position: absolute;
    width: 70%;
    top: -15%;
    left: 15%;
    background-color: rgb(248, 236, 219);
    padding: 1rem 2.5rem;
    border-radius: 16px;
    animation: fadeIn .4s ease-in-out;
    z-index: 2;

    &.show {
        display: block;
    }
}

.icon--close {
    width: 28px;
    height: 28px;
    float: right;
    cursor: pointer;

    &:hover {
        color: #777;
    }
}

.modal__heading {
    margin-top: 1.5rem;
    line-height: 3.2rem;
}

.form__group {
    display: flex;
    margin-top: 1.5rem;
    font-size: 1.2rem;
}

.sex__input {
    display: flex;
    align-items: center;
    flex: 2;

    [class^=gender--] {
        flex: 1;
        text-align: left;
    }
}

.form-group__label {
    flex: 0.5;
    font-weight: 600;
    text-align: left;

    &.upload {
        flex: none;
        padding: 10px 15px;
        border-radius: 25px;
        background-color: black;
        color: white;
        opacity: 1;
        cursor: pointer;

        &:hover {
            opacity: 0.7;
        }
    }
}

.form__input {
    margin-left: 5px;
    flex: 2;
}

.form__group--btn {
    margin-top: 2rem;

    .btn--create,
    .btn--cancel {
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

    .btn--create {
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

@keyframes fadeIn {
    from {
        transform: translateY(-80%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 1023px) {
    .modal__heading {
        margin-top: 1rem;
        line-height: 2.8rem;
    }

    .form__group {
        display: flex;
        margin-top: 1rem;
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    #add-teacher {
        width: 90%;
        left: 5%;
    }

    .form__group {
        font-size: 1rem;
    }
}

@media (max-width: 739px) {
    #add-teacher {
        width: 96%;
        left: 2%;
        padding: 1rem .5rem;
        border-radius: 10px;
    }

    .form__group {
        font-size: .9rem;
    }
}
</style>