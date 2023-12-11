import axios from 'axios';
import axiosJWT from './createInstance.js';

const baseUrl = import.meta.env.VITE_URL_SERVER + '/course';

class courseService {
    async newCourse(form, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.post(`${baseUrl}/new`, form, headerConfig);
    }

    async coursesTeacher(id) {
        return await axios.get(`${baseUrl}/teacher/${id}`);
    }

    async detailCourse(id) {
        return await axios.get(`${baseUrl}/${id}`);
    }

    async editInfo(form, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.put(`${baseUrl}/edit`, form, headerConfig);
    }

    async entireLesson(id) {
        return await axios.get(`${baseUrl}/${id}/lesson`);
    }

    async allCourses() {
        return await axios.get(`${baseUrl}/all`);
    }

    async coursesCategory(category) {
        return await axios.get(`${baseUrl}/${category}/stored`);
    }

    async allComingSoon() {
        return await axios.get(`${baseUrl}/coming-soon`);
    }

    async enrollCourse(data, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.put(`${baseUrl}/enroll`, data, headerConfig);
    }

    async allStudent(id) {
        return await axios.get(`${baseUrl}/${id}/students`);
    }

    async toggleCompleted(data, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.patch(`${baseUrl}/complete`, data, headerConfig);
    }

    async softDelete(id, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.delete(`${baseUrl}/${id}`, headerConfig);
    }

    async deletedList(accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.get(`${baseUrl}/deleted`, headerConfig);
    }

    async restore(id, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.put(`${baseUrl}/restore`, id, headerConfig);
    }

    async forceDelete(id, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.delete(`${baseUrl}/${id}/remove`, headerConfig);
    }

    async updateLessonLearning(data, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.put(`${baseUrl}/student/learning`, data, headerConfig);
    }
}

export default new courseService;