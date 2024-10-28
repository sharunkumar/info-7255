import { bearerAuth } from 'hono/bearer-auth';

import { OAuth2Client } from 'google-auth-library';

export const googleTokenVerifier = bearerAuth({
	verifyToken: async (token, _) => {
		try {
			const client = new OAuth2Client({
				clientId: process.env.GOOGLE_CLIENT_ID,
			});
			const tokenInfo = await client.verifyIdToken({
				idToken: token,
				audience: client._clientId,
			});
			console.log({ tokenInfo });
			return tokenInfo != null;
		} catch (error) {
			console.error(error);
			return false;
		}
	},
});
