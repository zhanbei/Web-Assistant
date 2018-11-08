'use strict';

import {h, Component} from 'preact';
import PropTypes from 'prop-types';
import * as main from './interact-main.js';

/** @jsx h */

const URL_ICON_PNG = chrome.runtime.getURL('icon.png');

class FloatingIconButton extends Component {
	render({actionId}) {
		return (
			<div
				className={main.CLASS_NAME_INTERACT_DRAGGABLE_BUTTONS}
				style={{
					display: 'inline-block', position: 'absolute',
					right: '24px', bottom: '24px',
					width: '48px', height: '48px',
					backgroundImage: `url(${URL_ICON_PNG})`, backgroundSize: 'contain',
					cursor: 'pointer', pointerEvents: 'auto',
				}}
				// onClick={() => eval(action.script)}
				// data-click-event={() => eval(action.script)}
				data-action-id={actionId}
			>
			</div>
		);
	}
}

FloatingIconButton.propTypes = {
	actionId: PropTypes.any.isRequired,
};

export default FloatingIconButton;
