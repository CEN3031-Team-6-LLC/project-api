/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: Entry point of the application. Configures clustering for multiprocessing,
 *  connects to the MongoDB and launches worker servers.
 */

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const mongoose = require('mongoose');
// Depending on the environment either get configuration from config file or from environment itself
const config = process.env.NODE_ENV == "PROD" ? {} : require('./server/config/config');
// Number of worker respawn attempts
const retryRespawnTimes = process.env.RESTART_ATTEMPTS || config.restart_attepmts;

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

        // listen to workers exiting
        var respawnCounter = 0;
        cluster.on('exit', (worker, code, signal) => {
            // if worker process exited - log and fork a new worker process
            respawnCounter++;
            console.log(`Worker thread ${worker.process.pid} died with code ${code}. Respawning...\n`);
            cluster.fork();
            // ...until maximum number of retries is exceeded, then kill the app.
            if (respawnCounter > retryRespawnTimes) {
                console.error(`Exceeded maximum of ${retryRespawnTimes} restart attempts! Something is wrong, please check logs before trying to restart the server again!\n`);
                process.exit(1);
            }
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

        // instantiating server instance on each worker
        // FYI: worker servers share the same port
        var app = require('./server/config/app');
        app.start();
    }
})();