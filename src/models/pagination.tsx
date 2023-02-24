export default class PaginatedResult {
    currentPage: number;
    pageSize: number;
    pagedList: any[];
    totalItems: number;

    constructor() {
        this.currentPage = 0;
        this.pageSize = 0;
        this.pagedList = [];
        this.totalItems = 0;
      }
}