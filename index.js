const restify = require('restify');
const plugins = require('restify-plugins');
const nodemailer = require('nodemailer');
const ses = require('nodemailer-ses-transport');
const winston = require('winston');
require('winston-loggly-bulk');

require('dotenv').config();

winston.add(winston.transports.Loggly, {
  token: process.env.LOGGLY_TOKEN,
  subdomain: process.env.LOGGLY_SUBDOMAIN,
  tags: ['Winston-NodeJS'],
  json:true
});

const mailerTransport = nodemailer.createTransport(ses({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}));

const server = restify.createServer();

server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.bodyParser());

server.post('/sum', (req, res, next) => {

  mailerTransport.sendMail({
    from: 'no-reply@domain.com.br',
    to: process.env.ADMIN_EMAIL,
    subject: 'New sum request',
    text: new Date().toString()
  }, (err) => {
    if (err) {
      winston.log('error', process.env.DOCKER_INSTANCE, err);
    }
  });

  let result = req.body.reduce((a, b) => a + b, 0);

  winston.log('info', 'New sum request', process.env.DOCKER_INSTANCE, req.body, result);

  res.send(200, result);
  return next();
});

server.listen(process.env.RESTIFY_SEVER_PORT, () => {
  winston.log('info', 'Server started Web #' + process.env.DOCKER_INSTANCE + ' PORT ' + process.env.DOCKER_PORT);
});
