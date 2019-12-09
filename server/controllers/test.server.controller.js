/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a handler for test requests. nuff said.
 */

exports.hello = function(req, res) {
  res.send('Hello world! ');
};

exports.helloDude = function(req, res) {
  res.send(`Hello ${req.params.who}!`);
};