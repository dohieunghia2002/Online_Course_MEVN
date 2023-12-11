import axios from 'axios';
import axiosJWT from './createInstance.js';

const baseUrl = import.meta.env.VITE_URL_SERVER + '/lesson';

class lessonService {
    async updateLesson(form, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.put(`${baseUrl}/update`, form, headerConfig);
    }

    async lessonList(id) {
        return await axios.get(`${baseUrl}/course/${id}`);
    }
}

export default new lessonService;