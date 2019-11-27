const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const mongoose = require('mongoose');
const config = process.env.NODE_ENV == "PROD" ? {} : require('./server/config/config');

(async () => { 
    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running in ${process.env.NODE_ENV || "LOCAL"} environmet.`);
        console.log("The following clients are allowed to usi this API: ", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);

        // workers to process clients' requests
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} died`);
        });
    } else {
        //connect to database
        await mongoose.connect(process.env.DB_KEY || config.db.uri, { useNewUrlParser: true });
        await mongoose.set('useCreateIndex', true);
        await mongoose.set('useFindAndModify', false);

        // instantiating server instance on each workers
        // servers share the same port though, so we are good
        var app = require('./server/config/app');
        var serverWorker = app.start();

        console.log(`Worker ${process.pid} started`);
    }
})();