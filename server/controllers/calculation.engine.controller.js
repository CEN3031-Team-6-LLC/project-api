const AdYCoefficients = {
    "A": 0.22,
    "B": 0.16,
    "C": 0.11,
    "D": 0.08,
    "E": 0.06,
    "F": 0.04
}

const sigmaY = function(stability, x) {
    switch(stability) {
        case "A": {
            return (0.22 * x)/Math.sqrt(1 + 0.0001 * x);
        }
        case "B": {
            return (0.16 * x)/Math.sqrt(1 + 0.0001 * x);
        }
        case "C": {
            return (0.11 * x)/Math.sqrt(1 + 0.0001 * x);
        }
        case "D": {
            return (0.08 * x)/Math.sqrt(1 + 0.0001 * x);
        }
        case "E": {
            return (0.06 * x)/Math.sqrt(1 + 0.0001 * x);
        }
        case "F": {
            return (0.04 * x)/Math.sqrt(1 + 0.0001 * x);
        }
        default: {
            throw new Error("Unsupported stability value!");
        }
    }
}

const sigmaZ = function(stability, x) {
    switch(stability) {
        case "A": {
            return (0.2 * x);
        }
        case "B": {
            return (0.12 * x);
        }
        case "C": {
            return (0.08 * x)/Math.sqrt(1 + 0.0002 * x);
        }
        case "D": {
            return (0.06 * x)/Math.sqrt(1 + 0.0015 * x);
        }
        case "E": {
            return (0.03 * x)/(1 + 0.0003 * x);
        }
        case "F": {
            return (0.016 * x)/(1 + 0.0003 * x);
        }
        default: {
            throw new Error("Unsupported stability value!");
        }
    }
}

const gaussian = function(stability, x, y, z, H, u, Qt) {
    var C = Qt / (2 * Math.PI * sigmaY(stability, x) * sigmaZ(stability, x) * u);
    var exp1Partial = (z - H) / sigmaZ(stability, x);
    var exp2Partial = (z + H) / sigmaZ(stability, x);
    return C * (Math.exp(-0.5 * Math.pow(exp1Partial , 2)) + Math.exp(-0.5 * Math.pow(exp2Partial , 2)));
}

const fireReleaseHeight = function(fireCloudTop) {
    if (fireCloudTop <= 200) {
        return fireCloudTop / 1.42;
    } else {
        return fireCloudTop / (0.00224 * fireCloudTop + 0.964);
    }
}

const dY = function(stability, x) {
    var c = Math.pow(sigmaY(stability, x), 2);
    var b = 0.0001 * c;
    var a = Math.pow(AdYCoefficients[stability], 2);
    return quadraticRoots(a, b, c);
}

const quadraticRoots = function(a, b, c) {
    return (b + Math.sqrt(b * b + 4 * a * c))/(2 * a);
}

const dZ = function(stability, x) {
    switch(stability) {
        case "A": {
            return sigmaZ(stability, x) / 0.2;
        }
        case "B": {
            return sigmaZ(stability, x) / 0.12;
        }
        case "C": {
            var c = Math.pow(sigmaZ(stability, x), 2);
            var b = 0.0002 * c;
            var a = Math.pow(0.08, 2);
            return quadraticRoots(a, b, c);
        }
        case "D": {
            var c = Math.pow(sigmaZ(stability, x), 2);
            var b = 0.0015 * c;
            var a = Math.pow(0.06, 2);
            return quadraticRoots(a, b, c);
        }
        case "E": {
            var qZ = sigmaZ(stability, x);
            return qZ / (0.03 - 0.0003 * qZ);
        }
        case "F": {
            var qZ = sigmaZ(stability, x);
            return qZ / (0.016 - 0.0003 * qZ);
        }
        default: {
            throw new Error("Unsupported stability value!");
        }
    }
}

exports.engine = { gaussian };