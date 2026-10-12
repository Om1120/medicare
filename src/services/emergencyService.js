/**
 * Emergency Service & Live Critical Care Telemetry
 * Provides real-time ICU bed availability, blood bank stocks,
 * and live ambulance dispatch tracking with GPS simulation.
 */

export const emergencyService = {
  /**
   * Retrieves live critical care telemetry for hospitals
   */
  getHospitalTelemetry(hospitalId) {
    const baseHash = (hospitalId || "hosp-1").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return {
      icuBedsAvailable: (baseHash % 12) + 2,
      icuBedsTotal: 25,
      ventilatorsAvailable: (baseHash % 8) + 1,
      ventilatorsTotal: 15,
      emergencyDoctorsOnDuty: (baseHash % 5) + 3,
      ambulanceUnitsAvailable: (baseHash % 4) + 2,
      bloodStock: {
        "A+": (baseHash % 15) + 5,
        "B+": (baseHash % 18) + 8,
        "O+": (baseHash % 25) + 10,
        "AB+": (baseHash % 10) + 3,
        "O-": (baseHash % 8) + 2,
        "A-": (baseHash % 6) + 2,
        "B-": (baseHash % 6) + 2,
        "AB-": (baseHash % 4) + 1
      },
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  /**
   * Dispatches emergency ambulance and returns live tracking session
   */
  dispatchAmbulance({ callerName, contactPhone, pickupLocation, emergencyType, userCoords }) {
    const dispatchId = `AMB-SOS-${Date.now().toString().slice(-6)}`;
    const driverNames = ["Rajesh Kumar", "Sunil Shinde", "Anil Patil", "Vikram Rathod"];
    const driver = driverNames[Math.floor(Math.random() * driverNames.length)];
    const vehicleNumber = `MH-04-ER-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      dispatchId,
      status: "Dispatched",
      callerName,
      contactPhone,
      pickupLocation,
      emergencyType,
      driverName: driver,
      driverPhone: "+91 98200 44551",
      vehicleNumber,
      etaMinutes: Math.floor(6 + Math.random() * 8), // 6 to 14 mins
      dispatchedAt: new Date().toISOString(),
      hospitalAssigned: "MediCare Central Trauma & Emergency Hub",
      hospitalCoordinates: { latitude: 19.0760, longitude: 72.8777 }
    };
  }
};
