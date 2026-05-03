import { App, normalizePath, TFile, TFolder } from 'obsidian';
import type { PeoplePluginSettings } from './types';

export class PeopleManager {
    private app: App;
    settings: PeoplePluginSettings;

    constructor(app: App, settings: PeoplePluginSettings) {
        this.app = app;
        this.settings = settings;
    }

    private get folderPath(): string {
        return normalizePath(this.settings.peopleFolder);
    }

    private getPeopleFolder(): TFolder | null {
        const node = this.app.vault.getAbstractFileByPath(this.folderPath);
        return node instanceof TFolder ? node : null;
    }

    getPeopleNames(): string[] {
        const folder = this.getPeopleFolder();
        if (!folder) return [];
        return folder.children
            .filter((f): f is TFile => f instanceof TFile && f.extension === 'md')
            .map((f) => f.basename);
    }

    async createPerson(name: string): Promise<TFile> {
        if (!this.app.vault.getAbstractFileByPath(this.folderPath)) {
            await this.app.vault.createFolder(this.folderPath);
        }
        const filePath = normalizePath(`${this.folderPath}/${name}.md`);
        const existing = this.app.vault.getAbstractFileByPath(filePath);
        if (existing instanceof TFile) return existing;
        return await this.app.vault.create(filePath, '');
    }
}