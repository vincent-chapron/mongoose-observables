var Rx = require('Rx');

let findOnePromiseFn = (Schema, filter, data, options = {}) => {
    return new Promise((done, reject) => {
        Schema
            .findOneAndUpdate(filter, data, options);
            .exec((err, data) => {
                if (err) {
                    return reject(err); }
                return done(data);
            });
    });
};

module.exports = function(Schema, filter, data, options = {}) {
    return Rx.Observable.fromPromise(findOnePromiseFn(Schema, filter, data, options));
};
