import { DefaultRouteProps } from "apps/api/src/common/types/routes/default";

export interface AuthRouteProps extends DefaultRouteProps {
  signIn: string;
  signUp: string;
  getMe: string;
  refreshToken: string;
  activateAccount: string;
  sendActivation: string;
  googleSignIn: string;
  googleCallback: string;
  getSessions: string;
}

export const authRoute: AuthRouteProps = {
  index: "/auth",
  default: "/",
  status: "/api-status",
  signIn: "/signin",
  signUp: "/signup",
  getMe: "/me",
  refreshToken: "/refresh-token",
  activateAccount: "/activate-account",
  sendActivation: "/send-activation",
  googleSignIn: "/google",
  googleCallback: "/google/callback",
  getSessions: "/sessions",
};
