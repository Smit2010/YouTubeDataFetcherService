const validFilterValues = ["views", "likes", "comments", "date"];
const validSortValues = ["default", "1", "-1"];

const isNotNullAndUndefined = (param) => {
    return param !== null && param !== undefined;
};

// Validating parameters before making a db query
exports.validateAndReturnParameters = (params) => {
    const { search, page, limit, filter, sort } = params;

    let validParameters = { search: search };

    if (isNotNullAndUndefined(page)) {
        if (page <= 0) throw new Error(`'page' cannot be less than 0`);
        else validParameters["page"] = page;
    }

    if (isNotNullAndUndefined(limit)) {
        if (limit <= 0) throw new Error(`'limit' cannot be less than 0`);
        else validParameters["limit"] = limit;
    }

    if (isNotNullAndUndefined(filter)) {
        if (!validFilterValues.includes(filter))
            throw new Error(`'filter' cannot be ${filter}`);
        else validParameters["filter"] = filter;
    }

    if (isNotNullAndUndefined(sort)) {
        if (!validSortValues.includes(sort))
            throw new Error(`'sort' cannot be ${sort}`);
        else validParameters["sort"] = sort;
    }

    return validParameters;
};

exports.getSortQuery = (filter, sortOrder) => {
    let sortQuery = {};

    if (!filter && !sortOrder) {
        sortQuery = { score: -1 };
    } else if (sortOrder === "default") {
        sortQuery = {
            publishedAt: -1,
        };
    } else if (filter === "date") {
        sortQuery = {
            publishedAt: parseInt(sortOrder),
        };
    } else {
        sortQuery[`statistics.${filter}`] = parseInt(sortOrder);
    }
    return sortQuery;
};
