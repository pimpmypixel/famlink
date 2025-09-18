/**
 * Cookie utilities for managing onboarding session persistence
 */

export const ONBOARDING_SESSION_COOKIE = 'famlink_onboarding_session';
export const ONBOARDING_SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export interface OnboardingSessionData {
  sessionId: string;
  lastActivity: number;
  progress: {
    answered: number;
    total: number;
    currentQuestionKey?: string;
  };
}

/**
 * Set onboarding session cookie
 */
export function setOnboardingSession(sessionId: string, progress?: OnboardingSessionData['progress']): void {
  const sessionData: OnboardingSessionData = {
    sessionId,
    lastActivity: Date.now(),
    progress: progress || { answered: 0, total: 0 },
  };

  const expires = new Date(Date.now() + ONBOARDING_SESSION_EXPIRY);
  document.cookie = `${ONBOARDING_SESSION_COOKIE}=${encodeURIComponent(JSON.stringify(sessionData))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Get onboarding session from cookie
 */
export function getOnboardingSession(): OnboardingSessionData | null {
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(cookie => cookie.trim().startsWith(`${ONBOARDING_SESSION_COOKIE}=`));

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split('=')[1])) as OnboardingSessionData;

    // Check if session is expired
    if (Date.now() - sessionData.lastActivity > ONBOARDING_SESSION_EXPIRY) {
      clearOnboardingSession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Failed to parse onboarding session cookie:', error);
    clearOnboardingSession();
    return null;
  }
}

/**
 * Clear onboarding session cookie
 */
export function clearOnboardingSession(): void {
  document.cookie = `${ONBOARDING_SESSION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Update session activity timestamp
 */
export function updateSessionActivity(sessionId: string, progress?: OnboardingSessionData['progress']): void {
  const existingSession = getOnboardingSession();
  if (existingSession && existingSession.sessionId === sessionId) {
    setOnboardingSession(sessionId, progress || existingSession.progress);
  }
}