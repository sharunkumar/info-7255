import { describe, expect, it } from 'bun:test';
import { hash, verify } from '../functions/crypto';

describe('Crypto functions', () => {
	const testPassword = 'mySecurePassword123';

	describe('hash function', () => {
		it('should return a hashed string', async () => {
			const hashedPassword = await hash(testPassword);
			expect(typeof hashedPassword).toBe('string');
			expect(hashedPassword).not.toBe(testPassword);
		});

		it('should generate different hashes for the same password', async () => {
			const hash1 = await hash(testPassword);
			const hash2 = await hash(testPassword);
			expect(hash1).not.toBe(hash2);
		});
	});

	describe('verify function', () => {
		it('should return true for correct password', async () => {
			const hashedPassword = await hash(testPassword);
			const result = await verify(testPassword, hashedPassword);
			expect(result).toBe(true);
		});

		it('should return false for incorrect password', async () => {
			const hashedPassword = await hash(testPassword);
			const result = await verify('wrongPassword', hashedPassword);
			expect(result).toBe(false);
		});
	});
});
