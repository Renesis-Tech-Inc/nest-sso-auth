import { template } from './template';

export const welcomeTemplate = (fullName: string) => {
  return template(`
  
  <div style="box-sizing: border-box; background-color:#101217; max-width: 600px; border-radius: 24px; width: 100%; margin: 30px auto; padding: 16px;">
		
  <div style="padding: 0px 32px;">
      <a target="_blank" href="#">
      <img src="https://cdn-icons-png.flaticon.com/512/1006/1006771.png" alt="LogoBanner" width="100%" height="auto" style="display: block; margin-bottom: 16px;" />

      </a>  
  </div>
  <div style="padding: 32px;">
      <h1 style="font-size: 26px; font-weight: 600;margin: 0; text-align: start;color:#FFF">Welcome to SSO-Auth</h1>

      <h2 style="font-size: 16px; margin-bottom: 27px; font-weight: 400;">Hi <span style="font-weight: 600; ">${fullName}</span></h2>
      <p style="margin-bottom: 24px;font-size: 14px;color:#FFF">Welcome to <span
              style="color: #FFCC57;">SSO-Auth</span> Here we believe in the power of collective kindness.
      </p>
      <p style="margin-bottom: 27px;font-size: 14px;color:#FFF">Your decision to be a part of our app means
          that you are joining a network of individuals dedicated to making a positive impact on the lives of
          animals in need.</p>
      <span>Thanks,</span>
      <span style="display: block; font-weight: 600;color:#FFF">SSO-Auth</span>
  </div>

 
</div>`);
};
