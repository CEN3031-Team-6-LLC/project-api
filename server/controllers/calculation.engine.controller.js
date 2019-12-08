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

const gaussian = function(stability, x, receptorHeight, releaseHeight, windSpeed, sourceAmount, fireCloudTop, fireRadius, isFire) {
    var sY = isFire ? adjustedFireRadius(stability, fireRadius, fireCloudTop)/2 + dY(stability, x) : sigmaY(stability, x);
    var sZ = isFire ? adjustedFireRadius(stability, fireRadius, fireCloudTop)/2 + dZ(stability, x) : sigmaZ(stability, x);
    var C = sourceAmount / (2 * Math.PI * sY * sZ * windSpeed);
    var exp1Partial = (receptorHeight - (isFire ? fireReleaseHeight(fireCloudTop) : releaseHeight)) / sZ;
    var exp2Partial = (receptorHeight + (isFire ? fireReleaseHeight(fireCloudTop) : releaseHeight)) / sY;
    return C * (Math.exp(-0.5 * Math.pow(exp1Partial , 2)) + Math.exp(-0.5 * Math.pow(exp2Partial , 2)));
}

const fireReleaseHeight = function(fireCloudTop) {
    if (fireCloudTop <= 200) {
        return fireCloudTop / 1.42;
    } else {
        return fireCloudTop / (0.00224 * fireCloudTop + 0.964);
    }
}

const adjustedFireRadius = function(stability, fireRadius, fireCloudTop) {
    if (["A", "B", "C", "D"].findIndex(stab => stab === stability) != -1) {
        if (fireReleaseHeight(fireCloudTop)/3 > fireRadius) {
            return fireReleaseHeight(fireCloudTop)/3;
        } else {
            return 0;
        }
    } else {
        return fireRadius;
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

const lambda = function(halfLife) {
    return 0.69/halfLife;
}

const arrivalTime = function(windSpeed, x) {
    return x/windSpeed;
}

const adjustment = function(C, lambda, arrivalTime) {
    return C * Math.exp(-1 * lambda * arrivalTime);
}

const dose = function(Cadj, effectiveDose) {
    return Cadj * 4.17E-04 * effectiveDose;
}

const adjustedConcentration = function(C, halfLife, windSpeed, x) {
    return adjustment(C, lambda(halfLife), arrivalTime(windSpeed, x));
}

exports.engine = { gaussian, dose, arrivalTime, adjustedConcentration };