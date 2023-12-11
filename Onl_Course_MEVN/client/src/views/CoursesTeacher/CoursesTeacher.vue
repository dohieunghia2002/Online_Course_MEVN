<template>
    <div class="grid wide">
        <InfoPersonalUser />
        <div class="row">
            <div class="col lg-12 md-12 col-12">
                <div class="header-page">
                    <h2>Khóa học của tôi</h2>
                    <button type="button" class="btn--create">
                        <router-link :to="{ name: 'course-new' }" class="btn-create__link">
                            Tạo khóa học mới
                        </router-link>
                    </button>
                </div>
            </div>
        </div>

        <div class="req-add-course row" v-if="courseStore.coursesTeacher.length === 0">
            <div class="col lg-12 md-12 col-12 text-center">
                <h3>Bạn chưa có khóa học nào!</h3>
                <h3>Hãy tiến hành tạo thêm khóa học mới</h3>

                <router-link :to="{ name: 'course-new' }">
                    <button type="button" class="course-new__btn">
                        Tạo Khóa Học
                    </button>
                </router-link>
            </div>
        </div>

        <div class="row" v-else>
            <p class="note-record">*Chú thích: các hàng màu vàng đánh dấu khóa học đã hoàn thiện</p>
            <div class="table-courses col lg-12 md-12 col-12">
                <table class="w-100 text-center">
                    <tr>
                        <th>STT</th>
                        <th>Tên Khóa Học</th>
                        <th>Danh mục</th>
                        <th>Số Bài Học</th>
                        <th class="record--quantity-student">Học Viên Đăng Ký</th>
                        <th class="record--state">Trạng Thái</th>
                        <th>Ngày Tạo</th>
                        <th></th>
                    </tr>
                    <tr class="record" v-for="(entry, index) in courseStore.coursesTeacher" :key="entry._id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ entry.name }}</td>
                        <td>{{ courseStore.entryCategory(entry.category) }}</td>
                        <td>{{ entry.quantityLesson }}</td>
                        <td class="record--quantity-student">{{ entry.quantityStudent }}</td>
                        <td class="record--state">{{ entry.isCompleted ? 'Hoàn thiện' : 'Chưa hoàn thiện' }}</td>
                        <td>{{ entry.createdDate }}</td>
                        <td>
                            <button type="button" class="btn--edit">
                                <router-link :to="{ name: 'course-edit', params: { id: entry._id } }"
                                    class="course-edit__link">
                                    Chỉnh sửa
                                </router-link>
                            </button>
                            <button type="button" class="btn-delete" @click="toggleModal(entry._id)">Xóa</button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <ModalDelete />
    </div>
</template>

<script>
import ModalDelete from '../../components/ModalDelete/ModalDelete.vue';
import InfoPersonalUser from '../../components/InfoPersonalUser/InfoPersonalUser.vue';
import { useCourseStore } from '../../stores/course.js';

export default {
    components: { ModalDelete, InfoPersonalUser },
    setup() {
        const courseStore = useCourseStore();
        return {
            courseStore
        }
    },
    methods: {
        toggleModal(id) {
            this.courseStore.idPropModal = id;
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            const overlayElement = document.getElementsByClassName('overlay')[0];
            const modalElement = document.getElementById('delete-course');
            overlayElement.classList.toggle('show');
            modalElement.classList.toggle('show');
        },

        async assignValues() {
            await this.courseStore.allCourseTeacher(this.$route.params.id);
            await this.courseStore.preprocessing();
        },

        highlightCompleted() {
            const records = document.getElementsByClassName('record');
            const sizeCourses = this.courseStore.coursesTeacher.length;
            for (let i = 0; i < sizeCourses; i++) {
                if (this.courseStore.coursesTeacher[i].isCompleted) {
                    records[i].classList.add('completed');
                }
                else {
                    records[i].classList.remove('completed');
                }
            }
        }
    },
    async created() {
        await this.assignValues();
    },
    async updated() {
        this.highlightCompleted();
    }
}
</script>

<style lang="scss" scoped>
.header-page {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.note-record {
    display: none;
}

.btn--create {
    padding: 8px 12px;
    background-color: $green-color;
    border: 1px solid rgb(5, 194, 46);
    color: $white-text-color;
    font-size: 1.2rem;
    border-radius: 25px;
    cursor: pointer;
    opacity: 1;

    &:hover {
        opacity: 0.8;
    }
}

.btn-create__link,
.course-edit__link {
    text-decoration: none;
    color: inherit;
}

.req-add-course {
    margin-top: 2rem;
    font-size: 1.3rem;
    line-height: 4rem;
    min-height: 66.8vh;
}

.course-new__btn {
    background-color: $green-color;
    font-size: 1.3rem;
    padding: 10px;
    color: $white-text-color;
    border: 1px solid rgb(27, 227, 34);
    border-radius: 25px;
    opacity: 1;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
}

.table-courses {
    min-height: 71vh;
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

.record.completed {
    background-color: rgb(236, 236, 187);
}

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

.btn--edit {
    background-color: blue;
    margin-right: 10px;
}

.btn-delete {
    background-color: red;
}

@media (max-width: 1023px) {

    table,
    th,
    td {
        border: 1px solid black;
        border-collapse: collapse;
    }

    table {
        margin: 1rem 0;
    }

    th {
        font-size: .9rem;
        line-height: 2.1rem;
        color: $white-text-color;
        background-color: $black-color;
        opacity: 0.92;
    }

    td {
        font-size: .8rem;
        line-height: 2rem;
    }

    .btn--create {
        font-size: 1rem;
    }

    .btn--edit,
    .btn-delete {
        padding: 5px 10px;
        font-size: .9rem;
        margin-top: 6px;
        margin-bottom: 6px;
    }

    .btn--edit {
        margin-right: 0;
    }
}

@media (max-width: 739px) {
    .note-record {
        display: block;
        margin-top: 1rem;
        font-size: .8rem;
    }

    .record--state,
    .record--quantity-student {
        display: none;
    }
}
</style>