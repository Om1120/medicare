/**
 * Doctor & Appointment Availability Service
 * Validates doctor working schedules, generates slot options,
 * and checks existing bookings to prevent duplicate allocations.
 */

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Checks if a date string (YYYY-MM-DD) falls on a working day for the doctor
 */
export const isDoctorWorkingOnDate = (doctor, dateString) => {
  if (!doctor || !dateString) return false;
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return false;

  const dayName = DAY_NAMES[dateObj.getDay()];
  const availableDays = doctor.availableDays || [];
  return availableDays.includes(dayName);
};

/**
 * Generates 30-minute interval appointment slots for doctor's shift
 */
export const generateDoctorTimeSlots = (doctor) => {
  if (!doctor) return [];
  // Standard clinical slots if doctor has a custom shift
  const defaultSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM"
  ];

  if (doctor.availableTime && doctor.availableTime.includes("02:00 PM - 07:00 PM")) {
    return ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"];
  }

  if (doctor.availableTime && doctor.availableTime.includes("09:00 AM - 01:00 PM")) {
    return ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM"];
  }

  return defaultSlots;
};

/**
 * Evaluates slot availability status considering booked appointments
 * Returns array of { time, status: 'available' | 'booked' | 'unavailable' }
 */
export const getSlotAvailability = (doctor, dateString, existingAppointments = []) => {
  if (!doctor || !dateString) return [];

  const isWorking = isDoctorWorkingOnDate(doctor, dateString);
  const slots = generateDoctorTimeSlots(doctor);

  if (!isWorking) {
    return slots.map(time => ({
      time,
      status: 'unavailable',
      reason: `Doctor is not scheduled on ${DAY_NAMES[new Date(dateString).getDay()]}`
    }));
  }

  // Filter booked appointments for this doctor on this date (excluding cancelled)
  const bookedTimes = new Set(
    existingAppointments
      .filter(apt => apt.doctorId === doctor.id && apt.date === dateString && apt.status !== 'Cancelled')
      .map(apt => apt.time)
  );

  return slots.map(time => ({
    time,
    status: bookedTimes.has(time) ? 'booked' : 'available',
    reason: bookedTimes.has(time) ? 'Slot already reserved' : 'Available for booking'
  }));
};
