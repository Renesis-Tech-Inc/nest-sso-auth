import { IToken } from './auth-token.interface';
import ESteps from 'src/modules/social-auth/enums/steps.enum';
import { IAuthUser } from './auth-user.interface';

export interface ILogin {
  user?: IAuthUser;
  token?: IToken;
  nextStep?: ESteps;
}
