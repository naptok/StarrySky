const cpus = require('os').cpus().length;

function loop (count) {
  return function (func) {
    for (var i = 0; i < count; i++) { func(); }
  };
}

module.exports = function (cluster) {
  loop(cpus)(cluster.fork);
  cluster.on('exit', function () { cluster.fork(); });
  for (const idx in cluster.workers) {
    cluster.workers[idx].idx = idx;
    console.log(cluster.workers[idx].idx);
    cluster.workers[idx].on('message', function (data) {
      console.log(idx);
      cluster.workers[idx].send('idx');
    });
  }
};
