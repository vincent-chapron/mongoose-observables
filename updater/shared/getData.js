module.exports = function(data, options) {
    if (options.fields) {
        let _data = {};
        if (typeof options.fields == "string") {
            let fields = options.fields.split(" ");
            fields.forEach(value => {
                if (value[0] != '-' && data[key]) {
                    _data[value] = data[value];
                }
            });
        }
        else if (typeof options.fields == "object") {
            for (var key in options.fields) {
                if (options.fields[key] && data[key]) {
                    _data[key] = data[key];
                }
            }
        }
        return _data;
    } else {
        return data;
    }
}
