import { QRState } from '../types';

export function saveStateToURL(state: QRState): void {
  try {
    const encoded = btoa(JSON.stringify(state));
    const url = new URL(window.location.href);
    url.hash = encoded;
    window.history.replaceState(null, '', url.toString());
  } catch (error) {
    console.error('Failed to save state to URL:', error);
  }
}

export function loadStateFromURL(): QRState | null {
  try {
    const hash = window.location.hash.slice(1); // Remove #
    if (!hash) return null;
    
    const decoded = atob(hash);
    const state = JSON.parse(decoded) as QRState;
    
    // Validate the loaded state
    if (isValidQRState(state)) {
      return state;
    }
  } catch (error) {
    console.error('Failed to load state from URL:', error);
  }
  
  return null;
}

function isValidQRState(state: any): state is QRState {
  return (
    state &&
    typeof state === 'object' &&
    state.config &&
    typeof state.config === 'object' &&
    typeof state.config.type === 'string' &&
    ['url', 'wifi', 'vcard'].includes(state.config.type) &&
    typeof state.config.size === 'number' &&
    typeof state.config.foregroundColor === 'string' &&
    typeof state.config.backgroundColor === 'string' &&
    typeof state.config.errorCorrectionLevel === 'string' &&
    ['L', 'M', 'Q', 'H'].includes(state.config.errorCorrectionLevel) &&
    typeof state.config.quietZone === 'number' &&
    state.data &&
    typeof state.data === 'object'
  );
}

export function clearURLState(): void {
  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState(null, '', url.toString());
}
