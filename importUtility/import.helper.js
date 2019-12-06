/**
 * This is a helper script to upload new data into DB.
 * 
 * You have following tables: 
 * 1) nuclides and their half-lives: Nuclide
 * 2) nuclides, lung classes and doses: NuclideDoses
 * 3) nuclides and their ICRP lung classes: NuclideICRP
 * 
 * To persist previous entries pass additional parameter
 * {removeOldEntities} as false (by default is true).
 * 
 * Use those table names alongside the .csv (MS-DOS) filename
 * with properly formatted data (table header should contain
 * correct field names) and placed into this folder (importUtility)
 * to populate them into DB with this script:
 * 
 * node ./import.helper.js {filename} {table} {removeOldEntities}
 * (ex: "node ./import.helper.js data.csv Nuclide false")
 * 
 */

var csv = require("fast-csv");
var fs = require('fs');
var mongoose = require('mongoose');
const config = process.env.NODE_ENV == "PROD" ? {} : require('../server/config/config');
var Nuclide = require('../server/models/Nuclide.schema'),
    NuclideDoses = require('../server/models/NuclideDoses.schema'),
    NuclideICRP = require('../server/models/NuclideICRP.schema');
const entities = {
    Nuclide: Nuclide,
    NuclideDoses: NuclideDoses,
    NuclideICRP: NuclideICRP
};

var documentsToSave = [];

const startImport = (filename, entity, removePreviousEntries) => {
    fs.createReadStream(filename)
        .pipe(csv.parse({headers: true}))
        .on('data', (row) => {
            if (row.half_life && typeof row.half_life != 'number')
                if (isNaN(parseFloat(row.half_life)))
                    return;
                else
                    row.half_life = parseFloat(row.half_life);
            if (row.age && typeof row.age != 'number')
                if (isNaN(parseFloat(row.age)))
                    return;
                else
                    row.age = parseFloat(row.age);
            if (row.effective_dose && typeof row.effective_dose != 'number')
                if (isNaN(parseFloat(row.effective_dose)))
                    return;
                else
                    row.effective_dose = parseFloat(row.effective_dose);
            
            var element = new entity(row);
            documentsToSave.push(element);
        })
        .on('end', async () => {
            console.log('CSV file successfully processed.');
            if (removePreviousEntries) {
                await entity.deleteMany({});
                console.log('Removed old entities.');
            }
            console.log("Persisting...");
            var loader;
            for (var i = 0; i < documentsToSave.length; i++) {
                loader = "";
                await documentsToSave[i].save();
                for (var j = 0; j < 50; j++) {
                    if (((i + 1)/documentsToSave.length) * 50 >= (j + 1))
                        loader += "=";
                    else loader += " ";
                }
                process.stdout.write("\r" + `${i+1} / ${documentsToSave.length} documents saved. [${loader}] ${((i+1)*100/documentsToSave.length).toFixed(2)}%`);
            }
            console.log("\nPersisted new data to DB.");
            process.exit(0);
    }).on('error', () => {
        console.error("No file found! Please name files accordingly and place them in this directory.");
        process.exit(1);
    });
}

const startImportUtility = async() => {
    if (process.argv < 4) {
        console.error("Filename and entity type should be provided!");
        process.exit(1);
    }
    
    await mongoose.connect(
        config.db.uri,
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    
    startImport(process.argv[2], entities[process.argv[3]], (process.argv.length > 4) ? (process.argv[4] == 'true') : true);
}

startImportUtility();