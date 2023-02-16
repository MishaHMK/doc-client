export default class PaginatedResult {
    currentPage: number;
    pageSize: number;
    pagedUsers: any[];
    totalItems: number;

    constructor() {
        this.currentPage = 0;
        this.pageSize = 0;
        this.pagedUsers = [];
        this.totalItems = 0;
      }
}