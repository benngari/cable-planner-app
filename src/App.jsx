// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Camera, Network, Cable, Home as HomeIcon, FileSpreadsheet, 
  Sun, Moon, CircleDot, Cpu, Lightbulb, ArrowRight, Download, 
  Settings, Printer, Cloud, HardDrive, Zap, ChevronDown, Wrench, 
  Calculator, Globe, Ruler, Plus, Trash2, MapPin, User, Monitor, 
  ClipboardCheck, ShoppingCart, Layers, Tag, Video, CheckSquare, 
  Image as ImageIcon, Activity, AlertTriangle, Table, Smartphone
} from 'lucide-react';

const CATALOG = {
  dvrs: { hik4: { name: '4-Ch DVR', price: 5700 }, hik8: { name: '8-Ch DVR', price: 8500 } },
  nvrs: { hik4: { name: '4-Ch NVR', price: 8500 }, hik8: { name: '8-Ch NVR', price: 12500 } },
  cameras: {
    analogBullet: { name: 'Analog Bullet', price: 1700, type: 'Analog' },
    analogDome: { name: 'Analog Dome', price: 1600, type: 'Analog' },
    ipBullet: { name: 'IP Bullet (PoE)', price: 4500, type: 'IP' },
    ipDome: { name: 'IP Dome (PoE)', price: 4300, type: 'IP' }
  },
  storage: { hdd500: { name: '500GB HDD', price: 3100 }, hdd1tb: { name: '1TB HDD', price: 5500 } },
  monitors: { none: { name: 'No Monitor', price: 0 }, m22: { name: '22" Monitor', price: 13000 } },
  accessories: { psu: { name: 'Power Supply', price: 1500 }, rg59: { name: 'RG59 Cable /m', price: 20 }, cat6: { name: 'Cat6 Cable /m', price: 65 }, connectors: { name: 'Connectors', price: 250 } },
  labor: { diy: { name: 'Supply Only', price: 0 }, basic: { name: 'Basic Install', price: 4500 } },
  cabling: { cat6Box: { name: 'Cat6 Box (305m)', price: 19500 }, keystone: { name: 'Keystone', price: 150 }, faceplate: { name: 'Faceplate', price: 200 }, patchPanel: { name: '24-Port Panel', price: 4500 }, patchCord: { name: 'Patch Cord', price: 450 }, laborPerDrop: 1500 }
};

