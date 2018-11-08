# Web Assistant

<!--
```yaml
date: 2018-10-25T01:07:51+0800
titles:
    - Web Assistant
    - Page Assistant
```
-->

A Chrome extension to add custom buttons to execute custom scripts.

## Preferences

- [ ] Default Button Position: `right-bottom`.

## Button Types

Normally buttons may be added to web pages to trigger executing action script on button click.

- [ ] No Button
	- No button will be added when `action.button(s)` is `null/undefined`.
	- [ ] Normally will execute script on page loaded, and notice user if not.
- [ ] Fixed Buttons
	- [ ] How to organizing buttons(positions and styles).
- [ ] Floating Button
	- Page `1:1` Action
		- Currently, at most one icon button is allowed for one single page.
		- The extension icon will be used as the default button icon.
- [ ] Floating Buttons
	- [ ] How to organizing buttons(positions and styles).
- [ ] Dynamic Buttons
	- Add dynamic buttons to specified div.
- [ ] Extension Popover

## Scripts

## Actions

Define `Action` as the `Script` with its corresponding `Button(s)`.

## URL Filters

## Local Storage

- Pages(URL Filters) `n:n` Actions

## Entity

> The mark "`- [x]`" stands for required field while "`- [ ]`" stands for optional field.

Since it is a bit difficult to organize multiple buttons on one page, 
and to keep web pages clean and neat,
currently, one/zero floating button will be provided per page.

- [x] Name
- [x] Enabled `false`
- [x] Passive `true`
	- Execute Script on Page Load
- [ ] Description
- [x] Proactive `true`
	- Add a floating button to execute the script.
- [ ] Button
	- No Button
	- Fixed Button
		- [ ] Button Position
		- [ ] Button Icon/Text
		- [ ] Button Style
	- Floating Button
		- [ ] Button Icon
	- Dynamic Button
		- [ ] Container ID
		- [ ] Button Text
		- [ ] Button Style
- [ ] Buttons
	- [ ] Fixed Buttons
	- [ ] Floating Buttons
	- [ ] Dynamic Buttons
	- [x] Button Text
	- [x] Button Type
- [x] Script
- [ ] URL Filters

## Pages and Modules

@see `./documents/Pages-and-Modules.md`

- Extension Options
	- Actions Editor
	- [ ] Import and Export Actions
	- [ ] Extension Preferences
- [ ] Extension Icon Popover
	- URL Filters Editor
- Content Scripts
	- Action Loaders
- Data Manager
	- Chrome Storage

## References

- Chrome Extensions Development: https://developer.chrome.com/extensions
