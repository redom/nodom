
export function dashToCamel(dashedName) {
    var dashPositions = [];
    var dashedChars = dashedName.split('');
    dashedChars.map(function (e, i) {
        if (e === '-') dashPositions.push(i);
    });
    var camelChars = dashedName.split('');
    dashPositions.map((e, offset) => {
        var capLetter = dashedChars[e + 1].toUpperCase();
        camelChars.splice(e - offset, 2, capLetter);
    });
    return camelChars.join('');
}

export function camelToDash(camelName) {
    var capPositions = [];
    var camelChars = camelName.split('');
    camelChars.map(function (e, i) {
        if (/^[A-Z]/.test(e)) capPositions.push(i);
    });
    var dashedChars = camelName.split('');
    capPositions.map((e) => {
        dashedChars.splice(e, 1, '-' + camelChars[e].toLowerCase());
    });
    return dashedChars.join('');
}
