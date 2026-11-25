/** Session lifetime defined in SECURITY.md §6.4 (30 days, refreshed while the user is active). */
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

/** How often an active session is refreshed (once per day). */
export const SESSION_UPDATE_AGE_SECONDS = 24 * 60 * 60;
