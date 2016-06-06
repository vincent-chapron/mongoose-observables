var Rx = require('Rx');

var getPopulate = require('./shared/populate');

let findPromiseFn = (Schema, filter, serializer, populate) => {
    return new Promise((done, reject) => {
        let find = Schema.find(filter, serializer);

        getPopulate(find, populate);

        find.exec((err, data) => {
            if (err) {
                return reject(err); }
            return done(data);
        });
    });
};

module.exports = function(Schema, filter, serializer, populate) {
    return Rx.Observable.fromPromise(findPromiseFn(Schema, filter, serializer, populate));
};
