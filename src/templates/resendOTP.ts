import { template } from './template';

export const resendOTPTemplate = (fullName: string, OTP: number) => {
  return template(`
  <div style="box-sizing: border-box; background-color:#101217; max-width: 600px; border-radius: 24px; width: 100%; margin: 30px auto; padding: 16px;">
  	
  <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="LogoBanner" width="100%" height="auto" style="display: block; margin-bottom: 16px;" />

		<div style="width: 100%; padding: 40px 55px; margin-bottom: 16px; background-color: #1E2129; border-radius: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;">
			<div style="width: 100%; text-align: left;">
				<h1 style="box-sizing: border-box; margin: 0; font-size: 28px; line-height: 1.3; font-weight: 600; color: #FFFFFF;text-align:left; padding-bottom: 0.50rem; font-family: sans-serif;">OTP Verification</h1>
				<p style="box-sizing: border-box;margin: 0; font-size: 14px; font-weight: 400; line-height: 21px; color: #8F9094; padding-bottom: 1.25rem; font-family: sans-serif;">Thank you for registering with SSO-Auth. To complete the email verification process, please use  One-Time Password (OTP).</p>
				<h2 style="box-sizing: border-box; margin: 0; font-size: 28px; line-height: 1.3; font-weight: 700; color: #FFFFFF;text-align:left; padding-bottom: 1.25rem; font-family: sans-serif;">${OTP}</h2>
				<p style="box-sizing: border-box;margin: 0; font-size: 14px; font-weight: 400; line-height: 21px; color: #8F9094; font-family: sans-serif;">Please enter this code on the verification page. This OTP is valid for a limited time.</p>
			</div>
		</div>
	
	</div>`);
};
