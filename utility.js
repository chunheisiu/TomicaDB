/*
 * Clone object
 * Syntax: newObject = Object.create(oldObject);
 */
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    };
}

/*
 * Check if var is integer
 */
function isInt(value) {
    return !isNaN(value) && (function (x) {
        return (x | 0) === x;
    })(parseFloat(value))
}

/*
 * Check if var is empty
 */
function isEmpty(value) {
    return value != null && value !== "";
}
