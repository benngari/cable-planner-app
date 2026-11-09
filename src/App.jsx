// src/App.jsx
import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Camera, Network, Cable, Home as HomeIcon, FileSpreadsheet, 
  Sun, Moon, CircleDot, Cpu, Lightbulb, ArrowRight, Download, 
  Settings, CheckCircle, Printer, MonitorPlay, Server, Cloud, 
  HardDrive, Zap, ChevronDown, Wrench, Calculator, Globe, 
  Ruler, Plus, Trash2, MapPin, User, Briefcase, Monitor, 
  ClipboardCheck, ShoppingCart, Info, Layers, ListPlus
} from 'lucide-react';

const CATALOG = {
  dvrs: {
    hik4: { name: 'Hikvision 4-Ch DVR', price: 5700 },
    hik8: { name: 'Hikvision 8-Ch DVR', price: 8500 },
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
  },
  monitors: {
    none: { name: 'No Monitor', price: 0 },
    m22: { name: '22" CCTV Monitor', price: 13000 },
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
  },
  cabling: {
    cat6Box: { name: 'Cat6 Box (305m)', price: 19500 },
    keystone: { name: 'Keystone Jack', price: 150 },
    faceplate: { name: 'Faceplate', price: 200 },
    patchPanel: { name: '24-Port Patch Panel', price: 4500 },
    patchCord: { name: 'Patch Cord', price: 450 },
    laborPerDrop: 1500 // Labor per data point
  }
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 

  // Client Info
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });
  const [businessInfo, setBusinessInfo] = useState({ name: 'Ngari Tech Solutions', phone: '0711645837' });

  // CCTV State
  const [systemType, setSystemType] = useState('Analog'); 
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('analogBullet');
  const [cableLength, setCableLength] = useState(50);

  // Cabling Planner State
  const [cabDevices, setCabDevices] = useState([]);
  const [cabRoom, setCabRoom] = useState('');
  const [cabType, setCabType] = useState('Data (PC)');
  const [cabLength, setCabLength] = useState(30);

  // Engineer Tools State
  const [poeCams, setPoeCams] = useState(4);
  const [poeAps, setPoeAps] = useState(2);
  const [baseIp, setBaseIp] = useState('192.168.1.0');
  const [subnetMask, setSubnetMask] = useState('24');
  const [runRooms, setRunRooms] = useState(5);
  const [runFloors, setRunFloors] = useState(1);

  // Theme Logic
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

  // --- CABLING CALCULATIONS ---
  const addCabDevice = () => {
    if (!cabRoom.trim()) return alert("Enter a room name");
    setCabDevices([...cabDevices, { id: Date.now(), room: cabRoom, type: cabType, length: Number(cabLength) }]);
    setCabRoom('');
  };

  const calculateCabling = () => {
    const ports = cabDevices.length;
    const rawLength = cabDevices.reduce((sum, d) => sum + d.length, 0);
    const lengthWithWaste = rawLength * 1.15; // 15% slack
    const boxes = Math.ceil(lengthWithWaste / 305) || 0;
    const keystones = ports;
    const faceplates = ports; // Assuming 1 faceplate per drop
    const patchPanels = Math.ceil(ports / 24) || 0;
    const patchCords = ports;

    const cableCost = boxes * CATALOG.cabling.cat6Box.price;
    const keystoneCost = keystones * CATALOG.cabling.keystone.price;
    const faceplateCost = faceplates * CATALOG.cabling.faceplate.price;
    const patchPanelCost = patchPanels * CATALOG.cabling.patchPanel.price;
    const patchCordCost = patchCords * CATALOG.cabling.patchCord.price;
    const laborCost = ports * CATALOG.cabling.laborPerDrop;

    const total = cableCost + keystoneCost + faceplateCost + patchPanelCost + patchCordCost + laborCost;

    return { ports, lengthWithWaste, boxes, keystones, faceplates, patchPanels, patchCords, cableCost, keystoneCost, faceplateCost, patchPanelCost, patchCordCost, laborCost, total };
  };
  const cabTotals = calculateCabling();

  // --- CCTV CALCULATIONS ---
  const calculateCCTVTotal = () => {
    const camCost = CATALOG.cameras[selectedCamera].price * quantity;
    const recorderCost = systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].price : CATALOG.nvrs[selectedDvr].price;
    const storageCost = CATALOG.storage.hdd500.price;
    const cableCost = cableLength * (systemType === 'Analog' ? CATALOG.accessories.rg59.price : CATALOG.accessories.cat6.price);
    const accCost = systemType === 'Analog' ? (CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price) : 0;
    return camCost + recorderCost + storageCost + cableCost + accCost + CATALOG.labor.basic.price;
  };

  // --- TOOLS CALCULATIONS ---
  const poeTotalWatts = (poeCams * 15) + (poeAps * 20);
  const getSubnetInfo = () => {
    const cidr = parseInt(subnetMask);
    const hosts = Math.pow(2, 32 - cidr) - 2;
    const ipParts = baseIp.split('.').map(Number);
    return { hosts, gateway: `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.1` };
  };
  const subnet = getSubnetInfo();
  const estCable = Math.round((runRooms * 25) + (runFloors * 15));

  const handleDownloadPDF = (type) => {
    const element = document.getElementById(`pdf-${type}-container`);
    html2pdf().set({ margin: 0.5, filename: `${type === 'cctv' ? 'CCTV_Quote' : 'Cabling_BOM'}_${clientInfo.name || 'Client'}.pdf`, html2canvas: { scale: 2, useCORS: true } }).from(element).save();
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
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

        {/* CABLING PLANNER */}
        {currentView === 'cabling-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-1 space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Plus className="w-5 h-5 text-blue-500" /> <span>Add Data Drop</span></h3>
                <div className="space-y-4">
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Room / Location</label>
                    <input type="text" placeholder="e.g. Reception" value={cabRoom} onChange={e => setCabRoom(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Device Type</label>
                    <select value={cabType} onChange={e => setCabType(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                      <option value="Data (PC/Printer)">Data (PC/Printer)</option>
                      <option value="Access Point">Wireless Access Point</option>
                      <option value="VoIP Phone">VoIP Phone</option>
                      <option value="IP Camera">IP Camera</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs block mb-1 ${textMuted}`}>Cable Length (meters)</label>
                    <input type="number" value={cabLength} onChange={e => setCabLength(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                  <button onClick={addCabDevice} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <ListPlus className="w-4 h-4" /> <span>Add Drop</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIST & BOM */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* List of Drops */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4">Planned Drops ({cabDevices.length})</h3>
                {cabDevices.length === 0 ? (
                  <p className={`text-sm ${textMuted}`}>No drops added yet. Add your first drop on the left.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {cabDevices.map(d => (
                      <div key={d.id} className={`flex justify-between items-center p-2 rounded-lg text-sm ${bgInput}`}>
                        <span><span className="font-bold text-blue-500">{d.type}</span> • {d.room} • {d.length}m</span>
                        <button onClick={() => setCabDevices(cabDevices.filter(x => x.id !== d.id))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BOM Summary */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center space-x-2"><Layers className="w-5 h-5 text-green-500" /> <span>Bill of Materials</span></h3>
                  <button onClick={() => setCurrentView('report')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm transition-colors">Preview PDF</button>
                </div>
                
                <div className={`space-y-2 text-sm ${textMuted}`}>
                  <div className="flex justify-between"><span>Total Drops:</span> <span className={textMain}>{cabTotals.ports} Ports</span></div>
                  <div className="flex justify-between"><span>Total Cable (with 15% slack):</span> <span className={textMain}>{Math.round(cabTotals.lengthWithWaste)} meters</span></div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2"></div>
                  
                  <div className="flex justify-between"><span>Cat6 Boxes (305m):</span> <span className={textMain}>{cabTotals.boxes} boxes</span></div>
                  <div className="flex justify-between"><span>Keystone Jacks:</span> <span className={textMain}>{cabTotals.keystones} pcs</span></div>
                  <div className="flex justify-between"><span>Faceplates:</span> <span className={textMain}>{cabTotals.faceplates} pcs</span></div>
                  <div className="flex justify-between"><span>24-Port Patch Panels:</span> <span className={textMain}>{cabTotals.patchPanels} units</span></div>
                  <div className="flex justify-between"><span>Patch Cords:</span> <span className={textMain}>{cabTotals.patchCords} pcs</span></div>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3 flex justify-between font-bold text-lg">
                    <span>Total Est. Cost:</span> 
                    <span className="text-green-500">{formatKES(cabTotals.total)}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ENGINEER TOOLS (Keep as previous) */}
        {currentView === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Zap className="w-5 h-5 text-yellow-500" /> <span>PoE Calculator</span></h3>
              <input type="number" value={poeCams} onChange={e => setPoeCams(Number(e.target.value))} placeholder="IP Cams" className={`w-full px-3 py-2 mb-2 rounded border ${bgInput}`} />
              <input type="number" value={poeAps} onChange={e => setPoeAps(Number(e.target.value))} placeholder="APs" className={`w-full px-3 py-2 mb-4 rounded border ${bgInput}`} />
              <div className={`p-4 rounded-lg text-center ${isLight ? 'bg-yellow-50' : 'bg-yellow-900/20'}`}>
                <p className="text-sm">Power Required</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{poeTotalWatts}W</p>
              </div>
            </div>
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Globe className="w-5 h-5 text-blue-500" /> <span>Subnet Calculator</span></h3>
              <input type="text" value={baseIp} onChange={e => setBaseIp(e.target.value)} className={`w-full px-3 py-2 mb-2 rounded border ${bgInput}`} />
              <select value={subnetMask} onChange={e => setSubnetMask(e.target.value)} className={`w-full px-3 py-2 mb-4 rounded border ${bgInput}`}>
                <option value="24">/24 (255.255.255.0)</option>
                <option value="16">/16 (255.255.0.0)</option>
              </select>
              <div className={`p-4 rounded-lg ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                <p className="text-sm">Gateway: <span className="font-bold">{subnet.gateway}</span></p>
                <p className="text-sm">Hosts: <span className="font-bold">{subnet.hosts}</span></p>
              </div>
            </div>
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Ruler className="w-5 h-5 text-green-500" /> <span>Cable Estimator</span></h3>
              <input type="number" value={runRooms} onChange={e => setRunRooms(Number(e.target.value))} placeholder="Rooms" className={`w-full px-3 py-2 mb-2 rounded border ${bgInput}`} />
              <input type="number" value={runFloors} onChange={e => setRunFloors(Number(e.target.value))} placeholder="Floors" className={`w-full px-3 py-2 mb-4 rounded border ${bgInput}`} />
              <div className={`p-4 rounded-lg text-center ${isLight ? 'bg-green-50' : 'bg-green-900/20'}`}>
                <p className="text-sm">Cable Needed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500">{estCable}m</p>
              </div>
            </div>
          </div>
        )}

        {/* REPORT VIEW (Handles both CCTV & Cabling PDFs) */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('cabling-planner')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>← Back</button>
              <button onClick={() => handleDownloadPDF('cabling')} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center space-x-2">
                <Download className="w-5 h-5" /> <span>Download PDF</span>
              </button>
            </div>
            
            <div className={`flex justify-center p-4 rounded-xl overflow-x-auto ${isLight ? 'bg-gray-200' : isDark ? 'bg-gray-800' : 'bg-[#111]'}`}>
              <div id="pdf-cabling-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px', fontFamily: 'Arial, sans-serif' }}>
                
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px' }}>
                  <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>CABLING BOM</h1>
                  <p style={{ marginTop: '10px' }}>Date: {new Date().toLocaleDateString()}</p>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ color: '#1e3a8a', fontSize: '18px' }}>Project Summary</h3>
                  <p>Total Drops: {cabTotals.ports}</p>
                  <p>Total Cable Required: {Math.round(cabTotals.lengthWithWaste)}m</p>
                </div>

                <h3 style={{ color: '#1e3a8a', fontSize: '18px', marginTop: '30px' }}>Bill of Materials</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Item</th>
                      <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Qty</th>
                      <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Cat6 Boxes (305m)</td><td style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>{cabTotals.boxes}</td><td style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatKES(cabTotals.cableCost)}</td></tr>
                    <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Keystone Jacks</td><td style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>{cabTotals.keystones}</td><td style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatKES(cabTotals.keystoneCost)}</td></tr>
                    <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Faceplates</td><td style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>{cabTotals.faceplates}</td><td style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatKES(cabTotals.faceplateCost)}</td></tr>
                    <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>24-Port Patch Panels</td><td style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>{cabTotals.patchPanels}</td><td style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatKES(cabTotals.patchPanelCost)}</td></tr>
                    <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Patch Cords</td><td style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>{cabTotals.patchCords}</td><td style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatKES(cabTotals.patchCordCost)}</td></tr>
                    <tr><td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Installation Labor</td><td style={{ textAlign: 'center', borderBottom: '1px solid #eee' }}>-</td><td style={{ textAlign: 'right', borderBottom: '1px solid #eee' }}>{formatKES(cabTotals.laborCost)}</td></tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>TOTAL ESTIMATED COST</p>
                  <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(cabTotals.total)}</p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}