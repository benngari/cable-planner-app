// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Camera, Network, Cable, Home as HomeIcon, FileSpreadsheet, 
  Sun, Moon, CircleDot, Cpu, Lightbulb, ArrowRight, Download, 
  Settings, Printer, MonitorPlay, Server, Cloud, 
  HardDrive, Zap, ChevronDown, Wrench, Calculator, Globe, 
  Ruler, Plus, Trash2, MapPin, User, Monitor, 
  ClipboardCheck, ShoppingCart, Layers, Tag, Video, CheckSquare, 
  Image as ImageIcon, Activity, AlertTriangle, Table, Info, ShieldCheck, ShieldAlert, Sparkles, Palette, Wallet, RefreshCw
} from 'lucide-react';

const CATALOG = {
  dvrs: { hik4: { name: 'Hikvision 4-Ch DVR', price: 5700 }, hik8: { name: 'Hikvision 8-Ch DVR', price: 8500 } },
  nvrs: { hik4: { name: 'Hikvision 4-Ch NVR', price: 8500 }, hik8: { name: 'Hikvision 8-Ch NVR', price: 12500 } },
  cameras: {
    analogBullet: { name: 'Analog Bullet', price: 1700, type: 'Analog', shape: 'Bullet', desc: 'Best for outdoor perimeters.' },
    analogDome: { name: 'Analog Dome', price: 1600, type: 'Analog', shape: 'Dome', desc: 'Best for indoor ceilings.' },
    ipBullet: { name: 'IP Bullet (PoE)', price: 4500, type: 'IP', shape: 'Bullet', desc: 'High-res outdoor camera.' },
    ipDome: { name: 'IP Dome (PoE)', price: 4300, type: 'IP', shape: 'Dome', desc: 'High-res indoor/outdoor.' }
  },
  storage: { hdd500: { name: '500GB HDD', price: 3100 }, hdd1tb: { name: '1TB HDD', price: 5500 } },
  accessories: { psu: { name: 'Power Supply', price: 1500 }, rg59: { name: 'RG59 Cable /m', price: 20 }, cat6: { name: 'Cat6 Cable /m', price: 65 }, connectors: { name: 'Connectors', price: 250 } },
  labor: { diy: { name: 'Supply Only', price: 0 }, basic: { name: 'Basic Install', price: 4500 } },
  cabling: { cat6Box: { name: 'Cat6 Box (305m)', price: 19500 }, keystone: { name: 'Keystone', price: 150 }, faceplate: { name: 'Faceplate', price: 200 }, patchPanel: { name: '24-Port Panel', price: 4500 }, patchCord: { name: 'Patch Cord', price: 450 }, laborPerDrop: 1500 }
};

