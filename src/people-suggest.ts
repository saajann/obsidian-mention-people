import {
    App,
    Editor,
    EditorPosition,
    EditorSuggest,
    EditorSuggestContext,
    EditorSuggestTriggerInfo,
} from 'obsidian';
import type PeoplePlugin from './main';

const QUERY_RE = /@([\w ]*)$/;

export class PeopleSuggest extends EditorSuggest<string> {
    private plugin: PeoplePlugin;

    constructor(app: App, plugin: PeoplePlugin) {
        super(app);
        this.plugin = plugin;
        this.limit = 10;
    }

    onTrigger(cursor: EditorPosition, editor: Editor): EditorSuggestTriggerInfo | null {
        const line = editor.getLine(cursor.line);
        if (!line) return null;
        const lineUpToCursor = line.substring(0, cursor.ch);
        const match = QUERY_RE.exec(lineUpToCursor);
        if (!match || !match[1]) return null;
        return {
            start: { line: cursor.line, ch: lineUpToCursor.lastIndexOf('@') },
            end: cursor,
            query: match[1].trim(),
        };
    }

    getSuggestions(context: EditorSuggestContext): string[] {
        const query = context.query.toLowerCase();
        const people = this.plugin.peopleManager.getPeopleNames();

        // With empty query show all people, otherwise filter
        const matches =
            query.length === 0
                ? [...people]
                : people.filter((name) => name.toLowerCase().includes(query));

        // Always offer to create if the query doesn't match exactly
        if (!people.some((n) => n.toLowerCase() === query)) {
            if (query.length > 0) matches.push(`+ Create "${context.query}"`);
        }

        return matches;
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        const isCreate = value.startsWith('+ Create "');
        const wrapper = el.createDiv({ cls: 'people-suggest-item' });
        wrapper.createSpan({ cls: 'people-suggest-icon', text: isCreate ? '👤' : '@' });
        wrapper.createSpan({
            cls: isCreate ? 'people-suggest-label people-suggest-create' : 'people-suggest-label',
            text: value,
        });
    }

    selectSuggestion(value: string, _evt: MouseEvent | KeyboardEvent): void {
        void this.handleSuggestion(value);
    }

    private async handleSuggestion(value: string): Promise<void> {
        const { context } = this;
        if (!context) return;
        let name: string;
        if (value.startsWith('+ Create "')) {
            const match = value.match(/\+ Create "(.+)"/);
            if (!match || !match[1]) return;
            name = match[1];
            await this.plugin.peopleManager.createPerson(name);
        } else {
            name = value;
        }
        const folder = this.plugin.settings.peopleFolder;
        context.editor.replaceRange(`[[${folder}/${name}|@${name}]]`, context.start, context.end);
    }
}