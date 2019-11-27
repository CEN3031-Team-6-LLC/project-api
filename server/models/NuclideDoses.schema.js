var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var nuclideDosesSchema = new Schema({
    nuclide: { type: String },
    isotop: { type: String, required: true },
    age: { type: Number, required: true },
    lung_class: { type: String, required: true },
    effective_dose: { type: Number, required: true }
});

nuclideDosesSchema.pre('save', function(next) {
    if (!this.nuclide)
        this.nuclide = this.isotop.slice(0, this.isotop.indexOf('-'));
    next();
});

var NuclideDoses = mongoose.model('NuclidesDoses', nuclideDosesSchema);

module.exports = NuclideDoses;