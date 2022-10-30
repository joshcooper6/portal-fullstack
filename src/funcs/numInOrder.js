export default function numInOrder(array) {
    const groups = {
        artisan: array.filter((number) => number.positions.group === 'artisan'),
        misc: array.filter((number) => number.positions.group === 'misc'),
        crafted: array.filter((number) => number.vendor === 'crafted'),
        squash: array.filter((number) => number.positions.group === 'squash'),
        savoryCroissant: array.filter((number) => number.positions.group === 'savoryCroissant'),
        glutenFree: array.filter((number) => number.positions.group === 'glutenFree'),
        quiche: array.filter((number) => number.positions.group === 'quiche'),
        empanadas: array.filter((number) => number.positions.group === 'empanadas'),
    };

    const artisan1 = groups.artisan.slice(0, 5);
    const artisan2 = groups.artisan.slice(5);
    const misc1 = groups.misc.slice(0, 3);
    const misc2 = groups.misc.slice(3);

    const merged = [...artisan1, '', ...artisan2, '', ...misc1, '', ...misc2, '',  ...groups.crafted,  ...groups.squash, '', ...groups.savoryCroissant, '', ...groups.glutenFree, '', ...groups.quiche, '', ...groups.empanadas];

    return merged;
};