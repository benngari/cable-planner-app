// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Plus, Camera, Wifi, Phone, Network, Cable, MapPin, Layers, Download, 
  Trash2, FileText, Moon, Sun, CheckCircle, Server, Home as HomeIcon, 
  Building, TreePine, ArrowRight, DollarSign, Gauge, Sparkles, Star, 
  Zap, Printer, Eye, Save, FolderOpen, X, User, Briefcase, 
  FileSpreadsheet, MonitorPlay, Monitor, Settings, Package, Activity, 
  ShoppingCart, HardDrive, Smartphone, Cloud, Calculator, MessageCircle, ClipboardCheck, Shield, Cpu
} from 'lucide-react';

// Expanded Catalog with Options
const CATALOG = {
  dvrs: {
    hik4: { name: 'Hikvision 4-Channel DVR', price: 5700 },
    hik8: { name: 'Hikvision 8-Channel DVR', price: 8500 },
    dahua4: { name: 'Dahua 4-Channel DVR', price: 4500 },
    dahua8: { name: 'Dahua 8-Channel DVR', price: 7000 }
  },
  cameras: {
    hikBullet: { name: 'Hikvision 2MP Bullet', price: 1700, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' },
    hikDome: { name: 'Hikvision 2MP Dome', price: 1600, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dome_camera.jpg/640px-Dome_camera.jpg' },
    hikPTZ: { name: 'Hikvision 2MP PTZ', price: 12000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' },
    dahuaBullet: { name: 'Dahua 2MP Bullet', price: 1500, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' }
  },
  storage: {
    none: { name: 'No Hard Drive', price: 0 },
    hdd500: { name: '500GB Surveillance HDD', price: 3100 },
    hdd1tb: { name: '1TB Surveillance HDD', price: 5500 },
    hdd2tb: { name: '2TB Surveillance HDD', price: 9800 }
  },
  accessories: {
    psu: { name: '4-Port 5A Centralized Power Supply', price: 1500 },
    cablePerMeter: { name: 'RG59 Coaxial Cable (per meter)', price: 20 },
    connectors: { name: '12x BNC & DC Connectors', price: 250 }
  },
  monitors: {
    none: { name: 'No Monitor', price: 0 },
    m22: { name: '22" CCTV Monitor', price: 13000 },
    m32: { name: '32" Smart TV/Monitor', price: 18500 }
  },
  labor: {
    diy: { name: 'Supply Only (No Installation)', price: 0 },
    basic: { name: 'Basic Installation (1 day)', price: 4500 },
    complex: { name: 'Complex Installation (multi-day)', price: 8500 }
  },
  dvrImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Digital_Video_Recorder.jpg/640px-Digital_Video_Recorder.jpg',
  
  cablingStandards: {
    cat5e: { name: 'Cat5e', price: 39, speed: '1 Gbps' },
    cat6: { name: 'Cat6', price: 65, speed: '10 Gbps' },
    cat6a: { name: 'Cat6A', price: 110, speed: '10 Gbps' },
    fiber: { name: 'Fiber', price: 325, speed: '100 Gbps' }
  }
};

const defaultCabRooms = [
  { id: 1, name: "Main Office" },
  { id: 2, name: "Server Room" },
  { id: 3, name: "Conference Room" }
];

const cabDeviceTypes = {
  data: { label: "Data Point (Ethernet)", icon: Network },
  ap: { label: "Wireless Access Point", icon: Wifi },
  voip: { label: "VoIP Desk Phone", icon: Phone },
  cctv: { label: "IP Camera", icon: Camera }
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('welcome'); 
  const [activeProject, setActiveProject] = useState('cctv');
  const [isExporting, setIsExporting] = useState(false);

  // Shared Client & Business State
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [businessInfo, setBusinessInfo] = useState({ 
    name: 'Ngari Tech Solutions', 
    phone: '0711645837', 
    email: 'info@ngaritech.co.ke', 
    mpesa: 'Paybill 400200, Acc: 0110...' 
  });

  // Custom Items State
  const [customItems, setCustomItems] = useState([]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);

  // ======================= NEW CONFIGURATOR STATE =======================
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('hikBullet');
  const [selectedStorage, setSelectedStorage] = useState('hdd500');
  const [selectedMonitor, setSelectedMonitor] = useState('none');
  const [selectedLabor, setSelectedLabor] = useState('basic');
  const [cableLength, setCableLength] = useState(50);
  
  // Custom bundle override
  const [customBundlePrice, setCustomBundlePrice] = useState('');

  // Site Survey Checklist
  const [survey, setSurvey] = useState({
    power: false, cableRoute: false, internet: false, mounting: false, clientApp: false
  });

  // Storage Calculator
  const [calcHdd, setCalcHdd] = useState(500);
  const [calcRes, setCalcRes] = useState(1080);

  // Cabling State
  const [cabRooms, setCabRooms] = useState(defaultCabRooms);
  const [cabDevices, setCabDevices] = useState([]);
  const [cabStandard, setCabStandard] = useState('cat6');
  const [newCabRoom, setNewCabRoom] = useState('');
  const [cabDeviceName, setCabDeviceName] = useState('');
  const [cabDeviceType, setCabDeviceType] = useState('data');
  const [cabDeviceRoom, setCabDeviceRoom] = useState('');
  const [cabCableLength, setCabCableLength] = useState('');
  const [cabFaceplate, setCabFaceplate] = useState('single');

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  // Custom Items Logic
  const addCustomItem = () => {
    if (!customItemName || !customItemPrice) return alert("Please enter item name and price");
    setCustomItems([...customItems, { 
      id: Date.now(), 
      name: customItemName, 
      price: Number(customItemPrice), 
      qty: Number(customItemQty) 
    }]);
    setCustomItemName('');
    setCustomItemPrice('');
    setCustomItemQty(1);
  };

  const removeCustomItem = (id) => setCustomItems(customItems.filter(i => i.id !== id));
  const getCustomItemsTotal = () => customItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // ======================= CONFIGURATOR CALCULATIONS =======================
  const loadStandardJumiaKit = () => {
    setQuantity(4);
    setSelectedDvr('hik4');
    setSelectedCamera('hikBullet');
    setSelectedStorage('hdd500');
    setSelectedMonitor('none');
    setSelectedLabor('basic');
    setCableLength(50);
    setCustomBundlePrice('15500'); // The actual Jumia price
  };

  const calculateHardwareCost = () => {
    const camPrice = CATALOG.cameras[selectedCamera].price * quantity;
    const dvrPrice = CATALOG.dvrs[selectedDvr].price;
    const storagePrice = CATALOG.storage[selectedStorage].price;
    const monitorPrice = CATALOG.monitors[selectedMonitor].price;
    const psuPrice = CATALOG.accessories.psu.price;
    const cablePrice = cableLength * CATALOG.accessories.cablePerMeter.price;
    const connPrice = CATALOG.accessories.connectors.price;

    const rawTotal = camPrice + dvrPrice + storagePrice + monitorPrice + psuPrice + cablePrice + connPrice;
    
    // If user entered a custom bundle price, calculate the discount
    let discount = 0;
    if (customBundlePrice && Number(customBundlePrice) > 0) {
      discount = rawTotal - Number(customBundlePrice);
    }

    return { rawTotal, discount, finalHardware: rawTotal - discount };
  };

  const hardwareCosts = calculateHardwareCost();
  const laborCost = CATALOG.labor[selectedLabor].price;
  const calculateCCTVTotal = () => hardwareCosts.finalHardware + laborCost + getCustomItemsTotal();

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    let phoneStr = clientInfo.phone.replace(/\D/g, ''); 
    if (phoneStr.startsWith('0')) phoneStr = '254' + phoneStr.slice(1);
    
    const message = `*CCTV QUOTATION*\nFrom: ${businessInfo.name}\nClient: ${clientInfo.name || 'Valued Customer'}\n\n*System:* ${quantity}x ${CATALOG.cameras[selectedCamera].name} + ${CATALOG.dvrs[selectedDvr].name}${selectedStorage !== 'none' ? ' + HDD' : ''}${selectedMonitor !== 'none' ? ' + Monitor' : ''}\n\n*Total Cost:* ${formatKES(calculateCCTVTotal())}\n\nIncludes installation and mobile app setup. Please find the official PDF quotation attached.\n\nContact us: ${businessInfo.phone}`;
    
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneStr}?text=${encodedMsg}`, '_blank');
  };

  // Storage Calculator
  const getRecordingDays = () => {
    const gbPerCamPerDay = calcRes === 1080 ? 15 : 30;
    const totalGbPerDay = gbPerCamPerDay * quantity;
    return Math.floor(calcHdd / totalGbPerDay);
  };


  // ======================= CABLING CALCULATIONS =======================
  const addCabRoom = () => {
    if (!newCabRoom.trim()) return;
    setCabRooms([...cabRooms, { id: Date.now(), name: newCabRoom }]);
    setNewCabRoom('');
  };
  const removeCabRoom = (id) => setCabRooms(cabRooms.filter(r => r.id !== id));

  const addCabDevice = () => {
    if (!cabDeviceName.trim() || !cabDeviceRoom) return alert("Please enter device name and select a room.");
    const newDev = {
      id: Date.now(),
      name: cabDeviceName,
      type: cabDeviceType,
      room: cabDeviceRoom,
      cableLength: Number(cabCableLength) || 35,
      faceplate: cabDeviceType === 'data' ? cabFaceplate : 'single'
    };
    setCabDevices([...cabDevices, newDev]);
    setCabDeviceName('');
    setCabCableLength('');
  };
  const removeCabDevice = (id) => setCabDevices(cabDevices.filter(d => d.id !== id));

  const getCabTotals = () => {
    let totalPorts = 0;
    let totalLength = 0;
    cabDevices.forEach(d => {
      const ports = (d.type === 'data' && d.faceplate === 'dual') ? 2 : 1;
      totalPorts += ports;
      totalLength += d.cableLength * ports;
    });

    const totalWithWaste = totalLength * 1.15;
    const cableBoxes = Math.ceil(totalWithWaste / 305) || 0;
    const keystones = totalPorts;
    const patchCords = totalPorts;
    const faceplates = Math.ceil(totalPorts / 2) || 0;
    const patchPanels = Math.ceil(totalPorts / 24) || 0;

    const cablePrice = CATALOG.cablingStandards[cabStandard].price;
    const cableCost = totalWithWaste * cablePrice;
    const hardwareCost = (keystones * 150) + (patchCords * 450) + (faceplates * 200) + (patchPanels * 4500);
    const laborCost = 4500;
    const customTotal = getCustomItemsTotal();
    const totalCost = cableCost + hardwareCost + laborCost + customTotal;

    return {
      totalPorts, totalLength, totalWithWaste, cableBoxes, keystones, patchCords, faceplates, patchPanels,
      cableCost, hardwareCost, laborCost, customTotal, totalCost
    };
  };
  const cabTotals = getCabTotals();

  const handleDownloadPDF = () => {
    setIsExporting(true);
    const element = document.getElementById('pdf-report-container');
    const opt = {
      margin:       0.5,
      filename:     `${activeProject === 'cctv' ? 'CCTV_Quotation' : 'Cabling_BOM'}_${clientInfo.name || 'Client'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(() => setIsExporting(false));
  };

  // Shared PDF block styles
  const topologyBoxStyle = { backgroundColor: 'white', border: '2px solid #1e3a8a', padding: '10px 15px', borderRadius: '8px', textAlign: 'center', minWidth: '120px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
  const topologyLineStyle = { height: '20px', width: '2px', backgroundColor: '#94a3b8', margin: '0 auto' };
  const topologyLabelStyle = { fontSize: '11px', color: '#ea580c', fontWeight: 'bold', backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ea580c', margin: '4px 0', display: 'inline-block' };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Header */}
      <header className={`sticky top-0 z-20 border-b transition-all duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center flex-wrap gap-3">
          <div onClick={() => setCurrentView('welcome')} className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg"><Cable className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">CableIQ</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kenyan CCTV & Cabling Planner</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <HomeIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* ======================= WELCOME MENU ======================= */}
        {currentView === 'welcome' && (
          <div className="text-center py-10">
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What would you like to do?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-12">
              
              <div onClick={() => { setActiveProject('cctv'); setCurrentView('cctv-planner'); }} className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500' : 'bg-white border-gray-200 hover:border-orange-500'}`}>
                <div className="w-14 h-14 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>CCTV Configurator</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select exact hardware and build a custom kit.</p>
              </div>

              <div onClick={() => { setActiveProject('cabling'); setCurrentView('cabling-planner'); }} className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}`}>
                <div className="w-14 h-14 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Cabling Planner</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Plan data points, APs, and calculate exact cable lengths.</p>
              </div>

              <div onClick={() => setCurrentView('report')} className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-200 hover:border-green-500'}`}>
                <div className="w-14 h-14 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <FileSpreadsheet className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>View & Export PDF</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Preview your {activeProject === 'cctv' ? 'CCTV Quote' : 'Cabling BOM'} and download.</p>
              </div>

              <div onClick={() => setCurrentView('preview')} className={`group cursor-pointer p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-white border-gray-200 hover:border-purple-500'}`}>
                <div className="w-14 h-14 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <MonitorPlay className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Network Preview</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visualize the network topology of your project.</p>
              </div>

            </div>
          </div>
        )}

        {/* ======================= CCTV CONFIGURATOR ======================= */}
        {currentView === 'cctv-planner' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <div>
                <p className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>Quick Presets</p>
                <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Instantly configure standard setups.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={loadStandardJumiaKit} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-md flex items-center space-x-2">
                  <Package className="w-4 h-4" /> <span>Jumia 4-Cam Kit (KSh 15.5k)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT: Hardware Configurator */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* DVR & Camera Selection */}
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Cpu className="w-5 h-5 text-blue-500" /> <span>1. Select Hardware</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">DVR Recorder</label>
                      <select value={selectedDvr} onChange={e => setSelectedDvr(e.target.value)} className={`w-full px-4 py-3 rounded-xl border mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        {Object.entries(CATALOG.dvrs).map(([k, v]) => (
                          <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>
                        ))}
                      </select>

                      <label className="text-sm font-medium text-gray-500 block mb-2">Camera Model</label>
                      <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} className={`w-full px-4 py-3 rounded-xl border mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        {Object.entries(CATALOG.cameras).map(([k, v]) => (
                          <option key={k} value={k}>{v.name} - {formatKES(v.price)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Number of Cameras</label>
                      <input type="number" min="1" max="16" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-4 py-3 rounded-xl border mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                      
                      <label className="text-sm font-medium text-gray-500 block mb-2">Hard Drive (Storage)</label>
                      <select value={selectedStorage} onChange={e => setSelectedStorage(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        {Object.entries(CATALOG.storage).map(([k, v]) => (
                          <option key={k} value={k}>{v.name} {v.price > 0 ? `- ${formatKES(v.price)}` : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Add-ons & Labor */}
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Settings className="w-5 h-5 text-blue-500" /> <span>2. Add-ons & Installation</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Monitor</label>
                      <select value={selectedMonitor} onChange={e => setSelectedMonitor(e.target.value)} className={`w-full px-4 py-3 rounded-xl border mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        {Object.entries(CATALOG.monitors).map(([k, v]) => (
                          <option key={k} value={k}>{v.name} {v.price > 0 ? `- ${formatKES(v.price)}` : ''}</option>
                        ))}
                      </select>

                      <label className="text-sm font-medium text-gray-500 block mb-2">Cable Required (meters)</label>
                      <input type="number" value={cableLength} onChange={e => setCableLength(Number(e.target.value))} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">Installation Level</label>
                      <select value={selectedLabor} onChange={e => setSelectedLabor(e.target.value)} className={`w-full px-4 py-3 rounded-xl border mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        {Object.entries(CATALOG.labor).map(([k, v]) => (
                          <option key={k} value={k}>{v.name} {v.price > 0 ? `- ${formatKES(v.price)}` : ''}</option>
                        ))}
                      </select>
                      
                      <label className="text-sm font-medium text-orange-500 block mb-2">Custom Bundle Price Override (Optional)</label>
                      <input type="number" placeholder="e.g. 15500" value={customBundlePrice} onChange={e => setCustomBundlePrice(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 ${darkMode ? 'bg-gray-700 border-orange-900 text-white placeholder-gray-500' : 'bg-white border-orange-300'}`} />
                      <p className="text-xs text-gray-500 mt-1">Matches supplier discounts.</p>
                    </div>
                  </div>
                </div>

                {/* Site Survey Checklist */}
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <ClipboardCheck className="w-5 h-5 text-blue-500" /> <span>Site Survey Checklist</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'power', label: 'Power socket near DVR?' },
                      { key: 'cableRoute', label: 'Cable route clear?' },
                      { key: 'internet', label: 'Internet router available?' },
                      { key: 'mounting', label: 'Mounting surfaces suitable?' },
                      { key: 'clientApp', label: 'Client phone ready for app?' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center space-x-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={survey[item.key]} 
                          onChange={() => setSurvey({...survey, [item.key]: !survey[item.key]})}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-gray-100 border-gray-300"
                        />
                        <span className={`text-sm ${survey[item.key] ? 'line-through text-gray-500' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* RIGHT: Summary & Tools */}
              <div className="space-y-6">
                
                {/* Cost Summary */}
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <DollarSign className="w-5 h-5 text-green-500" /> <span>Quotation Summary</span>
                  </h3>
                  
                  <div className={`space-y-2 text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex justify-between"><span>Cameras ({quantity}x):</span> <span>{formatKES(CATALOG.cameras[selectedCamera].price * quantity)}</span></div>
                    <div className="flex justify-between"><span>DVR:</span> <span>{formatKES(CATALOG.dvrs[selectedDvr].price)}</span></div>
                    <div className="flex justify-between"><span>Storage:</span> <span>{formatKES(CATALOG.storage[selectedStorage].price)}</span></div>
                    <div className="flex justify-between"><span>Accessories & Cable:</span> <span>{formatKES(1500 + (cableLength * 20) + 250)}</span></div>
                    {selectedMonitor !== 'none' && <div className="flex justify-between"><span>Monitor:</span> <span>{formatKES(CATALOG.monitors[selectedMonitor].price)}</span></div>}
                    
                    {hardwareCosts.discount > 0 && (
                      <div className="flex justify-between text-red-500 font-bold">
                        <span>Bundle Discount:</span> <span>- {formatKES(hardwareCosts.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-700"><span>Hardware Subtotal:</span> <span>{formatKES(hardwareCosts.finalHardware)}</span></div>
                    <div className="flex justify-between"><span>Installation:</span> <span>{formatKES(laborCost)}</span></div>
                  </div>

                  <div className={`border-t pt-4 mb-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Quotation</p>
                    <p className="text-3xl font-bold text-green-500">{formatKES(calculateCCTVTotal())}</p>
                  </div>

                  <button onClick={handleWhatsAppShare} className="w-full py-3 bg-[#25D366] hover:bg-[#20b858] text-white font-bold rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-colors mb-3">
                    <MessageCircle className="w-5 h-5" /> <span>Share via WhatsApp</span>
                  </button>

                  <button onClick={() => setCurrentView('report')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-colors">
                    <Eye className="w-5 h-5" /> <span>Preview PDF Quote</span>
                  </button>
                </div>

                {/* Storage Calculator */}
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Calculator className="w-5 h-5 text-blue-500" /> <span>Storage Calculator</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Hard Drive Size</label>
                      <select value={calcHdd} onChange={e => setCalcHdd(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        <option value={500}>500 GB</option>
                        <option value={1000}>1 TB</option>
                        <option value={2000}>2 TB</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 block mb-1">Camera Resolution</label>
                      <select value={calcRes} onChange={e => setCalcRes(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        <option value={1080}>1080p (2MP)</option>
                        <option value={4000}>4MP (Higher Detail)</option>
                      </select>
                    </div>
                    <div className={`mt-4 p-3 rounded-lg text-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                      <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Estimated Recording Time</p>
                      <p className="text-2xl font-bold text-blue-500">{getRecordingDays()} Days</p>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>for {quantity} cameras</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ======================= CABLING PLANNER ======================= */}
        {currentView === 'cabling-planner' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Structured Cabling Planner</h2>
              <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <ArrowRight className="w-4 h-4 rotate-180" /> <span>Back to Menu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6 lg:col-span-1">
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Settings className="w-5 h-5 text-blue-500" /> <span>Cable Standard</span>
                  </h3>
                  <select value={cabStandard} onChange={e => setCabStandard(e.target.value)} className={`w-full px-4 py-3 rounded-xl border mb-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                    {Object.entries(CATALOG.cablingStandards).map(([key, val]) => (
                      <option key={key} value={key}>{val.name} - {formatKES(val.price)}/m ({val.speed})</option>
                    ))}
                  </select>

                  <h3 className={`text-lg font-bold mt-6 mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <MapPin className="w-5 h-5 text-blue-500" /> <span>Rooms</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cabRooms.map(r => (
                      <div key={r.id} className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                        <span>{r.name}</span>
                        <button onClick={() => removeCabRoom(r.id)} className="text-red-400 hover:text-red-600"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input type="text" placeholder="New room..." value={newCabRoom} onChange={e => setNewCabRoom(e.target.value)} className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    <button onClick={addCabRoom} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add</button>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Plus className="w-5 h-5 text-blue-500" /> <span>Add Device</span>
                  </h3>
                  <div className="space-y-4">
                    <select value={cabDeviceRoom} onChange={e => setCabDeviceRoom(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="">Select Room</option>
                      {cabRooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                    <select value={cabDeviceType} onChange={e => setCabDeviceType(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                      {Object.entries(cabDeviceTypes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <input type="text" placeholder="Device Name (e.g., Desk 1)" value={cabDeviceName} onChange={e => setCabDeviceName(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    <input type="number" placeholder="Cable Length (m)" value={cabCableLength} onChange={e => setCabCableLength(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    
                    {cabDeviceType === 'data' && (
                      <select value={cabFaceplate} onChange={e => setCabFaceplate(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        <option value="single">Single Port Faceplate (1 cable)</option>
                        <option value="dual">Dual Port Faceplate (2 cables)</option>
                      </select>
                    )}
                    <button onClick={addCabDevice} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">Add to Plan</button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Planned Devices</h3>
                  {cabDevices.length === 0 ? (
                    <p className="text-gray-500">No devices added yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {cabDevices.map(d => (
                        <div key={d.id} className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{d.name} <span className="text-xs text-blue-500 ml-2">{d.room}</span></p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {cabDeviceTypes[d.type].label} • {d.cableLength}m 
                              {d.type === 'data' && ` • ${d.faceplate === 'dual' ? 'Dual Port' : 'Single Port'}`}
                            </p>
                          </div>
                          <button onClick={() => removeCabDevice(d.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <ShoppingCart className="w-5 h-5 text-blue-500" /> <span>Additional Items Required</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <input type="text" placeholder="Item Name" value={customItemName} onChange={e => setCustomItemName(e.target.value)} className={`px-3 py-2 rounded-lg border md:col-span-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    <input type="number" placeholder="Qty" value={customItemQty} onChange={e => setCustomItemQty(Number(e.target.value))} className={`px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    <div className="flex space-x-2">
                      <input type="number" placeholder="Price (KSh)" value={customItemPrice} onChange={e => setCustomItemPrice(e.target.value)} className={`flex-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                      <button onClick={addCustomItem} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Add</button>
                    </div>
                  </div>
                  {customItems.length > 0 && (
                    <div className="space-y-2">
                      {customItems.map(item => (
                        <div key={item.id} className={`flex justify-between items-center p-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <span>{item.qty}x {item.name}</span>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold text-blue-500">{formatKES(item.price * item.qty)}</span>
                            <button onClick={() => removeCustomItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Material Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-xs text-gray-500">Ports</p>
                      <p className="text-xl font-bold text-blue-500">{cabTotals.totalPorts}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-xs text-gray-500">Total Cable</p>
                      <p className="text-xl font-bold text-blue-500">{Math.round(cabTotals.totalWithWaste)}m</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-xs text-gray-500">Patch Panels</p>
                      <p className="text-xl font-bold text-blue-500">{cabTotals.patchPanels}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-xs text-gray-500">Total Cost</p>
                      <p className="text-xl font-bold text-green-500">{formatKES(cabTotals.totalCost)}</p>
                    </div>
                  </div>
                  <button onClick={() => setCurrentView('report')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center space-x-2">
                    <Eye className="w-5 h-5" /> <span>Preview Cabling BOM & Export PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= REPORT / EXPORT VIEW ======================= */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView(activeProject === 'cctv' ? 'cctv-planner' : 'cabling-planner')} className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
                ← Back to Configuration
              </button>
              <button 
                onClick={handleDownloadPDF} 
                disabled={isExporting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold rounded-xl shadow-lg flex items-center space-x-2"
              >
                <Download className="w-5 h-5" /> 
                <span>{isExporting ? 'Generating PDF...' : 'Download PDF File'}</span>
              </button>
            </div>

            <div className="overflow-x-auto pb-10 bg-gray-200 dark:bg-gray-800 p-4 rounded-xl flex justify-center">
              
              <div id="pdf-report-container" className="bg-white text-gray-900 shadow-2xl" style={{ width: '800px', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
                {/* COMMON HEADER */}
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#f97316', letterSpacing: '1px' }}>
                      {activeProject === 'cctv' ? 'QUOTATION' : 'CABLING BOM'}
                    </h1>
                    <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>Date: {new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>{businessInfo.name}</h2>
                    <p style={{ margin: '5px 0', fontSize: '12px' }}>Tel: {businessInfo.phone} | Email: {businessInfo.email}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '13px' }}>
                  <div style={{ width: '48%' }}>
                    <h3 style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '5px', marginBottom: '10px', color: '#1e3a8a', fontSize: '14px' }}>PREPARED BY</h3>
                    <p style={{ margin: '2px 0' }}><strong>{businessInfo.name}</strong></p>
                    <p style={{ margin: '2px 0' }}>Tel: {businessInfo.phone}</p>
                    <p style={{ margin: '2px 0' }}>Email: {businessInfo.email}</p>
                  </div>
                  <div style={{ width: '48%' }}>
                    <h3 style={{ borderBottom: '2px solid #1e3a8a', paddingBottom: '5px', marginBottom: '10px', color: '#1e3a8a', fontSize: '14px' }}>PREPARED FOR</h3>
                    <p style={{ margin: '2px 0' }}><strong>{clientInfo.name || '[Client Name]'}</strong></p>
                    <p style={{ margin: '2px 0' }}>{clientInfo.address || '[Address]'}</p>
                    <p style={{ margin: '2px 0' }}>Tel: {clientInfo.phone || '[Phone]'}</p>
                  </div>
                </div>

                {/* ======================= CCTV REPORT ======================= */}
                {activeProject === 'cctv' && (
                  <>
                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>YOUR SYSTEM: WHAT YOU GET</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: '20px 0', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ textAlign: 'center', width: '30%' }}>
                        <img src={CATALOG.cameras[selectedCamera].image} alt="Camera" style={{ width: '100%', maxWidth: '140px', height: '100px', objectFit: 'contain', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'white', padding: '5px', border: '1px solid #e5e7eb' }} crossOrigin="anonymous" />
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: '5px 0' }}>{quantity}x {CATALOG.cameras[selectedCamera].name}</p>
                        <span style={{ fontSize: '10px', color: '#666' }}>2MP 1080p • Night Vision</span>
                      </div>
                      <div style={{ textAlign: 'center', width: '30%' }}>
                        <img src={CATALOG.dvrImage} alt="DVR" style={{ width: '100%', maxWidth: '140px', height: '100px', objectFit: 'contain', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'white', padding: '5px', border: '1px solid #e5e7eb' }} crossOrigin="anonymous" />
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: '5px 0' }}>1x {CATALOG.dvrs[selectedDvr].name}</p>
                        <span style={{ fontSize: '10px', color: '#666' }}>H.265 • Smartphone App</span>
                      </div>
                      {selectedMonitor !== 'none' && (
                        <div style={{ textAlign: 'center', width: '30%' }}>
                          <Monitor style={{ width: '40px', height: '40px', color: '#3b82f6', margin: '30px auto' }} />
                          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: '5px 0' }}>1x {CATALOG.monitors[selectedMonitor].name}</p>
                          <span style={{ fontSize: '10px', color: '#666' }}>Live Viewing Display</span>
                        </div>
                      )}
                    </div>

                    <h4 style={{ marginBottom: '10px', color: '#1e3a8a' }}>WHAT'S IN THE BOX</h4>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px 25px', fontSize: '13px', marginBottom: '20px' }}>
                      <ol style={{ paddingLeft: '20px', margin: 0 }}>
                        <li style={{ marginBottom: '8px' }}>1 {CATALOG.dvrs[selectedDvr].name} (DVR Machine)</li>
                        <li style={{ marginBottom: '8px' }}>{quantity} Pieces of {CATALOG.cameras[selectedCamera].name} Cameras</li>
                        {selectedStorage !== 'none' && <li style={{ marginBottom: '8px' }}>1 {CATALOG.storage[selectedStorage].name}</li>}
                        <li style={{ marginBottom: '8px' }}>1 Centralized CCTV Power Supply Box Unit</li>
                        <li style={{ marginBottom: '8px' }}>{cableLength}M RG59 Coaxial Cable Roll</li>
                        <li style={{ marginBottom: '8px' }}>12 Bnc and DC jack power connectors</li>
                        {selectedMonitor !== 'none' && <li style={{ marginBottom: '8px' }}><strong>1 {CATALOG.monitors[selectedMonitor].name}</strong></li>}
                      </ol>
                    </div>

                    {/* PRICE BREAKDOWN TABLE */}
                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>PRICE BREAKDOWN</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Description</th>
                          <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Amount (KSh)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{quantity}x {CATALOG.cameras[selectedCamera].name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{(CATALOG.cameras[selectedCamera].price * quantity).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>1x {CATALOG.dvrs[selectedDvr].name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{CATALOG.dvrs[selectedDvr].price.toLocaleString()}</td></tr>
                        {selectedStorage !== 'none' && <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>1x {CATALOG.storage[selectedStorage].name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{CATALOG.storage[selectedStorage].price.toLocaleString()}</td></tr>}
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>1x Power Supply & Accessories</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{(1500 + 250).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cableLength}m Coaxial Cable</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{(cableLength * 20).toLocaleString()}</td></tr>
                        {selectedMonitor !== 'none' && <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>1x {CATALOG.monitors[selectedMonitor].name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{CATALOG.monitors[selectedMonitor].price.toLocaleString()}</td></tr>}
                        
                        {hardwareCosts.discount > 0 && (
                          <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#dc2626' }}><strong>Bundle Discount</strong></td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#dc2626', textAlign: 'right' }}>- {hardwareCosts.discount.toLocaleString()}</td></tr>
                        )}

                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}><strong>Hardware Subtotal</strong></td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}><strong>{hardwareCosts.finalHardware.toLocaleString()}</strong></td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{CATALOG.labor[selectedLabor].name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>{laborCost.toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a' }}>TOTAL</td><td style={{ padding: '10px', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a', textAlign: 'right' }}>{calculateCCTVTotal().toLocaleString()}</td></tr>
                      </tbody>
                    </table>
                  </>
                )}

                {/* ... CABLING REPORT CODE REMAINS SAME ... */}
                {activeProject === 'cabling' && (
                  <>
                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>NETWORK & CABLE SUMMARY</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                      <tbody>
                        <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', width: '50%' }}><strong>Cable Standard</strong></td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{CATALOG.cablingStandards[cabStandard].name} ({CATALOG.cablingStandards[cabStandard].speed})</td></tr>
                        <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}><strong>Total Ports (Drops)</strong></td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.totalPorts} Ports</td></tr>
                        <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}><strong>Total Cable Length (inc 15% slack)</strong></td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{Math.round(cabTotals.totalWithWaste)} meters</td></tr>
                      </tbody>
                    </table>

                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>BILL OF MATERIALS</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Item</th>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Qty</th>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Unit</th>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Total (KSh)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{CATALOG.cablingStandards[cabStandard].name} Cable Box (305m)</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.cableBoxes}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>boxes</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{Math.round(cabTotals.cableCost).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>Keystone Jacks (Cat6)</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.keystones}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>pieces</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(cabTotals.keystones * 150).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>Patch Cords (2m)</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.patchCords}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>pieces</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(cabTotals.patchCords * 450).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>Faceplates (2-port)</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.faceplates}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>pieces</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(cabTotals.faceplates * 200).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>Patch Panel (24-port)</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.patchPanels}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>units</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(cabTotals.patchPanels * 4500).toLocaleString()}</td></tr>
                        
                        {customItems.map(item => (
                          <tr key={item.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{item.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{item.qty}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>units</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(item.price * item.qty).toLocaleString()}</td>
                          </tr>
                        ))}

                        <tr><td colSpan="3" style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}><strong>Hardware Subtotal</strong></td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}><strong>{(cabTotals.cableCost + cabTotals.hardwareCost + cabTotals.customTotal).toLocaleString()}</strong></td></tr>
                        <tr><td colSpan="3" style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Installation Labor</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.laborCost.toLocaleString()}</td></tr>
                        <tr><td colSpan="3" style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a' }}>TOTAL</td><td style={{ padding: '10px', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a' }}>{cabTotals.totalCost.toLocaleString()}</td></tr>
                      </tbody>
                    </table>
                  </>
                )}

                {/* COMMON TERMS */}
                <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>TERMS AND CONDITIONS</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>
                  <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                    <li style={{ marginBottom: '5px' }}><strong>Payment:</strong> 50% deposit to confirm, balance on completion. M-Pesa: {businessInfo.mpesa}</li>
                    <li style={{ marginBottom: '5px' }}>Prices include VAT. Quote valid for 14 days.</li>
                    <li style={{ marginBottom: '5px' }}>12 months warranty on all equipment, 3 months on workmanship.</li>
                  </ul>
                </div>
                
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '45%' }}><div style={{ borderBottom: '1px solid #333', height: '30px', marginBottom: '5px' }}></div><span style={{ fontSize: '12px' }}>Client Signature</span></div>
                  <div style={{ width: '45%' }}><div style={{ borderBottom: '1px solid #333', height: '30px', marginBottom: '5px' }}></div><span style={{ fontSize: '12px' }}>Date</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;