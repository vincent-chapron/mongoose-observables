var Rx = require('Rx');

var getData = require('./shared/getData')

let findOnePromiseFn = (Schema, filter, data, options = {}) => {
    return new Promise((done, reject) => {
        let _data = getData(data, options);

        Schema
            .findOneAndUpdate(filter, _data, options)
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
