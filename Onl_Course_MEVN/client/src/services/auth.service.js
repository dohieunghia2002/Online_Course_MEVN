import axios from 'axios';
import axiosJWT from './createInstance.js';

const baseUrl = import.meta.env.VITE_URL_SERVER + '/auth';

class authService {
    async signup(form) {
        return await axios.post(`${baseUrl}/signup`, form);
    }

    async login(form) {
        return await axios.post(`${baseUrl}/signin`, form);
    }

    async logout(accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.post(`${baseUrl}/logout`, {}, headerConfig);
    }

    async createTeacher(form, accessToken) {
        const headerConfig = {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        }
        return await axiosJWT.post(`${baseUrl}/signup/teacher`, form, headerConfig);
    }
}

export default new authService;