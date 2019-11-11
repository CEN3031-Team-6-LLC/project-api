// var server = app.start();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
// uncomment for db access
// const mongoose = require('mongoose');
// const config = require('./server/config/config');


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running in ${process.env.NODE_ENV || "LOCAL"} environmet.`);
    const config = process.env.NODE_ENV == "PROD" ? {} : require('./server/config/config');
    console.log("The following clients are allowed to usi this API: ", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);

    // workers to process clients' requests
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    //connect to database
    // !!!! uncomment to connect to DB
    // mongoose.connect(config.db.uri, { useNewUrlParser: true });
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    // instantiating server instance on each workers
    // servers share the same port though, so we are good
    var app = require('./server/config/app');
    var serverWorker = app.start();

    console.log(`Worker ${process.pid} started`);
}