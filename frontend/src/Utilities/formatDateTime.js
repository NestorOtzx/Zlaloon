import React from 'react';

export default function formatDateTime(dateString) {
    const now = new Date();
    const givenDate = new Date(dateString);
  
    // Ensure both times are in GMT-0
    const nowGMT = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
    );
    const givenDateGMT = new Date(
      Date.UTC(givenDate.getUTCFullYear(), givenDate.getUTCMonth(), givenDate.getUTCDate(), givenDate.getUTCHours(), givenDate.getUTCMinutes(), givenDate.getUTCSeconds())
    );
  
    // Calculate the time difference in milliseconds
    const timeDifference = nowGMT - givenDateGMT;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  
    if (timeDifference < 60 * 1000) {
      return `${secondsDifference} s`; 
    } else if (timeDifference < 60 * 60 * 1000) {
      return `${minutesDifference} min`;
    } else if (timeDifference <= 24 * 60 * 60 * 1000) {
      return `${hoursDifference} hour`;
    }
  
    // Format the date as /day/month/year
    const day = String(givenDateGMT.getUTCDate()).padStart(2, '0');
    const month = String(givenDateGMT.getUTCMonth() + 1).padStart(2, '0');
    const year = givenDateGMT.getUTCFullYear();
  
    return `${day}/${month}/${year}`;
}
