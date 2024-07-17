import { template } from './template';

export const passwordResetConfirmationTemplate = (fullName: string) => {
  return template(`
  <div style="box-sizing: border-box; background-color:#101217; max-width: 600px; border-radius: 24px; width: 100%; margin: 30px auto; padding: 16px;">
  <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="LogoBanner" width="100%" height="auto" style="display: block; margin-bottom: 16px;" />

  <div style="width: 100%; padding: 40px 55px; margin-bottom: 16px; background-color: #1E2129; border-radius: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;">
      <div style="width: 100%; text-align: left;">
          <h1 style="box-sizing: border-box; margin: 0; font-size: 28px; line-height: 1.3; font-weight: 600; color: #FFFFFF;text-align:left; padding-bottom: 0.50rem; font-family: sans-serif;">Password Reset Confirmation</h1>
          <h2 style="font-size: 16px; margin-bottom: 27px; font-weight: 400;">Hi <span style="font-weight: 600;color: #FFFFFF;">${fullName}</span></h2>
          <p style="box-sizing: border-box;margin: 0; font-size: 14px; font-weight: 400; line-height: 21px; color: #8F9094; padding-bottom: 1.25rem; font-family: sans-serif;">We're writing to inform you that your password has been successfully reset. Your account security is our top priority, and we're pleased to assist you in ensuring the safety of your <span style="color: #FFCC57;;">SSO-Auth,</span> account.</p>

          <p style="box-sizing: border-box;margin: 0; font-size: 14px; font-weight: 400; line-height: 21px; color: #8F9094; font-family: sans-serif;">If you initiated this password reset, you can disregard this email. However, if you did not request this action, please contact our support team immediately to investigate further.</p>
      </div>
  </div>

</div>`);
};
