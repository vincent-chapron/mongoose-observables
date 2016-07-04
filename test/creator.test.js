var expect = require('chai').expect;
var Rx = require("rx");

var creator = require('../creator');
var deleter = require('../deleter');

var _models = require('./models');
var _data = require('./data');

describe('TEST MONGOOSE OBSERVABLES', function() {
    describe('CREATOR', function () {
        it('delete', function (done) {
            Rx.Observable.forkJoin([
                deleter.removeAll(_models.Post),
                deleter.removeAll(_models.Person)
            ]).subscribe(data => done(), err => {
                throw err;
            });
        });

        it('create simple post', function (done) {
            creator
                .create(_models.Post, _data.post_data)
                .subscribe(post => {
                    expect(post).to.not.be.null;
                    expect(post._id).to.not.be.null;
                    expect(post.title).to.be.eql(_data.post_data.title);
                    done();
                }, err => {
                    throw err;
                });
        });

        it('create person with post', function (done) {
            creator
                .create(_models.Person, _data.person_data, [
                    {name: 'post', data: creator.create(_models.Post, _data.post_data)}
                ])
                .subscribe(person => {
                    expect(person).to.not.be.null;
                    expect(person._id).to.not.be.null;
                    expect(person.post).to.not.be.null;
                    expect(person.post._id).to.not.be.null;
                    expect(person.name).to.be.eql(_data.person_data.name);
                    expect(person.post.title).to.be.eql(_data.post_data.title);
                    done();
                }, err => {
                    throw err;
                });
        });
    });
});
