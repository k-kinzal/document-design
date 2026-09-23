// A fixed excerpt from the WordPress SQL catalog supplied with the project.
// These are observations from that analysis run, not current WordPress totals.
// Provenance and the selection rationale are recorded in README.md.
export const catalog = {
  total: 844,
  table: '{$}cache_data',
  statements: 13,
  source: 'wp-includes/SimplePie/src/Cache/MySQL.php',
  callers: [
    { method: 'MySQL::save', statements: 8, access: ['read', 'write'] },
    { method: 'MySQL::__construct', statements: 1, access: ['schema'] },
    { method: 'MySQL::load', statements: 1, access: ['read'] },
    { method: 'MySQL::mtime', statements: 1, access: ['read'] },
    { method: 'MySQL::touch', statements: 1, access: ['write'] },
    { method: 'MySQL::unlink', statements: 1, access: ['write'] },
  ],
  query: 'UPDATE `{$}cache_data` SET `mtime` = :time WHERE `id` = :id',
  queryLine: 317,
  resolution: [
    { label: 'Fully resolved', count: 35 },
    { label: 'Dependency not modeled', count: 709 },
    { label: 'Stopped at a cycle or limit', count: 95 },
    { label: 'Not analyzed', count: 5 },
  ],
};
