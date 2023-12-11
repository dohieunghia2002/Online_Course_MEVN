<template>
    <div class="trash-page grid wide" :key="courses.length">
        <h2 class="title-page">Khóa học đã khóa</h2>
        <br />
        <div class="row" v-if="courses.length === 0" style="min-height: 70.5vh;">
            <div class="col lg-12 md-12">
                <h3 class="text-center">Bạn không có bất kỳ danh mục nào bị xóa</h3>
            </div>
        </div>
        <div class="course__wrapper row" v-else>
            <div class="col lg-4 md-6" v-for="(course) in courses" :key="course._id">
                <div class="course__item">
                    <img :src="course.coverPhoto.url" alt="ảnh bìa" class="w-100 h-100">
                    <h3 class="course__name">{{ course?.name }}</h3>
                </div>
                <div class="course__btn">
                    <button type="button" class="btn--restore" @click="handleRestore(course._id)">
                        <font-awesome-icon :icon="['fas', 'key']" />
                        Mở khóa
                    </button>
                    <button type="button" class="btn--remove" title="xóa vĩnh viễn"
                        @click="updateValueIdDelete(course._id), toggleModalWarning()">
                        <font-awesome-icon :icon="['fas', 'trash']" />
                        Xóa
                    </button>
                </div>
            </div>
        </div>

        <section id="modal-warning">
            <h2 style="margin-top: .5rem; margin-bottom: .5rem;">Xóa khóa học</h2>
            <hr>

            <div class="modal__content">
                <h3 class="modal__title">Hành động này sẽ khiến khóa học bị xóa vĩnh viễn</h3>
                <p>Bạn có chắc chắn muốn xóa khóa học này ?</p>
                <div class="modal__btn">
                    <button class="no" type="button" @click="toggleModalWarning()">Hủy</button>
                    <button class="yes" type="button" @click="handleForceDel()">Xóa</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { useUserStore } from '../../stores/user.js';
import courseService from '../../services/course.service.js';

export default {
    setup() {
        const userStore = useUserStore();
        return {
            userStore
        }
    },
    data() {
        return {
            courses: [],
            idDelete: ''
        }
    },
    methods: {
        async assignValues() {
            const res = await courseService.deletedList(this.userStore.accessToken);
            this.courses = res.data;
        },
        updateValueIdDelete(id) {
            this.idDelete = id;
        },
        toggleModalWarning() {
            console.log(this.idDelete);
            const modalElement = document.getElementById('modal-warning');
            modalElement.classList.toggle('show');
        },

        async handleRestore(idCourse) {
            const res = await courseService.restore({ idCourse }, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Khôi phục khóa học thành công');
                await this.assignValues();
            }
        },
        async handleForceDel() {
            const res = await courseService.forceDelete(this.idDelete, this.userStore.accessToken);
            if (res.status === 200) {
                alert('Khóa học đã được xóa!');
                this.toggleModalWarning();
                await this.assignValues();
            }
        },
    },
    async created() {
        await this.assignValues();
    }
}
</script>

<style lang="scss" scoped>
.trash-page {
    position: relative;
}

#modal-warning {
    display: none;
    position: absolute;
    padding: 10px 20px;
    width: 50%;
    max-width: 50%;
    top: 20%;
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
        margin-left: 10px;
    }

    .no {
        background-color: $gray-color;
        border: 1px solid #777;
    }
}

.modal__title {
    margin: 10px auto;
}

.course__wrapper {
    min-height: 70.5vh;
}

.course__item {
    position: relative;
    height: $height-img-course-trash;
    border-radius: 15px;
    overflow: hidden;
}

.course__name {
    font-size: 1.2rem;
    line-height: 4.2rem;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: $white-text-color;
}

.course__btn {
    display: flex;
    margin: .5rem auto;
    justify-content: space-evenly;
}

.btn--restore,
.btn--remove {
    width: 38%;
    padding: 8px 0;
    color: $white-color;
    border: none;
    height: 100%;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 25px;
    cursor: pointer;
}

.btn--remove {
    background-color: rgb(249, 51, 51);

    &:hover {
        background-color: rgb(218, 2, 2);
    }
}

.btn--restore {
    background-color: rgb(64, 241, 24);

    &:hover {
        background-color: rgb(48, 185, 17);
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
    .course__item {
        height: 190px;
    }
}
</style>