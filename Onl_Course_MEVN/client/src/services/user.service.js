import axios from 'axios';
import axiosJWT from './createInstance.js';

const baseUrl = import.meta.env.VITE_URL_SERVER + '/user';

class userService {
    async coursesStudent(id) {
        return await axios.get(`${baseUrl}/${id}/my-courses`);
    }

    async currentProcess(id, idCourse) {
        return await axios.get(`${baseUrl}/${id}/my-courses/${idCourse}`);
    }

    async allTeacher() {
        return await axios.get(`${baseUrl}/entire/teacher`);
    }

    async allStudent() {
        return await axios.get(`${baseUrl}/entire/student`);
    }

    async detailTeacher(id) {
        return await axios.get(`${baseUrl}/teacher/${id}`);
    }

    async detailStudent(id) {
        return await axios.get(`${baseUrl}/student/${id}`);
    }

    async updateInfoTeacher(form, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.put(`${baseUrl}/teacher/edit`, form, headerConfig);
    }

    async delUser(id, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.delete(`${baseUrl}/${id}`, headerConfig);
    }

    async entireLocked() {
        return axios.get(`${baseUrl}/deleted/stored`);
    }

    async restore(data, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.put(`${baseUrl}/restore`, data, headerConfig);
    }

    async destroyUser(id, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.delete(`${baseUrl}/${id}/destroy`, headerConfig);
    }

    async updateAvatar(id, accessToken, data) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.patch(`${baseUrl}/${id}/avatar`, data, headerConfig);
    }
}

export default new userService;