declare namespace Cypress {
  interface Chainable<Subject> {
    signOut(hasBackedUp: HasBackedUp): Chainable<void>;
    signIn(backupFilepath: string, passcode?: string): Chainable<void>;
    onboardAsNewUser(
      profileName: string,
      profileBio?: string,
      skipOnboardingSlides?: SkipOnboardingSlides,
      pubkyAlias?: string
    ): Chainable<void>;
    backupRecoveryFile(passcode?: string): Chainable<void>;
    deleteDownloadsFolder(): Chainable<void>;
    waitForFileExistsWithSuffix(folder: string, suffix: string): Chainable<void>;
    deleteFile(filePath: string): Chainable<void>;
    renameFile(fromPath: string, toPath: string): Chainable<void>;
    innerTextShouldEq(text: string): Chainable<Subject>;
    innerTextShouldContain(text: string): Chainable<Subject>;
    innerTextContains(text: string): Chainable<Subject>;
    innerTextShouldNotContain(text: string): Chainable<Subject>;
    innerTextShouldNotEq(text: string): Chainable<Subject>;
    saveCopiedPubkyToAlias(alias: string): Chainable<void>;
    saveCopiedTextToAlias(alias: string): Chainable<void>;
    waitReload(time?: number): Chainable<void>;
    waitReloadWhileElementDoesNotExist(selector: string, attempts?: number): Chainable<void>;
    findPostInBookmarks(postIdx: number, expectedCount?: number): Chainable<JQuery<HTMLElement>>;
    countPostsInBookmarks(expectedCount: number): Chainable<void>;
    findFirstPostInFeed(checkIndexed?: CheckIndexed): Chainable<JQuery<HTMLElement>>;
    findFirstPostInFeedFiltered(filterText: string, checkIndexed?: CheckIndexed): Chainable<JQuery<HTMLElement>>;
    findPostInFeed(postIdx?: number, filterText?: string, checkIndexed?: CheckIndexed): Chainable<JQuery<HTMLElement>>;
    mockInviteCodeApi(): Chainable<void>;
  }
}
