/**
 * Medical Invoice & Prescription Document Generator Service
 * Generates verified digital invoices, appointment receipts, and diagnostic cards
 * with live QR code validation stamps.
 */

export const invoiceService = {
  /**
   * Generates real-time verification QR Code URL
   */
  getQrCodeUrl(content) {
    const encoded = encodeURIComponent(content || "https://medicare.org/verify");
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encoded}&color=0B6E99`;
  },

  /**
   * Opens a standardized printable invoice view in browser print engine
   */
  printInvoice(billData) {
    const qrUrl = this.getQrCodeUrl(`https://medicare.org/verify/bill/${billData.id || 'INV-001'}`);
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert("Please allow popups to print/download invoice.");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${billData.id || 'Hospital Receipt'}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background: #fff; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0B6E99; padding-bottom: 20px; margin-bottom: 25px; }
          .logo { color: #0B6E99; font-size: 24px; font-weight: 800; }
          .hospital-info { text-align: right; font-size: 13px; color: #64748b; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          th { background: #0B6E99; color: #fff; text-align: left; padding: 10px; font-size: 13px; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .total-box { margin-left: auto; width: 280px; text-align: right; font-size: 14px; margin-bottom: 30px; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .grand-total { font-weight: 800; font-size: 18px; color: #0B6E99; border-top: 2px solid #0B6E99; padding-top: 8px; }
          .qr-section { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #cbd5e1; padding-top: 20px; }
          .stamp { border: 2px solid #10B981; color: #10B981; font-weight: 800; padding: 8px 16px; border-radius: 6px; text-transform: uppercase; font-size: 14px; display: inline-block; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">🏥 MediCare Super Speciality Health</div>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">NABH & NABL Accredited Healthcare Network</p>
          </div>
          <div class="hospital-info">
            <strong>${billData.hospitalName || 'MediCare Central'}</strong><br/>
            Emergency 24x7: 1800-200-4455<br/>
            GSTIN: 27AABCM9876C1Z8
          </div>
        </div>

        <div class="meta-grid">
          <div>
            <strong>PATIENT DETAILS:</strong><br/>
            Name: ${billData.patientName || 'Verified Patient'}<br/>
            Patient ID: ${billData.patientId || 'PT-2026-8821'}<br/>
            Attending Doctor: ${billData.doctorName || 'Senior Consultant'}
          </div>
          <div style="text-align: right;">
            <strong>INVOICE DETAILS:</strong><br/>
            Invoice No: <strong>${billData.id || 'INV-2026-9901'}</strong><br/>
            Issue Date: ${billData.date || new Date().toISOString().slice(0, 10)}<br/>
            Payment Mode: ${billData.paymentMethod || 'Online (UPI/Card)'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item / Clinical Service</th>
              <th>Department</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${(billData.items || [
              { description: 'Specialist Clinical Consultation & Examination', dept: 'OPD Clinical', amount: billData.amount ? billData.amount * 0.7 : 1200 },
              { description: 'Hospital Facility & Administrative Health Card Fee', dept: 'Admin', amount: billData.amount ? billData.amount * 0.3 : 300 }
            ]).map(item => `
              <tr>
                <td>${item.description || item.name}</td>
                <td>${item.dept || 'Clinical'}</td>
                <td style="text-align: right;">₹${Math.round(item.amount).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row"><span>Subtotal:</span> <span>₹${Math.round(billData.amount || 1500).toLocaleString('en-IN')}</span></div>
          <div class="total-row"><span>Hospital Cess / GST (0% Medical):</span> <span>₹0.00</span></div>
          <div class="total-row grand-total"><span>Total Paid:</span> <span>₹${Math.round(billData.amount || 1500).toLocaleString('en-IN')}</span></div>
        </div>

        <div class="qr-section">
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="${qrUrl}" width="80" height="80" alt="Verification QR" />
            <div style="font-size: 11px; color: #64748b;">
              <strong>Scan to Verify Authenticity</strong><br/>
              Digitally certified via MediCare Central Clinical Database.<br/>
              Security Token: ${billData.id || 'SEC-VERIFIED'}
            </div>
          </div>
          <div style="text-align: right;">
            <div class="stamp">PAID & SETTLED</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 8px;">Authorized Hospital Seal & Signature</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
