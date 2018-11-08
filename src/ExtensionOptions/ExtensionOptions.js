'use strict';

import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconMenu from '@material-ui/icons/Menu';

import AdvancedTextField from '../../mui-lib/AdvancedTextField/AdvancedTextField';
import FieldSwitch from '../../mui-lib/FieldSwitch/FieldSwitch';
import SimpleEntityEditor from '../../mui-lib/SimpleEntityEditor/SimpleEntityEditor';
import DialogToConfirm from '../../mui-lib/DialogToConfirm/DialogToConfirm';
import FieldCheckbox from '../../mui-lib/FieldCheckbox/FieldCheckbox';

import ConsoleLogger from '../helpers/ConsoleLogger';

const ChromeStorageManager = require('../DataManagers/ChromeStorageManager');

const muiStyles = require('./mui-styles');
const strings = require('./strings');
const utils = require('./utils');

const logger = new ConsoleLogger('ExtensionOptions');

const title = strings.title;
const _action = strings.action;
const mActionFields = [
	_action.name,
	_action.enabled,
	_action.passive,
	_action.description,
	_action.proactive,
	// _action.buttonText,
	_action.script,
	_action.filter,
];

class ExtensionOptions extends React.Component {
	static getDerivedStateFromProps(nextProps, prevState) {
		const actions = ChromeStorageManager.getCachedPageActions() || [];
		const {selectedActionId, selectedAction} = prevState;
		const action = selectedActionId ? actions.find(action => action._id === selectedActionId) : undefined;
		return {
			actions: ChromeStorageManager.getCachedPageActions(),
			// Reset the selected action since it may be deleted.
			selectedAction: action || selectedAction,
			selectedActionId: action ? action._id : undefined,
		};
	}

	state = {
		actions: ChromeStorageManager.getCachedPageActions(),

		navigatorMenuSwitch: false,

		// Empty object to create; valid action to update; null/undefined as unselected.
		selectedAction: null,
		selectedActionId: null,

		isCreatingAction: true,
		isReadyToCreate: false,
		isReadyToUpdate: false,

		patch: {},
	};

	componentDidMount() {
		ChromeStorageManager.addOnStorageDataChangeListener(this.onStorageDataChanged);
	};

	componentWillUnmount() {
		ChromeStorageManager.removeOnStorageDataChangeListener(this.onStorageDataChanged);
	}

	onStorageDataChanged = (_actions) => {
		const actions = ChromeStorageManager.getCachedPageActions() || [];
		logger.log('actions changed:', actions, _actions === actions);
		this.setState({
			actions: actions,
		});
	};

	doOpenNavigatorMenu = () => this.setState({navigatorMenuSwitch: true});
	doCloseNavigatorMenu = () => this.setState({navigatorMenuSwitch: false});

	onCreateAction = () => {
		this.setState({
			navigatorMenuSwitch: false,

			// Prepare to create a new action.
			selectedAction: {},
			selectedActionId: null,

			isCreatingAction: true,
			isReadyToCreate: false,
			isReadyToUpdate: false,

			patch: {},
		});
	};

	onDeleteAction = () => {
		this.setState({
			navigatorMenuSwitch: false,

			selectedAction: null,
			selectedActionId: null,

			isCreatingAction: true,
			isReadyToCreate: false,
			isReadyToUpdate: false,

			patch: {},
		});
	};

	onSelectAction = (actionId) => {
		const {actions, selectedActionId} = this.state;
		if (selectedActionId === actionId) {return;}
		if (!actionId) {return logger.warn('Received empty actionId:', actionId);}
		const action = actions.find((action) => action._id === actionId);
		if (!action) {return logger.warn('Failed to find the action by given actionId:', actionId);}

		this.setState({
			navigatorMenuSwitch: false,

			selectedAction: action,
			selectedActionId: actionId,

			isCreatingAction: false,
			isReadyToCreate: false,
			isReadyToUpdate: false,

			// Reset the patch for the newly selected action.
			patch: {},
		});
	};

	onPatchChange = (patch) => {
		const {isCreatingAction, selectedAction} = this.state;
		const isReadyToCreate = isCreatingAction && utils.isValid(patch);
		const isReadyToUpdate = !isCreatingAction && !utils.isEmpty(patch) && utils.isValid({...selectedAction, ...patch});
		this.setState({
			isReadyToCreate: isReadyToCreate,
			isReadyToUpdate: isReadyToUpdate,
			// Update reference of the patch.
			patch: {...patch},
		});
	};

	onConfirm = () => {
		const {isCreatingAction, isReadyToCreate, isReadyToUpdate, selectedAction, patch} = this.state;
		if (isCreatingAction) {
			if (!isReadyToCreate || !utils.isValid(patch)) {
				logger.error('Not ready to create action:', selectedAction, patch);
				return;
			}
			logger.log('Ready to create action', selectedAction, patch);
			ChromeStorageManager.newPageAction(patch).then((action) => {
				this.onSelectAction(action._id);
			});
			return;
		}

		// Updating an existed selectedAction.
		if (!isReadyToUpdate || utils.isEmpty(patch) || !utils.isValid({...selectedAction, ...patch})) {
			logger.error('Not ready to update action:', selectedAction, patch);
			return;
		}
		logger.log('Ready to update action:', selectedAction, patch);
		ChromeStorageManager.updatePageAction(selectedAction._id, patch).then((action) => {
			this.setState({
				isReadyToUpdate: false,
				selectedActionId: action._id,
				// FIX-ME Reconstruct the selectedAction?
				selectedAction: action,
				patch: {},
			});
		});
	};

