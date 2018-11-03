'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';
import {h, render} from 'preact';
import * as ChromeStorageManager from '../DataManagers/ChromeStorageManager';
// import * as HtmlScriptLoader from './utils/HtmlScriptLoader';
// const interact = require('../extensions/chrome/interact.min');
// const INTERACT_SCRIPT_URL = 'https://unpkg.com/interactjs@1.3/dist/interact.min.js';
/** @namespace chrome.runtime.getURL */
const INTERACT_SCRIPT_URL = chrome.runtime.getURL('libs/interact.min.js');
import * as main from './interact-main.js';
import ConsoleLogger from '../helpers/ConsoleLogger';

// @see https://github.com/developit/preact
// Tell Babel to transform JSX into h() calls:
/** @jsx h */

const logger = new ConsoleLogger('content-script');
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
		if (!action.script) {return;}
		action = {...action};
		action.href = location.href;
		try {
			if (action.filter) {
				action.exp = action.filter.trim().replace(/\./g, '\\.').replace(/\*/g, '.*') + '.*';
				const reg = new RegExp(action.exp, 'i');
				if (!reg.test(action.href)) {return;}
				floatingButtonsActions.push(action);
			}
			action.output = eval(action.script);
		} catch (ex) {
			action.ex = ex;
		}
		executedActions.push(action);
	});

	fnRenderFloatingButtonDoms(floatingButtonsActions);

	return executedActions;
};

const fnRenderFloatingButtonDoms = (floatingButtonsActions) => {
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
			{floatingButtonsActions.map((action) => (
				<div
					key={action._id} className={main.CLASS_NAME_INTERACT_DRAGGABLE_BUTTONS}
					style={{
						display: 'inline-block', position: 'absolute',
						right: '24px', bottom: '24px',
						maxWidth: '50px', maxHeight: '50px', margin: '8px', padding: '8px',
						borderRadius: '5px', backgroundColor: '#ffab00', color: 'white',
						cursor: 'pointer', pointerEvents: 'auto',
					}}
					// onClick={() => eval(action.script)}
					// data-click-event={() => eval(action.script)}
					data-action-id={action._id}
				>
					<span style={{display: 'inline-block', width: '100%', height: '100%'}}>{action.buttonText}</span>
				</div>
			))}
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
