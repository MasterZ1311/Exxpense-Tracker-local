/** FinTrack Pro — Bank Profiles Registry */

import { indianBankProfiles } from './india/index.js';
import { worldBankProfiles } from './world/index.js';

/** All 20 supported bank profiles */
export const allBankProfiles = [...indianBankProfiles, ...worldBankProfiles];

/**
 * Find a bank profile by its ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getProfileById(id) {
  return allBankProfiles.find(p => p.id === id);
}

/**
 * Find bank profiles matching any of the given signature strings.
 * @param {string} text - Text to search for signatures in
 * @returns {{ profile: object, confidence: number }[]}
 */
export function detectProfileFromText(text) {
  const upperText = text.toUpperCase();
  const matches = [];
  for (const profile of allBankProfiles) {
    for (const sig of profile.signatures) {
      if (upperText.includes(sig.toUpperCase())) {
        matches.push({ profile, confidence: 0.8 });
        break;
      }
    }
  }
  return matches;
}

export { indianBankProfiles } from './india/index.js';
export { worldBankProfiles } from './world/index.js';
