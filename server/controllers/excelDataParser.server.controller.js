const { parse } = require('json2csv');

const fields = [
    {
        label: 'Distance from the source',
        value: 'distance'
    },
    {
        label: 'Nuclide concentration',
        value: 'concentration'
    }
];

exports.convertPayloadToExcel = function(req, res, next) {
    try {
        var data = parse(req.payload, { fields: fields });
        res.attachment(`export_${(new Date()).getTime()}.csv`);
        req.payload = data;
    } catch (err) {
        console.error(err);
        res.error(err);
    }
    next();
}