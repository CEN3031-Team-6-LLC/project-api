const { parse } = require('json2csv');

const fields = [
    {
        label: 'Distance from the source',
        value: 'distance'
    },
    {
        label: 'Nuclide dose',
        value: 'dose'
    },
    {
        label: 'Nuclide concentration',
        value: 'concentration'
    },
    {
        label: 'Arrival time',
        value: 'arrivalTime'
    }
];

exports.convertPayloadToExcel = function(req, res, next) {
    if (req.error) {
        next();
        return;
    }
    try {
        var data = parse(req.payload, { fields: fields });
        res.attachment(`export_${(new Date()).getTime()}.csv`);
        req.payload = data;
    } catch (err) {
        console.error(err);
        req.error = true;
        req.payload = err.message;
        next();
    }
    next();
}