const { parse } = require('json2csv');

const fields = [
    {
        label: 'Distance from the source',
        value: 'distance'
    },
    {
        label: 'Nuclide dose (Ci or Bq)',
        value: 'dose'
    },
    {
        label: 'Nuclide concentration',
        value: 'concentration'
    },
    {
        label: 'Arrival time (s)',
        value: 'arrivalTime'
    }
];

exports.convertPayloadToExcel = function(req, res, next) {
    var fieldsCopy = [];
    fields.forEach(field => fieldsCopy.push(field));
    fieldsCopy[0].label = 'Distance from the source ' + (req.body.unitSystem == 'metric' ? '(m)' : '(ft)');
    try {
        var data = parse(req.payload, { fields: fieldsCopy });
        res.attachment(`export_${(new Date()).getTime()}.csv`);
        req.payload = data;
    } catch (err) {
        next(err);
    }
    next();
}