import { App, PluginSettingTab, Setting } from 'obsidian';
import type PeoplePlugin from './main';

export class PeopleSettingTab extends PluginSettingTab {
	plugin: PeoplePlugin;

	constructor(app: App, plugin: PeoplePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		new Setting(containerEl).setName('People plugin').setHeading();

		new Setting(containerEl)
			.setName('People folder')
			.setDesc('Vault folder where person notes are stored. Created automatically on first use.')
			.addText((text) =>
				text
					.setPlaceholder('PEOPLE')
					.setValue(this.plugin.settings.peopleFolder)
					.onChange(async (value) => {
						this.plugin.settings.peopleFolder = value.trim() || 'PEOPLE';
						await this.plugin.saveSettings();
					})
			);
	}
}