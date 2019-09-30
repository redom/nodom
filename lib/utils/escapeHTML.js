const htmlEntities = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

export function escapeHTML (str) {
  return (str || '').replace(/[&<>]/g, c => htmlEntities[c]);
}
