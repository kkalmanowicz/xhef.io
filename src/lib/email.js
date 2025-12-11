import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const emailService = {
  // Send order confirmation email
  async sendOrderConfirmation(to, orderDetails) {
    try {
      const { data, error } = await resend.emails.send({
        from: `xhef.io <noreply@${import.meta.env.VITE_RESEND_DOMAIN || 'resend.dev'}>`,
        to: [to],
        subject: `Order Confirmation - ${orderDetails.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Order Confirmation</h2>
            <p>Your order <strong>${orderDetails.orderNumber}</strong> has been confirmed.</p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Vendor:</strong> ${orderDetails.vendorName}</p>
              <p><strong>Expected Delivery:</strong> ${orderDetails.expectedDelivery}</p>
              <p><strong>Total Amount:</strong> $${orderDetails.totalAmount}</p>
            </div>

            ${
              orderDetails.items?.length
                ? `
              <h3>Items Ordered:</h3>
              <ul>
                ${orderDetails.items
                  .map(
                    item => `
                  <li>${item.name} - ${item.quantity} ${item.unit} @ $${item.unitCost} each</li>
                `
                  )
                  .join('')}
              </ul>
            `
                : ''
            }

            <p>You can track this order in your <a href="${import.meta.env.VITE_APP_URL}">xhef.io dashboard</a>.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent from xhef.io Kitchen Management System.<br>
              If you have any questions, please contact support.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error('Email sending failed:', error);
        throw new Error(error.message);
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send low stock alert
  async sendLowStockAlert(to, items) {
    try {
      const { data, error } = await resend.emails.send({
        from: `xhef.io Alerts <alerts@${import.meta.env.VITE_RESEND_DOMAIN || 'resend.dev'}>`,
        to: [to],
        subject: 'Low Stock Alert - Immediate Attention Required',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">⚠️ Low Stock Alert</h2>
            <p>The following items are running low in your inventory:</p>

            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0;">
              <h3>Items Below Minimum Stock:</h3>
              <ul>
                ${items
                  .map(
                    item => `
                  <li style="margin: 10px 0;">
                    <strong>${item.name}</strong><br>
                    Current: ${item.currentStock} ${item.unit} | Minimum: ${item.minStock} ${item.unit}
                    ${item.vendor ? `<br><em>Vendor: ${item.vendor}</em>` : ''}
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>

            <p><strong>Action Required:</strong> Consider placing orders for these items to avoid stockouts.</p>

            <p>Manage your inventory in your <a href="${import.meta.env.VITE_APP_URL}">xhef.io dashboard</a>.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This is an automated alert from xhef.io Kitchen Management System.<br>
              You can adjust alert thresholds in your settings.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error('Low stock alert failed:', error);
        throw new Error(error.message);
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send weekly inventory report
  async sendWeeklyReport(to, reportData) {
    try {
      const { data, error } = await resend.emails.send({
        from: `xhef.io Reports <reports@${import.meta.env.VITE_RESEND_DOMAIN || 'resend.dev'}>`,
        to: [to],
        subject: `Weekly Inventory Report - Week of ${reportData.weekOf}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">📊 Weekly Inventory Report</h2>
            <p>Here's your weekly inventory summary for the week of <strong>${reportData.weekOf}</strong>:</p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
                <h3 style="color: #059669; margin: 0;">Total Items</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${reportData.totalItems}</p>
              </div>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center;">
                <h3 style="color: #dc2626; margin: 0;">Low Stock Items</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${reportData.lowStockItems}</p>
              </div>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Key Metrics:</h3>
              <ul>
                <li>Orders Placed: ${reportData.ordersPlaced || 0}</li>
                <li>Total Spent: $${reportData.totalSpent || '0.00'}</li>
                <li>Waste Recorded: ${reportData.wasteItems || 0} items</li>
                <li>Prep Items Created: ${reportData.prepItemsCreated || 0}</li>
              </ul>
            </div>

            ${
              reportData.topUsedItems?.length
                ? `
              <h3>Most Used Items This Week:</h3>
              <ol>
                ${reportData.topUsedItems
                  .map(
                    item => `
                  <li>${item.name} - ${item.usage} ${item.unit} used</li>
                `
                  )
                  .join('')}
              </ol>
            `
                : ''
            }

            <p>View detailed reports in your <a href="${import.meta.env.VITE_APP_URL}">xhef.io dashboard</a>.</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This automated report is sent weekly from xhef.io.<br>
              You can customize report settings in your dashboard.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error('Weekly report failed:', error);
        throw new Error(error.message);
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  // Send welcome email to new users
  async sendWelcomeEmail(to, userName) {
    try {
      const { data, error } = await resend.emails.send({
        from: `xhef.io Welcome <welcome@${import.meta.env.VITE_RESEND_DOMAIN || 'resend.dev'}>`,
        to: [to],
        subject:
          'Welcome to xhef.io - Your Kitchen Management Journey Starts Here!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">🍽️ Welcome to xhef.io!</h2>
            <p>Hi ${userName || 'there'},</p>

            <p>Welcome to xhef.io - your complete kitchen management solution! We're excited to help you streamline your inventory, orders, and prep work.</p>

            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; margin: 20px 0;">
              <h3>🚀 Get Started:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Set up your vendor contacts</li>
                <li>Add your inventory categories</li>
                <li>Create your first inventory items</li>
                <li>Set minimum stock levels for alerts</li>
              </ul>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Key Features:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>📦 Inventory Management</li>
                <li>🛒 Order Tracking</li>
                <li>👨‍🍳 Prep Item Planning</li>
                <li>📧 Automated Alerts</li>
                <li>📊 Usage Reports</li>
                <li>♻️ Waste Tracking</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="${import.meta.env.VITE_APP_URL}" style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Access Your Dashboard
              </a>
            </p>

            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>

            <p>Happy cooking!<br>The xhef.io Team</p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              This email was sent because you signed up for xhef.io.<br>
              If you didn't create this account, please contact our support team.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error('Welcome email failed:', error);
        throw new Error(error.message);
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },
};
