import { bearerAuth } from 'hono/bearer-auth';
import { OAuth2Client } from 'google-auth-library';
import nullthrows from 'nullthrows';

const clientId = nullthrows(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID is required');

export const google_token_checker = bearerAuth({
  verifyToken: async (token, _) => {
    try {
      const client = new OAuth2Client({ clientId });
      const tokenInfo = await client.verifyIdToken({
        idToken: token,
        audience: clientId,
      });
      return tokenInfo != null;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});
