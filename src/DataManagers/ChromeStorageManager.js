'use strict';

const EventListener = require('../utils/EventListener');
const helper = require('./ChromeStorageHelper');

let mStorageData = null;

const mEventManager = new EventListener();

export const getStorageData = () => {
	return new Promise((resolve) => {
		/** @namespace chrome.storage.sync.get */
		chrome.storage.sync.get([helper.CHROME_STORAGE_KEY], (result) => {
			const data = helper.parseStorageData(result[helper.CHROME_STORAGE_KEY]);
			mStorageData = data;
			mEventManager.triggerEvent(data.actions);
			resolve(data.actions);
		});
	});
};
getStorageData().then(() => {
	// console.log('Resolved chrome storage data:', actions);
});

export const getCachedStorageData = () => mStorageData;
export const getCachedPageActions = () => mStorageData && mStorageData.actions;

/** @namespace chrome.storage.onChanged */
chrome.storage.onChanged.addListener(() => {
	// Force to refresh on data changes.
	// isFirstRender = true;
	// fnRearrangeLayout();
	getStorageData();
});

export const updateStorageData = (data) => {
	return new Promise((resolve) => {
		console.log('Updating storage data:', JSON.stringify(data));
		chrome.storage.sync.set({[helper.CHROME_STORAGE_KEY]: JSON.stringify(data)}, () => {
			// FIX-ME Resolve with the parsed action of on changed.
			resolve(data);
		});
	});
};

export const addOnStorageDataChangeListener = (listener) => {
	mEventManager.addListener(listener);
};

export const addTempOnStorageDataChangeListener = (listener) => {
	mEventManager.addTempListener(listener);
};

export const removeOnStorageDataChangeListener = (listener) => {
	mEventManager.removeListener(listener);
};

export const newPageAction = (action) => {
	if (action._id) {return Promise.reject(new Error('The given action already has an ID.'));}
	if (!mStorageData || !mStorageData.actions) {return Promise.reject(new Error('Sorry, the cached #mStorageData is not ready!'));}
	action._id = mStorageData.nextId++;
	mStorageData.actions.push(action);
	return updateStorageData(mStorageData).then(mStorageData => {
		return mStorageData.actions.find(item => item._id === action._id);
	});
};

export const updatePageAction = (actionId, patch) => {
	if (!mStorageData || !mStorageData.actions) {return Promise.reject(new Error('Sorry, the cached #mStorageData is not ready!'));}
	const action = mStorageData.actions.find(action => action._id === actionId);
	if (!action) {return Promise.reject(new Error('Expected action is not found!'));}
	Object.assign(action, patch);
	return updateStorageData(mStorageData).then(mStorageData => {
		return mStorageData.actions.find(item => item._id === action._id);
	});
};

export const deletePageAction = (actionId) => {
	if (!mStorageData || !mStorageData.actions) {return Promise.reject(new Error('Sorry, the cached #mStorageData is not ready!'));}
	// const index = mStorageData.actions.indexOf(actionId);
	let index = -1;
	let action;
	for (let i = 0; i < mStorageData.actions.length; i++) {
		if (mStorageData.actions[i]._id === actionId) {
			index = i;
			action = mStorageData.actions[i];
			break;
		}
	}
	if (index < 0) {return Promise.reject(new Error('Failed to find the selected action: ' + actionId));}
	mStorageData.actions.splice(index, 1);
	return updateStorageData(mStorageData).then(() => {
		return action;
	});
};
