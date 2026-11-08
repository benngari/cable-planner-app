// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Camera, Network, Cable, Home as HomeIcon, FileSpreadsheet, 
  Sun, Moon, CircleDot, Cpu, Lightbulb, ArrowRight, Download, 
  Settings, CheckCircle, Printer, MonitorPlay, Server, Cloud, 
  HardDrive, Zap, ChevronDown, Wrench, Calculator, Globe, 
  Ruler, Plus, Trash2, MapPin, Wifi, Phone
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
  },
  accessories: {
    psu: { name: 'Power Supply', price: 1500 },
    rg59: { name: 'RG59 Cable (per meter)', price: 20 },
    cat6: { name: 'Cat6 Cable (per meter)', price: 65 },
    connectors: { name: 'BNC/DC Connectors', price: 250 }
  },
  labor: {
    basic: { name: 'Basic Installation', price: 4500 },
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

  // CCTV State
  const [systemType, setSystemType] = useState('Analog'); // Analog or IP
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('analogBullet');
  const [cableLength, setCableLength] = useState(50);

  // Cabling Planner State
  const [cabDevices, setCabDevices] = useState([]);
  const [cabDevType, setCabDevType] = useState('Data');
  const [cabDevRoom, setCabDevRoom] = useState('Office');
  const [cabDevLength, setCabDevLength] = useState(30);

  // PoE State
  const [poeCams, setPoeCams] = useState(4);
  const [poeAps, setPoeAps] = useState(2);

  // Subnet State
  const [baseIp, setBaseIp] = useState('192.168.1.0');
  const [subnetMask, setSubnetMask] = useState('24');

  // Cable Run State
  const [runRooms, setRunRooms] = useState(5);
  const [runFloors, setRunFloors] = useState(1);

  // THEME LOGIC
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

  // --- CALCULATIONS ---
  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  // CCTV Total
  const calculateCCTVTotal = () => {
    const camCost = CATALOG.cameras[selectedCamera].price * quantity;
    const recorderCost = systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].price : CATALOG.nvrs[selectedDvr].price;
    const storageCost = CATALOG.storage.hdd500.price;
    const cableCost = cableLength * (systemType === 'Analog' ? CATALOG.accessories.rg59.price : CATALOG.accessories.cat6.price);
    const accCost = systemType === 'Analog' ? (CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price) : 0;
    return camCost + recorderCost + storageCost + cableCost + accCost + CATALOG.labor.basic.price;
  };

  // Cabling Total
  const calculateCabling = () => {
    let ports = cabDevices.length;
    let totalLength = cabDevices.reduce((sum, d) => sum + d.length, 0);
    let lengthWithWaste = totalLength * 1.15; // 15% slack
    let boxes = Math.ceil(lengthWithWaste / 305) || 0;
    let patchPanels = Math.ceil(ports / 24) || 0;
    
    let cableCost = boxes * CATALOG.cabling.cat6Box.price;
    let hardCost = (ports * CATALOG.cabling.keystone.price) + (Math.ceil(ports/2) * CATALOG.cabling.faceplate.price) + (patchPanels * CATALOG.cabling.patchPanel.price) + (ports * CATALOG.cabling.patchCord.price);
    let labor = CATALOG.labor.basic.price;
    
    return { ports, lengthWithWaste, boxes, patchPanels, total: cableCost + hardCost + labor };
  };
  const cabTotals = calculateCabling();

  // PoE Calc
  const poeTotalWatts = (poeCams * 15) + (poeAps * 20);

  // Subnet Calc (Simplified for IPv4)
  const getSubnetInfo = () => {
    const cidr = parseInt(subnetMask);
    const hosts = Math.pow(2, 32 - cidr) - 2;
    const ipParts = baseIp.split('.').map(Number);
    // Assuming /24 for basic calc representation
    const gateway = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.1`;
    const dhcpStart = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.10`;
    const dhcpEnd = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.250`;
    return { hosts, gateway, dhcpStart, dhcpEnd };
  };
  const subnet = getSubnetInfo();

  // Cable Run Estimator
  const estCable = Math.round((runRooms * 25) + (runFloors * 15));
  const estConduit = Math.round(estCable * 1.1); // 10% extra

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-report-container');
    html2pdf().set({ margin: 0.5, filename: `Quote.pdf`, html2canvas: { scale: 2, useCORS: true } }).from(element).save();
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
            <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl transition-colors ${bgButton}`}>
              <HomeIcon className="w-5 h-5" />
            </button>
            
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
              <p className={`text-sm ${textMuted}`}>Quote Analog (DVR) and IP (NVR) CCTV systems.</p>
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

        {/* CCTV PLANNER */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Settings className="w-5 h-5 text-blue-500" /> <span>System Configuration</span></h3>
                
                {/* System Type Toggle */}
                <div className="flex space-x-4 mb-6">
                  <button onClick={() => { setSystemType('Analog'); setSelectedCamera('analogBullet'); setSelectedDvr('hik4'); }} className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${systemType === 'Analog' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' : `border-transparent ${bgInput}`}`}>
                    Analog (DVR + Coax) - Cheaper
                  </button>
                  <button onClick={() => { setSystemType('IP'); setSelectedCamera('ipBullet'); setSelectedDvr('hik4'); }} className={`flex-1 py-3 rounded-lg font-bold border-2 transition-all ${systemType === 'IP' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : `border-transparent ${bgInput}`}`}>
                    IP (NVR + Cat6) - Higher Res
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>{systemType === 'Analog' ? 'DVR' : 'NVR'}</label>
                    <select value={selectedDvr} onChange={e => setSelectedDvr(e.target.value)} className={`w-full px-3 py-2 rounded-lg border mb-3 outline-none ${bgInput}`}>
                      {Object.entries(systemType === 'Analog' ? CATALOG.dvrs : CATALOG.nvrs).map(([k, v]) => <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>Camera Type</label>
                    <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} className={`w-full px-3 py-2 rounded-lg border mb-3 outline-none ${bgInput}`}>
                      {Object.entries(CATALOG.cameras).filter(([k, v]) => v.type === systemType).map(([k, v]) => <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>Cable Length (m)</label>
                    <input type="number" value={cableLength} onChange={e => setCableLength(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4">Cost Summary</h3>
                <div className={`space-y-2 text-sm ${textMuted}`}>
                  <div className="flex justify-between"><span>Cameras ({quantity}x):</span> <span className={textMain}>{formatKES(CATALOG.cameras[selectedCamera].price * quantity)}</span></div>
                  <div className="flex justify-between"><span>{systemType === 'Analog' ? 'DVR' : 'NVR'}:</span> <span className={textMain}>{formatKES(systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].price : CATALOG.nvrs[selectedDvr].price)}</span></div>
                  <div className="flex justify-between"><span>Storage:</span> <span className={textMain}>{formatKES(CATALOG.storage.hdd500.price)}</span></div>
                  <div className="flex justify-between"><span>Cable:</span> <span className={textMain}>{formatKES(cableLength * (systemType === 'Analog' ? CATALOG.accessories.rg59.price : CATALOG.accessories.cat6.price))}</span></div>
                  {systemType === 'Analog' && <div className="flex justify-between"><span>PSU & Connectors:</span> <span className={textMain}>{formatKES(CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price)}</span></div>}
                  <div className="flex justify-between"><span>Labor:</span> <span className={textMain}>{formatKES(CATALOG.labor.basic.price)}</span></div>
                  <div className={`flex justify-between font-bold text-lg border-t pt-3 mt-3 ${isLight ? 'border-gray-200' : isDark ? 'border-gray-700' : 'border-[#222]'}`}>
                    <span>Total:</span> <span className="text-green-500">{formatKES(calculateCCTVTotal())}</span>
                  </div>
                </div>
                <button onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Preview PDF Quote</button>
              </div>
            </div>
          </div>
        )}

        {/* CABLING PLANNER */}
        {currentView === 'cabling-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Plus className="w-5 h-5 text-blue-500" /> <span>Add Device Drop</span></h3>
                <div className="space-y-4">
                  <select value={cabDevType} onChange={e => setCabDevType(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`}>
                    <option value="Data">Data Point (PC/Printer)</option>
                    <option value="AP">Wireless Access Point</option>
                    <option value="VoIP">VoIP Phone</option>
                    <option value="IPCam">IP Camera</option>
                  </select>
                  <input type="text" placeholder="Room / Location" value={cabDevRoom} onChange={e => setCabDevRoom(e.target.value)} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  <input type="number" placeholder="Cable Length (m)" value={cabDevLength} onChange={e => setCabDevLength(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border outline-none ${bgInput}`} />
                  <button onClick={() => setCabDevices([...cabDevices, { id: Date.now(), type: cabDevType, room: cabDevRoom, length: cabDevLength }])} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Add to Plan</button>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4">Planned Drops ({cabDevices.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mb-6">
                  {cabDevices.map(d => (
                    <div key={d.id} className={`flex justify-between items-center p-2 rounded-lg text-sm ${bgInput}`}>
                      <span><span className="font-bold text-blue-500">{d.type}</span> • {d.room} • {d.length}m</span>
                      <button onClick={() => setCabDevices(cabDevices.filter(x => x.id !== d.id))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>

                <div className={`p-4 rounded-lg mb-4 ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Bill of Materials (BOM)</h4>
                  <div className={`space-y-1 text-sm ${textMuted}`}>
                    <div className="flex justify-between"><span>Total Cable Length (+15% slack):</span> <span className={textMain}>{Math.round(cabTotals.lengthWithWaste)} meters</span></div>
                    <div className="flex justify-between"><span>Cat6 Boxes (305m):</span> <span className={textMain}>{cabTotals.boxes} boxes</span></div>
                    <div className="flex justify-between"><span>Keystone Jacks:</span> <span className={textMain}>{cabTotals.ports} pcs</span></div>
                    <div className="flex justify-between"><span>Patch Panels (24-port):</span> <span className={textMain}>{cabTotals.patchPanels} units</span></div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-300 dark:border-gray-600"><span>Estimated Hardware Cost:</span> <span className="text-green-500">{formatKES(cabTotals.total)}</span></div>
                  </div>
                </div>
              </div>
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
                  Recommendation: {poeTotalWatts > 120 ? '16-Port PoE Switch (250W+)' : '8-Port PoE Switch (120W)'}
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
                    <option value="23">/23 (255.255.254.0)</option>
                    <option value="16">/16 (255.255.0.0)</option>
                  </select>
                </div>
              </div>
              <div className={`p-4 rounded-lg text-sm space-y-2 ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                <div className="flex justify-between"><span>Usable Hosts:</span> <span className="font-bold">{subnet.hosts}</span></div>
                <div className="flex justify-between"><span>Gateway (Router):</span> <span className="font-bold text-blue-600 dark:text-blue-400">{subnet.gateway}</span></div>
                <div className="flex justify-between"><span>DHCP Range:</span> <span className="font-mono text-xs">{subnet.dhcpStart} - {subnet.dhcpEnd}</span></div>
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
                <p className={`text-xs mt-2 ${textMuted}`}>Conduit/PVC Needed: ~{estConduit} meters</p>
              </div>
            </div>

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
              <div id="pdf-report-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px' }}>
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px' }}>
                  <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>QUOTATION</h1>
                  <p style={{ marginTop: '10px' }}>System: {systemType} CCTV</p>
                </div>
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>SYSTEM DETAILS</h2>
                <p style={{ fontSize: '16px' }}>{quantity}x {CATALOG.cameras[selectedCamera].name} + {systemType === 'Analog' ? CATALOG.dvrs[selectedDvr].name : CATALOG.nvrs[selectedDvr].name}</p>
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>TOTAL COST</h2>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(calculateCCTVTotal())}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}