'use strict';

const _exist = (str) => Boolean(str && str.trim());

export const isValid = (action) => {
	return _exist(action.name) && _exist(action.script) && _exist(action.buttonText);
};

export const isEmpty = (patch) => {
	return JSON.stringify(patch) === '{}';
};
