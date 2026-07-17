const { contextBridge, ipcRenderer } = require('electron');

// Expose a window.storage compatible with the web app, backed by a real file on disk.
contextBridge.exposeInMainWorld('storage', {
  get: async (key) => {
    const raw = await ipcRenderer.invoke('storage:get');
    if (!raw) return null;
    try {
      const all = JSON.parse(raw);
      return (all && key in all) ? { key, value: all[key] } : null;
    } catch (e) { return null; }
  },
  set: async (key, value) => {
    const raw = await ipcRenderer.invoke('storage:get');
    let all = {};
    try { all = raw ? JSON.parse(raw) : {}; } catch (e) { all = {}; }
    all[key] = value;
    await ipcRenderer.invoke('storage:set', JSON.stringify(all));
    return { key, value };
  }
});

// Window controls for the widget/full + always-on-top buttons.
contextBridge.exposeInMainWorld('appctl', {
  getAutoLaunch: () => ipcRenderer.invoke('autolaunch:get'),
  setAutoLaunch: (v) => ipcRenderer.invoke('autolaunch:set', v)
});

contextBridge.exposeInMainWorld('phone', {
  send: (topic, title, body) => ipcRenderer.invoke('ntfy:send', topic, title, body)
});

contextBridge.exposeInMainWorld('focusWin', {
  toggleOnTop: () => ipcRenderer.invoke('window:toggleOnTop'),
  isOnTop: () => ipcRenderer.invoke('window:isOnTop'),
  toggleWidget: () => ipcRenderer.invoke('window:toggleWidget'),
  isWidget: () => ipcRenderer.invoke('window:isWidget')
});
