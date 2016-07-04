var Rx = require('rx');

/**
 * @param Schema
 * @param data
 * @param observables => [{name: String, data: finder.findOne}]
 */
var createPromiseFn = (Schema, data, observables = []) => {
    return new Promise((done, reject) => {
        let forkJoin = [];

        for (let key in observables) {
            forkJoin.push(observables[key].data);
        }

        let save = create => {
            create.save(err => {
                if (err) {
                    return reject(err); }
                return done(create);
            });
        };

        if (!observables.length) {
            return save(new Schema(data));
        } else {
            Rx.Observable
                .forkJoin(forkJoin)
                .subscribe(_data => {
                    for (let key in observables) {
                        data[observables[key].name] = _data[key]; }
                    return save(new Schema(data));
                }, err => {
                    return reject(err);
                });
        }
    });
};

module.exports = function(Schema, data, observables) {
    return Rx.Observable.fromPromise(createPromiseFn(Schema, data, observables));
};
