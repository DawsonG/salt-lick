import { marked } from "marked";
import { optionList, transclude, twineLink } from "./markedExtensions";

// Setup Markdown processing
marked.use({ 
    extensions: [twineLink, optionList, transclude]
});

const markedParse = async (input: string) => await marked.parse(input);

export default markedParse;