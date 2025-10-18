export type IStoryData = {
    ifid: string;
    name: string;
    startnode: number;
    creator: string;
    creatorVersion: string;
    format: string;
    formatVersion: string;
    options: string;
    tags: string;
    zoom: number;
    hidden: string;
};

export const tagToStoryData = (tag: Element): IStoryData => ({
    ifid: tag.getAttribute('ifid')!,
    name: tag.getAttribute('name')!,
    startnode: parseInt(tag.getAttribute('startnode') || '1'),
    creator: tag.getAttribute('creator') || 'you',
    creatorVersion: tag.getAttribute('creator-version') || '1.0.0',
    format: tag.getAttribute('format')!,
    formatVersion: tag.getAttribute('format-version')!,
    options: tag.getAttribute('options') || '',
    tags: tag.getAttribute('tags') || '',
    zoom: parseFloat(tag.getAttribute('zoom') || '1'),
    hidden: tag.getAttribute('hidden') || '',
});


export type IPassage = {
    pid: number; // unique
    name: string; // should be unique
    tags?: string[];
    position?: string; // We don't really care about this
    size?: string; // or this
    textContent: string; // we care a LOT about this
};

export const tagToPassage = (tag: Element): IPassage => ({
    pid: parseInt(tag.getAttribute('pid')!),
    name: tag.getAttribute('name')!,
    tags: tag.getAttribute('tags')?.split(','),
    position: tag.getAttribute('position') || '',
    size: tag.getAttribute('size') || '',
    textContent: tag.textContent,
});