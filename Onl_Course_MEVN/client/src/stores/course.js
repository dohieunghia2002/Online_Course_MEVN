import { defineStore } from 'pinia';
import courseService from '../services/course.service.js';


export const useCourseStore = defineStore('course', {
    state: () => {
        return {
            coursesTeacher: [],
            idPropModal: '0',
            nameCourse: '',
            studentsCourse: []
        }
    },

    getters: {
        company() {
            return import.meta.env.VITE_COMPANY_NAME;
        }
    },

    actions: {
        async allCourseTeacher(id) {
            const res = await courseService.coursesTeacher(id);
            if (res.status === 200) {
                this.coursesTeacher = res.data.courses;
            }
            if (this.coursesTeacher.length > 0) {
                this.idPropModal = this.coursesTeacher[0]._id;
            }
        },

        async preprocessing() {
            const temp = this.coursesTeacher.map((obj) => {
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
            this.coursesTeacher = [...sortedAsc];
        },

        entryCategory(category) {
            if (category === 'web') {
                return 'Lập trình web';
            }
            else if (category === 'ml') {
                return 'Machine learning';
            }
            else if (category === 'algorithm') {
                return 'CTDL & GT';
            }
            else {
                return 'Danh mục khác'
            }
        },
    }
})