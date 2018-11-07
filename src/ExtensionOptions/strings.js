'use strict';

const defaultOptions = {
	required: false,
	type: 'string',
	fullWidth: true,
	margin: 'dense',
	multiline: false,
	autoComplete: 'off',
};

const types = {
	NoButton: 'Execute on Page Loaded',
	FixedButton: 'Fixed Button',
	FloatingButton: 'Floating Button',
	DynamicButton: 'Dynamic Button',
	ExtensionPopover: 'Extension Popover',
};
const BUTTON_TYPES = [];

for (const key in types) {
	BUTTON_TYPES.push({name: key, value: types[key]});
}

module.exports = {
	title: 'Options - Web Assistant',
	// titleHtml: 'Options - Web Assistant',
	titleActionEditor: 'Action Editor',
	titleCreatingAction: 'Creating Page Action',
	titlePageActions: 'Page Actions',
	buttonOnCreateAction: 'Create Action',
	buttonDoCreateAction: 'Create Action',
	buttonDoUpdateAction: 'Save Changes',
	titleDialogDeleteAction: 'Delete this page action?',
	buttonOnDeleteAction: 'Delete Action',
	buttonDoDeleteAction: 'Do Delete',
	buttonCancelDeletion: 'Cancel',
	noticeEmptyActions: 'No valid action(s) found, and you may create new actions now.',
	noticeNoSelectedAction: 'No action is selected, and you may select an action or create new actions.',
	buttonExportActions: 'Export Existing Actions',

	// The requirements of fields should be consistent with the validators in ./utils.
	action: {
		name: {
			...defaultOptions,
			id: 'name',
			required: true,
			label: 'Name',
			placeholder: 'The action name!',
			getErrorText: (value) => (!value || !value.trim()) ? `The action name cannot be empty.` : null,
		},
		enabled: {
			id: 'enabled',
			// @see https://material-ui.com/demos/selection-controls/
			// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
			// @see https://material-ui.com/api/checkbox/
			type: 'switch',
			label: 'Enabled',
			// placeholder: 'Whether the action is enabled!',
		},
		// Whether to execute script on page load.
		passive: {
			id: 'passive',
			// @see https://uxplanet.org/checkbox-vs-toggle-switch-7fc6e83f10b8
			type: 'checkbox',
			label: 'Execute Script on Page Load',
			// placeholder: 'Whether to execute script on page load!',
		},
		description: {
			...defaultOptions,
			id: 'description',
			label: 'Description',
			placeholder: 'The action description!',
		},

		buttonType: {
			...defaultOptions,
			id: 'buttonType',
			required: true,
			label: 'Button Type',
			placeholder: 'The label for the action button!',
			values: BUTTON_TYPES,
			default: types.NoButton,
			getErrorText: (value) => (!value || !value.trim()) ? `The button type for the action cannot be empty.` : null,
		},
		buttonText: {
			...defaultOptions,
			id: 'buttonText',
			required: true,
			label: 'Button Label',
			placeholder: 'The label for the action button!',
			getErrorText: (value) => (!value || !value.trim()) ? `The label for the action button cannot be empty.` : null,
		},

		script: {
			...defaultOptions,
			id: 'script',
			required: true,
			label: 'Script',
			placeholder: 'The action script to be executed!',
			getErrorText: (value) => (!value || !value.trim()) ? `The action script cannot be empty.` : null,
			multiline: true,
			rows: '12',
		},
		filter: {
			...defaultOptions,
			id: 'filter',
			label: 'URL Filter',
			placeholder: 'The URL filter, you may use "*.example.com" to match all sites of example.com',
		},
	},
};