	doDeleteAction = () => {
		const {isCreatingAction, isReadyToUpdate, selectedAction} = this.state;
		if (isCreatingAction || isReadyToUpdate) {return;}
		ChromeStorageManager.deletePageAction(selectedAction._id).then(action => {
			logger.log('Page Action Deleted:', action);
			this.onDeleteAction();
		});
	};

	renderAppBar = () => {
		return (
			<AppBar>
				<Toolbar>
					<Hidden mdUp>
						<IconButton color='inherit' onClick={this.doOpenNavigatorMenu}><IconMenu/></IconButton>
					</Hidden>
					<Typography variant='h6' color='inherit' style={{flex: 1}}>{title}</Typography>
				</Toolbar>
			</AppBar>
		);
	};

	renderAppBody = ({classes} = this.props) => {
		return (
			<div className={classes.mainContentWithPaddingHolder}>
				{this.renderEntityEditor()}
			</div>
		);
	};

	renderEntityEditor = ({classes} = this.props, {actions, isCreatingAction, isReadyToCreate, isReadyToUpdate, selectedAction, patch} = this.state) => {
		if (!selectedAction) {
			return (
				<div>
					<Typography variant='h4' gutterBottom>{strings.titleActionEditor}</Typography>
					<Typography variant='body1' style={{margin: '2em 4px'}}>
						{!actions || actions.length === 0 ? strings.noticeEmptyActions : strings.noticeNoSelectedAction}
					</Typography>
					<Hidden mdUp>
						{this.renderNavigatorMenu()}
					</Hidden>
				</div>
			);
		}
		if (isCreatingAction) {
			return (
				<div>
					<Typography variant='h4' gutterBottom>{strings.titleCreatingAction}</Typography>
					<SimpleEntityEditor
						onPatchChange={this.onPatchChange}
						entityFields={mActionFields}
						TextField={AdvancedTextField}
						Switch={FieldSwitch}
						Checkbox={FieldCheckbox}
						targetEntity={selectedAction}
						entityPatch={patch}
					/>
					<Button variant='contained' color='primary' onClick={this.onConfirm} disabled={!isReadyToCreate}>
						{strings.buttonDoCreateAction}
					</Button>
				</div>
			);
		}

		return (
			<div>
				<Typography variant='h4' gutterBottom>{patch.name || selectedAction.name || ''}</Typography>
				<SimpleEntityEditor
					onPatchChange={this.onPatchChange}
					entityFields={mActionFields}
					TextField={AdvancedTextField}
					Switch={FieldSwitch}
					Checkbox={FieldCheckbox}
					targetEntity={selectedAction}
					entityPatch={patch}
				/>
				<Button variant='contained' color='primary' onClick={this.onConfirm} disabled={!isReadyToUpdate}>
					{strings.buttonDoUpdateAction}
				</Button>
				<span style={{display: 'inline-block', width: '24px'}}/>
				<DialogToConfirm
					disabled={isReadyToUpdate}
					buttonProps={{variant: 'contained', color: 'primary'}}
					buttonText={strings.buttonOnDeleteAction}
					buttonCancelText={strings.buttonCancelDeletion}
					buttonConfirmText={strings.buttonDoDeleteAction}
					dialogTitle={strings.titleDialogDeleteAction}
					onConfirm={this.doDeleteAction}
				/>
			</div>
		);
	};

	renderTemporaryDrawer = ({classes} = this.props, {navigatorMenuSwitch} = this.state) => (
		<Hidden mdUp>
			<Drawer
				open={navigatorMenuSwitch}
				onClose={this.doCloseNavigatorMenu}
				// Better open performance on mobile.
				ModalProps={{keepMounted: true}}
				classes={{paper: classes.drawerHolder}}
			>
				<div className={classes.toolbar}/>
				{this.renderNavigatorMenu()}
			</Drawer>
		</Hidden>
	);

	renderLeftNavigator = ({classes} = this.props) => (
		<Hidden smDown implementation='css' className={classes.leftNavigationHolder}>
			{this.renderNavigatorMenu()}
		</Hidden>
	);

	renderNavigatorMenu = ({classes} = this.props, {actions, selectedActionId} = this.state) => (
		<div>
			<List subheader={<ListSubheader>{strings.titlePageActions}</ListSubheader>}>
				{actions ? actions.map(action => (
					<div
						key={action._id}
						className={action._id === selectedActionId ? classes.selectedItem : classes.unselectedItem}
					>
						<ListItem button onClick={() => this.onSelectAction(action._id)}>
							<ListItemText
								primary={action.name}
								primaryTypographyProps={{color: 'inherit', noWrap: true}}
								secondary={action.description || action.filter || action.buttonText || undefined}
								secondaryTypographyProps={{color: 'inherit', noWrap: true}}
							/>
						</ListItem>
					</div>
				)) : undefined}
			</List>
			<div style={{height: '24px'}}/>
			<Button variant='contained' color='primary' onClick={this.onCreateAction} style={{width: '92%', margin: '0 4%'}}>
				{strings.buttonOnCreateAction}
			</Button>
		</div>
	);
	//		<div className={selectedAction && !selectedAction._id ? classes.selectedItem : classes.unselectedItem}>
	// 			<ListItem button onClick={this.onCreateAction}>
	// 				<Typography color='inherit' variant='subtitle1'>{strings.buttonOnCreateAction}</Typography>
	// 			</ListItem>
	// 		</div>

	render() {
		document.title = title;
		const {classes} = this.props;
		return (
			<div className={classes.pageHolder}>
				{this.renderAppBar()}
				{this.renderTemporaryDrawer()}
				<div className={classes.toolbar}/>
				<div className={classes.bodyHolder}>
					{this.renderLeftNavigator()}
					<div className={classes.contentHolder}>
						<div className={classes.mainContentHolder}>
							{this.renderAppBody()}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withStyles(muiStyles)(ExtensionOptions);
