/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a validation middleware for export and calculate endpoints.
 */

const requiredPlumeFields = [
    "sourceAmount",
    "windSpeed",
    "receptorHeight",
    "releaseHeight",
    "stability",
    "isotop",
    "lungClass"
];
const requiredFireFields = [
    "sourceAmount",
    "fireCloudTop",
    "windSpeed",
    "receptorHeight",
    "fireRadius",
    "stability",
    "isotop",
    "lungClass"
];
const numericalFields = [
    "releaseHeight",
    "sourceAmount",
    "fireCloudTop",
    "windSpeed",
    "receptorHeight",
    "fireRadius",
];

exports.validateReqestBody = (req, res, next) => {
    var body = req.body;
    try {
        // general validations
        if (!req.body.maxDistance || !req.body.distanceIncrement)
            throw new Error("Both maxDistance and distanceIncrement should be provided!");
        if (!req.body.unitSystem)
            throw new Error("Please specify which unit system ('metric' or 'imperial') is used for length units");
        // parsing numerical values
        numericalFields.forEach(field => {
            req.body[field] = parseFloat(req.body[field]+'');
        });
        // unit validations
        if ((typeof req.body.maxDistance != 'number' && isNaN(parseFloat(req.body.maxDistance))) || (typeof req.body.distanceIncrement != 'number' && isNaN(parseFloat(req.body.distanceIncrement))))
            throw new Error("Both maxDistance and distanceIncrement should be numbers!");
        if (req.body.maxDistance/req.body.distanceIncrement > 10000)
            throw new Error("Either maxDistance is too big or distanceIncrement is too small!\nTechnical limitations start impacting Calculation engine when calculating more than 10000 points.");
        if (req.body.maxDistance/req.body.distanceIncrement < 2)
            throw new Error("Nothing to calculate with the provided maxDistance and distanceIncrement!");
        // required fields checks
        if (req.url.includes("fire")) {
            requiredFireFields.forEach(field => {
                if (req.body[field] === undefined || req.body[field] === null || (typeof req.body[field] == 'number' && isNaN(req.body[field])))
                    throw new Error(`Missing field "${field}" in the request payload!`);
            });
        } else if (req.url.includes("plume")) {
            requiredPlumeFields.forEach(field => {
                if (req.body[field] === undefined || req.body[field] === null || (typeof req.body[field] == 'number' && isNaN(req.body[field])))
                    throw new Error(`Missing field "${field}" in the request payload!`);
            });
        }
        // checking if adjustment needed for wind speed
        if (req.body.unitSystem == "imperial") req.body.windSpeed = (req.body.windSpeed * 22) / 15;
        // assigning parsed req.body back to request
    } catch(err) {
        next(err);
    }
    next();
}