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
  Image as ImageIcon, Activity, AlertTriangle, Table, Info, 
  ShieldCheck, ShieldAlert, Sparkles, Palette, Wallet, RefreshCw,
  Wifi, Star, Smartphone, Database, Car, Copy, CheckCircle, Package, Share2,
  FolderOpen, Save, Bookmark, AlertCircle, Box, BoxSelect, LayoutGrid, Router,
  Volume2, Unplug, Terminal
} from 'lucide-react';

// ... (CATALOG and defaultState remain the same) ...
const CATALOG = {
  dvrs: { hik4: { name: 'Hikvision 4-Ch DVR', price: 5700 }, hik8: { name: 'Hikvision 8-Ch DVR', price: 8500 } },
  nvrs: { hik4: { name: 'Hikvision 4-Ch NVR', price: 8500 }, hik8: { name: 'Hikvision 8-Ch NVR', price: 12500 } },
  cameras: {
    analogBullet: { name: 'Analog Bullet', price: 1700, type: 'Analog', shape: 'Bullet', desc: 'Best for outdoor perimeters.' },
    analogDome: { name: 'Analog Dome', price: 1600, type: 'Analog', shape: 'Dome', desc: 'Best for indoor ceilings.' },
    ipBullet: { name: 'IP Bullet (PoE)', price: 4500, type: 'IP', shape: 'Bullet', desc: 'High-res outdoor camera.' },
    ipDome: { name: 'IP Dome (PoE)', price: 4300, type: 'IP', shape: 'Dome', desc: 'High-res indoor/outdoor.' }
  },
  storage: { hdd500: { name: '500GB HDD', price: 3100 }, hdd1tb: { name: '1TB HDD', price: 5500 }, hdd2tb: { name: '2TB HDD', price: 9800 } },
  accessories: { psu: { name: 'Power Supply', price: 1500 }, rg59: { name: 'RG59 Cable /m', price: 20 }, cat6: { name: 'Cat6 Cable /m', price: 65 }, connectors: { name: 'Connectors', price: 250 } },
  labor: { diy: { name: 'Supply Only', price: 0 }, basic: { name: 'Basic Install', price: 4500 } },
  cabling: { cat6Box: { name: 'Cat6 Box (305m)', price: 19500 }, keystone: { name: 'Keystone', price: 150 }, faceplate: { name: 'Faceplate', price: 200 }, patchPanel: { name: '24-Port Panel', price: 4500 }, patchCord: { name: 'Patch Cord', price: 450 }, laborPerDrop: 1500 }
};

const RACK_EQUIPMENT = {
  patchPanel: { name: '24-Port Patch Panel', size: 1, color: 'bg-blue-500' },
  switch: { name: '24-Port PoE Switch', size: 1, color: 'bg-green-500' },
  router: { name: 'Router / Firewall', size: 1, color: 'bg-purple-500' },
  ups: { name: 'UPS Backup Unit', size: 2, color: 'bg-red-500' },
  blank: { name: 'Blanking Panel', size: 1, color: 'bg-gray-600' }
};

