<template>
    <section class="login grid wide">
        <div class="row">
            <div class="col lg-6 lg-o-3 md-8 md-o-2 col-12 col-o-0">
                <form class="form" method="POST" @submit.prevent="login()">
                    <h3 style="font-size: 1.5rem;" class="text-center">Đăng Nhập</h3>

                    <div class="form__group">
                        <label class="form-group__label" for="username">Username</label>
                        <input class="form__input" type="username" id="username" v-model="formLogin.username">
                    </div>
                    <div class="form__group">
                        <label class="form-group__label" for="pwd">Password</label>
                        <input class="form__input" type="password" id="pwd" v-model="formLogin.password">
                    </div>

                    <div class="form__group--btn">
                        <button type="submit" class="btn--login" disabled v-if="isDisabled">Đăng nhập</button>
                        <button type="submit" class="btn--login" v-else>Đăng nhập</button>
                        <button type="reset" class="btn--cancel">Hủy</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="row">
            <div class="col lg-12 md-12 col-12">
                <p class="router-content text-center">
                    Nếu bạn chưa có tài khoản? Hãy thực hiện
                    <router-link class="signup-link" :to="{ name: 'signup' }">
                        đăng ký
                    </router-link>
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col lg-12 md-12 col-12" style="text-align: center; margin-top: 1rem;">
                <img src="../../assets/images/logo.png" alt="logo" class="logo">
            </div>
        </div>
    </section>
</template>

<script>
import { useUserStore } from '../../stores/user.js';

export default {
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            formLogin: {
                username: '',
                password: ''
            }
        }
    },
    computed: {
        isDisabled() {
            if (this.formLogin.username.length === 0 || this.formLogin.password.length === 0) {
                return true;
            }
            else return false;
        }
    },
    methods: {
        async login() {
            await this.userStore.loginUser(this.formLogin);
        }
    }
}
</script>

<style lang="scss" scoped>
.login {
    min-height: 79vh;
}

.form {
    margin-top: 2rem;
    margin-bottom: 2rem;
}

.form__group {
    display: flex;
    margin-top: 1.5rem;
    font-size: 1.3rem;
}

.form__group--btn {
    margin-top: 2rem;

    .btn--login,
    .btn--cancel {
        margin-bottom: 2rem;
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

    .btn--login {
        background-color: rgb(3, 166, 3);
        border: 1px solid rgb(92, 152, 2);
        margin-left: 10px;

        &:disabled {
            background-color: rgb(91, 89, 89);
            border: 1px solid #888;
            pointer-events: none;
        }
    }

    .btn--cancel {
        background-color: rgb(153, 153, 153);
        border: 1px solid #888;
    }
}

.form-group__label {
    flex: 0.5;
}

.form__input {
    margin-left: 5px;
    flex: 2.5;
    font-size: 1.3rem;
}

.router-content {
    font-size: 1.2rem;
    line-height: 4.5rem;

    .signup-link {
        text-decoration: none;
        padding: 4px 10px;
        background-color: rgb(62, 93, 248);
        color: white;
        border-radius: 6px;
    }
}

.logo {
    width: 20%;
}

@media (max-width: 1023px) {
    .logo {
        width: 60%;
    }
}

@media (max-width: 739px) {
    .router-content {
        font-size: 1.25rem;
        line-height: 2.5rem;

        .signup-link {
            padding: 5px 12px;
        }
    }

    .login {
        min-height: 77.5vh;
    }
}
</style>