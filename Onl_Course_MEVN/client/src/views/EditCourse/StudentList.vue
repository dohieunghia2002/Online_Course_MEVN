<template>
    <div class="notify-no-student col lg-12 md-12 col-12" v-if="studentList.length === 0">
        <h2 class="text-center">Chưa có học viên nào đăng ký</h2>
    </div>

    <div class="table-students col lg-12 md-12 col-12" v-else>
        <table class="w-100 text-center">
            <tr>
                <th>STT</th>
                <th>Họ Tên</th>
                <th>Giới tính</th>
                <th>Liên Hệ</th>
                <th>Tiến Độ</th>
            </tr>
            <tr v-for="(student, index) in studentList" :key="student._id">
                <td>{{ index + 1 }}</td>
                <td>{{ student.idStudent.fullName }}</td>
                <td>{{ student.idStudent.gender ? 'Nam' : 'Nữ' }}</td>
                <td class="cell-email">{{ student.idStudent.email }}</td>
                <td>{{ student.lessonLearning + 1 }}/{{ totalLesson }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import courseService from '../../services/course.service.js';

export default {
    data() {
        return {
            studentList: [],
            totalLesson: 0
        }
    },
    methods: {
        async assignValues() {
            const res = await courseService.allStudent(this.$route.params.id);
            if (res.status === 200) {
                this.studentList = res.data.students;
            }
            const resDetail = await courseService.detailCourse(this.$route.params.id);
            this.totalLesson = resDetail.data.quantityLesson;
        }
    },
    async created() {
        await this.assignValues();
    }
}
</script>

<style lang="scss" scoped>
.notify-no-student {
    margin-top: .5rem;
    min-height: 63.5vh;
}

.table-students {
    min-height: 64.5vh;
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

@media (max-width: 739px) {
    th {
        font-size: 1rem;
        line-height: 2rem;
    }

    td {
        font-size: .9rem;
        line-height: 1.9rem;
    }

    .cell-email {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 148px;
    }
}
</style>