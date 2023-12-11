<template>
    <div class="overlay"></div>

    <section id="delete-course" class="modal--delete text-center">
        <font-awesome-icon :icon="['fas', 'times']" class="icon--close" @click="toggleModal()" />

        <div class="modal__content">
            <h3 class="modal__title">Bạn có chắc chắn muốn xóa khóa học này ?</h3>
            <h3 class="modal__title">Bạn sẽ không thể phục hồi lại khóa học sau khi xóa</h3>
            <font-awesome-icon :icon="['fas', 'trash']" class="icon--trash" />
            <button class="modal__btn" type="button" @click="handleForceDel()">Xóa</button>
        </div>
    </section>
</template>

<script>
import courseService from '../../services/course.service.js';
import { useUserStore } from '../../stores/user.js';
import { useCourseStore } from '../../stores/course.js';

export default {
    props: ['idCourse'],
    setup() {
        const userStore = useUserStore();
        const courseStore = useCourseStore();
        return {
            userStore,
            courseStore
        }
    },
    methods: {
        toggleModal() {
            const overlayElement = document.getElementsByClassName('overlay')[0];
            const modalElement = document.getElementById('delete-course');
            overlayElement.classList.toggle('show');
            modalElement.classList.toggle('show');
        },
        async handleForceDel() {
            const res = await courseService.forceDelete(this.courseStore.idPropModal, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Khóa học đã được xóa!');
                await this.toggleModal();
                this.$router.push({ name: 'courses' })
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 2;

    &.show {
        display: block;
    }
}

#delete-course {
    display: none;
    position: absolute;
    width: 50%;
    aspect-ratio: 2/1;
    background-color: $white-color;
    box-shadow: 3px 3px 2px rgba(0, 0, 0, 0.3);
    border-radius: 20px;
    top: 15%;
    left: 25%;
    z-index: 3;
    animation: fadeIn .3s ease-in-out;

    &.show {
        display: block;
    }
}

.icon--close {
    width: 30px;
    height: 30px;
    float: right;
    margin: 1rem 1.25rem 2rem auto;
    cursor: pointer;

    &:hover {
        color: #777;
    }
}

.modal__content {
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal__title {
    font-size: 1.2rem;
    margin-bottom: .5rem;
}

.icon--trash {
    margin-top: 1rem;
    width: 10%;
    height: 12%;
    color: rgb(250, 46, 46);
}

.modal__btn {
    float: none;
    margin-top: 2rem;
    padding: 8px 22px;
    font-size: 1.2rem;
    font-weight: 550;
    background-color: rgb(249, 65, 65);
    color: $white-color;
    border: 2px solid chocolate;
    border-radius: 15px;
    cursor: pointer;

    &:hover {
        background-color: rgb(249, 0, 0);
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

@media (max-width: 1023px) {
    .icon--close {
        margin: .5rem .75rem 1rem auto;
    }

    .modal__content {
        margin-top: 3.5rem;
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    #delete-course {
        width: 80%;
        left: 10%;
        top: 25%;
    }
}

@media (max-width: 739px) {
    #delete-course {
        width: 96%;
        left: 2%;
        top: 25%;
    }

    .modal__title {
        font-size: .9rem;
    }

    .modal__btn {
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 6px 20px;
        font-size: 1rem;
    }

    .icon--close {
        width: 24px;
        height: 24px;
    }
}
</style>