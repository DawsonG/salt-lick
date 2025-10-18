import './styles/main.css';
import './styles/visual-novel.css';

import OptionList from './components/OptionList';
import Passage from './components/Passage';
import { tagToStoryData } from './utils/tagHandlers';
import Game from './Game';

// Perform setup
// Decide dark mode
//let darkMode = true;
//if (!window.matchMedia("(prefers-color-scheme: dark)").matches) darkMode = false;//os preference
function load() {
    const storydatas = document.getElementsByTagName('tw-storydata');
    if (storydatas.length !== 1)
        throw new Error(`${storydatas.length} storydata tags found. The format or the file may be corrupted.`);
    const storydata = tagToStoryData(storydatas[0]);
    
    // Future actions: import special content sections

    return storydata;
}

// Load custom components
customElements.define('option-list', OptionList);
customElements.define('transclude-passage', Passage);

document.addEventListener('DOMContentLoaded', () => {
    // Load storydata
    const storydata = load();

    // Start the game
    new Game(storydata.startnode);
});
