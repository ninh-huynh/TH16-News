const TH16_NEWS = {
    ARTICLE: {
        _: 'ARTICLE',
        id: 'id',
        title: 'title',
        summary: 'summary',
        content: 'content',
        isPremium: 'isPremium',
        categoryID: 'categoryID',
        publicationDate: 'publicationDate',
        coverImageURL: 'coverImageURL',
        statusID: 'statusID',
        writerID: 'writerID'
    },

    COMMENT: {
        _: 'COMMENT',
        id: 'id',
        date: 'date',
        readerName: 'readerName',
        content: 'content',
        articleID: 'articleID'
    },

    ARTICLE_TAG: {
        _: 'ARTICLE_TAG',
        articleID: 'articleID',
        tagID: 'tagID'
    },

    TAG: {
        _: 'TAG',
        id: 'id',
        name: 'name'
    },

    CATEGORY: {
        _: 'CATEGORY',
        id: 'id',
        name: 'name',
        parentID: 'parentID'
    },

    USER: {
        _: 'USER',
        id: 'id',
        name: 'name',
        dayOfBirth: 'dayOfBirth',
        email: 'email',
        nickName: 'nickName',
        expriryDate: 'expriryDate'
    },

    ARTICLE_VIEWS: {
        _: 'ARTICLE_VIEWS',
        id: 'id',
        articleId: 'articleId',
        date: 'date',
        total: 'total'
    },

    ARTICLE_STATUS: {
        _: 'ARTICLE_STATUS',
        id: 'id',
        name: 'name'
    }

};

module.exports = TH16_NEWS;