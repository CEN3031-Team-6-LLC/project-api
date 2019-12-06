const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const mongoose = require('mongoose');
const config = process.env.NODE_ENV == "PROD" ? {} : require('./server/config/config');

(async () => { 
    if (cluster.isMaster) {
        // log server specs
        console.log(`\nMaster ${process.pid} is running in ${process.env.NODE_ENV || "LOCAL"} environmet.\n`);
        console.log("The following clients are allowed to use this API: ", process.env.ALLOWED_UI_DOMAINS || config.allowed_ui_domains);
        console.log(`Detected ${numCPUs} logical cores, so the server will spawn ${numCPUs} worker threads.\n`);

        // workers to process clients' requests
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker thread ${worker.process.pid} died with code ${code}. Respawning...\n`);
            cluster.fork();
        });
    } else {
        //connect worker to database
        await mongoose.connect(
            process.env.DB_KEY || config.db.uri,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });

        // instantiating server instance on each workers
        // servers share the same port though, so we are good
        var app = require('./server/config/app');
        app.start();
    }
})();