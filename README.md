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

- [ ] No Button
	- Execute script on page loaded.
- [ ] Fixed Buttons
- [ ] Floating Button
- [ ] Floating Buttons
- [ ] Dynamic Buttons
	- Add dynamic buttons to specified div.
- [ ] Extension Popover

## Scripts

## Actions

Define `Action` as the `Script` with its corresponding `Button(s)`.

## URL Filters

## Local Storage

- Action 1:n URL Filters

## Entity

> The mark "`- [x]`" stands for required field while "`- [ ]`" stands for optional field.

- [x] Name
- [x] Enabled `false`
- [ ] Passive `true`
	- Execute Script on Page Load
- [ ] Description
- [ ] Buttons
	- [x] Button Text
	- [x] Button Type
- [x] Script
- [ ] URL Filters

## Pages and Modules

@see `./documents/Pages-and-Modules.md`

- Extension Options
	- Actions Editor
- [ ] Extension Icon Popover
	- URL Filters Editor
- Content Scripts
	- Action Loaders
- Data Manager
	- Chrome Storage

## References

- Chrome Extensions Development: https://developer.chrome.com/extensions
