'use strict';

import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button/Button';

import SimpleEntityEditor from '../../mui-lib/SimpleEntityEditor/SimpleEntityEditor';
import AdvancedTextField from '../../mui-lib/AdvancedTextField/AdvancedTextField';

const muiStyles = require('./mui-styles');
const strings = require('./strings');
const utils = require('./utils');

const title = strings.title;
const _action = strings.action;
const mActionFields = [
	_action.name,
	_action.enabled,
	_action.description,
	_action.buttonText,
	_action.script,
	_action.filter,
];

class ExtensionOptions extends React.Component {
	state = {
		isCreatingAction: true,
		isReadyToCreate: false,
		isReadyToUpdate: false,
		action: {},
		patch: {},
	};

	onPatchChange = (patch) => {
		const {isCreatingAction} = this.state;
		const isReadyToCreate = isCreatingAction && utils.isValid(patch);
		const isReadyToUpdate = !isCreatingAction && utils.isValid(patch) && !utils.isEmpty({...patch});
		this.setState({
			isReadyToCreate: isReadyToCreate,
			isReadyToUpdate: isReadyToUpdate,
			// Update reference of the patch.
			patch: {...patch},
		});
	};

	onConfirm = () => {
		const {isCreatingAction, isReadyToCreate, action, patch} = this.state;
		if (!isReadyToCreate || !utils.isValid(patch)) {
			console.error('Not ready to create action:', action, patch);
			return;
		}
		if (isCreatingAction) {
			console.log('Ready to create action', action, patch);
		} else {
			console.log('Ready to update action:', action, patch);
		}
	};

	renderAppBar = () => {
		return (
			<AppBar>
				<Toolbar>
					<Typography variant="h6" color="inherit" style={{flex: 1}}>{title}</Typography>
				</Toolbar>
			</AppBar>
		);
	};

	renderAppBody = ({classes} = this.props, {isReadyToCreate, action, patch} = this.state) => {
		return (
			<div className={classes.mainContentWithPaddingHolder}>
				<Typography variant="h5" gutterBottom>{strings.titleActionEditor}</Typography>
				<SimpleEntityEditor
					onPatchChange={this.onPatchChange}
					entityFields={mActionFields}
					TextField={AdvancedTextField}
					targetEntity={action}
					entityPatch={patch}
				/>
				<Button
					variant="contained" color="primary"
					onClick={this.onConfirm}
					disabled={!isReadyToCreate}
				>
					{strings.buttonSaveAction}
				</Button>
			</div>
		);
	};

	render() {
		document.title = title;
		const {classes} = this.props;
		return (
			<div>
				{this.renderAppBar()}
				<div className={classes.toolbar}/>
				{this.renderAppBody()}
			</div>
		);
	}
}

export default withStyles(muiStyles)(ExtensionOptions);
