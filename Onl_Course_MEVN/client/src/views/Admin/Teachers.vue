<template>
    <div class="table-teachers col lg-12 md-12 col-12">
        <SearchBar placeholder="Nhập tên giáo viên" />
        <button type="button" class="btn--create" @click="toggleModal()">
            Thêm giáo viên mới
        </button>
        <table class="w-100 text-center">
            <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>Liên hệ</th>
                <th>Tổng số khóa học</th>
                <th></th>
            </tr>
            <tr v-for="(teacher, index) in filteredTeachers" :key="teacher._id">
                <td>{{ index + 1 }}</td>
                <td>{{ teacher.fullName }}</td>
                <td>{{ teacher.gender ? 'Nam' : 'Nữ' }}</td>
                <td>{{ teacher.phone }}</td>
                <td>{{ teacher.totalCourse }}</td>
                <td>
                    <button type="button" class="btn--lock" @click="handleLockTeacher(teacher._id)">
                        <font-awesome-icon :icon="['fas', 'lock']" />
                        Khóa
                    </button>
                    <button type="button" class="btn--edit">
                        <router-link :to="{ name: 'admin' }" class="teacher-edit__link"
                            @click="toggleModalEdit(teacher._id)">
                            <font-awesome-icon :icon="['fas', 'pen']" />
                            Chỉnh sửa
                        </router-link>
                    </button>
                    <button type="button" class="btn-delete" @click="toggleModalWarning(teacher._id)">
                        <font-awesome-icon :icon="['fas', 'trash']" />
                        Xóa
                    </button>
                </td>
            </tr>
        </table>

        <ModalAddTeacher />
        <ModalEditTeacher />
        <ModalRemove />
    </div>
</template>

<script>
import ModalEditTeacher from './ModalEditTeacher.vue';
import ModalAddTeacher from './ModalAddTeacher.vue';
import ModalRemove from '../../components/AdminModalRemove/ModalRemove.vue';
import SearchBar from '../../components/SearchBar/SearchBar.vue';

import userService from '../../services/user.service.js';
import { useUserStore } from '../../stores/user.js';

export default {
    components: { ModalEditTeacher, ModalAddTeacher, ModalRemove, SearchBar },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    computed: {
        filteredTeachers() {
            return this.userStore.teachers.filter((teacher) => teacher.fullName.toLowerCase().includes(this.userStore.contentSearch.toLowerCase()))
        }
    },
    methods: {
        async assignValues() {
            const res = await userService.allTeacher();
            this.userStore.teachers = res.data;
            this.userStore.teacherFormEdit.idTeacher = this.userStore.teachers[0]._id;
        },

        async toggleModal() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            const modalNewTeacher = document.getElementById('add-teacher');
            const overlayNewTeacher = document.getElementsByClassName('overlay-add-teacher')[0];
            modalNewTeacher.classList.toggle('show');
            overlayNewTeacher.classList.toggle('show');
        },

        toggleModalWarning(id) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.userStore.idPropModal = id;
            const modalWarn = document.getElementById('modal-warning');
            modalWarn.classList.toggle('show');
        },

        async toggleModalEdit(id) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.userStore.teacherFormEdit.idTeacher = id;
            const res = await userService.detailTeacher(this.userStore.teacherFormEdit.idTeacher);
            this.userStore.teacherFormEdit.idTeacher = res.data._id;
            this.userStore.teacherFormEdit.fullName = res.data.fullName;
            this.userStore.teacherFormEdit.gender = res.data.gender;
            this.userStore.teacherFormEdit.phone = res.data.phone;
            const modalNewTeacher = document.getElementById('edit-teacher');
            modalNewTeacher.classList.toggle('show');
        },

        async handleLockTeacher(id) {
            const res = await userService.delUser(id, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Khóa giáo viên thành công');
                this.assignValues();
            }
        }
    },
    async created() {
        await this.assignValues();
    }
}
</script>

<style lang="scss" scoped>
.table-teachers {
    min-height: 58.46vh;
    position: relative;
}

.btn--create {
    padding: 12px 15px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 700;
    background-color: $green-color;
    border: 1px solid rgb(140, 208, 5);
    border-radius: 25px;
    color: $white-text-color;
    float: right;
    cursor: pointer;
    opacity: 1;

    &:hover {
        opacity: 0.7;
    }
}

table,
th,
td {
    border: 1px solid black;
    border-collapse: collapse;
}

table {
    margin: 1.5rem 0;
}

th {
    font-size: 1.3rem;
    line-height: 3.2rem;
    color: $white-text-color;
    background-color: $black-color;
    opacity: 0.92;
}

td {
    font-size: 1.2rem;
    line-height: 3rem;
}

.btn--lock,
.btn--edit,
.btn-delete {
    padding: 4px 10px;
    color: $white-text-color;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    opacity: 1;
    cursor: pointer;

    &:hover {
        opacity: 0.6;
    }
}

.btn--lock {
    background-color: rgb(250, 139, 4);
}

.btn--edit {
    background-color: blue;
    margin-left: 10px;
    margin-right: 10px;
}

.btn-delete {
    background-color: red;
}

.teacher-edit__link {
    text-decoration: none;
    color: inherit;
}

@media (min-width: 740px) and (max-width: 1023px) {
    th {
        font-size: 1.1rem;
        line-height: 2rem;
    }

    td {
        font-size: 1rem;
        line-height: 3rem;
    }
}

@media (max-width: 739px) {
    th {
        font-size: 1rem;
        line-height: 2rem;
    }

    td {
        font-size: .8rem;
        line-height: 2.5rem;
    }
}
</style>