<template>
    <div class="frame__intro">
        <section class="wrapper">
            <div class="frame__header">
                <h3 class="header__heading">About me</h3>
            </div>

            <div class="frame__content row">
                <div class="col lg-3 md-3 col-0">
                    <div class="avatar__wrapper w-100">
                        <img class="avatar w-100"
                            src="https://res.cloudinary.com/ddr8slya4/image/upload/v1698304797/kwb2-4611_m7dqed.webp"
                            alt="avatar">
                    </div>
                </div>

                <div class="col lg-9 md-9 col-12">
                    <div class="speech--lg">
                        <p class="speech">
                            &emsp;&emsp;Chào các bạn! Tôi là Steve Do. Hiện tại tôi đang là một lập trình viên,
                            nhà phân tích dữ liệu, giảng viên đại học. Tôi là người đã thành lập {{ courseStore.company }},
                            với mong muốn xây dựng một cộng động học lập trình lớn mạnh và vững vàng, giúp việc
                            học lập trình trở nên dễ nắm bắt và chủ động hơn.
                        </p>

                        <p class="speech">
                            &emsp;&emsp;Hy vọng bạn sẽ có một trải nghiệm tuyệt vời với {{ courseStore.company }} và sẽ học
                            tập
                            được nhiều kiến thức hữu ích từ các khóa học của chúng tôi. Nếu bạn có kĩ năng truyền đạt
                            tốt và muốn góp phần phát triển khóa học, đừng ngần ngại liên lạc với tôi.
                        </p>
                        <p class="speech">&emsp;&emsp;<strong>"Theo đuổi sự ưu tú, thành công sẽ theo đuổi bạn".</strong>
                        </p>
                    </div>
                    <div class="speech--md">
                        <p class="speech">
                            &emsp;&emsp;Chào các bạn! Tôi là Steve Do. Hiện tại tôi đang là một lập trình viên,
                            nhà phân tích dữ liệu, giảng viên đại học. Tôi là người đã thành lập {{ courseStore.company }},
                            với mong muốn xây dựng một cộng động học lập trình lớn mạnh và vững vàng, giúp việc
                            học lập trình trở nên dễ nắm bắt và chủ động hơn.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import { useCourseStore } from '../../stores/course.js';

export default {
    setup() {
        const courseStore = useCourseStore();
        return {
            courseStore
        }
    }
}
</script>

<style lang="scss" scoped>
.frame__intro {
    min-height: 368px;
    color: $white-text-color;
    background-color: $dark-color;
    border-radius: 25px;
    margin-bottom: 2rem;

    .wrapper {
        padding: 1rem 1.5rem;
    }
}

.header__heading {
    font-size: 1.3rem;
    line-height: 2rem;
    border-bottom: 2px solid rgb(227, 244, 41);
    width: 10%;
}

.avatar {
    margin-top: 1rem;
    border-radius: 50%;
}

.speech {
    font-size: 1.3rem;
    text-align: justify;
}

.speech--md {
    display: none;
}

@media (max-width: 1023px) {
    .header__heading {
        width: 20%;
    }

    .speech--md {
        display: block;
    }

    .speech--lg {
        display: none;
    }

    .frame__intro {
        min-height: 290px;
    }
}

@media (max-width: 739px) {
    .header__heading {
        width: 33%;
        margin-bottom: 5px;
    }

    .frame__intro {
        border-radius: 15px;
    }
}
</style>