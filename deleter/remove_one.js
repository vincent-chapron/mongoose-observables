var Rx = require('rx');

var removeOnePromiseFn = (Schema, filter) => {
    return new Promise((done, reject) => {
        Schema
            .findOne(filter)
            .exec((err, data) => {
                if (err) {
                    return reject(err); }

                if (!data) {
                    return reject(new Error("Data not found."))}

                data.remove(err => {
                    if (err) {
                        return reject(err); }
                    return done(data);
                });
            });
    });
};

module.exports = function(Schema, filter) {
    return Rx.Observable.fromPromise(removeOnePromiseFn(Schema, filter));
};
