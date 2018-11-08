# Extension Options

<!-- > 2018-11-07T16:23:26+0800 -->

The #Options page to manage #Preferences, #Actions, and etc.

## Outlines

- App Bar
- Actions Editor
	- Action Editor
		- Action Buttons Editor
		- URL Filters Editor
- [ ] Import and Export Actions
- [ ] Extension Preferences

## TO DO

- [ ] Add #Switch to edit `action.enabled`.
- [ ] Add #Selection to edit `action.button.type`.

## Actions Editor

The page should be responsive and mobile compatible and hence the #Action-Editor.

### 1. Actions Editor with Navigator

- Navigator/Menus of Actions
- Editor of the Selected Action
- Editor to Create Action

### 2. Actions Editor with #Pages-and-Routes

- Primary Page
	- List of Actions
- Secondary Page
	- Editor of the Selected Action
- Secondary Page
	- Editor to Create Action

## Action Editor

- Title
	- Creating Page Action
	- `${action.name}`
- Actions
	- Create Action
	- ~~Abort~~

### 1. Regular Action Editor with `#Array-Field-Editor` Supporting Single/Multiple #Button(s)

- Regular Fields
- List to Edit Fields of Array of Entities

### 2. Regular Action Editor with `#Entity-Editor-Dialog` Supporting Single/Multiple #Button(s)

- Regular Fields
- Dialog to Edit Fields of Array of Entities

### 3. Action Editor with `#Steppers` Supporting Single #Button `[Selected]`

Mostly often, one button for each button type will be enough for most use cases and more further, one button for each action should be just fine, currently.

- Step 1
	- Regular Fields
	- Actions
		- Back `[disabled]`
		- Next
		- ~~Abort~~
- Step 2
	- Entity Editor of `action.buttons[0]`
	- Actions
		- Back
		- Create Action `[primary]`
		- ~~Abort~~

### 4. Action Editor with #Pages

- Primary Page
	- List of Action Buttons together with other Action Fields
- Secondary Page
	- Entity Editor of Selected Action Button
	- Entity Editor to Create Action Button

## URL Filters Editor

URL Filter can be raw #RegExp or simplified URL filter.

Use `#Array(-of-Entities)-Editor`.

## Import and Export Actions

Import and export actions from and to JSON file.

## Extension Preferences

@see `./documents/Extension-Preferences.md`.
