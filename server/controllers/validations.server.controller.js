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
    if (req.error) {
        next();
        return;
    }
    var body = req.body;
    try {
        // general validations
        if (!body.maxDistance || !body.distanceIncrement)
            throw new Error("Both or neither maxDistance and distanceIncrement should be provided!");
        if (!body.unitSystem)
            throw new Error("Please specify which unit system ('metric' or 'imperial') is used for length units");
        // parsing numerical values
        numericalFields.forEach(field => {
            body[field] = parseFloat(body[field]+'');
        });
        // unit validations
        if ((typeof body.maxDistance != 'number' && isNaN(parseFloat(body.maxDistance))) || (typeof body.distanceIncrement != 'number' && isNaN(parseFloat(body.distanceIncrement))))
            throw new Error("Both maxDistance and distanceIncrement should be numbers!");
        if (body.maxDistance/body.distanceIncrement > 10000)
            throw new Error("Either maxDistance is too big or distanceIncrement is too small!\nTechnical limitations start impacting Calculation engine when calculating more than 10000 points.");
        if (body.maxDistance/body.distanceIncrement < 2)
            throw new Error("Nothing to calculate with the provided maxDistance and distanceIncrement!");
        // required fields checks
        if (req.url.includes("fire")) {
            requiredFireFields.forEach(field => {
                if (body[field] === undefined || body[field] === null || (typeof body[field] == 'number' && isNaN(body[field])))
                    throw new Error(`Missing field "${field}" in the request payload!`);
            });
        } else if (req.url.includes("plume")) {
            requiredPlumeFields.forEach(field => {
                if (body[field] === undefined || body[field] === null || (typeof body[field] == 'number' && isNaN(body[field])))
                    throw new Error(`Missing field "${field}" in the request payload!`);
            });
        }
        // checking if adjustment needed for wind speed
        if (body.unitSystem == "imperial") body.windSpeed = (body.windSpeed * 22) / 15;
        // assigning parsed body back to request
        req.body = body;
    } catch(err) {
        console.error(err);
        req.error = true;
        req.payload = err.message;
        next();
    }
    next();
}