export default function App() {
  // --- GLOBAL STATE ---
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });
  const [businessInfo, setBusinessInfo] = useState({ name: 'Ngari Tech Solutions', phone: '0711645837', mpesa: 'Paybill 400200' });

  // --- CCTV STATE ---
  const [systemType, setSystemType] = useState('Analog'); 
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('analogBullet');
  const [cableLength, setCableLength] = useState(50);
  const [sitePhoto, setSitePhoto] = useState(null);
  const [wizardStep, setWizardStep] = useState(0);

  // --- CABLING STATE ---
  const [cabDevices, setCabDevices] = useState([]);
  const [cabRoom, setCabRoom] = useState('');
  const [cabType, setCabType] = useState('Data');
  const [cabLength, setCabLength] = useState(30);
  const [showLabels, setShowLabels] = useState(false);

  // --- TOOLS STATE ---
  const [activeTool, setActiveTool] = useState('poe');
  const [poeCams, setPoeCams] = useState(4);
  const [poeAps, setPoeAps] = useState(2);
  const [baseIp, setBaseIp] = useState('192.168.1.0');
  const [runRooms, setRunRooms] = useState(5);
  const [lensType, setLensType] = useState('2.8');
  const [voltLength, setVoltLength] = useState(50);
  const [voltAmps, setVoltAmps] = useState(0.5);

  // --- THEME LOGIC ---
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

  // --- CALCULATIONS ---
  const calculateCCTVTotal = (type = systemType) => {
    const isIP = type === 'IP';
    const camCost = (isIP ? CATALOG.cameras.ipBullet.price : CATALOG.cameras.analogBullet.price) * quantity;
    const recorderCost = isIP ? CATALOG.nvrs.hik4.price : CATALOG.dvrs.hik4.price;
    const cableCost = cableLength * (isIP ? CATALOG.accessories.cat6.price : CATALOG.accessories.rg59.price);
    const accCost = isIP ? 0 : (CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price);
    return camCost + recorderCost + CATALOG.storage.hdd500.price + cableCost + accCost + CATALOG.labor.basic.price;
  };

  const calculateCabling = () => {
    const ports = cabDevices.length;
    const rawLength = cabDevices.reduce((sum, d) => sum + d.length, 0);
    const lengthWithWaste = rawLength * 1.15;
    const boxes = Math.ceil(lengthWithWaste / 305) || 0;
    const patchPanels = Math.ceil(ports / 24) || 0;
    const cost = (boxes * CATALOG.cabling.cat6Box.price) + (ports * CATALOG.cabling.keystone.price) + (ports * CATALOG.cabling.faceplate.price) + (patchPanels * CATALOG.cabling.patchPanel.price) + (ports * CATALOG.cabling.patchCord.price) + (ports * CATALOG.cabling.laborPerDrop);
    return { ports, lengthWithWaste, boxes, patchPanels, cost };
  };
  const cabTotals = calculateCabling();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSitePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

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
                  <button onClick={() => { setTheme('light'); setShowThemeMenu(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700`}>Light Mode</button>
                  <button onClick={() => { setTheme('dark'); setShowThemeMenu(false); }} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700`}>Dark Mode</button>
                  <button onClick={() => { setTheme('black'); setShowThemeMenu(false); }} className={`w-full text-left px-4 py-3 text-sm border-t hover:bg-gray-100 dark:hover:bg-gray-700`}>AMOLED Black</button>
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
              <p className={`text-sm ${textMuted}`}>Quote systems, compare Analog vs IP, and run setup wizards.</p>
            </div>
            <div onClick={() => setCurrentView('cabling-planner')} className={`cursor-pointer p-6 rounded-2xl border hover:border-blue-500 ${bgCard}`}>
              <Network className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cabling Planner</h3>
              <p className={`text-sm ${textMuted}`}>Calculate Cat6 boxes and generate printable cable labels.</p>
            </div>
            <div onClick={() => setCurrentView('tools')} className={`cursor-pointer p-6 rounded-2xl border hover:border-green-500 ${bgCard}`}>
              <Wrench className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Engineer Tools</h3>
              <p className={`text-sm ${textMuted}`}>FOV Simulator, Voltage Drop, PoE, and Subnet tools.</p>
            </div>
          </div>
        )}

        {/* ================= CCTV CONFIGURATOR ================= */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* System Type & Comparison */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Settings className="w-5 h-5 text-blue-500" /> <span>System Configuration</span></h3>
                <div className="flex space-x-4 mb-6">
                  <button onClick={() => setSystemType('Analog')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${systemType === 'Analog' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : `border-transparent ${bgInput}`}`}>Analog (DVR)</button>
                  <button onClick={() => setSystemType('IP')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${systemType === 'IP' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>IP (NVR)</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Cable (m)</label><input type="number" value={cableLength} onChange={e => setCableLength(Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                </div>
                
                {/* Analog vs IP Cost Comparison */}
                <div className={`mt-4 p-3 rounded-lg flex justify-between items-center ${isLight ? 'bg-gray-100' : 'bg-gray-900/50'}`}>
                  <div>
                    <p className="text-sm font-bold">Compare with {systemType === 'Analog' ? 'IP' : 'Analog'}</p>
                    <p className="text-xs text-muted">Switch to {systemType === 'Analog' ? 'IP' : 'Analog'} for {formatKES(calculateCCTVTotal(systemType === 'Analog' ? 'IP' : 'Analog'))}</p>
                  </div>
                  <button onClick={() => setSystemType(systemType === 'Analog' ? 'IP' : 'Analog')} className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-bold">Switch</button>
                </div>
              </div>

              {/* IP Camera Setup Wizard */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><CheckSquare className="w-5 h-5 text-green-500" /> <span>Camera Setup Wizard</span></h3>
                <div className="space-y-2">
                  {['Change default IP to match site subnet', 'Set Gateway and DNS', 'Add camera to NVR/DVR', 'Configure Hik-Connect/DMSS App', 'Test motion detection and alerts'].map((step, idx) => (
                    <label key={idx} className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={wizardStep > idx} onChange={() => setWizardStep(idx + 1)} className="rounded" />
                      <span className={`text-sm ${wizardStep > idx ? 'line-through text-gray-500' : ''}`}>{step}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Site Survey Photo */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><ImageIcon className="w-5 h-5 text-blue-500" /> <span>Site Photo Attachment</span></h3>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm" />
                {sitePhoto && <img src={sitePhoto} alt="Site" className="mt-4 h-32 object-cover rounded border" />}
                <p className={`text-xs mt-2 ${textMuted}`}>This photo will be embedded in the PDF quotation.</p>
              </div>

            </div>

            {/* Summary Sidebar */}
            <div className={`p-6 rounded-xl border ${bgCard} h-fit`}>
              <h3 className="text-lg font-bold mb-4">Quote Summary</h3>
              <div className={`space-y-2 text-sm ${textMuted}`}>
                <div className="flex justify-between"><span>Cameras:</span> <span>{formatKES((systemType === 'IP' ? CATALOG.cameras.ipBullet.price : CATALOG.cameras.analogBullet.price) * quantity)}</span></div>
                <div className="flex justify-between"><span>Recorder:</span> <span>{formatKES(systemType === 'IP' ? CATALOG.nvrs.hik4.price : CATALOG.dvrs.hik4.price)}</span></div>
                <div className="flex justify-between"><span>Storage:</span> <span>{formatKES(CATALOG.storage.hdd500.price)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total:</span> <span className="text-green-500">{formatKES(calculateCCTVTotal())}</span></div>
              </div>
              <button onClick={() => setCurrentView('report')} className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-lg">Preview PDF</button>
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
              <button onClick={() => setCabDevices([...cabDevices, { id: Date.now(), room: cabRoom, length: cabLength, type: cabType }])} className="w-full py-2 bg-blue-600 text-white rounded font-bold">Add Drop</button>
            </div>

            <div className={`p-6 rounded-xl border lg:col-span-2 ${bgCard}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Bill of Materials</h3>
                <button onClick={() => setShowLabels(true)} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center space-x-1">
                  <Tag className="w-4 h-4" /> <span>Print Cable Labels</span>
                </button>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Total Drops:</span> <span>{cabTotals.ports}</span></div>
                <div className="flex justify-between"><span>Cable Required:</span> <span>{Math.round(cabTotals.lengthWithWaste)}m</span></div>
                <div className="flex justify-between"><span>Cat6 Boxes (305m):</span> <span>{cabTotals.boxes}</span></div>
                <div className="flex justify-between"><span>24-Port Patch Panels:</span> <span>{cabTotals.patchPanels}</span></div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total Cost:</span> <span className="text-green-500">{formatKES(cabTotals.cost)}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ENGINEER TOOLS (6 TOOLS) ================= */}
        {currentView === 'tools' && (
          <div className="space-y-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {['poe', 'fov', 'voltage', 'subnet'].map(t => (
                <button key={t} onClick={() => setActiveTool(t)} className={`px-4 py-2 rounded-lg font-bold capitalize ${activeTool === t ? 'bg-blue-600 text-white' : bgButton}`}>{t}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* PoE Tool */}
              {activeTool === 'poe' && (
                <div className={`p-6 rounded-xl border ${bgCard} lg:col-span-3`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Zap className="w-5 h-5 text-yellow-500" /> <span>PoE Calculator</span></h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs">IP Cameras (15W)</label><input type="number" value={poeCams} onChange={e => setPoeCams(e.target.value)} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Access Points (20W)</label><input type="number" value={poeAps} onChange={e => setPoeAps(e.target.value)} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  </div>
                  <div className={`p-4 rounded text-center ${isLight ? 'bg-yellow-50' : 'bg-yellow-900/20'}`}>
                    <p className="text-2xl font-bold text-yellow-600">{(poeCams*15) + (poeAps*20)} Watts Required</p>
                  </div>
                </div>
              )}

              {/* FOV Simulator */}
              {activeTool === 'fov' && (
                <div className={`p-6 rounded-xl border ${bgCard} lg:col-span-3`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Video className="w-5 h-5 text-blue-500" /> <span>FOV Simulator</span></h3>
                  <select value={lensType} onChange={e => setLensType(e.target.value)} className={`w-full p-2 rounded mb-4 ${bgInput}`}>
                    <option value="2.8">2.8mm Lens (Wide ~100°)</option>
                    <option value="3.6">3.6mm Lens (Standard ~80°)</option>
                    <option value="4">4.0mm Lens (Narrow ~70°)</option>
                    <option value="6">6.0mm Lens (Telephoto ~50°)</option>
                  </select>
                  <div className="relative h-64 bg-gray-200 dark:bg-gray-900 rounded overflow-hidden border">
                    {/* Visual representation of FOV cone */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                       <div className="w-4 h-4 bg-red-500 rounded-full shadow" />
                       <div className="absolute top-1/2 left-1/2 w-0 h-0 border-l-[150px] border-l-transparent border-r-[150px] border-r-transparent border-t-[300px] border-t-blue-500/30 transform -translate-x-1/2 -translate-y-full origin-bottom"
                            style={{ transform: `translate(-50%, -100%) rotate(${lensType === '2.8' ? '60' : lensType === '3.6' ? '50' : lensType === '4' ? '45' : '35'}deg)` }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Voltage Drop */}
              {activeTool === 'voltage' && (
                <div className={`p-6 rounded-xl border ${bgCard} lg:col-span-3`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Activity className="w-5 h-5 text-orange-500" /> <span>Voltage Drop Calculator (12V)</span></h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs">Cable Length (m)</label><input type="number" value={voltLength} onChange={e => setVoltLength(e.target.value)} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Camera Load (Amps)</label><input type="number" step="0.1" value={voltAmps} onChange={e => setVoltAmps(e.target.value)} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  </div>
                  <div className={`p-4 rounded text-center ${isLight ? 'bg-orange-50' : 'bg-orange-900/20'}`}>
                    <p className="text-sm">Approx Voltage at Camera</p>
                    <p className="text-2xl font-bold text-orange-600">{(12 - (voltLength * voltAmps * 0.0164)).toFixed(2)} Volts</p>
                    {(12 - (voltLength * voltAmps * 0.0164)) < 10.5 && <p className="text-red-500 text-xs mt-2 font-bold flex items-center justify-center space-x-1"><AlertTriangle className="w-3 h-3"/> <span>Warning: Below 10.5V! Use thicker cable or local power.</span></p>}
                  </div>
                </div>
              )}

              {/* Subnet Splitter */}
              {activeTool === 'subnet' && (
                <div className={`p-6 rounded-xl border ${bgCard} lg:col-span-3`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Table className="w-5 h-5 text-purple-500" /> <span>Subnet / VLAN Planner</span></h3>
                  <p className="text-sm mb-4">Plan your network separation for a 192.168.1.0/24 network.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-sm"><span>VLAN 10 - Data (PCs/Printers)</span><span className="font-mono">192.168.10.0/24</span></div>
                    <div className="flex justify-between p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-sm"><span>VLAN 20 - CCTV (NVR/Cams)</span><span className="font-mono">192.168.20.0/24</span></div>
                    <div className="flex justify-between p-2 bg-green-100 dark:bg-green-900/30 rounded text-sm"><span>VLAN 30 - VoIP Phones</span><span className="font-mono">192.168.30.0/24</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= REPORT / PDF (Includes Brand Chart & Photo) ================= */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <button onClick={() => setCurrentView('cctv-planner')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>← Back</button>
              <button onClick={() => handleDownloadPDF('pdf-cctv-container', 'CCTV_Quote.pdf')} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg flex items-center space-x-2"><Download className="w-5 h-5" /> Download PDF</button>
            </div>
            
            <div className={`flex justify-center p-4 rounded-xl overflow-x-auto ${isLight ? 'bg-gray-200' : isDark ? 'bg-gray-800' : 'bg-[#111]'}`}>
              <div id="pdf-cctv-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px', fontFamily: 'Arial, sans-serif' }}>
                
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px' }}>
                  <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>QUOTATION</h1>
                </div>

                {sitePhoto && (
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <img src={sitePhoto} alt="Site" style={{ maxHeight: '200px', margin: '0 auto', borderRadius: '8px' }} />
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Proposed Installation Site</p>
                  </div>
                )}

                <h3 style={{ color: '#1e3a8a', fontSize: '18px', marginTop: '30px', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>Brand Comparison</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Feature</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Hikvision (Premium)</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Dahua (Value)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '8px', border: '1px solid #ddd' }}>Video Quality</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>Excellent Color / Night Vision</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>Very Good</td></tr>
                    <tr><td style={{ padding: '8px', border: '1px solid #ddd' }}>App Experience</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>Hik-Connect (Smooth)</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>DMSS (Good)</td></tr>
                    <tr><td style={{ padding: '8px', border: '1px solid #ddd' }}>Warranty</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>2 Years</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>1-2 Years</td></tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>TOTAL ESTIMATED COST</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(calculateCCTVTotal())}</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ================= CABLE LABEL MODAL ================= */}
        {showLabels && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className={`w-full max-w-2xl p-6 rounded-xl shadow-2xl ${bgCard}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cable Labels</h2>
                <button onClick={() => setShowLabels(false)} className="text-red-500 font-bold">Close</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2 bg-white text-black">
                {cabDevices.map((d, i) => (
                  <div key={d.id} className="border-2 border-dashed border-gray-400 p-2 text-center rounded">
                    <p className="font-bold text-sm">{d.room}</p>
                    <p className="text-xs text-gray-600">Port {i + 1}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Cat6 Drop</p>
                  </div>
                ))}
              </div>
              <button onClick={() => window.print()} className="w-full mt-4 py-2 bg-blue-600 text-white font-bold rounded">Print Labels</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}