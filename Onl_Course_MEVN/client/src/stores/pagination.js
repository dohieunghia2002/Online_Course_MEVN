import { defineStore } from 'pinia';


export const usePaginationStore = defineStore('pagination', {
    state: () => {
        return {
            idxCurNode: 0,
            totalQuantityItems: 1,
            quantityItemsPage: 1
        }
    },

    getters: {
        quantityNodes() {
            return Math.ceil(this.totalQuantityItems / this.quantityItemsPage);
        }
    },

    actions: {
        indexPrevPage() {
            if (this.idxCurNode > 0) {
                this.idxCurNode = this.idxCurNode - 1;
            }
        },

        indexNextPage() {
            if (this.idxCurNode < (this.quantityNodes - 1)) {
                this.idxCurNode = this.idxCurNode + 1;
            }
        },

        indexFirstItemPage() {
            return this.idxCurNode * this.quantityItemsPage;
        },

        indexLastItemPage() {
            return this.idxCurNode * this.quantityItemsPage + (this.quantityItemsPage - 1);
        },
    }
})