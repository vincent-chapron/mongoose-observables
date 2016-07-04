var expect = require('chai').expect;
var Rx = require("rx");

var creator = require('../creator');
var deleter = require('../deleter');
var finder = require('../finder');

var _models = require('./models');
var _data = require('./data');

describe('TEST MONGOOSE OBSERVABLES', function() {
    describe('FINDER', function () {
        it('delete', function (done) {
            Rx.Observable.forkJoin([
                deleter.removeAll(_models.Post),
                deleter.removeAll(_models.Person)
            ]).subscribe(data => done(), err => {
                throw err;
            });
        });

        it('create new post and person', function (done) {
            let post = new _models.Post(_data.post_data);

            post.save(err => {
                if (err) {
                    throw err; }

                _data.person_data.post = post._id;
                let person = new _models.Person(_data.person_data);

                person.save(err => {
                    if (err) {
                        throw err; }
                    done();
                })
            });
        });

        it('find posts', function (done) {
            finder
                .find(_models.Post, {})
                .subscribe(posts => {
                    expect(posts).to.not.be.null;
                    expect(posts).to.have.lengthOf(1);
                    expect(posts[0]._id).to.not.be.null;
                    done();
                }, err => {
                    throw err;
                })
        });

        it('find one post', function (done) {
            finder
                .findOne(_models.Post, {title: _data.post_data.title})
                .subscribe(post => {
                    expect(post).to.not.be.null;
                    expect(post._id).to.not.be.null;
                    expect(post.title).to.be.eql(_data.post_data.title);
                    done();
                }, err => {
                    throw err;
                })
        });

        it('find one person with populate', function (done) {
            finder
                .findOne(_models.Person, {name: _data.person_data.name}, null, {post: null})
                .subscribe(person => {
                    expect(person).to.not.be.null;
                    expect(person._id).to.not.be.null;
                    expect(person.name).to.be.eql(_data.person_data.name);
                    expect(person.post).to.not.be.null;
                    expect(person.post._id).to.not.be.null;
                    expect(person.post.title).to.be.eql(_data.post_data.title);
                    done();
                }, err => {
                    throw err;
                })
        });

        it('find one person with serializer and populate with serializer', function (done) {
            finder
                .findOne(_models.Person, {name: _data.person_data.name}, 'post -_id', {post: 'title -_id'})
                .subscribe(person => {
                    expect(person).to.not.be.null;
                    expect(person._id).to.be.undefined;
                    expect(person.name).to.be.undefined;
                    expect(person.post).to.not.be.null;
                    expect(person.post._id).to.be.undefined;
                    expect(person.post.title).to.be.eql(_data.post_data.title);
                    done();
                }, err => {
                    throw err;
                })
        });

        it('find paginate', function (done) {
            Rx.Observable.forkJoin([
                Rx.Observable.fromPromise(new Promise((done, reject) => {
                    let post = new _models.Post(_data.post_data);
                    post.save(err => {
                        if (err) throw err;
                        done()
                    })
                })),
                Rx.Observable.fromPromise(new Promise((done, reject) => {
                    let post = new _models.Post(_data.post_data);
                    post.save(err => {
                        if (err) throw err;
                        done()
                    })
                })),
                Rx.Observable.fromPromise(new Promise((done, reject) => {
                    let post = new _models.Post(_data.post_data);
                    post.save(err => {
                        if (err) throw err;
                        done()
                    })
                })),
            ]).subscribe(() => {
                finder
                    .findPage({
                        protocol: "http",
                        get: host => "localhost/",
                        originalUrl: "?nbByPage=3",
                        query: {nbByPage: 3}
                    }, _models.Post, {}, 'title')
                    .subscribe(res => {
                        expect(res.data).to.have.lengthOf(3);
                        expect(res.max).to.be.eql(4);
                        expect(res.next).to.be.eql("http://localhost/?nbByPage=3&offset=3");
                        expect(res.last).to.be.eql("http://localhost/?nbByPage=3&offset=3");
                        done();
                    }, err => {
                        throw err;
                    });
            }, err => {
                throw err;
            })
        });
    });
});
