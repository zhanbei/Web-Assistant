'use strict';

const ChromeStorageManager = require('./DataManagers/ChromeStorageManager');

const extractData = (actions) => {
	if (!actions || actions.length === 0) {return;}
	return actions.reduce((state, action) => {
		if (!action.script) {return state;}
		action = {...action};
		action.href = location.href;
		try {
			if (action.filter) {
				action.exp = action.filter.trim().replace(/\./g, '\\.').replace(/\*/g, '.*') + '.*';
				const reg = new RegExp(action.exp, 'i');
				if (!reg.test(action.href)) {return state;}
			}
			action.output = eval(action.script);
		} catch (ex) {
			action.ex = ex;
		}
		state.push(action);
		return state;
	}, []);
};

ChromeStorageManager.addTempOnStorageDataChangeListener((actions) => {
	if (!actions) {return;}
	const logs = extractData(actions);
	console.log('Executed actions:', logs);
});
