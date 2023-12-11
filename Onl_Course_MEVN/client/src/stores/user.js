import { defineStore } from 'pinia';
import authService from '../services/auth.service.js';
import userService from '../services/user.service.js';


export const useUserStore = defineStore('user', {
    state: () => {
        return {
            isLoading: false,
            account: {
                _id: '',
                fullName: '',
                gender: true,
                email: '',
                username: '',
                role: '',
                phone: '',
                avatar: {},
                joinDate: Date.now()
            },
            accessToken: JSON.parse(localStorage.getItem('accessToken'))?.accessToken || '',
            coursesStudent: [],
            teacherFormEdit: {
                idTeacher: '',
                fullName: '',
                gender: true,
                phone: ''
            },
            lockedUsers: [], // locked user list page
            teachers: [], // teacher list page
            students: [], // student list page
            idPropModal: '0',
            contentSearch: '',
            isActiveSearch: false
        }
    },

    actions: {
        async signupStudent(formRegister) {
            const res = await authService.signup(formRegister);
            if (res.status === 201) {
                window.alert('Tạo tài khoản thành công')
                window.location.assign('/login');
            }
        },

        async addNewTeacher(formRegister) {
            const res = await authService.createTeacher(formRegister, this.accessToken);
            if (res.status === 201) {
                window.alert('Tạo giáo viên thành công');
            }
        },

        async loginUser(formLogin) {
            try {
                this.isLoading = true;
                const res = await authService.login(formLogin);
                if (res.status === 200) {
                    window.alert('Đăng nhập thành công')
                    this.account._id = res.data.user._id;
                    this.account.fullName = res.data.user.fullName;
                    this.account.gender = res.data.user.gender;
                    this.account.email = res.data.user.email;
                    this.account.username = res.data.user.username;
                    this.account.role = res.data.user.role;
                    this.account.phone = res.data.user.phone;
                    this.account.joinDate = res.data.user.joinDate;
                    if (res.data.user.avatar != undefined) {
                        this.account.avatar = res.data.user.avatar;
                    }
                    console.log(this.account);
                    this.accessToken = res.data.accessToken;

                    if (this.account.role == 'Admin') {
                        window.location.assign('/admin');
                    }
                    else window.location.assign('/');
                    this.isLoading = false;
                }
            } catch (error) {
                alert('Sai tên đăng nhập hoặc mật khẩu');
                this.isLoading = false;
            }
        },
        async handleLogout() {
            const res = await authService.logout(this.accessToken);
            if (res.status == 200) {
                this.account._id = '';
                this.account.fullName = '';
                this.account.gender = true;
                this.account.email = '';
                this.account.username = '';
                this.account.role = 'Student';
                this.account.avatar = {};
                this.account.joinDate = Date.now();

                this.accessToken = await JSON.parse(localStorage.getItem('accessToken'))?.accessToken || '';
                window.location.href = '/';
                localStorage.clear();
                sessionStorage.clear();
            }
        },

        async getCoursesEnrolled(id) {
            const res = await userService.coursesStudent(id);
            if (res.status === 200) {
                this.coursesStudent = res.data.courses;
            }
        }
    },

    persist: [
        {
            key: 'user',
            paths: ['account'],
            storage: localStorage
        },
        {
            key: 'accessToken',
            paths: ['accessToken'],
            storage: localStorage
        }
    ]
})