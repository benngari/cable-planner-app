// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Camera, Network, Cable, Home as HomeIcon, FileSpreadsheet, 
  Sun, Moon, CircleDot, Cpu, Lightbulb, ArrowRight, Download, 
  Settings, CheckCircle, Printer, MonitorPlay, Server, Cloud, 
  HardDrive, Zap, ChevronDown, Wrench, Calculator, Globe, 
  Ruler, Plus, Trash2, MapPin, User, Briefcase, Monitor, 
  ClipboardCheck, ShoppingCart, Info
} from 'lucide-react';

const CATALOG = {
  dvrs: {
    hik4: { name: 'Hikvision 4-Ch DVR', price: 5700 },
    hik8: { name: 'Hikvision 8-Ch DVR', price: 8500 },
    hik16: { name: 'Hikvision 16-Ch DVR', price: 14500 },
  },
  nvrs: {
    hik4: { name: 'Hikvision 4-Ch NVR', price: 8500 },
    hik8: { name: 'Hikvision 8-Ch NVR', price: 12500 },
  },
  cameras: {
    analogBullet: { name: 'Analog 2MP Bullet', price: 1700, type: 'Analog' },
    analogDome: { name: 'Analog 2MP Dome', price: 1600, type: 'Analog' },
    ipBullet: { name: 'IP 2MP Bullet (PoE)', price: 4500, type: 'IP' },
    ipDome: { name: 'IP 2MP Dome (PoE)', price: 4300, type: 'IP' }
  },
  storage: {
    hdd500: { name: '500GB HDD', price: 3100 },
    hdd1tb: { name: '1TB HDD', price: 5500 },
    hdd2tb: { name: '2TB HDD', price: 9800 },
  },
  monitors: {
    none: { name: 'No Monitor', price: 0 },
    m22: { name: '22" CCTV Monitor', price: 13000 },
    m32: { name: '32" Smart TV', price: 18500 },
  },
  accessories: {
    psu: { name: 'Power Supply', price: 1500 },
    rg59: { name: 'RG59 Cable (per meter)', price: 20 },
    cat6: { name: 'Cat6 Cable (per meter)', price: 65 },
    connectors: { name: 'BNC/DC Connectors', price: 250 }
  },
  labor: {
    diy: { name: 'Supply Only (No Install)', price: 0 },
    basic: { name: 'Basic Installation', price: 4500 },
    complex: { name: 'Complex Install (2+ days)', price: 8500 }
  },
  cabling: {
    cat6Box: { name: 'Cat6 Box (305m)', price: 19500 },
    keystone: { name: 'Keystone Jack', price: 150 },
    faceplate: { name: 'Faceplate', price: 200 },
    patchPanel: { name: '24-Port Patch Panel', price: 4500 },
    patchCord: { name: 'Patch Cord', price: 450 }
  }
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 

  // Client & Business Info
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [businessInfo, setBusinessInfo] = useState({ 
    name: 'Ngari Tech Solutions', phone: '0711645837', email: 'info@ngaritech.co.ke', mpesa: 'Paybill 400200'
  });

  // CCTV State
  const [systemType, setSystemType] = useState('Analog'); 
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('analogBullet');
  const [selectedStorage, setSelectedStorage] = useState('hdd500');
  const [selectedMonitor, setSelectedMonitor] = useState('none');
  const [selectedLabor, setSelectedLabor] = useState('basic');
  const [cableLength, setCableLength] = useState(50);

  // Custom Items State
  const [customItems, setCustomItems] = useState([]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);

  // Site Survey State
  const [survey, setSurvey] = useState({ power: false, cableRoute: false, internet: false, mounting: false });

  // Cabling Planner State
  const [cabDevices, setCabDevices] = useState([]);
  const [cabDevType, setCabDevType] = useState('Data');
  const [cabDevRoom, setCabDevRoom] = useState('Office');
  const [cabDevLength, setCabDevLength] = useState(30);

  // Theme
  const isLight = theme === 'light';
  const isDark = theme === 'dark';
  const isBlack = theme === 'black';

  const bgMain = isLight ? 'bg-gray-50' : isDark ? 'bg-gray-900' : 'bg-black';
  const textMain = isLight ? 'text-gray-900' : 'text-gray-100';
  const textMuted = isLight ? 'text-gray-500' : isDark ? 'text-gray-400' : 'text-gray-500';
  const bgCard = isLight ? 'bg-white border-gray-200' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-[#0a0a0a] border-[#222]';
  const bgHeader = isLight ? 'bg-white border-gray-200' : isDark ? 'bg-gray-900 border-gray-800' : 'bg-black border-[#222]';
  const bgInput = isLight ? 'bg-gray-50 border-gray-300 text-gray-900' : isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-[#111] border-[#333] text-white';
  const bgButton = isLight ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#222] text-white hover:bg-[#333]';

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  const addCustomItem = () => {
    if (!customItemName || !customItemPrice) return alert("Enter item name and price");
    setCustomItems([...customItems, { id: Date.now(), name: customItemName, price: Number(customItemPrice), qty: Number(customItemQty) }]);
    setCustomItemName(''); setCustomItemPrice(''); setCustomItemQty(1);
  };
  const removeCustomItem = (id) => setCustomItems(customItems.filter(i => i.id !== id));
  const getCustomItemsTotal = () => customItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // --- CALCULATIONS ---
  const calculateCCTVTotal = () => {
    const camCost = CATALOG.cameras[selectedCamera].price * quantity;
    const recorderCost = systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].price : CATALOG.nvrs[selectedDvr].price;
    const storageCost = CATALOG.storage[selectedStorage].price;
    const monitorCost = CATALOG.monitors[selectedMonitor].price;
    const cableCost = cableLength * (systemType === 'Analog' ? CATALOG.accessories.rg59.price : CATALOG.accessories.cat6.price);
    const accCost = systemType === 'Analog' ? (CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price) : 0;
    const laborCost = CATALOG.labor[selectedLabor].price;
    const customCost = getCustomItemsTotal();
    
    return camCost + recorderCost + storageCost + monitorCost + cableCost + accCost + laborCost + customCost;
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-report-container');
    html2pdf().set({ margin: 0.5, filename: `Quote_${clientInfo.name || 'Client'}.pdf`, html2canvas: { scale: 2, useCORS: true } }).from(element).save();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textMain}`}>
      {/* HEADER */}
      <header className={`sticky top-0 z-50 border-b ${bgHeader}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => setCurrentView('welcome')} className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl"><Cable className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className={`text-2xl font-bold ${isBlack ? 'text-white' : 'text-blue-600'}`}>CableIQ</h1>
              <p className={`text-xs ${textMuted}`}>Engineer Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl transition-colors ${bgButton}`}><HomeIcon className="w-5 h-5" /></button>
            
            {/* THEME DROPDOWN */}
            <div className="relative">
              <button onClick={() => setShowThemeMenu(!showThemeMenu)} className={`px-4 py-2 rounded-xl flex items-center space-x-2 font-medium transition-colors ${bgButton}`}>
                {isLight && <><Sun className="w-5 h-5 text-orange-500" /> <span className="hidden sm:inline">Light</span></>}
                {isDark && <><Moon className="w-5 h-5 text-blue-400" /> <span className="hidden sm:inline">Dark</span></>}
                {isBlack && <><CircleDot className="w-5 h-5 text-gray-300" /> <span className="hidden sm:inline">Black</span></>}
                <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </button>
              {showThemeMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-50 ${bgCard}`}>
                  <button onClick={() => { setTheme('light'); setShowThemeMenu(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 ${textMain}`}><Sun className="w-4 h-4 text-orange-500" /><span>Light</span></button>
                  <button onClick={() => { setTheme('dark'); setShowThemeMenu(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 ${textMain}`}><Moon className="w-4 h-4 text-blue-400" /><span>Dark</span></button>
                  <button onClick={() => { setTheme('black'); setShowThemeMenu(false); }} className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium border-t hover:bg-gray-100 dark:hover:bg-gray-700 ${textMain}`}><CircleDot className="w-4 h-4 text-gray-500" /><span>AMOLED Black</span></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {showThemeMenu && <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>}

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* WELCOME MENU */}
        {currentView === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div onClick={() => setCurrentView('cctv-planner')} className={`cursor-pointer p-6 rounded-2xl border transition-all hover:border-orange-500 shadow-sm hover:shadow-md ${bgCard}`}>
              <Camera className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">CCTV Configurator</h3>
              <p className={`text-sm ${textMuted}`}>Quote Analog (DVR) and IP (NVR) systems.</p>
            </div>
            <div onClick={() => setCurrentView('cabling-planner')} className={`cursor-pointer p-6 rounded-2xl border transition-all hover:border-blue-500 shadow-sm hover:shadow-md ${bgCard}`}>
              <Network className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cabling Planner</h3>
              <p className={`text-sm ${textMuted}`}>Calculate exact Cat6 rolls and patch panels.</p>
            </div>
            <div onClick={() => setCurrentView('tools')} className={`cursor-pointer p-6 rounded-2xl border transition-all hover:border-green-500 shadow-sm hover:shadow-md ${bgCard}`}>
              <Wrench className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Engineer Tools</h3>
              <p className={`text-sm ${textMuted}`}>PoE, IP Subnet, and Cable Run estimators.</p>
            </div>
          </div>
        )}

        {/* DETAILED CCTV PLANNER */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN - FORMS */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* CLIENT DETAILS */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><User className="w-5 h-5 text-blue-500" /> <span>Client & Business Details</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Client Name</label>
                    <input type="text" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Client Phone</label>
                    <input type="text" value={clientInfo.phone} onChange={e => setClientInfo({...clientInfo, phone: e.target.value})} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} placeholder="e.g. 0712345678" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={`text-xs block mb-1 ${textMuted}`}>Business Name (Your Company)</label>
                    <input type="text" value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                </div>
              </div>

              {/* SYSTEM CONFIG */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Settings className="w-5 h-5 text-blue-500" /> <span>System Configuration</span></h3>
                
                <div className="flex space-x-4 mb-6">
                  <button onClick={() => { setSystemType('Analog'); setSelectedCamera('analogBullet'); setSelectedDvr('hik4'); }} className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${systemType === 'Analog' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : `border-transparent ${bgInput}`}`}>
                    Analog (DVR + Coax)
                  </button>
                  <button onClick={() => { setSystemType('IP'); setSelectedCamera('ipBullet'); setSelectedDvr('hik4'); }} className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${systemType === 'IP' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : `border-transparent ${bgInput}`}`}>
                    IP (NVR + Cat6)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>{systemType === 'Analog' ? 'DVR Recorder' : 'NVR Recorder'}</label>
                    <select value={selectedDvr} onChange={e => setSelectedDvr(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                      {Object.entries(systemType === 'Analog' ? CATALOG.dvrs : CATALOG.nvrs).map(([k, v]) => <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Camera Type</label>
                    <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                      {Object.entries(CATALOG.cameras).filter(([k, v]) => v.type === systemType).map(([k, v]) => <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Quantity of Cameras</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Cable Length (m)</label>
                    <input type="number" value={cableLength} onChange={e => setCableLength(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Storage (Hard Drive)</label>
                    <select value={selectedStorage} onChange={e => setSelectedStorage(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                      {Object.entries(CATALOG.storage).map(([k, v]) => <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Monitor Display</label>
                    <select value={selectedMonitor} onChange={e => setSelectedMonitor(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                      {Object.entries(CATALOG.monitors).map(([k, v]) => <option key={k} value={k}>{v.name} {v.price > 0 ? `- ${formatKES(v.price)}` : ''}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`text-xs block mb-1 ${textMuted}`}>Installation Labor</label>
                    <select value={selectedLabor} onChange={e => setSelectedLabor(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                      {Object.entries(CATALOG.labor).map(([k, v]) => <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* SITE SURVEY & CUSTOM ITEMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-xl border ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><ClipboardCheck className="w-5 h-5 text-blue-500" /> <span>Site Survey</span></h3>
                  <div className="space-y-2">
                    {['power', 'cableRoute', 'internet', 'mounting'].map(k => (
                      <label key={k} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={survey[k]} onChange={() => setSurvey({...survey, [k]: !survey[k]})} className="rounded text-blue-600" />
                        <span className="capitalize text-gray-700 dark:text-gray-300">{k.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><ShoppingCart className="w-5 h-5 text-blue-500" /> <span>Extra Items</span></h3>
                  <div className="flex space-x-2 mb-3">
                    <input type="text" placeholder="Item" value={customItemName} onChange={e => setCustomItemName(e.target.value)} className={`flex-1 px-2 py-1 text-sm rounded border outline-none ${bgInput}`} />
                    <input type="number" placeholder="Qty" value={customItemQty} onChange={e => setCustomItemQty(Number(e.target.value))} className={`w-16 px-2 py-1 text-sm rounded border outline-none ${bgInput}`} />
                    <input type="number" placeholder="Price" value={customItemPrice} onChange={e => setCustomItemPrice(e.target.value)} className={`w-20 px-2 py-1 text-sm rounded border outline-none ${bgInput}`} />
                    <button onClick={addCustomItem} className="px-3 py-1 bg-blue-600 text-white rounded font-bold text-sm">Add</button>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {customItems.map(i => (
                      <div key={i.id} className="flex justify-between text-xs p-1 border-b border-gray-200 dark:border-gray-700">
                        <span>{i.qty}x {i.name}</span>
                        <span>{formatKES(i.price * i.qty)} <button onClick={() => removeCustomItem(i.id)} className="text-red-500 ml-2">X</button></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - SUMMARY */}
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border sticky top-24 ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><FileSpreadsheet className="w-5 h-5 text-green-500" /> <span>Cost Summary</span></h3>
                <div className={`space-y-2 text-sm ${textMuted}`}>
                  <div className="flex justify-between"><span>Cameras ({quantity}x):</span> <span className={textMain}>{formatKES(CATALOG.cameras[selectedCamera].price * quantity)}</span></div>
                  <div className="flex justify-between"><span>Recorder:</span> <span className={textMain}>{formatKES(systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].price : CATALOG.nvrs[selectedDvr].price)}</span></div>
                  <div className="flex justify-between"><span>Storage:</span> <span className={textMain}>{formatKES(CATALOG.storage[selectedStorage].price)}</span></div>
                  <div className="flex justify-between"><span>Monitor:</span> <span className={textMain}>{formatKES(CATALOG.monitors[selectedMonitor].price)}</span></div>
                  <div className="flex justify-between"><span>Cable & Acc:</span> <span className={textMain}>{formatKES((cableLength * (systemType === 'Analog' ? 20 : 65)) + (systemType === 'Analog' ? 1750 : 0))}</span></div>
                  <div className="flex justify-between"><span>Labor:</span> <span className={textMain}>{formatKES(CATALOG.labor[selectedLabor].price)}</span></div>
                  {customItems.length > 0 && <div className="flex justify-between"><span>Extras:</span> <span className={textMain}>{formatKES(getCustomItemsTotal())}</span></div>}
                  
                  <div className={`flex justify-between font-bold text-lg border-t pt-3 mt-3 ${isLight ? 'border-gray-200' : isDark ? 'border-gray-700' : 'border-[#222]'}`}>
                    <span>Total:</span> <span className="text-green-500">{formatKES(calculateCCTVTotal())}</span>
                  </div>
                </div>
                <button onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Printer className="w-5 h-5" /> <span>Preview PDF Quote</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CABLING PLANNER (Keep existing logic for now) */}
        {currentView === 'cabling-planner' && (
          <div className={`p-8 rounded-xl border text-center ${bgCard}`}>
             <h2 className="text-2xl font-bold mb-4">Cabling Planner</h2>
             <p className={textMuted}>Coming in next update...</p>
             <button onClick={() => setCurrentView('welcome')} className={`mt-4 px-6 py-2 rounded-lg ${bgButton}`}>Back</button>
          </div>
        )}

        {/* ENGINEER TOOLS (Keep existing) */}
        {currentView === 'tools' && (
          <div className={`p-8 rounded-xl border text-center ${bgCard}`}>
             <h2 className="text-2xl font-bold mb-4">Tools</h2>
             <p className={textMuted}>Coming in next update...</p>
             <button onClick={() => setCurrentView('welcome')} className={`mt-4 px-6 py-2 rounded-lg ${bgButton}`}>Back</button>
          </div>
        )}

        {/* REPORT VIEW */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('cctv-planner')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>← Back</button>
              <button onClick={handleDownloadPDF} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center space-x-2">
                <Download className="w-5 h-5" /> <span>Download PDF</span>
              </button>
            </div>
            
            <div className={`flex justify-center p-4 rounded-xl overflow-x-auto ${isLight ? 'bg-gray-200' : isDark ? 'bg-gray-800' : 'bg-[#111]'}`}>
              {/* PDF CONTENT */}
              <div id="pdf-report-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px', fontFamily: 'Arial, sans-serif' }}>
                
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>QUOTATION</h1>
                    <p style={{ marginTop: '10px' }}>Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>{businessInfo.name}</h2>
                    <p style={{ margin: '5px 0', fontSize: '14px' }}>Tel: {businessInfo.phone}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
                  <div>
                    <h3 style={{ color: '#1e3a8a', fontSize: '14px', fontWeight: 'bold' }}>PREPARED FOR:</h3>
                    <p style={{ fontSize: '16px', margin: '5px 0' }}>{clientInfo.name || 'Client Name'}</p>
                    <p style={{ fontSize: '14px', color: '#555' }}>{clientInfo.phone || 'Phone'}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ color: '#1e3a8a', fontSize: '14px', fontWeight: 'bold' }}>PAYMENT DETAILS:</h3>
                    <p style={{ fontSize: '14px', margin: '5px 0' }}>M-Pesa: {businessInfo.mpesa}</p>
                  </div>
                </div>

                <h3 style={{ color: '#1e3a8a', fontSize: '18px', marginTop: '30px', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>SYSTEM DETAILS</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', fontSize: '14px' }}><strong>Recorder:</strong> {systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].name : CATALOG.nvrs[selectedDvr].name}</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>{formatKES(systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].price : CATALOG.nvrs[selectedDvr].price)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', fontSize: '14px' }}><strong>Cameras:</strong> {quantity}x {CATALOG.cameras[selectedCamera].name}</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>{formatKES(CATALOG.cameras[selectedCamera].price * quantity)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', fontSize: '14px' }}><strong>Storage:</strong> {CATALOG.storage[selectedStorage].name}</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>{formatKES(CATALOG.storage[selectedStorage].price)}</td>
                  </tr>
                  {selectedMonitor !== 'none' && (
                    <tr style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px 0', fontSize: '14px' }}><strong>Monitor:</strong> {CATALOG.monitors[selectedMonitor].name}</td>
                      <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>{formatKES(CATALOG.monitors[selectedMonitor].price)}</td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', fontSize: '14px' }}><strong>Cable & Accessories:</strong> {cableLength}m cable + PSU/Connectors</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>{formatKES((cableLength * (systemType === 'Analog' ? 20 : 65)) + (systemType === 'Analog' ? 1750 : 0))}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0', fontSize: '14px' }}><strong>Installation:</strong> {CATALOG.labor[selectedLabor].name}</td>
                    <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>{formatKES(CATALOG.labor[selectedLabor].price)}</td>
                  </tr>
                  {customItems.map(i => (
                    <tr key={i.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '8px 0', fontSize: '14px' }}>{i.qty}x {i.name}</td>
                      <td style={{ padding: '8px 0', fontSize: '14px', textAlign: 'right' }}>{formatKES(i.price * i.qty)}</td>
                    </tr>
                  ))}
                </table>

                <div style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>TOTAL ESTIMATED COST</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(calculateCCTVTotal())}</p>
                </div>

                <div style={{ marginTop: '40px', fontSize: '12px', color: '#777' }}>
                  <p><strong>Terms & Conditions:</strong></p>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>50% deposit required to commence work.</li>
                    <li>Warranty: 12 months on equipment, 3 months on labor.</li>
                    <li>Quote valid for 14 days.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}