const defaultState = {
  clientName: '', clientPhone: '',
  systemType: 'Analog', cameraShape: 'Bullet', quantity: 4, cableLength: 50, selectedStorage: 'hdd500', lensType: '3.6',
  cabDevices: [], poeCams: 4, poeAps: 2, voltLength: 50, voltAmps: 0.5, runRooms: 5, runFloors: 1,
  isInvoice: false, depositPaid: 0
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 
  const [showClientView, setShowClientView] = useState(false);

  // --- STATE WITH LOCALSTORAGE AUTO-SAVE ---
  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem('cableiq_data');
    return saved ? JSON.parse(saved) : defaultState;
  });

  // Helper to update specific state keys
  const updateData = (key, value) => setAppData(prev => ({ ...prev, [key]: value }));

  // Auto-save effect
  useEffect(() => {
    localStorage.setItem('cableiq_data', JSON.stringify(appData));
  }, [appData]);

  const businessInfo = { name: 'Ngari Tech Solutions', phone: '0711645837', mpesa: 'Paybill 400200' };

  // Auto-update selected camera when systemType or cameraShape changes
  const selectedCameraKey = `${appData.systemType === 'Analog' ? 'analog' : 'ip'}${appData.cameraShape}`;
  const selectedCamera = CATALOG.cameras[selectedCameraKey];

  // Theme
  const isLight = theme === 'light';
  const isDark = theme === 'dark';
  const isBlack = theme === 'black';
  const bgMain = isLight ? 'bg-gray-50' : isDark ? 'bg-gray-900' : 'bg-black';
  const textMain = isLight ? 'text-gray-900' : 'text-gray-100';
  const textMuted = isLight ? 'text-gray-500' : isDark ? 'text-gray-400' : 'text-gray-500';
  const bgCard = isLight ? 'bg-white border-gray-200' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-[#0a0a0a] border-[#222]';
  const bgInput = isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-[#111] border-[#333] text-white';
  const bgButton = isLight ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#222] text-white hover:bg-[#333]';

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  // --- PRICE CALCULATIONS ---
  const camPrice = selectedCamera.price * appData.quantity;
  const recorderPrice = appData.systemType === 'Analog' ? CATALOG.dvrs.hik4.price : CATALOG.nvrs.hik4.price;
  const storagePrice = CATALOG.storage[appData.selectedStorage].price;
  const cablePrice = appData.cableLength * (appData.systemType === 'Analog' ? CATALOG.accessories.rg59.price : CATALOG.accessories.cat6.price);
  const accPrice = appData.systemType === 'Analog' ? (CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price) : 0;
  const laborPrice = CATALOG.labor.basic.price;
  const totalCCTV = camPrice + recorderPrice + storagePrice + cablePrice + accPrice + laborPrice;

  const balanceDue = totalCCTV - appData.depositPaid;

  const calculateCabling = () => {
    const ports = appData.cabDevices.length;
    const rawLength = appData.cabDevices.reduce((sum, d) => sum + d.length, 0);
    const lengthWithWaste = rawLength * 1.15;
    const boxes = Math.ceil(lengthWithWaste / 305) || 0;
    const patchPanels = Math.ceil(ports / 24) || 0;
    const cost = (boxes * CATALOG.cabling.cat6Box.price) + (ports * CATALOG.cabling.keystone.price) + (ports * CATALOG.cabling.faceplate.price) + (patchPanels * CATALOG.cabling.patchPanel.price) + (ports * CATALOG.cabling.patchCord.price) + (ports * CATALOG.cabling.laborPerDrop);
    return { ports, lengthWithWaste, boxes, patchPanels, cost };
  };
  const cabTotals = calculateCabling();

  const handleDownloadPDF = (containerId, filename) => {
    const element = document.getElementById(containerId);
    html2pdf().set({ margin: 0.5, filename: filename, html2canvas: { scale: 2, useCORS: true } }).from(element).save();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textMain}`}>
      {/* HEADER */}
      <header className={`sticky top-0 z-50 border-b ${isLight ? 'bg-white border-gray-200' : isDark ? 'bg-gray-900 border-gray-800' : 'bg-black border-[#222]'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => setCurrentView('welcome')} className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl"><Cable className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className={`text-2xl font-bold ${isBlack ? 'text-white' : 'text-blue-600'}`}>CableIQ</h1>
              <p className={`text-xs ${textMuted}`}>Engineer Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl ${bgButton}`}><HomeIcon className="w-5 h-5" /></button>
            <div className="relative">
              <button onClick={() => setShowThemeMenu(!showThemeMenu)} className={`px-4 py-2 rounded-xl flex items-center space-x-2 font-medium ${bgButton}`}>
                {isLight ? <Sun className="w-5 h-5 text-orange-500" /> : isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <CircleDot className="w-5 h-5 text-gray-300" />}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showThemeMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-50 ${bgCard}`}>
                  <button onClick={() => { setTheme('light'); setShowThemeMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Light Mode</button>
                  <button onClick={() => { setTheme('dark'); setShowThemeMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Dark Mode</button>
                  <button onClick={() => { setTheme('black'); setShowThemeMenu(false); }} className="w-full text-left px-4 py-3 text-sm border-t hover:bg-gray-100 dark:hover:bg-gray-700">AMOLED Black</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* ================= WELCOME ================= */}
        {currentView === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div onClick={() => setCurrentView('cctv-planner')} className={`cursor-pointer p-6 rounded-2xl border hover:border-orange-500 ${bgCard}`}>
              <Camera className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">CCTV Configurator</h3>
              <p className={`text-sm ${textMuted}`}>Quote systems, view FOV coverage, and run setup wizards.</p>
            </div>
            <div onClick={() => setCurrentView('cabling-planner')} className={`cursor-pointer p-6 rounded-2xl border hover:border-blue-500 ${bgCard}`}>
              <Network className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cabling Planner</h3>
              <p className={`text-sm ${textMuted}`}>Calculate Cat6 boxes and generate printable cable labels.</p>
            </div>
            <div onClick={() => setCurrentView('tools')} className={`cursor-pointer p-6 rounded-2xl border hover:border-green-500 ${bgCard}`}>
              <Wrench className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Engineer Tools</h3>
              <p className={`text-sm ${textMuted}`}>PoE, Voltage Drop, and Subnet Planner.</p>
            </div>
          </div>
        )}

        {/* ================= CCTV CONFIGURATOR ================= */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Client Info */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><User className="w-5 h-5 text-blue-500" /> <span>Client Info</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Client Name</label><input type="text" value={appData.clientName} onChange={e => updateData('clientName', e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`} placeholder="e.g. John Doe" /></div>
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Phone</label><input type="text" value={appData.clientPhone} onChange={e => updateData('clientPhone', e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`} placeholder="0712345678" /></div>
                </div>
              </div>

              {/* System Config */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Settings className="w-5 h-5 text-blue-500" /> <span>System Configuration</span></h3>
                
                <div className="flex space-x-4 mb-6">
                  <button onClick={() => updateData('systemType', 'Analog')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.systemType === 'Analog' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : `border-transparent ${bgInput}`}`}>Analog (DVR)</button>
                  <button onClick={() => updateData('systemType', 'IP')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.systemType === 'IP' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>IP (NVR)</button>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button onClick={() => updateData('cameraShape', 'Bullet')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.cameraShape === 'Bullet' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>Bullet Shape</button>
                  <button onClick={() => updateData('cameraShape', 'Dome')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.cameraShape === 'Dome' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>Dome Shape</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Quantity</label><input type="number" value={appData.quantity} onChange={e => updateData('quantity', Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Cable (m)</label><input type="number" value={appData.cableLength} onChange={e => updateData('cableLength', Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                  <div>
                    <label className={`text-xs mb-1 ${textMuted}`}>Storage</label>
                    <select value={appData.selectedStorage} onChange={e => updateData('selectedStorage', e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`}>
                      <option value="hdd500">500GB HDD</option>
                      <option value="hdd1tb">1TB HDD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* FOV & Camera Advice */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Video className="w-5 h-5 text-purple-500" /> <span>Camera Coverage & Advice</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <select value={appData.lensType} onChange={e => updateData('lensType', e.target.value)} className={`w-full px-3 py-2 rounded border mb-4 ${bgInput}`}>
                      <option value="2.8">2.8mm Lens (Wide Angle ~100°)</option>
                      <option value="3.6">3.6mm Lens (Standard ~80°)</option>
                      <option value="4">4.0mm Lens (Narrow ~70°)</option>
                      <option value="6">6.0mm Lens (Telephoto ~50°)</option>
                    </select>
                    <div className={`p-4 rounded-lg text-sm ${isLight ? 'bg-purple-50' : 'bg-purple-900/20'}`}>
                      <p className="font-bold text-purple-700 dark:text-purple-400 mb-1">Engineer Advice:</p>
                      <p className="italic">{selectedCamera.desc}</p>
                    </div>
                  </div>
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden border flex items-center justify-center">
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full" />
                    <div className="absolute bottom-10 left-1/2 origin-bottom bg-blue-500/30 border-t border-l border-r border-blue-500/50" style={{ width: appData.lensType === '2.8' ? '300px' : appData.lensType === '3.6' ? '220px' : appData.lensType === '4' ? '180px' : '120px', height: '150px', transform: 'translateX(-50%)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className={`p-6 rounded-xl border h-fit sticky top-24 ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><FileSpreadsheet className="w-5 h-5 text-green-500" /> <span>Quote Summary</span></h3>
              <div className={`space-y-2 text-sm ${textMuted}`}>
                <div className="flex justify-between"><span>Cameras ({appData.quantity}x):</span> <span>{formatKES(camPrice)}</span></div>
                <div className="flex justify-between"><span>Recorder:</span> <span>{formatKES(recorderPrice)}</span></div>
                <div className="flex justify-between"><span>Storage:</span> <span>{formatKES(storagePrice)}</span></div>
                <div className="flex justify-between"><span>Cables & Acc:</span> <span>{formatKES(cablePrice + accPrice)}</span></div>
                <div className="flex justify-between"><span>Labor:</span> <span>{formatKES(laborPrice)}</span></div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total:</span> <span className="text-green-500">{formatKES(totalCCTV)}</span></div>
              </div>
              <button onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center space-x-2">
                <Printer className="w-5 h-5" /> <span>Preview Document</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= CABLING PLANNER ================= */}
        {currentView === 'cabling-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border lg:col-span-1 ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4">Add Data Drop</h3>
              <input type="text" placeholder="Room (e.g., Desk 1)" value={cabRoom} onChange={e => setCabRoom(e.target.value)} className={`w-full px-3 py-2 mb-2 rounded border ${bgInput}`} />
              <input type="number" placeholder="Length (m)" value={cabLength} onChange={e => setCabLength(Number(e.target.value))} className={`w-full px-3 py-2 mb-2 rounded border ${bgInput}`} />
              <button onClick={() => updateData('cabDevices', [...appData.cabDevices, { id: Date.now(), room: cabRoom, length: cabLength }])} className="w-full py-2 bg-blue-600 text-white rounded font-bold">Add Drop</button>
            </div>
            <div className={`p-6 rounded-xl border lg:col-span-2 ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4">Bill of Materials</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Total Drops:</span> <span>{cabTotals.ports}</span></div>
                <div className="flex justify-between"><span>Cable Required:</span> <span>{Math.round(cabTotals.lengthWithWaste)}m</span></div>
                <div className="flex justify-between"><span>Cat6 Boxes:</span> <span>{cabTotals.boxes}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total Cost:</span> <span className="text-green-500">{formatKES(cabTotals.cost)}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ENGINEER TOOLS (With Wiring Guide) ================= */}
        {currentView === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PoE Calculator */}
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Zap className="w-5 h-5 text-yellow-500" /> <span>PoE Calculator</span></h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs">IP Cams (15W)</label><input type="number" value={appData.poeCams} onChange={e => updateData('poeCams', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                <div><label className="text-xs">APs (20W)</label><input type="number" value={appData.poeAps} onChange={e => updateData('poeAps', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
              </div>
              <div className={`p-4 rounded text-center ${isLight ? 'bg-yellow-50' : 'bg-yellow-900/20'}`}>
                <p className="text-2xl font-bold text-yellow-600">{(appData.poeCams*15) + (appData.poeAps*20)} Watts</p>
              </div>
            </div>

            {/* Voltage Drop Calculator */}
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Activity className="w-5 h-5 text-orange-500" /> <span>Voltage Drop</span></h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs">Length (m)</label><input type="number" value={appData.voltLength} onChange={e => updateData('voltLength', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                <div><label className="text-xs">Load (Amps)</label><input type="number" step="0.1" value={appData.voltAmps} onChange={e => updateData('voltAmps', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
              </div>
              <div className={`p-4 rounded text-center ${isLight ? 'bg-orange-50' : 'bg-orange-900/20'}`}>
                <p className="text-2xl font-bold text-orange-600">{(12 - (appData.voltLength * appData.voltAmps * 0.0164)).toFixed(2)}V</p>
              </div>
            </div>

            {/* NEW: CABLE TRACER & WIRING GUIDE */}
            <div className={`p-6 rounded-xl border md:col-span-2 ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Palette className="w-5 h-5 text-pink-500" /> <span>Cable Wiring Guide</span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* T568B */}
                <div>
                  <p className="font-bold mb-2">Ethernet (RJ45) - T568B Standard</p>
                  <div className="flex space-x-1 mb-2">
                    {['bg-orange-300','bg-orange-500','bg-green-300','bg-blue-500','bg-blue-300','bg-green-500','bg-amber-800','bg-amber-900'].map((c, i) => (
                      <div key={i} className={`w-6 h-12 ${c} rounded-sm border border-gray-400`} />
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 flex space-x-1">
                    {['W-Org','Org','W-Grn','Blu','W-Blu','Grn','W-Brn','Brn'].map((t, i) => (
                      <span key={i} className="w-6 text-center">{t}</span>
                    ))}
                  </div>
                  <p className="text-xs mt-2 text-gray-500">Pin 1 (Left) to Pin 8 (Right). Looking at clip facing down.</p>
                </div>

                {/* BNC / CCTV */}
                <div>
                  <p className="font-bold mb-2">CCTV Analog (Siamese Cable)</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-red-500 border border-gray-400" />
                      <span>Red Wire: <strong>+12V Power</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-black border border-gray-400" />
                      <span>Black Wire: <strong>Ground (-12V)</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-600 border border-gray-400" />
                      <span>Copper Core: <strong>Video Signal (BNC Center)</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-gray-400 border border-gray-400" />
                      <span>Silver Shield: <strong>Video Ground (BNC Shell)</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= REPORT / PDF ================= */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <button onClick={() => setCurrentView('cctv-planner')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>← Back</button>
              
              <div className="flex space-x-2">
                <button onClick={() => setShowClientView(true)} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg flex items-center space-x-2">
                  <Monitor className="w-5 h-5" /> <span className="hidden sm:inline">Client View</span>
                </button>
                <button onClick={() => handleDownloadPDF('pdf-cctv-container', 'Document.pdf')} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg flex items-center space-x-2">
                  <Download className="w-5 h-5" /> <span>Download PDF</span>
                </button>
              </div>
            </div>
            
            <div className={`flex justify-center p-4 rounded-xl overflow-x-auto ${isLight ? 'bg-gray-200' : isDark ? 'bg-gray-800' : 'bg-[#111]'}`}>
              <div id="pdf-cctv-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px', fontFamily: 'Arial, sans-serif' }}>
                
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>{appData.isInvoice ? 'INVOICE' : 'QUOTATION'}</h1>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{businessInfo.name}</p>
                    <p style={{ margin: 0, fontSize: '12px' }}>Tel: {businessInfo.phone}</p>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#666' }}>PREPARED FOR:</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>{appData.clientName || 'Client Name'}</p>
                    <p style={{ fontSize: '14px' }}>{appData.clientPhone}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => updateData('isInvoice', !appData.isInvoice)} style={{ fontSize: '12px', padding: '5px 10px', backgroundColor: '#e5e7eb', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>
                      Toggle Quote/Invoice
                    </button>
                  </div>
                </div>

                <h3 style={{ color: '#1e3a8a', fontSize: '18px', marginTop: '30px', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>System Details</h3>
                <p style={{ fontSize: '14px', marginTop: '10px' }}><strong>{appData.quantity}x {selectedCamera.name}</strong> ({appData.lensType}mm Lens)</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Cameras</td><td style={{ textAlign: 'right' }}>{formatKES(camPrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Recorder</td><td style={{ textAlign: 'right' }}>{formatKES(recorderPrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Storage HDD</td><td style={{ textAlign: 'right' }}>{formatKES(storagePrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Cable ({appData.cableLength}m) & Acc</td><td style={{ textAlign: 'right' }}>{formatKES(cablePrice + accPrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Installation</td><td style={{ textAlign: 'right' }}>{formatKES(laborPrice)}</td></tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>TOTAL: <strong>{formatKES(totalCCTV)}</strong></p>
                  {appData.isInvoice && (
                    <>
                      <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#555' }}>Deposit Paid: <strong>{formatKES(appData.depositPaid)}</strong></p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>Balance Due: {formatKES(balanceDue)}</p>
                      
                      {/* Deposit Input (Only visible on screen, hidden in print/pdf) */}
                      <div className="mt-4 print:hidden">
                         <label className="text-xs text-gray-500 mr-2">Update Deposit:</label>
                         <input type="number" value={appData.depositPaid} onChange={e => updateData('depositPaid', Number(e.target.value))} className="border p-1 rounded text-black w-24" />
                      </div>
                    </>
                  )}
                  {!appData.isInvoice && <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(totalCCTV)}</p>}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ================= CLIENT VIEW MODAL ================= */}
        {showClientView && (
          <div className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 md:p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full bg-white rounded-3xl p-8 md:p-12 relative shadow-2xl text-gray-900">
              <button onClick={() => setShowClientView(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <Trash2 className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">{businessInfo.name}</h1>
                <p className="text-xl text-gray-500">CCTV Security Proposal</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">What You Get</h2>
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-green-500" /> <span><strong>{appData.quantity}x</strong> High-Definition Cameras</span></li>
                    <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-green-500" /> <span>24/7 Mobile Phone Access</span></li>
                    <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-green-500" /> <span>Professional Installation</span></li>
                    <li className="flex items-center space-x-3"><CheckCircle className="w-6 h-6 text-green-500" /> <span>Full System Setup & Training</span></li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-center items-center text-center">
                  <p className="text-xl text-gray-500 mb-2">Total Investment</p>
                  <p className="text-5xl font-extrabold text-green-600">{formatKES(totalCCTV)}</p>
                  <p className="mt-4 text-sm text-gray-400">Includes all equipment and labor</p>
                </div>
              </div>

              <div className="text-center text-gray-500 text-sm border-t pt-6">
                <p>Call us today to get started: <strong className="text-lg text-blue-900">{businessInfo.phone}</strong></p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}