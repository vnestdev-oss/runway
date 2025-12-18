import nodemailer from 'nodemailer';

// Create reusable transporter
export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email template for application submission
export const generateApplicationEmail = (data: {
  fullName: string;
  registerNumber: string;
  email: string;
  startupName: string;
  problemStatement: string;
  proposedSolution: string;
  facultyName: string;
  facultyEmail: string;
  resources: any[];
  submittedAt: string;
}) => {
  const resourcesList = data.resources.length > 0
    ? data.resources
        .map(
          (r, i) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${i + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${r.resourceName || 'N/A'}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${r.description || 'N/A'}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">₹${r.cost || 0}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            r.link ? `<a href="${r.link}">Link</a>` : 'N/A'
          }</td>
        </tr>
      `
        )
        .join('')
    : '<tr><td colspan="5" style="padding: 8px; border: 1px solid #ddd; text-align: center;">No resources required</td></tr>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .section { margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px; }
        .section-title { color: #4F46E5; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background-color: #4F46E5; color: white; padding: 10px; text-align: left; }
        td { padding: 8px; border: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Runway VNEST Application Submission</h1>
        </div>
        
        <div class="section">
          <div class="section-title">Student Details</div>
          <div class="field"><span class="label">Full Name:</span> ${data.fullName}</div>
          <div class="field"><span class="label">Register Number:</span> ${data.registerNumber}</div>
          <div class="field"><span class="label">Email:</span> ${data.email}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Startup/Idea Information</div>
          <div class="field"><span class="label">Startup Name:</span> ${data.startupName}</div>
          <div class="field"><span class="label">Problem Statement:</span> ${data.problemStatement}</div>
          <div class="field"><span class="label">Proposed Solution:</span> ${data.proposedSolution}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Faculty Mentor</div>
          <div class="field"><span class="label">Name:</span> ${data.facultyName}</div>
          <div class="field"><span class="label">Email:</span> ${data.facultyEmail}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Resource Requirements</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Resource Name</th>
                <th>Description</th>
                <th>Cost</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              ${resourcesList}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <div class="field"><span class="label">Submitted At:</span> ${new Date(data.submittedAt).toLocaleString()}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send application notification email
export const sendApplicationEmail = async (data: any) => {
  const transporter = createEmailTransporter();
  
  const emailHtml = generateApplicationEmail(data);
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `New Application: ${data.startupName} - ${data.fullName}`,
    html: emailHtml,
  };
  
  await transporter.sendMail(mailOptions);
};
