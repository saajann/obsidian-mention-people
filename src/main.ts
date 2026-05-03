import { Plugin } from 'obsidian';
import { PeopleManager } from './people-manager';
import { PeopleSuggest } from './people-suggest';
import { PeopleSettingTab } from './settings';
import { DEFAULT_SETTINGS, PeoplePluginSettings } from './types';

export default class PeoplePlugin extends Plugin {
	settings: PeoplePluginSettings;
	peopleManager: PeopleManager;

	async onload() {
		await this.loadSettings();
		this.peopleManager = new PeopleManager(this.app, this.settings);
		this.registerEditorSuggest(new PeopleSuggest(this.app, this));
		this.addSettingTab(new PeopleSettingTab(this.app, this));
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.peopleManager.settings = this.settings;
	}
}