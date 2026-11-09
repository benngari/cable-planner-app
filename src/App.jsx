// src/App.jsx
import React, { useState } from 'react';
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

  // --- ENGINEER TOOLS STATE ---
  const [poeCams, setPoeCams] = useState(4);
  const [poeAps, setPoeAps] = useState(2);
  const [baseIp, setBaseIp] = useState('192.168.1.0');
  const [subnetMask, setSubnetMask] = useState('24');
  const [runRooms, setRunRooms] = useState(5);
  const [runFloors, setRunFloors] = useState(1);

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

  // --- TOOLS CALCULATIONS ---
  const poeTotalWatts = (poeCams * 15) + (poeAps * 20);
  
  const getSubnetInfo = () => {
    const cidr = parseInt(subnetMask);
    const hosts = Math.pow(2, 32 - cidr) - 2;
    const ipParts = baseIp.split('.').map(Number);
    const gateway = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.1`;
    return { hosts, gateway };
  };
  const subnet = getSubnetInfo();

  const estCable = Math.round((runRooms * 25) + (runFloors * 15));
  const estConduit = Math.round(estCable * 1.1);

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
            <div onClick={() => setCurrentView('tools')} className={`cursor-pointer p-6 rounded-2xl border transition-all hover:border-green-500 shadow-sm hover:shadow-md ${bgCard}`}>
              <Wrench className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Engineer Tools</h3>
              <p className={`text-sm ${textMuted}`}>PoE, IP Subnet, and Cable Run estimators.</p>
            </div>
          </div>
        )}

        {/* ENGINEER TOOLS */}
        {currentView === 'tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* PoE Calculator */}
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Zap className="w-5 h-5 text-yellow-500" /> <span>PoE Switch Calculator</span></h3>
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`text-sm block mb-1 ${textMuted}`}>Number of IP Cameras (15W each)</label>
                  <input type="number" value={poeCams} onChange={e => setPoeCams(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                </div>
                <div>
                  <label className={`text-sm block mb-1 ${textMuted}`}>Number of Access Points (20W each)</label>
                  <input type="number" value={poeAps} onChange={e => setPoeAps(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                </div>
              </div>
              <div className={`p-4 rounded-lg text-center ${isLight ? 'bg-yellow-50' : 'bg-yellow-900/20'}`}>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Total Power Required</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{poeTotalWatts} Watts</p>
                <p className={`text-xs mt-2 ${textMuted}`}>
                  Rec: {poeTotalWatts > 120 ? '16-Port PoE Switch (250W+)' : '8-Port PoE Switch (120W)'}
                </p>
              </div>
            </div>

            {/* IP Subnet Calculator */}
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Globe className="w-5 h-5 text-blue-500" /> <span>IP Subnet Calculator</span></h3>
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`text-sm block mb-1 ${textMuted}`}>Network Base IP</label>
                  <input type="text" value={baseIp} onChange={e => setBaseIp(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                </div>
                <div>
                  <label className={`text-sm block mb-1 ${textMuted}`}>Subnet Mask (CIDR)</label>
                  <select value={subnetMask} onChange={e => setSubnetMask(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                    <option value="24">/24 (255.255.255.0)</option>
                    <option value="16">/16 (255.255.0.0)</option>
                  </select>
                </div>
              </div>
              <div className={`p-4 rounded-lg text-sm space-y-2 ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                <div className="flex justify-between"><span>Usable Hosts:</span> <span className="font-bold">{subnet.hosts}</span></div>
                <div className="flex justify-between"><span>Gateway (Router):</span> <span className="font-bold text-blue-600 dark:text-blue-400">{subnet.gateway}</span></div>
              </div>
            </div>

            {/* Cable Run Estimator */}
            <div className={`p-6 rounded-xl border ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Ruler className="w-5 h-5 text-green-500" /> <span>Cable Run Estimator</span></h3>
              <div className="space-y-3 mb-4">
                <div>
                  <label className={`text-sm block mb-1 ${textMuted}`}>Number of Rooms / Drops</label>
                  <input type="number" value={runRooms} onChange={e => setRunRooms(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                </div>
                <div>
                  <label className={`text-sm block mb-1 ${textMuted}`}>Number of Floors</label>
                  <input type="number" value={runFloors} onChange={e => setRunFloors(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                </div>
              </div>
              <div className={`p-4 rounded-lg text-center ${isLight ? 'bg-green-50' : 'bg-green-900/20'}`}>
                <p className="text-sm text-green-700 dark:text-green-400">Estimated Cable Needed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500">{estCable} meters</p>
                <p className={`text-xs mt-2 ${textMuted}`}>Conduit Needed: ~{estConduit} meters</p>
              </div>
            </div>

            <div className="lg:col-span-3 text-center mt-4">
              <button onClick={() => setCurrentView('welcome')} className={`px-6 py-2 rounded-lg font-bold ${bgButton}`}>Back to Menu</button>
            </div>
          </div>
        )}

        {/* CCTV PLANNER (Same as before, keep your layout) */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ... Keep your existing CCTV code here ... */}
            <div className="lg:col-span-3 text-center mt-4">
               <button onClick={() => setCurrentView('welcome')} className={`px-6 py-2 rounded-lg font-bold ${bgButton}`}>Back to Menu</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}