
export function dashToCamel (dashedName) {
  let dashPositions = [];
  let dashedChars = dashedName.split('');
  dashedChars.map(function (e, i) {
    if (e === '-') dashPositions.push(i);
  });
  let camelChars = dashedName.split('');
  dashPositions.map((e, offset) => {
    let capLetter = dashedChars[e + 1].toUpperCase();
    camelChars.splice(e - offset, 2, capLetter);
  });
  return camelChars.join('');
}

export function camelToDash (camelName) {
  let capPositions = [];
  let camelChars = camelName.split('');
  camelChars.map(function (e, i) {
    if (/^[A-Z]/.test(e)) capPositions.push(i);
  });
  let dashedChars = camelName.split('');
  capPositions.map((e) => {
    dashedChars.splice(e, 1, '-' + camelChars[e].toLowerCase());
  });
  return dashedChars.join('');
}
