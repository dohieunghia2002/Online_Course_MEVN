<template>
    <div class="table-students col lg-12 md-12 col-12">
        <SearchBar placeholder="Nhập tên học viên" />
        <table class="w-100 text-center">
            <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>Liên hệ</th>
                <th class="total-course-joined">Số khóa học đăng ký</th>
                <th></th>
            </tr>
            <tr v-for="(student, index) in filteredStudents" :key="student._id">
                <td>{{ index + 1 }}</td>
                <td>{{ student.fullName }}</td>
                <td>{{ student.gender ? 'Nam' : 'Nữ' }}</td>
                <td>{{ student.email }}</td>
                <td class="total-course-joined">{{ student.totalCourse }}</td>
                <td>
                    <button type="button" class="btn--lock" @click="handleLockStudent(student._id)">
                        <font-awesome-icon :icon="['fas', 'lock']" />
                        Khóa
                    </button>
                    <button type="button" class="btn--edit">
                        <router-link :to="{ name: 'courses-student', params: { id: student._id } }"
                            class="student-edit__link">
                            <font-awesome-icon :icon="['fas', 'info-circle']" />
                            Chi tiết
                        </router-link>
                    </button>
                    <button type="button" class="btn-delete" @click="toggleModalWarning(student._id)">
                        <font-awesome-icon :icon="['fas', 'trash']" />
                        Xóa
                    </button>
                </td>
            </tr>
        </table>

        <ModalRemove />
    </div>
</template>

<script>
import ModalRemove from '../../components/AdminModalRemove/ModalRemove.vue';
import SearchBar from '../../components/SearchBar/SearchBar.vue';

import userService from '../../services/user.service.js';
import { useUserStore } from '../../stores/user.js';

export default {
    components: { ModalRemove, SearchBar },
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    computed: {
        filteredStudents() {
            return this.userStore.students.filter((student) => student.fullName.toLowerCase().includes(this.userStore.contentSearch.toLowerCase()))
        }
    },
    methods: {
        async assignValues() {
            const res = await userService.allStudent();
            this.userStore.students = res.data;
        },

        async handleLockStudent(id) {
            const res = await userService.delUser(id, this.userStore.accessToken);
            if (res.status === 200) {
                await this.assignValues();
            }
        },

        toggleModalWarning(id) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.userStore.idPropModal = id;
            const modalWarn = document.getElementById('modal-warning');
            modalWarn.classList.toggle('show');
        }
    },
    async created() {
        await this.assignValues();
    }
}
</script>

<style lang="scss" scoped>
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

.table-students {
    min-height: 58.5vh;
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
    background-color: rgb(253, 178, 38);
}

.btn--edit {
    background-color: blue;
    margin-left: 10px;
    margin-right: 10px;
}

.btn-delete {
    background-color: red;
}

.student-edit__link {
    text-decoration: none;
    color: inherit;
}

@media (max-width: 1023px) {
    .total-course-joined {
        display: none;
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    th {
        font-size: 1.1rem;
        line-height: 2.2rem;
    }

    td {
        font-size: 1rem;
        line-height: 2.5rem;
    }
}

@media (max-width: 739px) {
    th {
        font-size: 1rem;
        line-height: 2rem;
    }

    td {
        font-size: .8rem;
        line-height: 2.3rem;
    }
}
</style>