<template>
    <section id="modal-warning">
        <h2 style="margin-top: .5rem; margin-bottom: .5rem;">Xóa người dùng</h2>
        <hr>

        <div class="modal__content">
            <h3 class="modal__title">Hành động này sẽ khiến người dùng bị xóa vĩnh viễn</h3>
            <p>Bạn có chắc chắn muốn xóa người dùng này ?</p>
            <div class="modal__btn">
                <button class="no" type="button" @click="toggleModalWarning()">Hủy</button>
                <button class="yes" type="button" title="xóa vĩnh viễn" @click="handleDestroyUser()">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                    Xóa
                </button>
            </div>
        </div>
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
        async assignValues() {
            const res = await userService.allTeacher();
            this.userStore.teachers = res.data;
            this.userStore.teacherFormEdit.idTeacher = this.userStore.teachers[0]._id;

            const res1 = await userService.entireLocked();
            if (res1.status === 200) {
                this.userStore.lockedUsers = res1.data;
            }

            const res2 = await userService.allStudent();
            this.userStore.students = res2.data;
        },

        toggleModalWarning() {
            const modalWarn = document.getElementById('modal-warning');
            modalWarn.classList.toggle('show');
        },

        async handleDestroyUser() {
            const res = await userService.destroyUser(this.userStore.idPropModal, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Xoá người dùng thành công');
                this.toggleModalWarning();
                await this.assignValues();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#modal-warning {
    display: none;
    position: absolute;
    padding: 15px 24px;
    width: 50%;
    max-width: 50%;
    top: 18%;
    left: 25%;
    background-color: #e4e4e4;
    border-radius: 10px;
    animation: fadeIn .3s ease-in;

    &.show {
        display: block;
    }
}

.modal__btn {
    float: right;
    margin-top: 1rem;

    .yes,
    .no {
        padding: 10px 15px;
        font-size: 1rem;
        border-radius: 5px;
        color: $white-text-color;
        cursor: pointer;
        opacity: 1;

        &:hover {
            opacity: 0.8;
        }
    }

    .yes {
        background-color: $red-color;
        border: 1px solid orangered;
        margin-left: 12px;
    }

    .no {
        background-color: $gray-color;
        border: 1px solid #777;
    }
}

.modal__title {
    margin: 10px auto;
}

@keyframes fadeIn {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    #modal-warning {
        width: 70%;
        max-width: 70%;
        left: 15%;
    }
}

@media (max-width: 739px) {
    #modal-warning {
        width: 90%;
        max-width: 90%;
        left: 5%;
    }
}
</style>