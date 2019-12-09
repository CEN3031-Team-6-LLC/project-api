/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: This is a request handler for export endpoint.
 */

const { parse } = require('json2csv');

// definition of the excel sheet table headers
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
    // modify table headers based on the unit system used
    var fieldsCopy = [];
    fields.forEach(field => fieldsCopy.push(field));
    fieldsCopy[0].label = 'Distance from the source ' + (req.body.unitSystem == 'metric' ? '(m)' : '(ft)');
    try {
        // parse JSON data into a .csv table
        var data = parse(req.payload, { fields: fieldsCopy });
        // attach file name in the header
        res.attachment(`export_${(new Date()).getTime()}.csv`);
        req.payload = data;
    } catch (err) {
        next(err);
    }
    next();
}