
exports.pluck = function (array) {
    return array.map(function(item) { return item['name']})
}