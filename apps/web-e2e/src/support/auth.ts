import moment = require('moment');
import path = require('path');

export const backupFilename = () : string => {
  return `pubky_recovery_${moment().utc().format('YYYY-MM-DD')}.pkarr`
};

export const backupDownloadFilePath = (filename : string = backupFilename()) : string => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  return path.join(downloadsFolder, filename);
};