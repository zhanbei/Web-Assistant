'use strict';

const muiStyles = require('../resources/MuiStyles');

module.exports = theme => {
	const styles = muiStyles(theme);
	return {
		pageHolder: styles.pageHolder,
		drawerHolder: styles.drawerHolder,
		toolbar: styles.toolbar,
		leftNavigationHolder: styles.leftNavigationHolder,
		bodyHolder: styles.bodyHolder,
		contentHolder: styles.contentHolder,
		mainContentHolder: styles.mainContentHolder,
		mainContentWithPaddingHolder: styles.mainContentWithPaddingHolder,

		selectedItem: Object.assign(
			{'&:hover': {background: theme.palette.secondary.dark}},
			{color: 'white'},
			{background: theme.palette.secondary.dark},
		),
		unselectedItem: {},
	};
};
