import { tagToPassage, type IPassage } from "./tagHandlers";
import { isNumber } from "./types";

export const loadPassage = (passageName: string | number): IPassage => {
    const passage = document
            .querySelector(`tw-passagedata[${isNumber(passageName) ? 'pid=' : 'name='}'${passageName}']`);
    if (!passage) {
        throw new Error(`No passage with the name ${passageName}`)
    }
    return tagToPassage(passage);
}