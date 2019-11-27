var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

var nuclideSchema = new Schema({
    nuclide: { type: String },
    isotop: { type: String, required: true },
    half_life: { type: Number, required: true }
});

nuclideSchema.pre('save', function(next) {
    if (!this.nuclide)
        this.nuclide = this.isotop.slice(0, this.isotop.indexOf('-'));
    next();
});

var Nuclide = mongoose.model('Nuclides', nuclideSchema);

module.exports = Nuclide;