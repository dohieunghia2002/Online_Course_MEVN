<template>
    <div class="courses-student__head row">
        <div class="col lg-2 lg-o-5 md-4 md-o-4 col-6 col-o-3">
            <div class="avatar__wrapper">
                <img src="https://res.cloudinary.com/ddr8slya4/image/upload/v1699142427/avatar-default-icon_aora7k.png"
                    alt="avatar default" class="avatar" v-if="user?.avatar?.url === undefined">
                <img :src="user.avatar.url" alt="avatar" class="avatar" v-else>

                <label for="photo-avatar" class="camera">
                    <font-awesome-icon :icon="['fas', 'camera']" class="camera__icon w-100 h-100" />
                </label>
                <input type="file" id="photo-avatar" hidden accept="image/png, image/jpeg, image/jpg"
                    @change="updateAvatar()">
            </div>
        </div>
        <div class="col lg-12 md-12 col-12">
            <h3 class="text-center">{{ user.fullName }}</h3>
            <p class="note-join-date">
                {{ user.role === 'Teacher' ? 'Giáo viên' : 'Học viên' }} đã tham gia {{ courseStore.company }} từ {{
                    joinDate.month }}/{{ joinDate.year }}
            </p>
        </div>
    </div>
</template>

<script>
import userService from '../../services/user.service';
import { useUserStore } from '../../stores/user.js';
import { useCourseStore } from '../../stores/course.js';
import axios from 'axios';

export default {
    setup() {
        const userStore = useUserStore();
        const courseStore = useCourseStore();
        return {
            userStore,
            courseStore
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
            joinDate: {
                month: '',
                year: ''
            },
            newAvatar: {
                id: '',
                url: ''
            }
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
        preprocessing() {
            const temp = this.user.joinDate.toString().split('T')[0];
            this.joinDate.month = temp.split('-')[1];
            this.joinDate.year = temp.split('-')[0];
        },
        async handleUploadCloud() {
            const photo = document.getElementById('photo-avatar').files[0];

            const form = new FormData();
            const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
            const PRESET_NAME = import.meta.env.VITE_PRESET_NAME;
            const FOLDER_STUDENT = import.meta.env.VITE_FOLDER_STUDENT;
            const FOLDER_TEACHER = import.meta.env.VITE_FOLDER_TEACHER;

            form.append('upload_preset', PRESET_NAME);
            if (this.userStore.account.role === 'Student') {
                form.append('folder', FOLDER_STUDENT);
            } else {
                form.append('folder', FOLDER_TEACHER);
            }
            form.append('file', photo);
            const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

            const res = await axios.post(api, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            this.newAvatar.id = res.data.public_id;
            this.newAvatar.url = res.data.secure_url;
        },

        async updateAvatar() {
            await this.handleUploadCloud();
            const res = await userService.updateAvatar(this.userStore.account._id, this.userStore.accessToken, this.newAvatar);
            if (res.status === 200) {
                alert('Cập nhật ảnh đại diện thành công');
                this.userStore.account.avatar = await res.data.avatar;
                window.location.reload();
            }
        }
    },
    async created() {
        await this.assignValues();
        this.preprocessing();
    }
}
</script>

<style lang="scss" scoped>
.avatar__wrapper {
    position: relative;

    .avatar {
        width: 100%;
        display: block;
        margin: auto;
        // border-radius: 50%;
    }

    .camera {
        position: absolute;
        bottom: 8%;
        right: 10%;
        background-color: rgb(243, 242, 242);
        width: 35px;
        height: 35px;
        padding: 5px 6px;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
    }

    .camera:hover {
        background-color: rgb(178, 177, 177);
    }
}

.note-join-date {
    font-style: italic;
    color: #666;
    text-align: center;
}
</style>