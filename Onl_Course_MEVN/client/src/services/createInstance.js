import axios from "axios";
import jwtDecode from "jwt-decode";

const urlServer = import.meta.env.VITE_URL_SERVER;

const refreshToken = async (idUser) => {
    try {
        const res = await axios.post(`${urlServer}/auth/refresh`, { idUser });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

const newInstance = axios.create();
newInstance.interceptors.request.use(async function (config) {
    let date = new Date();
    const accessToken = await JSON.parse(localStorage.getItem('accessToken')).accessToken;

    const decode = await jwtDecode(accessToken);

    if (decode.exp < (date.getTime() / 1000)) {
        const newAccessToken = await refreshToken(decode.id);
        localStorage.setItem("accessToken", `{"accessToken":"${newAccessToken}"}`);
        config.headers['authorization'] = `Bearer ${newAccessToken}`
    }
    return config;
}, async function (err) {
    return Promise.reject(err);
});

export default newInstance;