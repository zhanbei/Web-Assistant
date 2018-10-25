'use strict';

function fnLoadActions() {
	return [{
		name: 'Test',
		description: '',
		script: 'console.log("Hello world, from Web Assistant");',
	}];
}

function fnExtractData(actions = []) {
	if (actions.length === 0) {return;}
	return actions.reduce((state, action) => {
		if (!action.script) {return state;}
		const value = eval(action.script);
		state.push(value);
		return state;
	}, []);
}

const data = fnExtractData(fnLoadActions());
console.log('Executed actions:', data);
