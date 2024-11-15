const useFilterArray = <T, K extends keyof T>(array: T[], keys: K[]): T[] => {
	const seen = new Set<string>();

	return array.reverse().filter((item) => {
		// Kết hợp tất cả các giá trị của các key thành một chuỗi duy nhất để kiểm tra
		const combinedKey = keys.map((key) => item[key]).join('|');

		if (seen.has(combinedKey)) {
			return false; // Bỏ qua phần tử nếu "chuỗi đại diện" đã tồn tại
		}

		// Nếu chưa tồn tại, thêm vào "seen" và giữ lại phần tử
		seen.add(combinedKey);
		return true;
	});
};

export default useFilterArray;
