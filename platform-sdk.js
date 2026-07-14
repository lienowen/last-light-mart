/* Cross-platform web-game SDK adapter. CrazyGames is the primary target; Poki is supported when its SDK is injected by the host. */
(() => {
  const state = { provider: 'none', ready: false, gameplay: false, adPlaying: false };
  let audioWasSuspended = false;

  function detectProvider() {
    if (window.CrazyGames?.SDK) return 'crazygames';
    if (window.PokiSDK) return 'poki';
    return 'none';
  }

  function setAdVisual(active) {
    state.adPlaying = active;
    document.body.classList.toggle('platform-ad-playing', active);
  }

  function muteGameForAd(muted) {
    try {
      if (typeof releaseRain !== 'undefined' && releaseRain?.gain && typeof releaseAudio !== 'undefined' && releaseAudio) {
        releaseRain.gain.gain.setTargetAtTime(muted ? 0 : .02, releaseAudio.currentTime, .08);
      }
      if (typeof releaseAudio !== 'undefined' && releaseAudio) {
        if (muted && releaseAudio.state === 'running') {
          audioWasSuspended = true;
          releaseAudio.suspend().catch(() => {});
        } else if (!muted && audioWasSuspended && releasePrefs?.sound) {
          audioWasSuspended = false;
          releaseAudio.resume().catch(() => {});
        }
      }
    } catch {}
  }

  function crazyAvailable() {
    return state.provider === 'crazygames' && window.CrazyGames?.SDK?.environment !== 'disabled';
  }

  async function init() {
    state.provider = detectProvider();
    try {
      if (state.provider === 'crazygames') {
        await window.CrazyGames.SDK.init();
        const game = window.CrazyGames.SDK.game;
        game.loadingStop?.();
        const applySettings = settings => {
          if (settings?.muteAudio && typeof releasePrefs !== 'undefined') {
            releasePrefs.sound = false;
            if (typeof stopRain === 'function') stopRain();
            if (typeof updateSoundButton === 'function') updateSoundButton();
          }
        };
        applySettings(game.settings);
        game.addSettingsChangeListener?.(applySettings);
      } else if (state.provider === 'poki') {
        await window.PokiSDK.init().catch(() => {});
        window.PokiSDK.gameLoadingFinished?.();
      }
    } catch (error) {
      console.warn('[Last Light Platform] SDK initialization fallback', error);
    }
    state.ready = true;
    window.dispatchEvent(new CustomEvent('lastlight:platform-ready', { detail: { ...state } }));
    return state;
  }

  function gameplayStart(context = {}) {
    state.gameplay = true;
    try {
      if (crazyAvailable()) {
        window.CrazyGames.SDK.game.gameplayStart();
        if (Object.keys(context).length) window.CrazyGames.SDK.game.setGameContext?.(context);
      } else if (state.provider === 'poki') {
        window.PokiSDK.gameplayStart?.();
      }
    } catch {}
  }

  function gameplayStop() {
    if (!state.gameplay) return;
    state.gameplay = false;
    try {
      if (crazyAvailable()) {
        window.CrazyGames.SDK.game.gameplayStop();
        window.CrazyGames.SDK.game.clearGameContext?.();
      } else if (state.provider === 'poki') {
        window.PokiSDK.gameplayStop?.();
      }
    } catch {}
  }

  async function midgame() {
    gameplayStop();
    if (crazyAvailable()) {
      return new Promise(resolve => {
        let started = false;
        window.CrazyGames.SDK.ad.requestAd('midgame', {
          adStarted: () => { started = true; setAdVisual(true); muteGameForAd(true); },
          adFinished: () => { setAdVisual(false); muteGameForAd(false); resolve(started); },
          adError: () => { setAdVisual(false); muteGameForAd(false); resolve(false); }
        });
      });
    }
    if (state.provider === 'poki') {
      try {
        await window.PokiSDK.commercialBreak?.(() => { setAdVisual(true); muteGameForAd(true); });
        return true;
      } catch {
        return false;
      } finally {
        setAdVisual(false); muteGameForAd(false);
      }
    }
    return false;
  }

  async function rewarded() {
    gameplayStop();
    if (crazyAvailable()) {
      return new Promise(resolve => {
        window.CrazyGames.SDK.ad.requestAd('rewarded', {
          adStarted: () => { setAdVisual(true); muteGameForAd(true); },
          adFinished: () => { setAdVisual(false); muteGameForAd(false); resolve(true); },
          adError: () => { setAdVisual(false); muteGameForAd(false); resolve(false); }
        });
      });
    }
    if (state.provider === 'poki') {
      try {
        const success = await window.PokiSDK.rewardedBreak?.({
          size: 'medium',
          onStart: () => { setAdVisual(true); muteGameForAd(true); }
        });
        return success === true;
      } catch {
        return false;
      } finally {
        setAdVisual(false); muteGameForAd(false);
      }
    }
    return false;
  }

  function canRewarded() {
    return crazyAvailable() || state.provider === 'poki';
  }

  function reportProgress(percent) {
    try {
      if (crazyAvailable()) window.CrazyGames.SDK.game.reportGameCompletedPercentage?.(Math.max(0, Math.min(100, percent)));
    } catch {}
  }

  function happyTime() {
    try { if (crazyAvailable()) window.CrazyGames.SDK.game.happytime?.(); } catch {}
  }

  window.LastLightPlatform = { state, init, gameplayStart, gameplayStop, midgame, rewarded, canRewarded, reportProgress, happyTime };
  init();
})();
