var Rx = require('Rx');

var getPopulate = require('./shared/populate');

let updateQuery = (req, offset) => {
    let url = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (req.query) {
        if (typeof req.query.offset !== "undefined") {
            url = url.replace(/(offset\=)[^\&]/g, "$1" + offset);
        } else {
            url += "&offset=" + offset; }
    } else {
        url = url + "?nbByPage=" + nbByPage + "&offset=" + offset; }
    return url;
}

let findPromiseFn = (req, Schema, filter, serializer, populate) => {
    return new Promise((done, reject) => {
        let nbByPage = parseInt(req.query.nbByPage) || 20;
        let offset = parseInt(req.query.offset) || 0;

        let find = Schema
            .find(filter, serializer)
            .skip(offset)
            .limit(nbByPage);

        getPopulate(find, populate);

        find.exec((err, data) => {
            if (err) {
                return reject(err); }

            Schema.count(filter, (err, max) => {
                if (err) {
                    return reject(err); }

                let res = {data, max};
                if (offset != 0) {
                    res.prev = updateQuery(req, (offset - nbByPage >= 0) ? offset - nbByPage : 0);
                    res.first = updateQuery(req, 0); }
                if (offset < max - nbByPage && offset + data.length < max) {
                    let _offset = max - (max % nbByPage) - (((max % nbByPage) == 0) ? nbByPage : 0);
                    res.next = updateQuery(req, offset + nbByPage);
                    res.last = updateQuery(req, _offset); }

                return done(res);
            });

        });
    });
};

module.exports = function(request, Schema, filter, serializer, populate) {
    return Rx.Observable.fromPromise(findPromiseFn(request, Schema, filter, serializer, populate));
};
