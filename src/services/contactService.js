/**
 * Contact and Inquiry Service
 */

export const contactService = {
  async submitInquiry(inquiryData) {
    // Simulates an inquiry dispatch
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          referenceId: `INQ-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toISOString()
        });
      }, 500);
    });
  }
};
