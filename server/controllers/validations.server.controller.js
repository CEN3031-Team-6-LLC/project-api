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

exports.validateReqestBody = (req, res, next) => {
    if (req.error) {
        next();
        return;
    }
    var body = req.body;
    try {
        if (body.maxDistance || body.distanceIncrement) {
            if (!body.maxDistance || !body.distanceIncrement)
                throw new Error("Both or neither maxDistance and distanceIncrement should be provided!");
            if (typeof body.maxDistance != 'number' || typeof body.distanceIncrement != 'number')
                throw new Error("Both maxDistance and distanceIncrement should be numbers!");
            if (body.maxDistance/body.distanceIncrement > 10000)
                throw new Error("Either maxDistance is too big or distanceIncrement is too small!\nTechnical limitations start impacting Calculation engine when calculating more than 10000 points.");
            if (req.url.includes("fire")) {
                requiredFireFields.forEach(field => {
                    if (body[field] === undefined || body[field] === null)
                        throw new Error(`Missing field "${field}" in the request payload!`);
                });
            } else if (req.url.includes("plume")) {
                requiredPlumeFields.forEach(field => {
                    if (body[field] === undefined || body[field] === null)
                        throw new Error(`Missing field "${field}" in the request payload!`);
                });
            }
        }
    } catch(err) {
        console.error(err);
        req.error = true;
        req.payload = err.message;
        next();
    }
    next();
}