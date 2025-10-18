export const capitalize = (input: string) => input.charAt(0).toUpperCase() + input.slice(1);
  
export const titleCase = (title: string) => title.toLowerCase().split(" ").map((word: string, i: number) => {
    // ignore certain words if they aren't the first word
    if (["a", "an", "to", "the", "of"].includes(word) && i > 0) return word;

    return capitalize(word);
}).join(" ");

export const parseOutQuotes = (str: string): string => {
    if (!isWrappedInQuotes(str)) {
        return str;
    }

    return str.substring(1, str.length-1);
};

export const isWrappedInQuotes = (str: string) => {
    if (typeof str !== 'string' || str.length < 2) {
        return false; // Not a string, or too short to be wrapped
    }
    return (str.startsWith('"') && str.endsWith('"')) ||
        (str.startsWith("'") && str.endsWith("'"));
};