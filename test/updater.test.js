var expect = require('chai').expect;
var Rx = require("Rx");

var creator = require('../creator');
var deleter = require('../deleter');
var updater = require('../updater');

var _models = require('./models');
var _data = require('./data');

describe('TEST MONGOOSE OBSERVABLES', function() {
    describe('UPDATER', function () {
        it('delete', function (done) {
            Rx.Observable.forkJoin([
                deleter.removeAll(_models.Post),
                deleter.removeAll(_models.Person)
            ]).subscribe(data => done(), err => {
                throw err;
            });
        });

        it('create new post', function (done) {
            let post = new _models.Post(_data.post_data);

            post.save(err => {
                if (err) {
                    throw err; }
                done();
            });
        });

        it('Update post title.', function (done) {
            var newTitle = "Updated !";
            updater
                .updateOne(_models.Post, {title: _data.post_data.title}, {title: newTitle}, {new: true, fields: {title: true}})
                .subscribe(data => {
                    expect(data).to.not.be.null;
                    expect(data.title).to.be.eql(newTitle);
                    done();
                }, err => {
                    throw err;
                });
        });

        it('Post should not be updated.', function (done) {
            var newTitle = "New update !";
            updater
                .updateOne(_models.Post, {title: _data.post_data.title}, {title: newTitle}, {new: true, fields: {}})
                .subscribe(data => {
                    expect(data).to.be.null;
                    _models.Post.find({}, (err, data) => {
                        if (err) throw err;
                        expect(data[0].title).to.not.be.eql(newTitle);
                        done();
                    })
                }, err => {
                    throw err;
                });
        });
    });
});
