export default function dayString () {
    const DATE = new Date();
    const TODAY = DATE.getDay();
  
    // switch(TODAY) {
    //   case 0: return 'sunday'; break;
    //   case 1: return 'monday'; break;
    //   case 2: return 'tuesday'; break;
    //   case 3: return 'wednesday'; break;
    //   case 4: return 'thursday'; break;
    //   case 5: return 'friday'; break;
    //   case 6: return 'saturday'; break;
    // };

    const values = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday', 
      5: 'friday',
      6: 'saturday'
    };

    return values[TODAY];
  };