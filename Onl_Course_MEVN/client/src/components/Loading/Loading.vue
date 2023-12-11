<template>
    <div class='modal' id="modal-loading">
        <div class='modal-content'>
            <div class='loader'></div>
            <div class='modal-text'>Loading...</div>
        </div>
    </div>
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

    async mounted() {
        const modalLoading = document.getElementById('modal-loading');
        this.userStore.isLoading ? modalLoading.style.display = "flex" : modalLoading.style.display = "none";
    }
}
</script>

<style lang="scss" scoped>
.modal {
    justify-content: center;
    align-items: center;
    position: fixed;
    /* Stay in place */
    z-index: 2;
    /* Sit on top */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    background-color: rgba(0, 0, 0, 0.3);
    /* Semi-transparent black background */
}

.modal-content {
    display: flex;
    margin: auto;
    width: 25%;
    aspect-ratio: 3/1.2;
    border: 1px solid #888;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2);
    background-color: $white-color;
}

.modal-text {
    margin-left: 14px;
    font-size: 2rem;
}

.loader {
    width: 50px;
    height: 50px;
    border: 8px solid $gray-color;
    border-top: 8px solid $green-color;
    border-bottom: 8px solid $green-color;
    border-radius: 50%;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@media (min-width: 740px) and (max-width: 1023px) {
    .modal-content {
        width: 40%;
    }
}

@media (max-width: 739px) {
    .modal-content {
        width: 64%;
    }
}
</style>