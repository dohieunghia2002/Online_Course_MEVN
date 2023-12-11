<template>
    <ul class="pagination" :key="paginationStore.idxCurNode" v-if="paginationStore.quantityNodes > 1">
        <li class="pagination__node pagination__node--pre">
            <button type="button" class="pagination__btn" @click="paginationStore.indexPrevPage()">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
            </button>
        </li>
        <li class="pagination__node pagination__node--number" v-for="(node) in paginationStore.quantityNodes">
            <button type="button" class="pagination__btn" @click="() => paginationStore.idxCurNode = node - 1">
                {{ node }}
            </button>
        </li>
        <li class="pagination__node pagination__node--next">
            <button type="button" class="pagination__btn" @click="paginationStore.indexNextPage()">
                <font-awesome-icon :icon="['fas', 'chevron-right']" />
            </button>
        </li>
    </ul>
</template>

<script>
import { usePaginationStore } from '../../stores/pagination.js';

export default {
    setup() {
        const paginationStore = usePaginationStore();
        return {
            paginationStore
        }
    },
    methods: {
        activeNode() {
            const nodes = document.getElementsByClassName('pagination__node--number');
            for (let i = 0; i < nodes.length; i++) {
                if (i === this.paginationStore.idxCurNode) {
                    nodes[i].classList.add('active')
                } else {
                    nodes[i].classList.remove('active')
                }
            }
        }
    },
    async mounted() {
        this.activeNode();
    },
    async updated() {
        this.activeNode();
    }
}
</script>

<style lang="scss" scoped>
.pagination {
    display: flex;
    justify-content: center;
    list-style: none;
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.pagination__node--number.active .pagination__btn {
    background-color: #135fb4;
    color: $white-text-color;
}

.pagination__btn {
    padding: 6px 13px;
    margin: 0 5px;
    background-color: $white-color;
    color: $black-text-color;
    border: 1px solid #ccc;
    border-radius: 50%;
    cursor: pointer;

    &.active {
        background-color: #135fb4;
        color: $white-text-color;
    }

    &:hover {
        background-color: #5f8cbf;
    }
}
</style>