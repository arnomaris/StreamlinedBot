
exports.pluck = function (array) {
    return array.map(function(item) { return item['name']})
}

exports.contains = function (array1, array2) {
    return array1.some(value => module.exports.pluck(array2).includes(value))
}