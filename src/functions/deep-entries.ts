function* deepEntriesImpl(obj: object): Generator<[string, object]> {
	for (const [key, value] of Object.entries(obj)) {
		yield [key, value];
		if (typeof value === 'object' && value !== null) {
			yield* deepEntriesImpl(value);
		}
	}
}

export function deepEntries(obj: object) {
	const result = [];
	for (const [key, value] of deepEntriesImpl(obj)) {
		result.push([key, value]);
	}
	return result;
}
