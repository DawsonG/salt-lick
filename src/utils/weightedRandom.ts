export type WeightedItem<T> = {
  item: T;
  weight: number;
};

/*
const items: WeightedItem[] = [
  { name: 'Common Item', weight: 70 },
  { name: 'Uncommon Item', weight: 20 },
  { name: 'Rare Item', weight: 10 },
];
*/

export const weightedRandom = <T>(randomTable: WeightedItem<T>[]): T => {
    const totalWeight = randomTable.reduce((sum, item) => sum + item.weight, 0);
    const randomNumber = Math.random() * totalWeight; // use Math.random() as a percent of
                                                      // the total weight
    let cumulativeWeight = 0;
    for (const item of randomTable) {
        cumulativeWeight += item.weight;
        if (randomNumber < cumulativeWeight) {
            return item.item;
        }
    }

    throw new Error("Something went wrong with weighted random");
}