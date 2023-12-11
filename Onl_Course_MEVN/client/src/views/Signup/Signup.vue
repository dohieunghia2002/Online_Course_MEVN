<template>
    <section class="signup grid wide">
        <div class="row">
            <div class="col lg-6 lg-o-3 md-12 md-o-0 col-12 col-o-0">
                <form class="form" method="POST" id="form-signup" @submit.prevent="handleRegister()">
                    <h3 style="font-size: 1.5rem; line-height: 4rem;" class="text-center">Đăng Ký Học Viên</h3>

                    <p class="title-heading text-center">
                        Cùng nhau học các khóa học hữu ích tại {{ courseStore.company }} !
                    </p>
                    <div class="form__group">
                        <label class="form-group__label" for="name">Họ tên</label>
                        <input class="form__input" type="text" id="name" placeholder="VD: Nguyễn Văn A"
                            v-model="formSignup.fullName" required>
                        <span class="form__msg"></span>
                    </div>

                    <div class="form__group">
                        <label class="form-group__label" for="sex">Giới tính</label>
                        <section class="sex__input">
                            <div class="sex__item">
                                <label class="form-group__label" style="margin-right: 8px;" for="male">Nam</label>
                                <input class="form__input" type="radio" id="male" value="true" v-model="formSignup.gender">
                            </div>
                            <div class="sex__item">
                                <label class="form-group__label" style="margin-right: 8px;" for="female">Nữ</label>
                                <input class="form__input" type="radio" id="female" value="false"
                                    v-model="formSignup.gender">
                            </div>
                        </section>
                    </div>
                    <div class="form__group">
                        <label class="form-group__label" for="email">Email</label>
                        <input class="form__input" type="email" id="email" placeholder="VD: nguyenvana@gmail.com"
                            v-model="formSignup.email" required>
                        <span class="form__msg"></span>
                    </div>
                    <div class="form__group">
                        <label class="form-group__label" for="username">Username</label>
                        <input class="form__input" type="username" id="username" placeholder="username tối thiểu 6 ký tự"
                            v-model="formSignup.username" required>
                        <span class="form__msg"></span>
                    </div>
                    <div class="form__group">
                        <label class="form-group__label" for="pwd">Password</label>
                        <input class="form__input" type="password" id="pwd" placeholder="mật khẩu tối thiểu 6 ký tự"
                            v-model="formSignup.password" required>
                        <span class="form__msg"></span>
                    </div>

                    <div class="form__group--btn">
                        <button type="submit" class="btn--signup">Đăng ký</button>
                        <button type="reset" class="btn--cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="row">
            <div class="col lg-12 md-12 col-12">
                <p class="router-content text-center">
                    Nếu bạn đã có tài khoản? Hãy thực hiện
                    <router-link class="login-link" :to="{ name: 'login' }">
                        đăng nhập
                    </router-link>
                </p>
            </div>
        </div>
    </section>
</template>
<script>
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
            formSignup: {
                fullName: '',
                gender: true,
                email: '',
                username: '',
                password: '',
            }
        }
    },
    methods: {
        handleValidator() {
            Validator({
                form: '#form-signup',
                errorSelector: '.form__msg',
                rules: [
                    Validator.isRequired('#name', 'Vui lòng nhập tên đầy đủ của bạn'),
                    Validator.isFullName('#name'),
                    Validator.isRequired('#email', 'Vui lòng nhập email của bạn'),
                    Validator.isEmail('#email'),
                    Validator.isRequired('#username'),
                    Validator.minLength('#username', 6),
                    Validator.minLength('#pwd', 6)
                ]
            });
        },
        handleRegister() {
            const formGroups = document.getElementsByClassName('invalid');
            if (formGroups.length > 0) {
                alert('Sai thông tin, đăng ký không thành công');
            }
            else {
                this.userStore.signupStudent(this.formSignup);
            }
        }
    },
    async mounted() {
        this.handleValidator();
    }
}
</script>
<style lang="scss" scoped>
.signup {
    min-height: 78vh;
}

.title-heading {
    font-size: 1.2rem;
    color: #666;
}

#form-signup {
    display: flex;
    flex-direction: column;
    border: 2px solid #ccc;
    border-radius: 12px;
    box-shadow: 2px 3px rgba(0, 0, 0, .1);
    padding: .5rem 1.5rem;
}

.form__group {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
}

.form-group__label {
    font-weight: 500;
    font-size: 1.25rem;
    padding-bottom: 6px;
    line-height: 1.5rem;
    text-align: left;
}

.form__input {
    font-size: 1.2rem;
    height: 32px;
    padding: 8px 12px;
    border: 1px solid #b3b3b3;
    border-radius: 3px;
    outline: none;
    text-align: left;
}

.sex__input {
    display: flex;

    .sex__item {
        display: inline-flex;
        align-items: center;
        margin-right: 5rem;
    }
}

.form__msg {
    font-size: 1rem;
    line-height: 1.4rem;
    padding: 4px 0 0;
    font-style: italic;
}

.form__group.invalid .form__msg {
    color: #f33a58;
}

.form__group.invalid .form__input {
    border: 1px solid #f33a58;
}

.form__group--btn {
    margin-top: 1.25rem;

    .btn--signup,
    .btn--cancel {
        margin-bottom: 1rem;
        font-size: 1.2rem;
        padding: 8px 10px;
        color: white;
        border-radius: 4px;
        float: right;
        opacity: 1;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }

    .btn--signup {
        background-color: rgb(3, 166, 3);
        border: 1px solid rgb(92, 152, 2);
        margin-left: 10px;

        &:disabled {
            background-color: rgb(103, 102, 102);
            border: 1px solid rgb(64, 64, 64);
        }
    }

    .btn--cancel {
        background-color: rgb(153, 153, 153);
        border: 1px solid #888;
    }
}

.router-content {
    font-size: 1.2rem;
    line-height: 4rem;

    .login-link {
        text-decoration: none;
        padding: 4px 10px;
        background-color: rgb(62, 93, 248);
        color: white;
        border-radius: 6px;
    }
}

@media (max-width: 1023px) {
    #form-signup {
        padding: 1rem 2.5rem;
    }
}

@media (max-width: 739px) {
    .title-heading {
        font-size: 1.1rem;
    }
}
</style>