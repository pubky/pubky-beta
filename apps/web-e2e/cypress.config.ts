import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

import { rmdir, unlink, rename } from 'fs';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, { cypressDir: 'src' }),
    baseUrl: 'http://localhost:4200',
    defaultCommandTimeout: process.env.CI ? 30_000 : 4000,
    video: true,
    viewportWidth: 1920,
    viewportHeight: 1080,

    // Plugins

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, _config) {
      on('task', {
        // task to delete a folder
        deleteFolder(folderName) {
          console.log('deleting folder %s', folderName)

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return new Promise((resolve, _reject) => {
            rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
              if (err) {
                console.error(err)
              }
              resolve(null)
            })
          })
        },

      // task to delete a file
      deleteFile(filePath) {
        console.log('deleting file %s', filePath);

        return new Promise((resolve, reject) => {
          unlink(filePath, (err) => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            resolve(null);
          });
        });
      },

      // Task to rename a file
      renameFile({ fromPath, toPath }) {
        console.log('renaming file from %s to %s', fromPath, toPath);

        return new Promise((resolve, reject) => {
          rename(fromPath, toPath, (err) => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            resolve(null);
          });
        });
      },
      });
    }
  },
});
