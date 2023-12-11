<template>
    <div class="table-user col lg-12 md-12 col-12" :key="userStore.lockedUsers.length">
        <h2 style="line-height: 4.2rem;" v-if="userStore.lockedUsers.length === 0">Chưa có Người dùng nào bị khóa!</h2>
        <table class="w-100 text-center" v-else>
            <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Giới tính</th>
                <th>Người dùng</th>
                <th class="record--contact">Liên hệ</th>
                <th class="record--date-join">Ngày tham gia</th>
                <th>Ngày bị khóa</th>
                <th></th>
            </tr>

            <tr class="record" v-for="(user, index) in userStore.lockedUsers" :key="user._id">
                <td>{{ index + 1 }}</td>
                <td>{{ user.fullName }}</td>
                <td>{{ user.gender ? 'Nam' : 'Nữ' }}</td>
                <td>{{ contentRoleUser(user.role) }}</td>
                <td class="record--contact">{{ user.phone || user.email }}</td>
                <td class="record--date-join">{{ user.joinDate.split('T')[0] }}</td>
                <td>{{ user.deletedAt.split('T')[0] }}</td>
                <td>
                    <button type="button" class="btn--recovery" @click="recoveryUser(user._id)">
                        <font-awesome-icon :icon="['fas', 'key']" style="color: #f1f1f1;" />
                        Gỡ khóa
                    </button>
                    <button type="button" class="btn--destroy" @click="toggleModalWarning(user._id)">Xóa</button>
                </td>
            </tr>
        </table>
    </div>

    <ModalRemove />
</template>

<script>
import ModalRemove from '../../components/AdminModalRemove/ModalRemove.vue';
import userService from '../../services/user.service.js';
import { useUserStore } from '../../stores/user.js';
import { useCourseStore } from '../../stores/course.js';


export default {
    components: { ModalRemove },
    setup() {
        const userStore = useUserStore();
        const courseStore = useCourseStore();
        return {
            userStore,
            courseStore
        }
    },
    methods: {
        async assignValues() {
            const res = await userService.entireLocked();
            if (res.status === 200) {
                this.userStore.lockedUsers = res.data;
            }
        },

        toggleModalWarning(id) {
            this.userStore.idPropModal = id;
            const modalWarn = document.getElementById('modal-warning');
            modalWarn.classList.toggle('show');
        },

        contentRoleUser(role) {
            if (role === 'Teacher') {
                return 'Giáo viên';
            }
            else if (role === 'Admin') {
                return 'Quản trị viên';
            }
            else return 'Học viên';
        },

        async recoveryUser(idUser) {
            const res = await userService.restore({ idUser }, this.userStore.accessToken);
            if (res.status === 200) {
                await this.assignValues();
            }
        },

        async handleDestroyUser(id) {
            const res = await userService.destroyUser(id, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Xoá người dùng thành công');
                await this.assignValues();
            }
        }
    },
    async created() {
        await this.assignValues();
    }
}
</script>
<style lang="scss" scoped>
@import './styles.scss';

@media (max-width: 1023px) {
    .record--date-join {
        display: none;
    }
}

@media (max-width: 739px) {
    .record--contact {
        display: none;
    }

    .btn--recovery {
        font-size: .9rem;
        margin-left: 2px;
        margin-right: 2px;
    }
}
</style>