// Utility to get page titles from their metadata
// This ensures consistency between the actual page titles and what we restore

// Route to title mapping - sourced from page metadata
export const routeTitleMap: Record<string, string> = {
  '/home': 'Home | Pubky.app',
  '/hot': 'Hot | Pubky.app',
  '/search': 'Search | Pubky.app',
  '/bookmarks': 'Bookmarks | Pubky.app',
  '/settings': 'Settings | Pubky.app',
  '/profile': 'Profile | Pubky.app',
  '/profile/following': 'Following | Pubky.app',
  '/profile/followers': 'Followers | Pubky.app',
  '/profile/friends': 'Friends | Pubky.app',
  '/profile/tagged': 'Tagged as | Pubky.app',
  '/who-to-follow': 'Who to Follow | Pubky.app',
  '/onboarding': 'Onboarding | Pubky.app',
  '/onboarding/intro': 'Intro | Pubky.app',
  '/onboarding/sign-up': 'SignUp | Pubky.app',
  '/onboarding/sign-in': 'SignIn | Pubky.app',
  '/onboarding/register': 'Register | Pubky.app',
  '/onboarding/pubky': 'Pubky | Pubky.app',
  '/onboarding/confirm': 'Confirm | Pubky.app',
  '/sign-in': 'SignIn | Pubky.app'
};

/**
 * Get the title for a given route from the page metadata
 * @param pathname - The current pathname
 * @returns The title for the route, or undefined if not found
 */
export function getPageTitle(pathname: string): string | undefined {
  return routeTitleMap[pathname];
}
