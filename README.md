# mongoose-observables

```
npm install npm i mongoose-observables --save
```

# Getting started

```
var mongoose = require('mongoose');

Job = mongoose.model('Job', new mongoose.Schema({
    title: String
}));

model.Person = mongoose.model('Person', new mongoose.Schema({
    name: String,
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }
}));
```

#### Create Job

```
var observables = require('mongoose-observables');

observables.creator
    .create(Job, {title: "developer"})
    .subscribe(job => console.log(job), err {
        throw err;
    });
```

#### Create Person with existing job

```
var observables = require('mongoose-observables');

observables.creator()
    .create(Person, {name: 'Octocat'}, [{name: 'job', data: observables.finder.findOne(Job, {title: "developer"})}])
    .subscribe(person => console.log(person), err {
        throw err;
    });
```

#### Create Person and job

```
var observables = require('mongoose-observables');

observables.creator()
    .create(Person, {name: 'Other Octocat'}, [{name: 'job', data: observables.creator.create(Job, {title: "firefighter"})}])
    .subscribe(person => console.log(person), err {
        throw err;
    });
```

#### Create 3 jobs

```
var observables = require('mongoose-observables');
var Rx = require('Rx');

var job1 = observables.creator.create(Job, {title: "developer"})
var job2 = observables.creator.create(Job, {title: "firefighter"})
var job3 = observables.creator.create(Job, {title: "teacher"})

Rx.Observable.forkJoin([job1, job2, job3]).subscribe(data => console.log(data), err => {
    throw err;
});
```

#### Find Person and populate job

```
var observables = require('mongoose-observables');

observables.finder
    .findOne(Person, {name: 'Octocat'}, null, {job: null})
    .subscribe(person => console.log(person), err {
        throw err;
    });
```

#### Find Person with only name and populate job with only title

```
var observables = require('mongoose-observables');

observables.finder
    .findOne(Person, {name: 'Octocat'}, "name -_id", {job: "title -_id"})
    .subscribe(person => console.log(person), err {
        throw err;
    });
```
