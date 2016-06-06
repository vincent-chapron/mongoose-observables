module.exports = (find, populate) => {
    if (populate) {
        for (let key in populate) {
            find.populate(key, populate[key]);
        }
    }
};
