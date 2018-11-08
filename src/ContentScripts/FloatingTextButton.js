'use strict';

import {h, Component} from 'preact';
import PropTypes from 'prop-types';
import * as main from './interact-main.js';

/** @jsx h */

class FloatingTextButton extends Component {
	render({label, actionId}) {
		return (
			<div
				className={main.CLASS_NAME_INTERACT_DRAGGABLE_BUTTONS}
				style={{
					display: 'inline-block', position: 'absolute',
					right: '24px', bottom: '24px',
					maxWidth: '50px', maxHeight: '50px', margin: '8px', padding: '8px',
					borderRadius: '5px', backgroundColor: '#ffab00', color: 'white',
					cursor: 'pointer', pointerEvents: 'auto',
				}}
				// onClick={() => eval(action.script)}
				// data-click-event={() => eval(action.script)}
				data-action-id={actionId}
			>
				<span style={{display: 'inline-block', width: '100%', height: '100%'}}>{label}</span>
			</div>
		);
	}
}

FloatingTextButton.propTypes = {
	label: PropTypes.string.isRequired,
	actionId: PropTypes.any.isRequired,
};

export default FloatingTextButton;
