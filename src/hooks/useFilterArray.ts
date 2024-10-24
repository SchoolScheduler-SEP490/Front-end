const useFilterArray = <T, K extends keyof T>(array: T[], key: K): T[] => {
	const seen = new Set<T[K]>();
	return array.filter((item) => {
		const value = item[key];
		if (seen.has(value)) {
			return false;
		}
		seen.add(value);
		return true;
	});
};

export default useFilterArray;
