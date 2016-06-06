var Rx = require('Rx');

var removeAllPromiseFn = (Schema) => {
    return new Promise((done, reject) => {
        Schema
            .remove({})
            .exec(err => {
                if (err) {
                    return reject(err); }
                return done();
            });
    });
};

module.exports = function(Schema) {
    return Rx.Observable.fromPromise(removeAllPromiseFn(Schema));
};
