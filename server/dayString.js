const dayString = (insertdate) => {
    const DATE = insertdate;
    const TODAY = DATE.getDay();
  
    switch(TODAY) {
      case 0:
        return 'sunday';
        break;
      case 1:
        return 'monday';
        break;
      case 2:
        return 'tuesday';
        break;
      case 3:
        return 'wednesday';
        break;
      case 4:
        return 'thursday';
        break;
      case 5:
        return 'friday';
        break;
      case 6:
        return 'saturday';
        break;
    }
  };
  
module.exports = dayString