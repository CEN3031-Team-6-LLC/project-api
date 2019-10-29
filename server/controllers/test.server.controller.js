exports.hello = function(req, res) {
  res.send('Hello world!');
};

exports.helloDude = function(req, res) {
  res.send(`Hello ${req.params.who}!`);
};