export default function resultInOrder (array) {
    const groups = {
        artisan: array.filter((number) => number.positions.group === 'artisan'),
        misc: array.filter((number) => number.positions.group === 'misc'),
        squash: array.filter((number) => number.positions.group === 'squash'),
        savoryCroissant: array.filter((number) => number.positions.group === 'savoryCroissant'),
        glutenFree: array.filter((number) => number.positions.group === 'glutenFree'),
        quiche: array.filter((number) => number.positions.group === 'quiche'),
        empanadas: array.filter((number) => number.positions.group === 'empanadas'),
    };

    const group = [
        'artisan',
        'misc',
        'squash',
        'savoryCroissant',
        'glutenFree',
        'quiche',
        'empanadas'
    ]

    const mapObject = (variable) => {
        if (groups?.[variable].length > 0) {
            return groups?.[variable].map((num) => {
                return `\n${num.name} = ${num.currentTotal}`
            }).join(' ')
        };
    };

    const text = `${group.map((string) => {
           return mapObject(string)
        }).join('\n')}`;

    return text;
};