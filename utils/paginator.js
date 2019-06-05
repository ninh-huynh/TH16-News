module.exports = {
    get: (currentPage, totalItem, itemPerPage) => {
        var totalPage = Math.floor(totalItem / itemPerPage);

        if (totalItem % itemPerPage != 0) { totalPage++; }

        var page = {
            current: currentPage,
            total: totalPage,
            next: currentPage + 1,
            prev: currentPage - 1
        };

        if (currentPage === 1) { page.prev = 0; }
        if (currentPage === totalPage) { page.next = 0; }
        
        return page;
    },
};