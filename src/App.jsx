// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Camera, Network, Cable, Home as HomeIcon, FileSpreadsheet, 
  Sun, Moon, CircleDot, Cpu, Lightbulb, ArrowRight, Download, 
  Settings, CheckCircle, Printer, MonitorPlay, Server, Cloud, 
  HardDrive, Zap, ChevronDown
} from 'lucide-react';

const CATALOG = {
  dvrs: {
    hik4: { name: 'Hikvision 4-Channel DVR', price: 5700 },
    hik8: { name: 'Hikvision 8-Channel DVR', price: 8500 },
  },
  cameras: {
    hikBullet: { name: '2MP Bullet', price: 1700, desc: 'Outdoor perimeters, long-range.' },
    hikDome: { name: '2MP Dome', price: 1600, desc: 'Indoor ceilings, vandal-resistant.' },
    hikPTZ: { name: '2MP PTZ', price: 12000, desc: 'Large open areas, pan and zoom.' }
  },
  storage: {
    none: { name: 'No Hard Drive', price: 0 },
    hdd500: { name: '500GB HDD', price: 3100 },
    hdd1tb: { name: '1TB HDD', price: 5500 },
  },
  labor: {
    basic: { name: 'Basic Installation', price: 4500 },
  }
};

function App() {
  // THEME STATE
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 
  
  // App State
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });
  const [premisesType, setPremisesType] = useState('home');
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('hikBullet');

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  const calculateTotal = () => {
    const camCost = CATALOG.cameras[selectedCamera].price * quantity;
    const dvrCost = CATALOG.dvrs[selectedDvr].price;
    const storageCost = CATALOG.storage.hdd500.price;
    const laborCost = CATALOG.labor.basic.price;
    return camCost + dvrCost + storageCost + laborCost;
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-report-container');
    html2pdf().set({ margin: 0.5, filename: `Quote.pdf`, html2canvas: { scale: 2, useCORS: true } }).from(element).save();
  };

  // DYNAMIC STYLING VARIABLES
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textMain}`}>
      
      {/* HEADER */}
      <header className={`sticky top-0 z-50 border-b ${bgHeader}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => setCurrentView('welcome')} className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl"><Cable className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className={`text-2xl font-bold ${isBlack ? 'text-white' : 'text-blue-600'}`}>CableIQ</h1>
              <p className={`text-xs ${textMuted}`}>Kenyan CCTV Planner</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl transition-colors ${bgButton}`}>
              <HomeIcon className="w-5 h-5" />
            </button>
            
            {/* THEME DROPDOWN MENU */}
            <div className="relative">
              <button 
                onClick={() => setShowThemeMenu(!showThemeMenu)} 
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 font-medium transition-colors ${bgButton}`}
              >
                {isLight && <><Sun className="w-5 h-5 text-orange-500" /> <span className="hidden sm:inline">Light</span></>}
                {isDark && <><Moon className="w-5 h-5 text-blue-400" /> <span className="hidden sm:inline">Dark</span></>}
                {isBlack && <><CircleDot className="w-5 h-5 text-gray-300" /> <span className="hidden sm:inline">Black</span></>}
                <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
              </button>

              {/* DROPDOWN OPTIONS */}
              {showThemeMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden z-50 ${bgCard}`}>
                  <button 
                    onClick={() => { setTheme('light'); setShowThemeMenu(false); }} 
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${isLight ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : `hover:bg-gray-100 dark:hover:bg-gray-700 ${textMain}`}`}
                  >
                    <Sun className="w-4 h-4 text-orange-500" />
                    <span>Light Mode</span>
                  </button>
                  
                  <button 
                    onClick={() => { setTheme('dark'); setShowThemeMenu(false); }} 
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${isDark ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : `hover:bg-gray-100 dark:hover:bg-gray-700 ${textMain}`}`}
                  >
                    <Moon className="w-4 h-4 text-blue-400" />
                    <span>Dark Mode</span>
                  </button>
                  
                  <button 
                    onClick={() => { setTheme('black'); setShowThemeMenu(false); }} 
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors border-t ${isBlack ? 'bg-gray-800 text-white' : `hover:bg-gray-100 dark:hover:bg-gray-700 ${textMain} ${isLight ? 'border-gray-200' : 'border-gray-700'}`}`}
                  >
                    <CircleDot className="w-4 h-4 text-gray-500" />
                    <span>AMOLED Black</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Click-away overlay for dropdown */}
      {showThemeMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)}></div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* WELCOME VIEW */}
        {currentView === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div onClick={() => setCurrentView('cctv-planner')} className={`cursor-pointer p-8 rounded-2xl border transition-all hover:border-orange-500 shadow-sm hover:shadow-md ${bgCard}`}>
              <Camera className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">CCTV Configurator</h3>
              <p className={`text-sm ${textMuted}`}>Build custom CCTV kits and generate PDF quotes.</p>
            </div>
            <div onClick={() => setCurrentView('report')} className={`cursor-pointer p-8 rounded-2xl border transition-all hover:border-green-500 shadow-sm hover:shadow-md ${bgCard}`}>
              <FileSpreadsheet className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Export PDF Quote</h3>
              <p className={`text-sm ${textMuted}`}>Preview and download the final quotation.</p>
            </div>
          </div>
        )}

        {/* CCTV CONFIGURATOR VIEW */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* SMART RECOMMENDATION */}
              <div className={`p-6 rounded-xl shadow-lg border ${isBlack ? 'bg-gradient-to-r from-blue-950 to-black border-blue-900' : 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white border-transparent'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" /> <span>Smart Recommendation</span>
                </h3>
                <select value={premisesType} onChange={e => setPremisesType(e.target.value)} className={`w-full px-4 py-2 rounded-lg border mb-3 outline-none ${isBlack ? 'bg-black border-gray-700 text-white' : 'bg-blue-900/50 border-blue-500 text-white'}`}>
                  <option value="home">🏠 Home / Residential</option>
                  <option value="shop">🏪 Shop / Retail</option>
                  <option value="warehouse">🏭 Warehouse</option>
                </select>
                <p className={`text-sm italic ${isBlack ? 'text-gray-400' : 'text-blue-100'}`}>"Standard setup covering the gate, compound, and main living area."</p>
              </div>

              {/* HARDWARE SELECTION */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Cpu className="w-5 h-5 text-blue-500" /> <span>Hardware</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>DVR</label>
                    <select value={selectedDvr} onChange={e => setSelectedDvr(e.target.value)} className={`w-full px-3 py-2 rounded-lg border mb-3 outline-none ${bgInput}`}>
                      {Object.entries(CATALOG.dvrs).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>Camera Type</label>
                    <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} className={`w-full px-3 py-2 rounded-lg border mb-3 outline-none ${bgInput}`}>
                      {Object.entries(CATALOG.cameras).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* COST SUMMARY */}
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4">Cost Summary</h3>
                <div className={`space-y-2 text-sm ${textMuted}`}>
                  <div className="flex justify-between"><span>Cameras ({quantity}x):</span> <span className={textMain}>{formatKES(CATALOG.cameras[selectedCamera].price * quantity)}</span></div>
                  <div className="flex justify-between"><span>DVR:</span> <span className={textMain}>{formatKES(CATALOG.dvrs[selectedDvr].price)}</span></div>
                  <div className="flex justify-between"><span>Storage:</span> <span className={textMain}>{formatKES(CATALOG.storage.hdd500.price)}</span></div>
                  <div className="flex justify-between"><span>Labor:</span> <span className={textMain}>{formatKES(CATALOG.labor.basic.price)}</span></div>
                  <div className={`flex justify-between font-bold text-lg border-t pt-3 mt-3 ${isLight ? 'border-gray-200' : isDark ? 'border-gray-700' : 'border-[#222]'}`}>
                    <span>Total:</span> <span className="text-green-500">{formatKES(calculateTotal())}</span>
                  </div>
                </div>
                <button onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                  Preview PDF Quote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REPORT / EXPORT VIEW */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('cctv-planner')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>← Back</button>
              <button onClick={handleDownloadPDF} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center space-x-2">
                <Download className="w-5 h-5" /> <span>Download PDF</span>
              </button>
            </div>
            
            <div className={`flex justify-center p-4 rounded-xl overflow-x-auto ${isLight ? 'bg-gray-200' : isDark ? 'bg-gray-800' : 'bg-[#111]'}`}>
              {/* The PDF Container is FORCED to light mode so the PDF prints correctly */}
              <div id="pdf-report-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px' }}>
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px' }}>
                  <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>QUOTATION</h1>
                  <p style={{ marginTop: '10px' }}>Date: {new Date().toLocaleDateString()}</p>
                </div>
                
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>PREPARED FOR</h2>
                <p style={{ fontSize: '16px' }}>{clientInfo.name || 'Client Name'}</p>
                
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>SYSTEM DETAILS</h2>
                <p style={{ fontSize: '16px' }}>{quantity}x {CATALOG.cameras[selectedCamera].name} + {CATALOG.dvrs[selectedDvr].name}</p>
                
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>TOTAL COST</h2>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(calculateTotal())}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;