const defaultState = {
  clientName: '', clientPhone: '',
  systemType: 'Analog', cameraShape: 'Bullet', quantity: 4, cableLength: 50, selectedStorage: 'hdd500', lensType: '3.6',
  cabDevices: [], poeCams: 4, poeAps: 2, voltLength: 50, voltAmps: 0.5, runRooms: 5, runFloors: 1,
  wifiRooms: 4, wifiWalls: 2, isInvoice: false, depositPaid: 0,
  calcCams: 4, calcRes: '2MP', calcComp: 'H.265', calcHdd: 1000,
  fuelDistance: 20, fuelPrice: 190, fuelConsumption: 12, transportFee: 0,
  ipRecords: [],
  rackItems: [] 
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 
  const [showClientView, setShowClientView] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [newDevice, setNewDevice] = useState({ name: '', ip: '', gateway: '', vlan: '10' });

  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem('cableiq_current');
    return saved ? JSON.parse(saved) : defaultState;
  });

  const [savedProjects, setSavedProjects] = useState(() => {
    const saved = localStorage.getItem('cableiq_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const updateData = (key, value) => setAppData(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    localStorage.setItem('cableiq_current', JSON.stringify(appData));
  }, [appData]);

  useEffect(() => {
    localStorage.setItem('cableiq_projects', JSON.stringify(savedProjects));
  }, [savedProjects]);

  const businessInfo = { name: 'Ngari Tech Solutions', phone: '0711645837', mpesa: 'Paybill 400200' };

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

  // --- CALCULATIONS ---
  const camPrice = selectedCamera.price * appData.quantity;
  const recorderPrice = appData.systemType === 'Analog' ? CATALOG.dvrs.hik4.price : CATALOG.nvrs.hik4.price;
  const storagePrice = CATALOG.storage[appData.selectedStorage].price;
  const cablePrice = appData.cableLength * (appData.systemType === 'Analog' ? CATALOG.accessories.rg59.price : CATALOG.accessories.cat6.price);
  const accPrice = appData.systemType === 'Analog' ? (CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price) : 0;
  const laborPrice = CATALOG.labor.basic.price;
  const fuelCost = (appData.fuelDistance / appData.fuelConsumption) * appData.fuelPrice;
  const transportTotal = Math.round(fuelCost + appData.transportFee);
  const totalCCTV = camPrice + recorderPrice + storagePrice + cablePrice + accPrice + laborPrice + transportTotal;
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

  const calculateStorage = () => {
    let bitratePerCam = appData.calcRes === '2MP' ? 3 : appData.calcRes === '4MP' ? 6 : 12;
    if (appData.calcComp === 'H.265') bitratePerCam *= 0.5;
    if (appData.calcComp === 'H.265+') bitratePerCam *= 0.3;
    const gbPerDay = ((bitratePerCam * 3600 * 24) / 8 / 1024) * appData.calcCams;
    const days = Math.floor(appData.calcHdd / gbPerDay) || 0;
    const remoteBandwidth = (bitratePerCam * appData.calcCams) * 1.2;
    return { days, remoteBandwidth: remoteBandwidth.toFixed(1) };
  };
  const storageCalc = calculateStorage();

  // --- RACK BUILDER LOGIC ---
  const rackTotalU = appData.rackItems.reduce((sum, item) => sum + RACK_EQUIPMENT[item.type].size, 0);
  const rackRemainingU = 42 - rackTotalU;

  const addRackItem = (type) => {
    if (rackTotalU + RACK_EQUIPMENT[type].size > 42) return alert("Not enough space in the 42U rack!");
    updateData('rackItems', [...appData.rackItems, { id: Date.now(), type }]);
  };

  const removeRackItem = (id) => {
    updateData('rackItems', appData.rackItems.filter(item => item.id !== id));
  };

  const copyMpesa = () => {
    navigator.clipboard.writeText(businessInfo.mpesa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProject = () => {
    if (!appData.clientName) return alert("Please enter a Client Name before saving.");
    const newProject = { id: Date.now(), date: new Date().toLocaleDateString(), client: appData.clientName, data: appData };
    setSavedProjects([newProject, ...savedProjects]);
    alert("Project Saved Successfully!");
  };

  const handleLoadProject = (project) => {
    setAppData(project.data);
    setCurrentView('cctv-planner');
  };

  const handleDeleteProject = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this project?")) setSavedProjects(savedProjects.filter(p => p.id !== id));
  };

  const handleNewProject = () => {
    if (window.confirm("Start a new blank project? Unsaved changes will be lost.")) {
      setAppData(defaultState);
      setCurrentView('cctv-planner');
    }
  };

  const handleShareWhatsApp = async () => {
    setIsSharing(true);
    const element = document.getElementById('pdf-cctv-container');
    
    try {
      const pdfBlob = await html2pdf().set({ margin: 0.5, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } }).from(element).outputPdf('blob');
      const fileName = `Quote_${appData.clientName || 'Client'}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'CCTV Quotation', text: `Hello ${appData.clientName}, here is your quotation.` });
      } else {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a'); a.href = url; a.download = fileName; a.click(); URL.revokeObjectURL(url);
        let phoneStr = appData.clientPhone.replace(/\D/g, ''); 
        if (phoneStr.startsWith('0')) phoneStr = '254' + phoneStr.slice(1);
        window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(`Hello ${appData.clientName}, here is your quotation.`)}`, '_blank');
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      alert("Could not share PDF.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textMain}`}>
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
            <button onClick={handleSaveProject} className={`px-3 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400`}>
              <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
            </button>
            <button onClick={handleNewProject} className={`px-3 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400`}>
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New</span>
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-12">
            <div onClick={() => setCurrentView('saved-projects')} className={`cursor-pointer p-4 rounded-2xl border hover:border-yellow-500 ${bgCard}`}>
              <FolderOpen className="w-8 h-8 text-yellow-500 mb-3" />
              <h3 className="text-lg font-bold mb-1">Saved Quotes</h3>
              <p className={`text-xs ${textMuted}`}>Load previous quotes ({savedProjects.length}).</p>
            </div>
            <div onClick={() => setCurrentView('cctv-planner')} className={`cursor-pointer p-4 rounded-2xl border hover:border-orange-500 ${bgCard}`}>
              <Camera className="w-8 h-8 text-orange-500 mb-3" />
              <h3 className="text-lg font-bold mb-1">CCTV Configurator</h3>
              <p className={`text-xs ${textMuted}`}>Quote systems and calculate FOV.</p>
            </div>
            <div onClick={() => setCurrentView('cabling-planner')} className={`cursor-pointer p-4 rounded-2xl border hover:border-blue-500 ${bgCard}`}>
              <Network className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="text-lg font-bold mb-1">Cabling Planner</h3>
              <p className={`text-xs ${textMuted}`}>Cat6 BOM and printable labels.</p>
            </div>
            <div onClick={() => setCurrentView('rack-builder')} className={`cursor-pointer p-4 rounded-2xl border hover:border-pink-500 ${bgCard}`}>
              <Server className="w-8 h-8 text-pink-500 mb-3" />
              <h3 className="text-lg font-bold mb-1">Rack Builder</h3>
              <p className={`text-xs ${textMuted}`}>Visual 42U server rack diagram.</p>
            </div>
            <div onClick={() => setCurrentView('ip-tracker')} className={`cursor-pointer p-4 rounded-2xl border hover:border-cyan-500 ${bgCard}`}>
              <Globe className="w-8 h-8 text-cyan-500 mb-3" />
              <h3 className="text-lg font-bold mb-1">IP & VLAN Tracker</h3>
              <p className={`text-xs ${textMuted}`}>Manage static IPs.</p>
            </div>
            <div onClick={() => setCurrentView('tools')} className={`cursor-pointer p-4 rounded-2xl border hover:border-green-500 ${bgCard}`}>
              <Wrench className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="text-lg font-bold mb-1">Engineer Tools</h3>
              <p className={`text-xs ${textMuted}`}>Fuel, Storage, Cable Guide.</p>
            </div>
            <div onClick={() => setCurrentView('upsell')} className={`cursor-pointer p-4 rounded-2xl border hover:border-purple-500 ${bgCard}`}>
              <Star className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="text-lg font-bold mb-1">Upsell Showcase</h3>
              <p className={`text-xs ${textMuted}`}>Show clients the value of 4K.</p>
            </div>
          </div>
        )}

        {/* ================= ENGINEER TOOLS ================= */}
        {currentView === 'tools' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Car className="w-5 h-5 text-red-500" /> <span>Fuel & Transport</span></h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs">Round Trip (km)</label><input type="number" value={appData.fuelDistance} onChange={e => updateData('fuelDistance', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  <div><label className="text-xs">Fuel Price (/L)</label><input type="number" value={appData.fuelPrice} onChange={e => updateData('fuelPrice', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  <div><label className="text-xs">Car Consumption (km/L)</label><input type="number" value={appData.fuelConsumption} onChange={e => updateData('fuelConsumption', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  <div><label className="text-xs">Extra Fee</label><input type="number" value={appData.transportFee} onChange={e => updateData('transportFee', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                </div>
                <div className={`p-4 rounded text-center ${isLight ? 'bg-red-50' : 'bg-red-900/20'}`}>
                  <p className="text-sm">Transport Charge</p>
                  <p className="text-2xl font-bold text-red-600">KSh {transportTotal}</p>
                </div>
              </div>

              <div className={`p-6 rounded-xl border md:col-span-2 ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-blue-600 dark:text-blue-400"><Database className="w-5 h-5" /> <span>Storage & Bandwidth</span></h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div><label className="text-xs">Cameras</label><input type="number" value={appData.calcCams} onChange={e => updateData('calcCams', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  <div>
                    <label className="text-xs">Resolution</label>
                    <select value={appData.calcRes} onChange={e => updateData('calcRes', e.target.value)} className={`w-full p-2 rounded ${bgInput}`}>
                      <option value="2MP">2MP (1080p)</option>
                      <option value="4MP">4MP (2K)</option>
                      <option value="8MP">8MP (4K)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs">Compression</label>
                    <select value={appData.calcComp} onChange={e => updateData('calcComp', e.target.value)} className={`w-full p-2 rounded ${bgInput}`}>
                      <option value="H.264">H.264</option>
                      <option value="H.265">H.265</option>
                      <option value="H.265+">H.265+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs">Hard Drive</label>
                    <select value={appData.calcHdd} onChange={e => updateData('calcHdd', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`}>
                      <option value={500}>500 GB</option>
                      <option value={1000}>1 TB</option>
                      <option value={2000}>2 TB</option>
                      <option value={4000}>4 TB</option>
                    </select>
                  </div>
                </div>
                <div className={`p-4 rounded-lg flex items-center justify-between ${isLight ? 'bg-gray-100' : 'bg-gray-900/50'}`}>
                  <div>
                    <p className="text-xs text-gray-500">Recording Days</p>
                    <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{storageCalc.days} Days</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Upload Speed Needed</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{storageCalc.remoteBandwidth} Mbps</p>
                  </div>
                </div>
              </div>

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

              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Wifi className="w-5 h-5 text-blue-500" /> <span>Wi-Fi Estimator</span></h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs">Number of Rooms</label><input type="number" value={appData.wifiRooms} onChange={e => updateData('wifiRooms', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  <div><label className="text-xs">Thick Walls</label><input type="number" value={appData.wifiWalls} onChange={e => updateData('wifiWalls', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                </div>
                <div className={`p-4 rounded text-center ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}>
                  <p className="text-sm">Access Points Needed</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.max(1, Math.ceil((appData.wifiRooms / 2) + (appData.wifiWalls / 3)))} APs</p>
                </div>
              </div>

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
            </div>

            {/* NEW: CABLE TESTER & TRACER GUIDE */}
            <div className={`p-6 rounded-xl border mt-6 ${bgCard}`}>
              <h3 className="text-lg font-bold mb-6 flex items-center space-x-2"><Terminal className="w-5 h-5 text-cyan-500" /> <span>Field Cable Tester & Tracer Guide</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center space-x-2"><Unplug className="w-4 h-4"/> 1. RJ45 Continuity Test</h4>
                  <p className={`text-sm mb-4 ${textMuted}`}>Use a cheap network tester to ensure all 8 wires inside the Cat6 cable are perfectly crimped.</p>
                  <div className="flex justify-center space-x-12 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 flex space-x-1">
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <div key={n} className={`w-2 h-4 rounded ${n === 3 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        ))}
                      </div>
                      <span className="text-xs mt-2 font-bold">Main Unit</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 flex space-x-1">
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <div key={n} className={`w-2 h-4 rounded ${n === 3 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        ))}
                      </div>
                      <span className="text-xs mt-2 font-bold">Remote</span>
                    </div>
                  </div>
                  <ul className={`text-sm space-y-1 ${textMuted}`}>
                    <li>• <strong className="text-green-600 dark:text-green-400">All green?</strong> Cable is perfectly crimped (T568B).</li>
                    <li>• <strong className="text-red-500">Red light on 3?</strong> Wire 3 is broken or not fully pushed into the RJ45.</li>
                    <li>• <strong className="text-orange-500">Lights flashing out of order?</strong> Wires are crossed (e.g., 1 and 2 are swapped).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center space-x-2"><Volume2 className="w-4 h-4"/> 2. Tone Generator & Probe</h4>
                  <p className={`text-sm mb-4 ${textMuted}`}>Use this to find which cable goes to which room without checking both ends physically.</p>
                  <div className="flex justify-center items-center space-x-8 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-800 p-2 rounded-lg border border-gray-600">
                        <Terminal className="w-8 h-8 text-yellow-500" />
                      </div>
                      <span className="text-xs mt-2 font-bold">Tone Gen</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-0.5 bg-gray-500 border-t border-dashed"></div>
                      <span className="text-[10px] text-gray-500">Cable Bundle</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-800 p-2 rounded-lg border border-gray-600 flex flex-col items-center">
                        <Wifi className="w-6 h-6 text-green-400 animate-pulse" />
                        <span className="text-[8px] font-bold">BEEP!</span>
                      </div>
                      <span className="text-xs mt-2 font-bold">Probe</span>
                    </div>
                  </div>
                  <ul className={`text-sm space-y-1 ${textMuted}`}>
                    <li>• Plug the Tone Generator into the wall jack in the room.</li>
                    <li>• Go to the patch panel/server room.</li>
                    <li>• Touch the Probe wand to different cables until you hear the loudest <strong className="text-green-600 dark:text-green-400">BEEP</strong>.</li>
                    <li>• Label that cable immediately!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= CCTV CONFIGURATOR ================= */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><User className="w-5 h-5 text-blue-500" /> <span>Client Info</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Client Name</label><input type="text" value={appData.clientName} onChange={e => updateData('clientName', e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`} placeholder="e.g. John Doe" /></div>
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Phone</label><input type="text" value={appData.clientPhone} onChange={e => updateData('clientPhone', e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`} placeholder="0712345678" /></div>
                </div>
              </div>

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
                      <option value="hdd2tb">2TB HDD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border h-fit sticky top-24 ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><FileSpreadsheet className="w-5 h-5 text-green-500" /> <span>Quote Summary</span></h3>
              <div className={`space-y-2 text-sm ${textMuted}`}>
                <div className="flex justify-between"><span>Cameras ({appData.quantity}x):</span> <span className={textMain}>{formatKES(camPrice)}</span></div>
                <div className="flex justify-between"><span>Recorder:</span> <span className={textMain}>{formatKES(recorderPrice)}</span></div>
                <div className="flex justify-between"><span>Storage:</span> <span className={textMain}>{formatKES(storagePrice)}</span></div>
                <div className="flex justify-between"><span>Cables & Acc:</span> <span className={textMain}>{formatKES(cablePrice + accPrice)}</span></div>
                <div className="flex justify-between"><span>Labor:</span> <span className={textMain}>{formatKES(laborPrice)}</span></div>
                <div className="flex justify-between text-red-500"><span>Transport:</span> <span>{formatKES(transportTotal)}</span></div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"><span>Total:</span> <span className="text-green-500">{formatKES(totalCCTV)}</span></div>
              </div>
              <button onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700">
                <Printer className="w-5 h-5" /> <span>Preview Document</span>
              </button>
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
                <button onClick={handleShareWhatsApp} disabled={isSharing} className="px-4 py-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold rounded-lg flex items-center space-x-2 disabled:opacity-50">
                  <Share2 className="w-5 h-5" /> <span>{isSharing ? '...' : 'Share PDF'}</span>
                </button>
                <button onClick={() => {
                  const element = document.getElementById('pdf-cctv-container');
                  html2pdf().set({ margin: 0.5, filename: 'Document.pdf', html2canvas: { scale: 2, useCORS: true } }).from(element).save();
                }} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center space-x-2">
                  <Download className="w-5 h-5" /> <span>Download</span>
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
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <button onClick={() => updateData('isInvoice', !appData.isInvoice)} style={{ fontSize: '12px', padding: '5px 10px', backgroundColor: '#e5e7eb', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Toggle Quote/Invoice</button>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontSize: '14px' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Cameras ({appData.quantity}x)</td><td style={{ textAlign: 'right' }}>{formatKES(camPrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Recorder</td><td style={{ textAlign: 'right' }}>{formatKES(recorderPrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Storage & Cables</td><td style={{ textAlign: 'right' }}>{formatKES(storagePrice + cablePrice + accPrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Installation Labor</td><td style={{ textAlign: 'right' }}>{formatKES(laborPrice)}</td></tr>
                    <tr style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '8px 0' }}>Transport & Logistics</td><td style={{ textAlign: 'right' }}>{formatKES(transportTotal)}</td></tr>
                  </tbody>
                </table>

                <div style={{ marginTop: '30px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '14px' }}>TOTAL: <strong>{formatKES(totalCCTV)}</strong></p>
                  
                  {appData.isInvoice && (
                    <>
                      <p style={{ margin: '10px 0 0 0', fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>Balance Due: {formatKES(balanceDue)}</p>
                      
                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', spaceX: '10px', marginBottom: '10px' }}>
                          <span style={{ fontSize: '14px', marginRight: '10px' }}>Amount Paid (Deposit):</span>
                          <input 
                            type="number" 
                            value={appData.depositPaid} 
                            onChange={e => updateData('depositPaid', Number(e.target.value))} 
                            style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '4px', width: '120px', textAlign: 'right', fontSize: '14px' }} 
                          />
                        </div>
                        
                        <button 
                          onClick={copyMpesa}
                          style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', spaceX: '8px', fontSize: '14px', fontWeight: 'bold' }}
                        >
                          {copied ? <CheckCircle style={{ width: '16px', height: '16px', marginRight: '5px' }} /> : <Copy style={{ width: '16px', height: '16px', marginRight: '5px' }} />}
                          {copied ? 'Copied M-Pesa Details!' : `Pay via M-Pesa: ${businessInfo.mpesa}`}
                        </button>
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
              <button onClick={() => setShowClientView(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Trash2 className="w-6 h-6 text-gray-600" /></button>
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">{businessInfo.name}</h1>
                <p className="text-xl text-gray-500">CCTV Security Proposal</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">What You Get</h2>
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center space-x-3"><ShieldCheck className="w-6 h-6 text-green-500" /> <span><strong>{appData.quantity}x</strong> HD Cameras</span></li>
                    <li className="flex items-center space-x-3"><ShieldCheck className="w-6 h-6 text-green-500" /> <span>Mobile Phone Access</span></li>
                    <li className="flex items-center space-x-3"><ShieldCheck className="w-6 h-6 text-green-500" /> <span>Professional Installation</span></li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-center items-center text-center">
                  <p className="text-xl text-gray-500 mb-2">Total Investment</p>
                  <p className="text-5xl font-extrabold text-green-600">{formatKES(totalCCTV)}</p>
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
                {appData.cabDevices.map((d, i) => (
                  <div key={d.id} className="border-2 border-dashed border-gray-400 p-2 text-center rounded">
                    <p className="font-bold text-sm">{d.room}</p>
                    <p className="text-xs text-gray-600">Port {i + 1}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => window.print()} className="w-full mt-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Print Labels</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}