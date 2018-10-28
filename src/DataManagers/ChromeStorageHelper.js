'use strict';

// @see https://developer.chrome.com/apps/storage
export const CHROME_STORAGE_KEY = 'key';

// Also use the default configurations when failed to parsing json string.
export const DEFAULT_CONFIGURATIONS = {
	nextId: 2,
	actions: [{
		_id: 1,
		name: 'Hello World',
		description: 'A test action to print hello to console on page load.',
		buttonText: 'Hello',
		script: 'console.log(\'Hello world, from #Web-Assistant$Hello-World\');',
	}],
};

export const parseStorageData = (json) => {
	try {
		if (!json) {
			console.info('Resolved nothing from chrome storage, and using the default configurations.', json, DEFAULT_CONFIGURATIONS);
			return DEFAULT_CONFIGURATIONS;
		}
		const data = JSON.parse(json);
		if (!data.nextId || !data.actions) {
			console.error('Resolved data from chrome storage is invalid, and using the default configurations.', data, DEFAULT_CONFIGURATIONS);
			return DEFAULT_CONFIGURATIONS;
		}
		return data;
	} catch (ex) {
		const msg = 'Error encountered when parsing the saved data!';
		alert(msg);
		console.error(msg, ex);
	}
	return DEFAULT_CONFIGURATIONS;
};
