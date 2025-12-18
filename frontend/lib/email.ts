import nodemailer from 'nodemailer';

// Create reusable transporter
export const createEmailTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT || '587');
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465, // true for 465, false for other ports
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
  contactNumber: string;
  email: string;
  schoolDepartment: string;
  yearOfStudy: string;
  startupName: string;
  problemStatement: string;
  proposedSolution: string;
  targetUsers: string;
  innovation: string;
  pptLink: string;
  facultyName: string;
  facultyDepartment: string;
  facultyEmail: string;
  facultyContact: string;
  facultyEmployeeId: string;
  resources: any[];
  consent: boolean;
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
          <div class="field"><span class="label">Contact Number:</span> ${data.contactNumber}</div>
          <div class="field"><span class="label">Email:</span> ${data.email}</div>
          <div class="field"><span class="label">School/Department:</span> ${data.schoolDepartment}</div>
          <div class="field"><span class="label">Year of Study:</span> ${data.yearOfStudy}</div>
        </div>
        
        <div class="section">
          <div class="section-title">Startup/Idea Information</div>
          <div class="field"><span class="label">Startup Name:</span> ${data.startupName}</div>
          <div class="field"><span class="label">Problem Statement:</span> ${data.problemStatement}</div>
          <div class="field"><span class="label">Proposed Solution:</span> ${data.proposedSolution}</div>
          <div class="field"><span class="label">Target Users/Market:</span> ${data.targetUsers}</div>
          <div class="field"><span class="label">Innovation/Uniqueness:</span> ${data.innovation}</div>
          <div class="field"><span class="label">PPT Link:</span> <a href="${data.pptLink}">${data.pptLink}</a></div>
        </div>
        
        <div class="section">
          <div class="section-title">Faculty Mentor</div>
          <div class="field"><span class="label">Name:</span> ${data.facultyName}</div>
          <div class="field"><span class="label">Department:</span> ${data.facultyDepartment}</div>
          <div class="field"><span class="label">Email:</span> ${data.facultyEmail}</div>
          <div class="field"><span class="label">Contact Number:</span> ${data.facultyContact}</div>
          <div class="field"><span class="label">Employee ID:</span> ${data.facultyEmployeeId}</div>
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
          <div class="section-title">Consent & Submission</div>
          <div class="field"><span class="label">Consent Given:</span> ${data.consent ? 'Yes ✓' : 'No ✗'}</div>
          <div class="field"><span class="label">Submitted At:</span> ${new Date(data.submittedAt).toLocaleString()}</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Confirmation email template for applicant
export const generateConfirmationEmail = (data: {
  fullName: string;
  registerNumber: string;
  startupName: string;
  submittedAt: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .success-icon { font-size: 48px; margin-bottom: 10px; }
        .highlight { background-color: #f0fdf4; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .info-box { background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; color: #555; }
        .value { color: #111; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .button { display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Application Submitted Successfully!</h1>
        </div>
        
        <div class="content">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear <strong>${data.fullName}</strong>,</p>
          
          <p>Thank you for submitting your application to <strong>Runway VNEST</strong>! We have successfully received your startup idea submission.</p>
          
          <div class="highlight">
            <p style="margin: 0;"><strong>Your application has been recorded and is now under review by our team.</strong></p>
          </div>
          
          <div class="info-box">
            <h3 style="margin-top: 0; color: #4F46E5;">Application Details</h3>
            <div class="info-row">
              <span class="label">Startup/Idea Name:</span>
              <span class="value">${data.startupName}</span>
            </div>
            <div class="info-row">
              <span class="label">Register Number:</span>
              <span class="value">${data.registerNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Submitted On:</span>
              <span class="value">${new Date(data.submittedAt).toLocaleString('en-IN', { 
                dateStyle: 'long', 
                timeStyle: 'short' 
              })}</span>
            </div>
          </div>
          
          <h3 style="color: #4F46E5;">What's Next?</h3>
          <ul style="line-height: 1.8;">
            <li>Our team will review your application carefully</li>
            <li>If shortlisted, you'll be contacted for the next steps</li>
          </ul>
          
          <div class="footer">
            <p><strong>Runway VNEST Team</strong></p>
            <p>Building the future, one startup at a time 🚀</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send application notification email to admin
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

// Send confirmation email to applicant
export const sendConfirmationEmail = async (data: {
  fullName: string;
  email: string;
  registerNumber: string;
  startupName: string;
  submittedAt: string;
}) => {
  const transporter = createEmailTransporter();
  
  const emailHtml = generateConfirmationEmail(data);
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: data.email,
    subject: `Application Received - ${data.startupName}`,
    html: emailHtml,
  };
  
  await transporter.sendMail(mailOptions);
};
