import { bearerAuth } from 'hono/bearer-auth';

import { OAuth2Client } from 'google-auth-library';

export const googleTokenVerifier = bearerAuth({
	verifyToken: async (token, _) => {
		try {
			const client = new OAuth2Client();
			const tokenInfo = await client.getTokenInfo(token);
			console.log({ tokenInfo });
			return tokenInfo != null;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
});
