/**
 * Notification Service
 * Integrates Web Push Notification API, WhatsApp Dispatcher, and SMS/Email messaging.
 */

export const notificationService = {
  /**
   * Requests browser permission for native push notifications
   */
  async requestPushPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notifications.");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  },

  /**
   * Dispatches a native browser notification
   */
  async sendBrowserNotification(title, options = {}) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      try {
        new Notification(title, {
          icon: "/vite.svg",
          badge: "/vite.svg",
          ...options
        });
      } catch (err) {
        console.warn("Notification trigger failed:", err);
      }
    }
  },

  /**
   * Generates a direct WhatsApp link for booking confirmation
   */
  generateWhatsAppLink(phone = "919876543210", appointmentDetails) {
    const cleanPhone = phone.replace(/\D/g, "");
    const text = encodeURIComponent(
      `*MediCare Healthcare Appointment Confirmation*\n\n` +
      `👤 Patient: ${appointmentDetails.patientName}\n` +
      `🏥 Hospital: ${appointmentDetails.hospitalName}\n` +
      `🩺 Doctor: ${appointmentDetails.doctorName} (${appointmentDetails.department})\n` +
      `📅 Date & Time: ${appointmentDetails.date} at ${appointmentDetails.time}\n` +
      `🆔 Token ID: ${appointmentDetails.id || appointmentDetails.appointmentId}\n\n` +
      `Please arrive 15 minutes before your scheduled slot. For queries call our 24x7 helpdesk at 1800-200-4455.`
    );
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`;
  },

  /**
   * Simulates immediate SMS & Email notification dispatch
   */
  async dispatchMultiChannelAlert({ type, recipient, data }) {
    // Trigger desktop notification if permitted
    await this.sendBrowserNotification(
      type === 'appointment' ? 'Appointment Confirmed! 📅' : 'Invoice Settlement Successful 💳',
      {
        body: `${data.hospitalName || 'MediCare Hospital'} - ${data.doctorName ? `Dr. ${data.doctorName}` : `Amount: ₹${data.amount}`}`,
        tag: 'medicare-alert'
      }
    );

    return {
      smsStatus: "Delivered",
      smsGatewayId: `SMS-${Math.floor(100000 + Math.random() * 900000)}`,
      emailStatus: "Dispatched",
      emailGatewayId: `MSG-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  }
};
