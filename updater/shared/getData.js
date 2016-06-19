module.exports = function(data, options) {
    if (options.fields) {
        let _data = {};
        if (typeof options.fields == "string") {
            _data = fromStringProjection(data, options.fields)
        }
        else if (typeof options.fields == "object") {
            _data = fromObjectProjection(data, options.fields)
        }
        return _data;
    } else {
        return data;
    }
}

fromObjectProjection = (data, fields) => {
    let removeId = false;
    let _data = {};
    let i = 0;
    let length = 0;

    if (typeof fields._id != "undefined" && fields._id === false) {
        removeId = true;
        delete fields._id;
    }

    for (var key in fields) {
        length++;
        if (fields[key] === false) i++;
    }

    if (i == 0) {
        if (!removeId) fields._id = true;
        for (var key in fields) {
            if (data[key]) _data[key] = data[key];
        }
    } else if (i == length) {
        if (removeId) fields._id = false;
        for (var key in data) {
            if (fields[key] !== false) _data[key] = data[key];
        }
    } else {
        throw new Error("Projection cannot have a mix of inclusion and exclusion.")
    }

    return _data;
};

fromStringProjection = (data, fields) => {
    let _fields = fields.split(" ");
    let removeId = false;
    let i = _fields.indexOf("-_id");
    let _data = {};

    if (i != -1) {
        removeId = true;
        _fields.splice(i, 1);
    }

    i = 0;
    _fields.forEach(value => {
        if (value[0] == '-') i++;
    });
    if (i == 0) {
        if (!removeId) _fields.push("_id");
        _fields.forEach(value => {
            if (data[value]) {
                _data[value] = data[value]; }
        });
    } else if (i == _fields.length) {
        if (removeId) _fields.push("-_id");
        for (var key in data) {
            if (_fields.indexOf("-" + key) == -1) _data[key] = data[key];
        }
    } else {
        throw new Error("Projection cannot have a mix of inclusion and exclusion.")
    }

    return _data;
};
