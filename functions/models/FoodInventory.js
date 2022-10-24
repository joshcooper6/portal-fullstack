const Mongoose = require('mongoose');
const FoodSchema = new Mongoose.Schema({
    "id": {
        type: String,
        unique: true,
        required: [true, 'Please provide an "id"!']
    },
    "name": {
        type: String,
        minLength: 1,
        required: [true, 'Please prov"id"e a "name"!']
    },
    "vendor": {
        type: String,
        required: [true, 'Please prov"id"e a "vendor"!']
    },
    "positions": {
        type: Object,
        default: {},
        required: [true, "Please provide group/subgroup/listPosition for this element."]
    },
    "rotating":{
        type: Boolean,
        default: false
    },
    "sunday": {
        type: Object,
        default: {
            morning: false,
            afternoon: false
        }
    },
    "monday": {
        type: Object,
        default: {
            morning: false,
            afternoon: false
        }
    },
    "tuesday": {
        type: Object,
        default: {
            morning: false,
            afternoon: false
        }
    },
    "wednesday": {
        type: Object,
        default: {
            morning: false,
            afternoon: false
        }
    },
    "thursday": {
        type: Object,
        default: {
            morning: false,
            afternoon: false
        }
    },
    "friday": {
        type: Object,
        default: {
            morning: false,
            afternoon: false
        }
    },
    "saturday": {
        type: Object,
        default: {
            morning: false,
            afternoon: false
        }
    },
}, {
    timestamps: true
});

const Food = Mongoose.model("food", FoodSchema)
module.exports = Food     

// const food = {
//     sunriseWraps: {
//         "id": "sunriseWraps",
//         "name": 'Sunrise Wraps',
//         "vendor": 'catapult,
//         "group": 'artisan1',
//     },
//     turkeyBacon: {
//         "id": "turkeyBacon",
//         "name": 'Turkey Bacon Croissant',
//         "vendor": 'catapult,
//         daysNeeded: ['hell', ''],
//         "group": 'artisan1',
//     },
//     hangryVegan: {
//         "id": "hangryVegan",
//         "name": 'Hangry Vegan',
//         "vendor": 'catapult,
//         "group": 'artisan1',
//     },
//     lumberjack: {
//         "id": "lumberjack",
//         "name": 'Lumberjack',
//         "vendor": 'catapult,
//         "group": 'artisan1',
//     },
//     rotatingLunch: {
//         "id": "rotatingLunch",
//         "name": 'Smoky Chicken Melt',
//         "vendor": 'catapult,
//         "group": 'artisan1',
//     },
//     proteinPack: {
//         "id": "proteinPack",
//         "name": 'Veggie Packs',
//         "vendor": 'catapult,
//         "group": 'artisan2',
//     },
//     vegetarianSandwich: {
//         "id": "vegetarianSandwich",
//         "name": 'Treehugger',
//         "vendor": 'catapult,
//         "group": 'artisan2',
//     },    
//     baconMelts: {
//         "id": "baconMelts",
//         "name": 'Bacon Melts',
//         "vendor": 'catapult,
//         "group": 'artisan2',
//     },
//     sausageMelts: {
//         "id": "sausageMelts",
//         "name": 'Sausage Melts',
//         "vendor": 'catapult,
//         "group": 'artisan2',
//     },
//     sausageBagels: {
//         "id": "sausageBagels",
//         "name": 'Sausage Bagels',
//         "vendor": 'catapult,
//         "group": 'misc1',
//     },
//     chevyBagel: {
//         "id": "chevyBagel",
//         "name": 'Chevy Bagels',
//         "vendor": 'catapult,
//         "group": 'misc1',
//     },
//     plainBagel: {
//         "id": "plainBagel",
//         "name": 'Plain Bagels',
//         "vendor": 'catapult,
//         "group": 'misc1',
//     },
//     morningGlory: {
//         "id": "morningGlory",
//         "name": 'Morning Glory Muffin',
//         "vendor": "macrina",
//         "group": "misc2",
//     },
//     blueberryScone: {
//         "id": "blueberryScone",
//         "name": 'Blueberry Scone',
//         "vendor": "macrina",
//         "group": "misc2",
//     },
//     rotatingScone: {
//         "id": "rotatingScone",
//         "name": 'Orange Current Scone',
//         "vendor": "macrina",
//         "group": "misc2",
//     },
//     squashBread: {
//         "id": "squashBread",
//         "name": 'Squash Bread',
//         "vendor": "macrina",
//         "group": 'squash',
//     },
//     baconCroissant: {
//         "id": "baconCroissant",
//         "name": 'Bacon Croissant',
//         "vendor": "rila",
//         "group": "savoryCroissant",
//     },
//     mushroomCroissant: {
//         "id": "mushroomCroissant",
//         "name": 'Mushroom Croissant',
//         "vendor": "rila",
//         "group": "savoryCroissant",
//     },
//     peanutBars: {
//         "id": "peanutBars", 
//         "name": 'PB Bars',
//         "vendor": "catapult",
//         "group": "glutenFree",
//     },
//     hamQuiche: {
//         "id": "hamQuiche",
//         "name": 'Ham Quiche',
//         "vendor": 'finales',
//         "group": 'quiche',
//     },
//     spinachQuiche: {
//         "id": "spinachQuiche",
//         "name": 'Spinach Quiche',
//         "vendor": 'finales',
//         "group": 'quiche',
//         boxes: '',
//         slices: '',
//     },
//     meatEmpanada: {
//         "id": "meatEmpanada",
//         "name": 'Ham Empanada',
//         "vendor": "marialuisa",
//         "group": "empanadas",

//     },
//     vegEmpanada: {
//         "id": "vegEmpanada",
//         "name": 'Spinach Empanada',
//         "vendor": "marialuisa",
//         "group": "empanadas",
//     },
//     veganCCCookie: {
//         "id":"veganCCCookie",
//         "name": 'PNW CC Cookies',
//         "vendor": 'pnw',
//         "group": "glutenFree",
//     },
//     veganRotatingCookie: {
//         "id": "veganRotatingCookie",
//         "name": 'PNW Snickerdoole Cookies',
//         "vendor": 'pnw',
//         "group": "glutenFree",
//     },
//     caramelJugs: {
//         "id": "caramelJugs",
//         "name": 'Caramel Jugs',
//         "vendor": "crafted",
//         "group": "crafted",
//     },
//     craftedCCCookies: {
//         "id": "craftedCCCookies",
//         "name": 'CC Cookies',
//         "vendor": "crafted",
//         "group": "crafted",
//     },
//     craftedCOTM: {
//         "id": "craftedCOTM",
//         "name": 'PBJ Cookies',
//         "vendor": "crafted",
//         "group": "crafted",
//     },
//     krispies: {
//         "id": "krispies",
//         "name": 'Krispies',
//         "vendor": "crafted",
//         "group": "crafted",
//     },
//     tartlet: {
//         "id": "tartlet",
//         "name": 'Tartlet',
//         "vendor": "crafted",
//         "group": "crafted",
//     },
// }
