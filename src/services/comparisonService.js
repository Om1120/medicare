/**
 * Hospital & Doctor Transparent Comparison Service
 * Calculates match ratings strictly derived from user-selected priorities.
 * Never claims an unsupported "universal best hospital".
 */

export const DEFAULT_PRIORITIES = {
  distance: 30,
  emergency: 25,
  specialties: 20,
  facilities: 15,
  pricing: 10
};

/**
 * Calculates a match score for a hospital given user priorities and context
 * @param {Object} hospital 
 * @param {Object} priorities { distance: 30, emergency: 25, specialties: 20, facilities: 15, pricing: 10 }
 * @param {Object} context { userCoords, targetSpecialty, maxDistance }
 * @returns {Object} { score, breakdown, maxPossibleScore }
 */
export const calculateHospitalMatch = (hospital, priorities = DEFAULT_PRIORITIES, context = {}) => {
  const { userCoords, targetSpecialty = "" } = context;
  const breakdown = [];

  // Normalize weights to sum up to 100
  const totalWeight = Object.values(priorities).reduce((a, b) => a + Number(b), 0) || 100;
  const weights = {
    distance: (priorities.distance / totalWeight) * 100,
    emergency: (priorities.emergency / totalWeight) * 100,
    specialties: (priorities.specialties / totalWeight) * 100,
    facilities: (priorities.facilities / totalWeight) * 100,
    pricing: (priorities.pricing / totalWeight) * 100
  };

  let totalScore = 0;

  // 1. Distance Metric (0 - 100)
  if (weights.distance > 0) {
    let distScore = 60; // Default when distance unknown
    let distExplanation = "Distance not calculated";

    if (hospital.distanceKm !== undefined && hospital.distanceKm !== null) {
      if (hospital.distanceKm <= 3) distScore = 100;
      else if (hospital.distanceKm <= 7) distScore = 85;
      else if (hospital.distanceKm <= 15) distScore = 70;
      else if (hospital.distanceKm <= 30) distScore = 45;
      else distScore = 20;

      distExplanation = `${hospital.distanceKm.toFixed(1)} km away (${distScore}/100)`;
    }
    const weightedDist = (distScore * weights.distance) / 100;
    totalScore += weightedDist;
    breakdown.push({
      criterion: "Proximity & Distance",
      weight: Math.round(weights.distance),
      rawScore: distScore,
      weightedScore: Math.round(weightedDist * 10) / 10,
      details: distExplanation
    });
  }

  // 2. Emergency Readiness (0 - 100)
  if (weights.emergency > 0) {
    let emergScore = 0;
    const features = [];
    if (hospital.emergencyServices && hospital.emergencyOpen24x7) {
      emergScore += 60;
      features.push("24/7 Emergency Unit");
    }
    if (hospital.icuBeds >= 30) {
      emergScore += 25;
      features.push(`${hospital.icuBeds} ICU Beds`);
    } else if (hospital.icuBeds > 0) {
      emergScore += 15;
      features.push(`${hospital.icuBeds} ICU Beds`);
    }
    if (hospital.ambulanceAvailable) {
      emergScore += 15;
      features.push("ACLS Ambulance");
    }

    const weightedEmerg = (emergScore * weights.emergency) / 100;
    totalScore += weightedEmerg;
    breakdown.push({
      criterion: "Emergency & Critical Care",
      weight: Math.round(weights.emergency),
      rawScore: emergScore,
      weightedScore: Math.round(weightedEmerg * 10) / 10,
      details: features.join(", ") || "Standard emergency support"
    });
  }

  // 3. Specialties & Department Depth
  if (weights.specialties > 0) {
    let specScore = 40;
    const specCount = (hospital.specialties || []).length;
    if (specCount >= 6) specScore = 100;
    else if (specCount >= 4) specScore = 80;
    else if (specCount >= 2) specScore = 60;

    let specDetails = `${specCount} major specialties available`;
    if (targetSpecialty) {
      const hasTarget = (hospital.specialties || []).some(
        s => s.toLowerCase().includes(targetSpecialty.toLowerCase())
      );
      if (hasTarget) {
        specDetails = `Includes requested specialty: ${targetSpecialty}`;
        specScore = Math.min(100, specScore + 15);
      }
    }

    const weightedSpec = (specScore * weights.specialties) / 100;
    totalScore += weightedSpec;
    breakdown.push({
      criterion: "Specialty & Department Coverage",
      weight: Math.round(weights.specialties),
      rawScore: specScore,
      weightedScore: Math.round(weightedSpec * 10) / 10,
      details: specDetails
    });
  }

  // 4. Diagnostic & Infrastructure Facilities
  if (weights.facilities > 0) {
    let facScore = 50;
    const facCount = (hospital.facilities || []).length + (hospital.amenities || []).length;
    if (facCount >= 10) facScore = 95;
    else if (facCount >= 6) facScore = 80;
    else facScore = 60;

    const weightedFac = (facScore * weights.facilities) / 100;
    totalScore += weightedFac;
    breakdown.push({
      criterion: "Facilities & Diagnostic Infrastructure",
      weight: Math.round(weights.facilities),
      rawScore: facScore,
      weightedScore: Math.round(weightedFac * 10) / 10,
      details: `${hospital.totalBeds} beds, ${hospital.operationTheatres} OTs, ${hospital.amenities?.length || 0} amenities`
    });
  }

  // 5. Pricing & Affordability
  if (weights.pricing > 0) {
    let priceScore = 70;
    const minFee = hospital.minFee || 600;
    if (minFee <= 400) priceScore = 100; // Highly affordable
    else if (minFee <= 650) priceScore = 85;
    else if (minFee <= 850) priceScore = 70;
    else if (minFee <= 1100) priceScore = 55;
    else priceScore = 40;

    const weightedPrice = (priceScore * weights.pricing) / 100;
    totalScore += weightedPrice;
    breakdown.push({
      criterion: "Consultation & Pricing Tier",
      weight: Math.round(weights.pricing),
      rawScore: priceScore,
      weightedScore: Math.round(weightedPrice * 10) / 10,
      details: `Consultation from ${hospital.consultationFeeRange || 'Standard'}`
    });
  }

  const finalMatchScore = Math.min(100, Math.round(totalScore));

  return {
    score: finalMatchScore,
    breakdown,
    summary: `Match rating calculated across ${breakdown.length} weighted criteria.`
  };
};
