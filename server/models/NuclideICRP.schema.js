/**
 *  Author: Alexey Makarevitch
 * 
 *  Description: A MongoDB ORM model for nuclide's ICRP lung class schema.
 */

var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var nuclideICRPSchema = new Schema({
    nuclide: { type: String, required: true },
    icrp_lung_class: { type: String, required: true }
});

var NuclideICRP = mongoose.model('NuclidesICRP', nuclideICRPSchema);

module.exports = NuclideICRP;