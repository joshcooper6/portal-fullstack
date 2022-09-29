const timeString = (insertdate, afternoonCutoff) => {
    const TIME = insertdate.getHours();

    if (TIME < afternoonCutoff) {
        return 'morning'
    } else if (TIME >= afternoonCutoff) {
        return 'afternoon'
    };
};

module.exports = timeString

