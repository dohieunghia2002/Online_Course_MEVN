<template>
    <div class="table-courses col lg-12  md-12 col-12">
        <h2 style="line-height: 4.2rem;" v-if="lockedCourses.length === 0">Chưa có Khóa học nào bị khóa!</h2>
        <table class="w-100 text-center" v-else>
            <tr>
                <th>STT</th>
                <th>Tên khóa học</th>
                <th>Danh mục</th>
                <th>Giáo viên</th>
                <th>Trạng Thái</th>
                <th class="record--quantity-student">Số học viên</th>
                <th class="record--quantity-lesson">Số bài học</th>
                <th>Ngày bị khóa</th>
                <th></th>
            </tr>

            <tr class="record" v-for="(course, index) in lockedCourses" :key="course._id">
                <td>{{ index + 1 }}</td>
                <td>{{ course.name }}</td>
                <td>{{ courseStore.entryCategory(course.category) }}</td>
                <td>{{ course.nameTeacher }}</td>
                <td>{{ contentStatus(course) }}</td>
                <td class="record--quantity-student">{{ course.quantityStudent }}</td>
                <td class="record--quantity-lesson">{{ course.quantityLesson }}</td>
                <td>{{ course.deletedAt.split('T')[0] }}</td>
                <td>
                    <button type="button" class="btn--recovery" @click="recoveryCourse(course._id)">
                        <font-awesome-icon :icon="['fas', 'key']" style="color: #f1f1f1;" />
                        Gỡ khóa
                    </button>
                    <button type="button" class="btn--destroy">Xóa</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import courseService from '../../services/course.service.js';
import { useUserStore } from '../../stores/user.js';
import { useCourseStore } from '../../stores/course.js';


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
            lockedCourses: []
        }
    },

    methods: {
        async assignValues() {
            const res = await courseService.deletedList(this.userStore.accessToken);
            if (res.status === 200) {
                this.lockedCourses = res.data;
            }
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

        async recoveryCourse(idCourse) {
            const res = await courseService.restore({ idCourse }, this.userStore.accessToken);
            if (res.status === 200) {
                await this.assignValues();
            }
        },
    },
    async created() {
        await this.assignValues();
    }
}
</script>
<style lang="scss" scoped>
@import './styles.scss';

@media (max-width: 1023px) {

    .record--quantity-student,
    .record--quantity-lesson {
        display: none;
    }
}
</style>