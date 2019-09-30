
export function dashToCamel (dashedName) {
  const dashPositions = [];
  const dashedChars = dashedName.split('');
  dashedChars.map(function (e, i) {
    if (e === '-') dashPositions.push(i);
  });
  const camelChars = dashedName.split('');
  dashPositions.map((e, offset) => {
    const capLetter = dashedChars[e + 1].toUpperCase();
    camelChars.splice(e - offset, 2, capLetter);
  });
  return camelChars.join('');
}

export function camelToDash (camelName) {
  const capPositions = [];
  const camelChars = camelName.split('');
  camelChars.map(function (e, i) {
    if (/^[A-Z]/.test(e)) capPositions.push(i);
  });
  const dashedChars = camelName.split('');
  capPositions.map((e) => {
    dashedChars.splice(e, 1, '-' + camelChars[e].toLowerCase());
  });
  return dashedChars.join('');
}
