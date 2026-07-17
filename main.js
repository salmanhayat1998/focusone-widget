const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const DATA_FILE = path.join(app.getPath('userData'), 'focusone-data.json');
function readData() { try { return fs.readFileSync(DATA_FILE, 'utf8'); } catch (e) { return null; } }
function writeData(str) { try { fs.writeFileSync(DATA_FILE, str, 'utf8'); return true; } catch (e) { return false; } }

let win = null;
let isWidget = false;
const FULL = { width: 700, height: 820 };
const WIDGET = { width: 330, height: 320 };

function baseOpts(extra) {
  return Object.assign({
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false },
    icon: path.join(__dirname, 'icon.png')
  }, extra);
}

function createFull() {
  const w = new BrowserWindow(baseOpts({
    width: FULL.width, height: FULL.height, minWidth: 300, minHeight: 260,
    title: 'FocusOne', backgroundColor: '#faf8f2', frame: true, transparent: false
  }));
  w.loadFile('index.html');
  return w;
}

function createWidget() {
  const disp = screen.getPrimaryDisplay().workAreaSize;
  const opts = baseOpts({
    width: WIDGET.width, height: WIDGET.height,
    x: disp.width - WIDGET.width - 20, y: 20,
    frame: false, resizable: true, alwaysOnTop: true, skipTaskbar: false,
    roundedCorners: true, hasShadow: true
  });
  // Native Windows blur (acrylic) — real frosted glass that samples the desktop.
  if (process.platform === 'win32') {
    opts.backgroundMaterial = 'acrylic';
    opts.backgroundColor = '#00000000';
    opts.transparent = false;
  } else {
    opts.transparent = true;
    opts.backgroundColor = '#00000000';
    opts.vibrancy = 'under-window';
  }
  const w = new BrowserWindow(opts);
  w.setAlwaysOnTop(true, 'screen-saver');
  w.loadFile('index.html', { query: { widget: '1' } });
  return w;
}

function recreate(toWidget) {
  const old = win;
  isWidget = toWidget;
  win = toWidget ? createWidget() : createFull();
  if (old && !old.isDestroyed()) old.destroy();
}

function createWindow() { win = createFull(); }

ipcMain.handle('storage:get', () => readData());
ipcMain.handle('storage:set', (e, str) => writeData(str));

ipcMain.handle('window:toggleOnTop', () => { const n = !win.isAlwaysOnTop(); win.setAlwaysOnTop(n, 'screen-saver'); return n; });
ipcMain.handle('window:isOnTop', () => win.isAlwaysOnTop());

ipcMain.handle('window:toggleWidget', () => { recreate(!isWidget); return isWidget; });
ipcMain.handle('window:isWidget', () => isWidget);

ipcMain.handle('autolaunch:get', () => { try { return app.getLoginItemSettings().openAtLogin; } catch(e){ return false; } });
ipcMain.handle('autolaunch:set', (e, enable) => { try { app.setLoginItemSettings({ openAtLogin: !!enable }); return app.getLoginItemSettings().openAtLogin; } catch(err){ return false; } });

ipcMain.handle('ntfy:send', (e, topic, title, body) => {
  return new Promise((resolve) => {
    if (!topic) { resolve({ ok:false, error:'no topic' }); return; }
    const data = Buffer.from(body || '', 'utf8');
    const safeTitle = (title || 'FocusOne').replace(/[\r\n]/g,' ').replace(/[^\x20-\x7E]/g,'');
    const req = https.request({
      hostname: 'ntfy.sh', path: '/' + encodeURIComponent(topic), method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': data.length, 'Title': safeTitle, 'Priority': 'high' }
    }, (res) => { let b=''; res.on('data',(d)=>b+=d); res.on('end', ()=>resolve({ ok: res.statusCode>=200 && res.statusCode<300, status: res.statusCode, body: b.slice(0,300) })); });
    req.on('error', (err) => resolve({ ok:false, error: String(err) }));
    req.write(data); req.end();
  });
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
