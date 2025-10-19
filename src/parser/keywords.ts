/**
 * VisualNovel
 * Battle {
 *   ch
 * }
 */



// A map of keywords and the accepted setting keys that go with them
export const keywords = new Map<string, string[]>();
keywords.set('VisualNovel', ['background']);
keywords.set('Battle', []);

const keywordsRegexStr = `^(${Array.from(keywords.keys()).join('|')})` +
    "\s?(\{(.*?)\n?\})?";

export const keywordsRegex = new RegExp(keywordsRegexStr, 'gms');