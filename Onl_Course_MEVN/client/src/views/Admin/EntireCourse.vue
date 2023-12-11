<template>
    <div class="table-courses col lg-12 md-12 col-12">
        <SearchBar placeholder="Nhập tên khóa học" />
        <p style="margin-top: 1rem;">*Chú thích: các hàng màu vàng là khóa học đã hoàn thiện</p>
        <table class="w-100 text-center">
            <tr>
                <th>STT</th>
                <th>Tên khóa học</th>
                <th>Danh mục</th>
                <th>Giáo viên</th>
                <th class="column--state">Trạng Thái</th>
                <th class="column--quantity-student">Số học viên</th>
                <th class="column--quantity-lesson">Số bài học</th>
                <th></th>
            </tr>
            <tr class="record" v-for="( course, index ) in  filteredCourses" :key="course._id">
                <td>{{ index + 1 }}</td>
                <td class="record__name">{{ course.name }}</td>
                <td>{{ courseStore.entryCategory(course.category) }}</td>
                <td>{{ course.teacherName }}</td>
                <td class="column--state">{{ contentStatus(course) }}</td>
                <td class="column--quantity-student">{{ course.quantityStudent }}</td>
                <td class="column--quantity-lesson">{{ course.quantityLesson }}</td>
                <td>
                    <button type="button" class="btn-info" @click="toggleModalInfoStudents(course._id)">
                        Học viên
                    </button>
                    <button type="button" class="btn-lock" @click="handleLockCourse(course._id)">Khóa</button>
                    <button type="button" class="btn-delete" @click="toggleModal(course._id)">Xóa</button>
                </td>
            </tr>
        </table>

        <ModalDelete />
        <ModalDetailStudents />
    </div>
</template>

<script>
import ModalDelete from '../../components/ModalDelete/ModalDelete.vue';
import ModalDetailStudents from './ModalDetailStudents.vue';
import SearchBar from '../../components/SearchBar/SearchBar.vue';

import courseService from '../../services/course.service.js';
import { useCourseStore } from '../../stores/course.js';
import { useUserStore } from '../../stores/user.js';

export default {
    components: { ModalDelete, ModalDetailStudents, SearchBar },
    setup() {
        const courseStore = useCourseStore();
        const userStore = useUserStore();
        return {
            courseStore,
            userStore
        }
    },
    data() {
        return {
            entireCourse: []
        }
    },
    computed: {
        filteredCourses() {
            return this.entireCourse.filter((course) => course.name.includes(this.userStore.contentSearch))
        }
    },
    methods: {
        toggleModal(id) {
            window.scrollTo({
                top: 0, behavior: 'smooth'
            });
            this.courseStore.idPropModal = id;
            const overlayElement = document.getElementsByClassName('overlay')[0];
            const modalElement = document.getElementById('delete-course');
            overlayElement.classList.toggle('show');
            modalElement.classList.toggle('show');
        },
        async toggleModalInfoStudents(id) {
            this.courseStore.idPropModal = id;
            const res = await courseService.allStudent(this.courseStore.idPropModal);
            if (res.status === 200) {
                const temp = await courseService.detailCourse(this.courseStore.idPropModal);
                this.courseStore.nameCourse = temp.data.name;
                this.courseStore.studentsCourse = res.data.students;
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            const modalElement = document.getElementById('detail-quantity-student');
            modalElement.classList.toggle('show');
        },

        async assignValues() {
            const res = await courseService.allCourses();
            this.entireCourse = res.data;
            const res1 = await courseService.allComingSoon();
            this.entireCourse = this.entireCourse.concat(res1.data);
        },

        async preprocessing() {
            const temp = this.entireCourse.map((obj) => {
                return { ...obj, createdDate: new Date(obj.createdDate) };
            });
            const sortedAsc = temp.sort(
                (objA, objB) => Number(objB.createdDate) - Number(objA.createdDate),
            );
            const sizeSortedAsc = sortedAsc.length;
            for (let i = 0; i < sizeSortedAsc; i++) {
                let isoStr = await sortedAsc[i].createdDate.toISOString();
                isoStr = isoStr.split('T')[0];
                sortedAsc[i].createdDate = isoStr;
            }
            this.entireCourse = [...sortedAsc];
        },

        disablebtnStudent() {
            const btnsInfo = document.getElementsByClassName('btn-info');
            this.filteredCourses.forEach((course, index) => {
                if (course.quantityStudent === 0) {
                    btnsInfo[index].disabled = true;
                }
            });
        },

        contentStatus(course) {
            if (course.teacher !== null) {
                if (course.isCompleted) {
                    return 'Hoàn thiện';
                }
                else return 'Chưa hoàn thiện';
            }
            else return 'Đã bị khóa';
        },

        highlightCompleted() {
            const records = document.getElementsByClassName('record');
            const sizeCourses = this.filteredCourses.length;
            for (let i = 0; i < sizeCourses; i++) {
                if (this.filteredCourses[i].isCompleted) {
                    records[i].classList.add('completed');
                }
                else {
                    records[i].classList.remove('completed');
                }
            }
        },

        async handleLockCourse(id) {
            const res = await courseService.softDelete(id, this.userStore.accessToken);
            if (res.status == 200) {
                await this.assignValues();
                await this.preprocessing();
            }
        }
    },
    async created() {
        await this.assignValues();
        await this.preprocessing();
    },
    async updated() {
        this.highlightCompleted();
        this.disablebtnStudent();
    }
}
</script>

<style lang="scss" scoped>
.table-courses {
    min-height: 58.6vh;
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
}

.record.completed {
    background-color: rgb(236, 236, 187);
}

.record__name {
    font-weight: 600;
    padding: 8px 12px;
    width: 15%;
}

.btn-info,
.btn-lock,
.btn-delete {
    padding: 8px 12px;
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

.btn-lock {
    background-color: rgb(252, 180, 48);
    margin-left: 10px;
    margin-right: 10px;
}

.btn-delete {
    background-color: red;
}

.btn-info {
    background-color: rgb(78, 48, 252);

    &:disabled {
        background-color: rgba(0, 0, 0, .5);
        pointer-events: none;
    }
}

.course-edit__link {
    text-decoration: none;
    color: inherit;
}

@media (max-width: 1023px) {

    .column--state,
    .column--quantity-student,
    .column--quantity-lesson {
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
    }
}

@media (max-width: 739px) {
    th {
        font-size: 1rem;
        line-height: 2rem;
    }

    td {
        font-size: .8rem;
        line-height: 2.6rem;
    }
}
</style>