import { readdirSync, rmdir, unlink, rename } from 'fs';

export const setupCypressTasks = (on: Cypress.PluginEvents) => {
  on('task', {
    deleteFolder(folderName: string) {
      console.log('deleting folder %s', folderName);
      return new Promise((resolve, _reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err) {
            console.error(err);
          }
          resolve(null);
        });
      });
    },

    deleteFile(filePath: string) {
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

    renameFile({ fromPath, toPath }: { fromPath: string; toPath: string }) {
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

    checkFileExistsWithSuffix({ folder, suffix }: { folder: string; suffix: string }) {
      const files = readdirSync(folder);
      const matchedFile = files.find((file) => file.endsWith(suffix));
      return !!matchedFile;
    }
  });
}; 