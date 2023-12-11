<template>
    <section id="edit-teacher" class="modal--edit text-center" v-if="userStore.teacherFormEdit.idTeacher.length > 0">
        <font-awesome-icon :icon="['fas', 'times']" class="icon--close" @click="toggleModal()" />
        <h2 class="modal__heading">Cập nhật thông tin giáo viên</h2>
        <hr>
        <form method="POST" class="form--edit" @submit.prevent="saveUpdate()">
            <div class="form__group">
                <label class="form-group__label" for="_name">Họ tên</label>
                <input class="form__input" type="text" id="_name" v-model="this.userStore.teacherFormEdit.fullName"
                    required>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="sex">Giới tính</label>

                <div class="sex__input">
                    <div>
                        <label class="form-group__label" for="_male">Nam</label>
                        <input class="form__input" name="sex" type="radio" id="_male" value="true"
                            v-model="this.userStore.teacherFormEdit.gender">
                    </div>

                    <div>
                        <label class="form-group__label" for="_female">Nữ</label>
                        <input class="form__input" name="sex" type="radio" id="_female" value="false"
                            v-model="this.userStore.teacherFormEdit.gender">
                    </div>
                </div>
            </div>
            <div class="form__group">
                <label class="form-group__label" for="_phone">Số điện thoại</label>
                <input class="form__input" type="text" id="_phone" required v-model="this.userStore.teacherFormEdit.phone">
            </div>

            <div class="form__group--btn">
                <button type="submit" class="btn--save">Lưu</button>
            </div>
        </form>
    </section>
</template>

<script>
import userService from '../../services/user.service.js';
import { useUserStore } from '../../stores/user.js';

export default {
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    methods: {
        toggleModal() {
            const modalNewTeacher = document.getElementById('edit-teacher');
            modalNewTeacher.classList.toggle('show');
        },

        async assignValues() {
            const res1 = await userService.allTeacher();
            this.userStore.teacherFormEdit.idTeacher = res1.data[0]._id;
            const res = await userService.detailTeacher(this.userStore.teacherFormEdit.idTeacher);
            this.userStore.teacherFormEdit.idTeacher = res.data._id;
            this.userStore.teacherFormEdit.fullName = res.data.fullName;
            this.userStore.teacherFormEdit.gender = res.data.gender;
            this.userStore.teacherFormEdit.phone = res.data.phone;
        },

        async saveUpdate() {
            const res = await userService.updateInfoTeacher(this.userStore.teacherFormEdit, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Cập nhật thông tin thành công');
                window.location.reload();
            }
        }
    },
    async mounted() {
        await this.assignValues();
    }
}
</script>
<style lang="scss" scoped>
#edit-teacher {
    display: none;
    position: absolute;
    width: 50%;
    top: -15%;
    left: 25%;
    background-color: rgb(248, 236, 219);
    padding: 1rem 2.5rem;
    border-radius: 16px;
    animation: fadeIn .4s ease-in-out;

    &.show {
        display: block;
    }
}

.icon--close {
    width: 28px;
    height: 28px;
    float: right;
    cursor: pointer;

    &:hover {
        color: #777;
    }
}

.modal__heading {
    margin-top: 1.5rem;
    line-height: 3.2rem;
}

.form__group {
    display: flex;
    margin-top: 1.5rem;
    font-size: 1.2rem;
}

.sex__input {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 80%;
}

.form-group__label {
    flex: 1;
    font-weight: 600;
    text-align: left;
}

.form__input {
    margin-left: 5px;
    flex: 2.5;
}

.form__group--btn {
    margin-top: 2rem;

    .btn--save {
        font-size: 1.2rem;
        padding: 8px 10px;
        color: white;
        border-radius: 4px;
        float: right;
        opacity: 1;
        cursor: pointer;
        background-color: rgb(3, 166, 3);
        border: 1px solid rgb(92, 152, 2);
        margin-left: 10px;

        &:disabled {
            background-color: rgb(91, 89, 89);
            border: 1px solid #888;
            pointer-events: none;
        }

        &:hover {
            opacity: 0.8;
        }
    }
}

@keyframes fadeIn {
    from {
        transform: translateY(-80%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    #edit-teacher {
        width: 90%;
        left: 5%;
    }
}

@media (max-width: 739px) {
    #edit-teacher {
        width: 96%;
        left: 2%;
        padding: 1rem .5rem;
    }

    .form__group {
        margin-top: 1rem;
        font-size: 1rem;
    }
}
</style>