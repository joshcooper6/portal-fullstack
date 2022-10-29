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

    const merged = [...groups.artisan, '', ...groups.misc, '', ...groups.crafted,  ...groups.squash, '', ...groups.savoryCroissant, '', ...groups.glutenFree, '', ...groups.quiche, '', ...groups.empanadas];

    return merged;
};