var Rx = require('rx');

var getPopulate = require('./shared/populate');

let findOnePromiseFn = (Schema, filter, serializer, populate) => {
    return new Promise((done, reject) => {
        let find = Schema.findOne(filter, serializer);

        getPopulate(find, populate);

        find.exec((err, data) => {
            if (err) {
                return reject(err); }
            return done(data);
        });
    });
};

module.exports = function(Schema, filter, serializer, populate) {
    return Rx.Observable.fromPromise(findOnePromiseFn(Schema, filter, serializer, populate));
};
