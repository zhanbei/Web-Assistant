'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';
import {h, render} from 'preact';
import FloatingIconButton from './FloatingIconButton';
import * as ChromeStorageManager from '../DataManagers/ChromeStorageManager';
import ConsoleLogger from '../helpers/ConsoleLogger';
// import * as HtmlScriptLoader from './utils/HtmlScriptLoader';
import * as main from './interact-main.js';

// @see https://github.com/developit/preact
// Tell Babel to transform JSX into h() calls:
/** @jsx h */

const logger = new ConsoleLogger('content-script');
// const interact = require('../extensions/chrome/interact.min');
// const INTERACT_SCRIPT_URL = 'https://unpkg.com/interactjs@1.3/dist/interact.min.js';
/** @namespace chrome.runtime.getURL */
const INTERACT_SCRIPT_URL = chrome.runtime.getURL('libs/interact.min.js');
logger.log('RESOLVED SCRIPT URL:', INTERACT_SCRIPT_URL);

ChromeStorageManager.addTempOnStorageDataChangeListener((actions) => {
	if (!actions || actions.length === 0) {return;}
	const outputs = fnExecutePageActions(actions);
	logger.debug('Executed actions:', outputs);
});

const fnExecutePageActions = (actions) => {
	if (!actions || actions.length === 0) {return;}
	const executedActions = [];
	const floatingButtonsActions = [];
	actions.map((action) => {
		if (!action.script || !action.enabled) {return;}
		action = {...action, output: ''};
		action.href = location.href;
		try {
			if (action.filter) {
				action.exp = action.filter.trim().replace(/\./g, '\\.').replace(/\*/g, '.*') + '.*';
				const reg = new RegExp(action.exp, 'i');
				if (!reg.test(action.href)) {return;}
			}
			if (action.passive) {action.output = eval(action.script);}
			if (action.proactive) {floatingButtonsActions.push(action);}
		} catch (ex) {
			action.ex = ex;
		}
		executedActions.push(action);
	});

	fnRenderFloatingButtonDoms(floatingButtonsActions);

	return executedActions;
};

const fnRenderFloatingButtonDoms = (floatingButtonsActions) => {
	if (!floatingButtonsActions || floatingButtonsActions.length === 0) {return;}
	// Use the first and probably the only action as the primary action.
	const mPrimaryAction = floatingButtonsActions[0];

	const holder = document.createElement('div');
	document.body.appendChild(holder);

	const actionsMap = new Map();
	floatingButtonsActions.map(action => actionsMap.set(`${action._id}`, action));

	render((
		<div style={{
			position: 'fixed',
			top: '0%', left: '0%', right: '0%', bottom: '0%',
			zIndex: 10000001, pointerEvents: 'none',
		}}>
			<FloatingIconButton
				key={mPrimaryAction._id}
				actionId={mPrimaryAction._id}
			/>
		</div>
	), holder);
	fnLoadInteractScript(actionsMap);
};

const fnLoadInteractScript = (actionsMap) => {
	// Environment of injection scripts and content scripts are separated.
	// @see https://stackoverflow.com/questions/20499994/access-window-variable-from-content-script
	// FIX-ME How to load script asynchronously and gently into current context/environment.
	// FIX-ME Thinking about using HtmlScriptLoader.loadScript(chrome.runtime.getURL('interact.min.js'))
	eval(`import('${INTERACT_SCRIPT_URL}')`).then(() => {
		if (!window.interact) {return logger.error('Failed to load the interact.js script.');}
		main.fnMakingButtonsFloat(actionsMap);
	}).catch(ex => {
		logger.error('Failed to load script:', ex);
	});
};
