// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Plus, Camera, Wifi, Phone, Network, Cable, MapPin, Layers, Download, 
  Trash2, FileText, Moon, Sun, CheckCircle, Server, Home as HomeIcon, 
  Building, TreePine, ArrowRight, DollarSign, Gauge, Sparkles, Star, 
  Zap, Printer, Eye, Save, FolderOpen, X, User, Briefcase, 
  FileSpreadsheet, MonitorPlay, Monitor, Settings, Package, Activity, 
  ShoppingCart, HardDrive, Smartphone, Cloud
} from 'lucide-react';

const PRICING = {
  brands: {
    hikvision: {
      name: 'Hikvision',
      cameras: {
        dome: { name: '2MP Dome Camera', price: 1800, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dome_camera.jpg/640px-Dome_camera.jpg' },
        bullet: { name: '2MP Bullet Camera', price: 1800, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' },
        ptz: { name: '2MP PTZ Camera', price: 12000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' }
      },
      dvr4: { name: '4-Channel DVR', price: 3500 },
      dvr8: { name: '8-Channel DVR', price: 5500 }
    },
    dahua: {
      name: 'Dahua',
      cameras: {
        dome: { name: '2MP Dome Camera', price: 1500, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dome_camera.jpg/640px-Dome_camera.jpg' },
        bullet: { name: '2MP Bullet Camera', price: 1500, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' },
        ptz: { name: '4MP PTZ Camera', price: 15000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' }
      },
      dvr4: { name: '4-Channel DVR', price: 3000 },
      dvr8: { name: '8-Channel DVR', price: 5000 }
    }
  },
  monitor: { name: '22" CCTV Monitor', price: 13000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Computer_monitor.jpg/640px-Computer_monitor.jpg' },
  hdd500: { name: '500GB Surveillance Hard Drive', price: 3100 },
  psu: { name: '4-Port 5A Centralized Power Supply', price: 800 },
  cablePerMeter: { name: 'RG59 Coaxial Cable', price: 20 },
  connectors: { name: '12x BNC & DC Connectors', price: 250 },
  dvrImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Digital_Video_Recorder.jpg/640px-Digital_Video_Recorder.jpg',
  installationCost: 4500,
  
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

  // CCTV State
  const [brand, setBrand] = useState('hikvision');
  const [cameraType, setCameraType] = useState('bullet');
  const [quantity, setQuantity] = useState(4);
  const [hasMonitor, setHasMonitor] = useState(false);
  const [cableLength, setCableLength] = useState(50);
  const [showItemizedPrice, setShowItemizedPrice] = useState(false); // New state for price breakdown

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

  // CCTV Calculations
  const loadJumiaKit = () => {
    setBrand('hikvision');
    setCameraType('bullet');
    setQuantity(4);
    setHasMonitor(false);
    setCableLength(50);
    setActiveProject('cctv');
    setShowItemizedPrice(true); // Show the itemized breakdown automatically
  };

  const calculateHardwareCost = () => {
    const brandData = PRICING.brands[brand];
    const cameraData = brandData.cameras[cameraType];
    const selectedDvr = quantity <= 4 ? brandData.dvr4 : brandData.dvr8;
    let total = (cameraData.price * quantity) + selectedDvr.price + PRICING.hdd500.price + PRICING.psu.price + (cableLength * PRICING.cablePerMeter.price) + PRICING.connectors.price;
    if (hasMonitor) total += PRICING.monitor.price;
    return total;
  };
  
  const calculateCCTVTotal = () => calculateHardwareCost() + PRICING.installationCost + getCustomItemsTotal();
  const selectedDvr = quantity <= 4 ? PRICING.brands[brand].dvr4 : PRICING.brands[brand].dvr8;

  // Cabling Calculations
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

    const cablePrice = PRICING.cablingStandards[cabStandard].price;
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

  const brandData = PRICING.brands[brand];
  const cameraData = brandData.cameras[cameraType];

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
                <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>CCTV Quotation</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Build Hikvision/Dahua kits and generate PDF quotes.</p>
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

        {/* ======================= CCTV PLANNER ======================= */}
        {currentView === 'cctv-planner' && (
          <div className="space-y-6">
            <div className={`p-4 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <div>
                <p className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>Jumia Kenya 4-Camera Kit (Hardware only)</p>
                <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Loads the KSh 15,850 package.</p>
              </div>
              <button onClick={loadJumiaKit} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md flex items-center space-x-2">
                <Package className="w-5 h-5" /> <span>Load Jumia Kit</span>
              </button>
            </div>

            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <User className="w-5 h-5 text-blue-500" /> <span>Quotation Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-blue-500">Client Info</h4>
                  <input type="text" placeholder="Client Name" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                  <input type="text" placeholder="Client Phone" value={clientInfo.phone} onChange={e => setClientInfo({...clientInfo, phone: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                  <input type="text" placeholder="Location / Address" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-blue-500">Your Business Info</h4>
                  <input type="text" placeholder="Business Name" value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                  <input type="text" placeholder="Phone" value={businessInfo.phone} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                  <input type="text" placeholder="M-Pesa Till/Paybill" value={businessInfo.mpesa} onChange={e => setBusinessInfo({...businessInfo, mpesa: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Settings className="w-5 h-5 text-blue-500" /> <span>System Configuration</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Brand</label>
                  <select value={brand} onChange={e => setBrand(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="hikvision">Hikvision</option>
                    <option value="dahua">Dahua</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Camera Design</label>
                  <select value={cameraType} onChange={e => setCameraType(e.target.value)} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="bullet">Bullet</option>
                    <option value="dome">Dome</option>
                    <option value="ptz">PTZ</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Number of Cameras</label>
                  <input type="number" min="1" max="16" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Cable Required (meters)</label>
                  <input type="number" value={cableLength} onChange={e => setCableLength(Number(e.target.value))} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
              </div>
              <div className={`mt-6 p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center space-x-3">
                  <Monitor className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add 22" CCTV Monitor</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Optional live viewing display</p>
                  </div>
                </div>
                <button onClick={() => setHasMonitor(!hasMonitor)} className={`px-6 py-2 rounded-lg font-bold transition-all ${hasMonitor ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'}`}>
                  {hasMonitor ? 'Added ✓' : `+ ${formatKES(PRICING.monitor.price)}`}
                </button>
              </div>
            </div>

            {/* NEW: ITEMIZED PRICE BREAKDOWN */}
            {showItemizedPrice && (
              <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-green-900' : 'bg-green-50 border-green-200'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-bold flex items-center space-x-2 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                    <DollarSign className="w-5 h-5" /> <span>Jumia Kit Price Estimate</span>
                  </h3>
                  <button onClick={() => setShowItemizedPrice(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>{quantity}x {brandData.name} Cameras (@{formatKES(cameraData.price)})</span> <span>{formatKES(cameraData.price * quantity)}</span></div>
                  <div className="flex justify-between"><span>1x {selectedDvr.name}</span> <span>{formatKES(selectedDvr.price)}</span></div>
                  <div className="flex justify-between"><span>1x {PRICING.hdd500.name}</span> <span>{formatKES(PRICING.hdd500.price)}</span></div>
                  <div className="flex justify-between"><span>1x {PRICING.psu.name}</span> <span>{formatKES(PRICING.psu.price)}</span></div>
                  <div className="flex justify-between"><span>{cableLength}m Coaxial Cable (@{formatKES(PRICING.cablePerMeter.price)}/m)</span> <span>{formatKES(cableLength * PRICING.cablePerMeter.price)}</span></div>
                  <div className="flex justify-between"><span>1x {PRICING.connectors.name}</span> <span>{formatKES(PRICING.connectors.price)}</span></div>
                  <div className="border-t border-green-300 dark:border-green-800 mt-2 pt-2 font-bold flex justify-between text-base">
                    <span>Total Hardware Estimate:</span> 
                    <span>{formatKES(calculateHardwareCost())}</span>
                  </div>
                </div>
              </div>
            )}

            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <ShoppingCart className="w-5 h-5 text-blue-500" /> <span>Additional Items Required</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input type="text" placeholder="Item Name (e.g., Extra Brackets)" value={customItemName} onChange={e => setCustomItemName(e.target.value)} className={`px-3 py-2 rounded-lg border md:col-span-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
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
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Quotation Summary</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hardware: {formatKES(calculateHardwareCost())} | Labor: {formatKES(PRICING.installationCost)} {customItems.length > 0 ? `| Custom: ${formatKES(getCustomItemsTotal())}` : ''}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</p>
                  <p className="text-3xl font-bold text-green-500">{formatKES(calculateCCTVTotal())}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentView('welcome')} className={`px-6 py-4 rounded-xl font-bold flex items-center space-x-2 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <ArrowRight className="w-5 h-5 rotate-180" /> <span>Back</span>
              </button>
              <button onClick={() => setCurrentView('report')} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center space-x-3 text-lg">
                <Eye className="w-6 h-6" /> <span>Preview & Export PDF Report</span>
              </button>
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
                    {Object.entries(PRICING.cablingStandards).map(([key, val]) => (
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
              
              <div 
                id="pdf-report-container" 
                className="bg-white text-gray-900 shadow-2xl"
                style={{ width: '800px', padding: '40px', fontFamily: 'Arial, sans-serif' }}
              >
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
                        <img src={cameraData.image} alt="Camera" style={{ width: '100%', maxWidth: '140px', height: '100px', objectFit: 'contain', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'white', padding: '5px', border: '1px solid #e5e7eb' }} crossOrigin="anonymous" />
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: '5px 0' }}>{quantity}x {brandData.name} {cameraData.name}</p>
                        <span style={{ fontSize: '10px', color: '#666' }}>2MP 1080p • Night Vision</span>
                      </div>
                      <div style={{ textAlign: 'center', width: '30%' }}>
                        <img src={PRICING.dvrImage} alt="DVR" style={{ width: '100%', maxWidth: '140px', height: '100px', objectFit: 'contain', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'white', padding: '5px', border: '1px solid #e5e7eb' }} crossOrigin="anonymous" />
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: '5px 0' }}>1x {brandData.name} {selectedDvr.name}</p>
                        <span style={{ fontSize: '10px', color: '#666' }}>H.265 • Smartphone App</span>
                      </div>
                      {hasMonitor && (
                        <div style={{ textAlign: 'center', width: '30%' }}>
                          <img src={PRICING.monitor.image} alt="Monitor" style={{ width: '100%', maxWidth: '140px', height: '100px', objectFit: 'contain', marginBottom: '10px', borderRadius: '8px', backgroundColor: 'white', padding: '5px', border: '1px solid #e5e7eb' }} crossOrigin="anonymous" />
                          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e3a8a', margin: '5px 0' }}>1x {PRICING.monitor.name}</p>
                          <span style={{ fontSize: '10px', color: '#666' }}>Full HD • HDMI & VGA</span>
                        </div>
                      )}
                    </div>

                    <h4 style={{ marginBottom: '10px', color: '#1e3a8a' }}>WHAT'S IN THE BOX</h4>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px 25px', fontSize: '13px', marginBottom: '20px' }}>
                      <ol style={{ paddingLeft: '20px', margin: 0 }}>
                        <li style={{ marginBottom: '8px' }}>1 {brandData.name} {selectedDvr.name} (DVR Machine) - White</li>
                        <li style={{ marginBottom: '8px' }}>{quantity} Pieces of {brandData.name} 1080P Full HD 2MP Indoor & outdoor IR Night vision CCTV Cameras</li>
                        <li style={{ marginBottom: '8px' }}>1 Piece of 500GB Hard Drive or Hard disk or Cameras Recording Memory</li>
                        <li style={{ marginBottom: '8px' }}>1 set of 4 ports 5 Amperes Centralized CCTV Power Supply Box Unit</li>
                        <li style={{ marginBottom: '8px' }}>{cableLength}M RG59 Two-in-one Coaxial CCTV Cameras cable Roll</li>
                        <li style={{ marginBottom: '8px' }}>12 Bnc and DC jack power connectors</li>
                        {hasMonitor && <li style={{ marginBottom: '8px' }}><strong>1 {PRICING.monitor.name} (Surveillance Display)</strong></li>}
                      </ol>
                    </div>

                    {/* CCTV SYSTEM TOPOLOGY DIAGRAM */}
                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>SYSTEM TOPOLOGY</div>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
                      
                      {/* Top row: Phone App & Monitor */}
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                           <div style={{ ...topologyBoxStyle, borderColor: '#0ea5e9', backgroundColor: '#f0f9ff' }}>
                              <Smartphone style={{ width: '20px', height: '20px', color: '#0ea5e9', margin: '0 auto 5px auto' }} />
                              <strong style={{ fontSize: '11px' }}>Remote Viewing</strong>
                           </div>
                           <span style={{ fontSize: '10px', color: '#ea580c', fontWeight: 'bold' }}>Internet (Cloud)</span>
                        </div>
                        {hasMonitor && (
                          <div style={{ textAlign: 'center' }}>
                             <div style={{ ...topologyBoxStyle, borderColor: '#3b82f6' }}>
                                <Monitor style={{ width: '20px', height: '20px', color: '#3b82f6', margin: '0 auto 5px auto' }} />
                                <strong style={{ fontSize: '11px' }}>CCTV Monitor</strong>
                             </div>
                             <span style={{ fontSize: '10px', color: '#ea580c', fontWeight: 'bold' }}>HDMI / VGA Cable</span>
                          </div>
                        )}
                      </div>

                      {/* Middle: DVR, HDD, PSU */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', textAlign: 'center', width: '100px' }}>
                          <HardDrive style={{ width: '20px', height: '20px', color: '#64748b', margin: '0 auto 5px auto' }} />
                          <strong style={{ fontSize: '10px', display: 'block' }}>500GB HDD</strong>
                        </div>
                        <div style={{ width: '20px', height: '2px', backgroundColor: '#94a3b8' }}></div>
                        <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '12px 20px', borderRadius: '8px', textAlign: 'center', minWidth: '150px' }}>
                          <strong style={{ fontSize: '13px' }}>{selectedDvr.name}</strong><br/>
                          <span style={{ fontSize: '10px', opacity: 0.8 }}>Main Recorder</span>
                        </div>
                        <div style={{ width: '20px', height: '2px', backgroundColor: '#94a3b8' }}></div>
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', textAlign: 'center', width: '100px' }}>
                          <Zap style={{ width: '20px', height: '20px', color: '#eab308', margin: '0 auto 5px auto' }} />
                          <strong style={{ fontSize: '10px', display: 'block' }}>5A Power Supply</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                        <div style={topologyLineStyle}></div>
                        <span style={topologyLabelStyle}>Video (RG59) & Power Cables</span>
                        <div style={{ height: '2px', width: '80%', backgroundColor: '#94a3b8', margin: '10px auto' }}></div>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                        {Array.from({ length: quantity }).map((_, i) => (
                          <div key={i} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', width: '100px', textAlign: 'center' }}>
                            <Camera style={{ width: '20px', height: '20px', color: '#f97316', margin: '0 auto 5px auto' }} />
                            <strong style={{ fontSize: '11px', display: 'block' }}>Cam {i + 1}</strong>
                            <span style={{ fontSize: '9px', color: '#64748b' }}>Outdoor</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>PRICE BREAKDOWN</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>#</th>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Description</th>
                          <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f3f4f6', color: '#1e3a8a' }}>Amount (KSh)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>1</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}><strong>{brandData.name} {cameraData.name}</strong> ({quantity} pcs @ {cameraData.price.toLocaleString()})</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(cameraData.price * quantity).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>2</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}><strong>{brandData.name} {selectedDvr.name}</strong></td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{selectedDvr.price.toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>3</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.hdd500.name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.hdd500.price.toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>4</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.psu.name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.psu.price.toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>5</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cableLength}m {PRICING.cablePerMeter.name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(cableLength * PRICING.cablePerMeter.price).toLocaleString()}</td></tr>
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>6</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.connectors.name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.connectors.price.toLocaleString()}</td></tr>
                        {hasMonitor && <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>7</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.monitor.name}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.monitor.price.toLocaleString()}</td></tr>}
                        
                        {customItems.map((item, index) => (
                          <tr key={item.id}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{hasMonitor ? 8 + index : 7 + index}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{item.qty}x {item.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{(item.price * item.qty).toLocaleString()}</td>
                          </tr>
                        ))}

                        <tr><td colSpan="2" style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}><strong>Hardware Subtotal</strong></td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}><strong>{calculateHardwareCost().toLocaleString()}</strong></td></tr>
                        <tr><td colSpan="2" style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Installation & Configuration</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.installationCost.toLocaleString()}</td></tr>
                        <tr><td colSpan="2" style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a' }}>TOTAL</td><td style={{ padding: '10px', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a' }}>{calculateCCTVTotal().toLocaleString()}</td></tr>
                      </tbody>
                    </table>
                  </>
                )}

                {/* ======================= CABLING REPORT ======================= */}
                {activeProject === 'cabling' && (
                  <>
                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>NETWORK & CABLE SUMMARY</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '13px' }}>
                      <tbody>
                        <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', width: '50%' }}><strong>Cable Standard</strong></td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.cablingStandards[cabStandard].name} ({PRICING.cablingStandards[cabStandard].speed})</td></tr>
                        <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}><strong>Total Ports (Drops)</strong></td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.totalPorts} Ports</td></tr>
                        <tr><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}><strong>Total Cable Length (inc 15% slack)</strong></td><td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>{Math.round(cabTotals.totalWithWaste)} meters</td></tr>
                      </tbody>
                    </table>

                    {/* CABLING TOPOLOGY DIAGRAM */}
                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>NETWORK TOPOLOGY</div>
                    <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
                      
                      <div style={topologyBoxStyle}>
                        <Server style={{ width: '24px', height: '24px', color: '#3b82f6', margin: '0 auto 5px auto' }} />
                        <strong style={{ fontSize: '12px', display: 'block' }}>Core Switch</strong>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>Main Distribution</span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
                        <div style={topologyLineStyle}></div>
                        <span style={topologyLabelStyle}>Patch Cords</span>
                        <div style={topologyLineStyle}></div>
                      </div>

                      <div style={{ ...topologyBoxStyle, borderColor: '#0ea5e9', backgroundColor: '#f0f9ff' }}>
                        <Layers style={{ width: '24px', height: '24px', color: '#0ea5e9', margin: '0 auto 5px auto' }} />
                        <strong style={{ fontSize: '12px', display: 'block' }}>{cabTotals.patchPanels}x Patch Panel</strong>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>24-Port Management</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0' }}>
                        <div style={topologyLineStyle}></div>
                        <span style={{ ...topologyLabelStyle, color: '#3b82f6', borderColor: '#3b82f6' }}>
                          {PRICING.cablingStandards[cabStandard].name} Cable (Solid Core)
                        </span>
                        <div style={{ height: '2px', width: '80%', backgroundColor: '#94a3b8', margin: '10px auto' }}></div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                        {cabRooms.map(room => {
                          const devCount = cabDevices.filter(d => d.room === room.name).length;
                          if (devCount === 0) return null;
                          return (
                            <div key={room.id} style={{ backgroundColor: 'white', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', width: '120px', textAlign: 'center' }}>
                              <MapPin style={{ width: '20px', height: '20px', color: '#10b981', margin: '0 auto 5px auto' }} />
                              <strong style={{ fontSize: '11px', display: 'block' }}>{room.name}</strong>
                              <span style={{ fontSize: '9px', color: '#64748b' }}>{devCount} devices</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

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
                        <tr><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.cablingStandards[cabStandard].name} Cable Box (305m)</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{cabTotals.cableBoxes}</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>boxes</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{Math.round(cabTotals.cableCost).toLocaleString()}</td></tr>
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

                    <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>DEVICE LOCATIONS</div>
                    {cabRooms.map(room => {
                      const devs = cabDevices.filter(d => d.room === room.name);
                      if (devs.length === 0) return null;
                      return (
                        <div key={room.id} style={{ marginBottom: '15px' }}>
                          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '13px', color: '#1e3a8a' }}>{room.name}</p>
                          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px' }}>
                            {devs.map(d => <li key={d.id}>{d.name} ({cabDeviceTypes[d.type].label}) - {d.cableLength}m {d.type === 'data' ? `[${d.faceplate === 'dual' ? 'Dual Port' : 'Single Port'}]` : ''}</li>)}
                          </ul>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* COMMON TERMS */}
                <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>TERMS AND CONDITIONS</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>
                  <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                    <li style={{ marginBottom: '5px' }}><strong>Payment:</strong> 50% deposit to confirm, balance on completion. M-Pesa: {businessInfo.mpesa}</li>
                    <li style={{ marginBottom: '5px' }}>Prices include VAT. Quote valid for 14 days.</li>
                    <li style={{ marginBottom: '5px' }}>Client provides a power socket near the equipment location.</li>
                    <li style={{ marginBottom: '5px' }}>12 months warranty on all equipment, 3 months on workmanship.</li>
                  </ul>
                </div>

                {/* SIGNATURES */}
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderBottom: '1px solid #333', paddingBottom: '5px', marginBottom: '5px', height: '30px' }}></div>
                    <span style={{ fontSize: '12px' }}>Accepted by (Client Signature)</span>
                  </div>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderBottom: '1px solid #333', paddingBottom: '5px', marginBottom: '5px', height: '30px' }}></div>
                    <span style={{ fontSize: '12px' }}>Date</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= NETWORK PREVIEW (UI) ======================= */}
        {currentView === 'preview' && (
          <div className={`p-10 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-2 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>Interactive Network Topology</h2>
            <p className={`mb-10 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Visual overview of how your system connects.
            </p>
            
            <div className="flex flex-col items-center justify-center space-y-6">
              
              {/* Top Layer: Cloud / Remote */}
              <div className="flex justify-center gap-8">
                <div className={`flex flex-col items-center p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <Cloud className="w-8 h-8 text-blue-400 mb-2" />
                  <span className="text-sm font-bold">Remote Viewing</span>
                  <span className="text-xs text-gray-500">Via Smartphone App</span>
                </div>
                {hasMonitor && (
                  <div className={`flex flex-col items-center p-4 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <Monitor className="w-8 h-8 text-blue-400 mb-2" />
                    <span className="text-sm font-bold">CCTV Monitor</span>
                    <span className="text-xs text-gray-500">HDMI Cable</span>
                  </div>
                )}
              </div>

              {/* Connecting Lines */}
              <div className="w-0.5 h-8 bg-gray-400 dark:bg-gray-600"></div>

              {/* Middle Layer: Main DVR & PSU */}
              <div className="flex items-center justify-center gap-6">
                <div className={`flex flex-col items-center p-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <HardDrive className="w-6 h-6 text-gray-500 mb-1" />
                  <span className="text-xs font-bold">500GB HDD</span>
                </div>
                
                <div className="w-8 h-0.5 bg-gray-400 dark:bg-gray-600"></div>
                
                <div className="flex flex-col items-center p-5 rounded-xl bg-blue-900 text-white shadow-lg">
                  <Server className="w-10 h-10 mb-2 text-orange-400" />
                  <span className="text-lg font-bold">{selectedDvr.name}</span>
                  <span className="text-xs opacity-80">Main Recorder</span>
                </div>

                <div className="w-8 h-0.5 bg-gray-400 dark:bg-gray-600"></div>

                <div className={`flex flex-col items-center p-3 rounded-xl border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                  <Zap className="w-6 h-6 text-yellow-500 mb-1" />
                  <span className="text-xs font-bold">Power Supply</span>
                </div>
              </div>

              {/* Connecting Lines */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-gray-400 dark:bg-gray-600"></div>
                <span className="text-xs font-bold text-orange-500 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-orange-500">Video (RG59) & Power Cables</span>
                <div className="w-0.5 h-6 bg-gray-400 dark:bg-gray-600"></div>
                <div className="h-0.5 w-3/4 bg-gray-400 dark:bg-gray-600"></div>
              </div>

              {/* Bottom Layer: Cameras */}
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {Array.from({ length: quantity }).map((_, i) => (
                  <div key={i} className={`flex flex-col items-center p-3 rounded-xl border w-24 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}>
                    <Camera className="w-6 h-6 text-orange-500 mb-1" />
                    <span className="text-xs font-bold">Camera {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <button onClick={() => setCurrentView('welcome')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all">
                Back to Menu
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;