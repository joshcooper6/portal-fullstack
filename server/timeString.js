const timeString = (insertdate) => {
    const TIME = insertdate.toLocaleTimeString();
    const MORNING = TIME.includes('AM');
    const AFTERNOON = TIME.includes('PM');
    
    if (MORNING) {
        return 'morning'
    } else if (AFTERNOON) {
        return 'afternoon'
    };
};

module.exports = timeString