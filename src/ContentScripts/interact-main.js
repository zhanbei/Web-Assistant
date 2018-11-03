'use strict';

import ConsoleLogger from '../helpers/ConsoleLogger';
import DocumentTextSelectionUtil from '../utils/DocumentTextSelectionUtil.js';

export const CLASS_NAME_INTERACT_DRAGGABLE_BUTTONS = 'interact-draggable-buttons';
const KEY_DATA_IS_DRAGGING = 'data-is-dragging';
// const KEY_DATA_CLICK_EVENT = 'data-click-event';
// const KEY_DATA_SCRIPT = 'data-script';
const KEY_DATA_ACTION_ID = 'data-action-id';
const STYLE_CURSOR_MOVE = 'move';
const STYLE_CURSOR_POINTER = 'pointer';

const logger = new ConsoleLogger('interact-main');

export const fnMakingButtonsFloat = (mActionsMap) => {
	if (!window.interact) {return logger.error('Failed to load the interact.js script.');}
	// @see http://interactjs.io/
	// target elements with the "draggable" class
	window.interact(`.${CLASS_NAME_INTERACT_DRAGGABLE_BUTTONS}`).on('click', event => {
		const target = (event.target.className || '').includes(CLASS_NAME_INTERACT_DRAGGABLE_BUTTONS) ?
			event.target : event.target.parentNode;

		const isDragging = target.getAttribute(KEY_DATA_IS_DRAGGING);
		const actionId = target.getAttribute(KEY_DATA_ACTION_ID);
		// Handled the real click event and reset the dragging flag.
		target.setAttribute(KEY_DATA_IS_DRAGGING, 'false');

		if (JSON.parse(isDragging)) {
			// logger.log('NOT executing the click event.');
		} else {
			if (actionId) {
				const action = mActionsMap.get(actionId);
				if (!action) {
					logger.warn('Failed to find the expected action by action._id attached with dom:', mActionsMap, actionId);
				} else if (!action.script) {
					logger.warn('Empty script found of the expected action:', action, action.script);
				} else {
					const out = eval(action.script);
					logger.debug('Executed action script:', out);
				}
			} else {
				logger.warn('No script to be executed found:', actionId);
			}
		}
		// event.stopPropagation();
		// event.stopImmediatePropagation();
		// , {capture: true}
	}).draggable({
		// enable inertial throwing
		inertia: true,
		// keep the element within the area of it's parent
		restrict: {
			restriction: 'parent',
			endOnly: true,
			elementRect: {top: 0, left: 0, bottom: 1, right: 1},
		},
		// enable autoScroll
		autoScroll: true,
		onstart: (event) => {
			const target = event.target;
			// logger.log('started dragging.', event.target === target);
			target.setAttribute(KEY_DATA_IS_DRAGGING, 'true');
			target.style.cursor = STYLE_CURSOR_MOVE;
		},
		// call this function on every dragmove event
		onmove: (event) => {
			const target = event.target;
			// keep the dragged position in the data-x/data-y attributes
			const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
			const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
			// translate the element
			target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
			// update the position attributes
			target.setAttribute('data-x', x);
			target.setAttribute('data-y', y);
			event.preventDefault();
		},
		// call this function on every dragend event
		onend: function (event) {
			const target = event.target;
			target.style.cursor = STYLE_CURSOR_POINTER;
			// logger.log('dragging ended.');
			// event.preventDefault();
			// event.stopPropagation();
		},
	});

	/* Enable/Disable Text Selection of Document */

	document.querySelectorAll(`.${CLASS_NAME_INTERACT_DRAGGABLE_BUTTONS}`).forEach(node => {
		// @see https://www.w3schools.com/jsref/event_onmousedown.asp
		node.addEventListener('mousedown', (event) => {
			// logger.log('----->>>> Now disabling selection.');
			DocumentTextSelectionUtil.disableTextSelection();
		});
		node.addEventListener('mouseup', (event) => {
			DocumentTextSelectionUtil.enableTextSelection();
			// logger.log('----->>>> Now re-enabled selection.');
		});
	});
};
