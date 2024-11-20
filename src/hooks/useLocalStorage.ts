import { useState } from 'react';

const useLocalStorage = (key: string, initialValue: string) => {
	const [readLocal, setReadLocal] = useState(() => {
		// Initialize the state
		try {
			const value = window.localStorage.getItem(key);
			// Check if the local storage already has any values,
			// otherwise initialize it with the passed initialValue
			return value ? JSON.parse(value) : initialValue;
		} catch (error) {
			console.log(error);
		}
	});

	const writeLocal = (value: any) => {
		try {
			// If the passed value is a callback function,
			//  then call it with the existing state.
			const valueToStore = value instanceof Function ? value(readLocal) : value;
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
			setReadLocal(value);
		} catch (error) {
			console.log(error);
		}
	};

	return [readLocal, writeLocal];
};

export default useLocalStorage;
