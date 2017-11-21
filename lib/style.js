
function CSSStyleDeclaration() {}

CSSStyleDeclaration.prototype = Object.create({});

CSSStyleDeclaration.prototype.setProperty = function (propertyName, value, priority) {
    this[dashToCamel(propertyName)] = value;
};

CSSStyleDeclaration.prototype.valueOf = function () {
    return this;
};

CSSStyleDeclaration.prototype.toString = function () {
    var str = '';
    for (var p in this) {
        if (!this.hasOwnProperty(p)) {
            continue;
        }
        str += camelToDash(p) + ': ' +  this[p] + '; ';
    }
    return str;
};

CSSStyleDeclaration.prototype.setValue = function (style) {
    var list = style.split(';');
    for (var p of list) {
        var pair = p.split(':');
        this[pair[0].trim()] = pair[1].trim();
    }
};

Object.defineProperty(CSSStyleDeclaration.prototype, 'cssText', {
    get: function () { return this.toString(); },
    set: function (text) { this.setValue(text); },
    enumerable: true
});
