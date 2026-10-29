// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { 
  Plus, Camera, Wifi, Phone, Network, Cable, MapPin, Layers, Download, 
  Trash2, FileText, Moon, Sun, CheckCircle, Server, Home as HomeIcon, 
  Building, TreePine, ArrowRight, DollarSign, Gauge, Sparkles, Star, 
  Zap, Printer, Eye, Save, FolderOpen, X, User, Briefcase, 
  FileSpreadsheet, MonitorPlay, Monitor, Settings, Package, Activity, 
  ShoppingCart, HardDrive, Smartphone, Cloud, Calculator, MessageCircle, 
  ClipboardCheck, Shield, Cpu, Info, Lightbulb
} from 'lucide-react';

const CATALOG = {
  dvrs: {
    hik4: { name: 'Hikvision 4-Channel DVR', price: 5700 },
    hik8: { name: 'Hikvision 8-Channel DVR', price: 8500 },
    dahua4: { name: 'Dahua 4-Channel DVR', price: 4500 },
    dahua8: { name: 'Dahua 8-Channel DVR', price: 7000 }
  },
  cameras: {
    hikBullet: { 
      name: 'Hikvision 2MP Bullet', type: 'Bullet', price: 1700, 
      bestFor: 'Outdoor perimeters, long-range viewing, and visible deterrence.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' 
    },
    hikDome: { 
      name: 'Hikvision 2MP Dome', type: 'Dome', price: 1600, 
      bestFor: 'Indoor ceilings or low-profile outdoor areas. Vandal-resistant.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dome_camera.jpg/640px-Dome_camera.jpg' 
    },
    hikPTZ: { 
      name: 'Hikvision 2MP PTZ', type: 'PTZ', price: 12000, 
      bestFor: 'Large open areas (compounds, warehouses). Pan, tilt, and zoom.',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' 
    }
  },
  storage: {
    none: { name: 'No Hard Drive', price: 0 },
    hdd500: { name: '500GB Surveillance HDD', price: 3100 },
    hdd1tb: { name: '1TB Surveillance HDD', price: 5500 },
  },
  accessories: {
    psu: { name: 'Power Supply', price: 1500 },
    cablePerMeter: { name: 'RG59 Cable', price: 20 },
    connectors: { name: 'Connectors', price: 250 }
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

function App() {
  // Check local storage for saved theme, otherwise default to dark
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });
  
  const [currentView, setCurrentView] = useState('welcome'); 
  const [activeProject, setActiveProject] = useState('cctv');
  const [isExporting, setIsExporting] = useState(false);

  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [businessInfo, setBusinessInfo] = useState({ 
    name: 'Ngari Tech Solutions', phone: '0711645837', email: 'info@ngaritech.co.ke', mpesa: 'Paybill 400200'
  });

  const [customItems, setCustomItems] = useState([]);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [customItemQty, setCustomItemQty] = useState(1);

  const [premisesType, setPremisesType] = useState('home');
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('hikBullet');
  const [selectedStorage, setSelectedStorage] = useState('hdd500');
  const [selectedMonitor, setSelectedMonitor] = useState('none');
  const [selectedLabor, setSelectedLabor] = useState('basic');
  const [cableLength, setCableLength] = useState(50);
  const [customBundlePrice, setCustomBundlePrice] = useState('');

  const [survey, setSurvey] = useState({ power: false, cableRoute: false, internet: false, mounting: false, clientApp: false });
  const [calcHdd, setCalcHdd] = useState(500);
  const [calcRes, setCalcRes] = useState(1080);

  useEffect(() => {
    // Save to local storage and update HTML class
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  const addCustomItem = () => {
    if (!customItemName || !customItemPrice) return alert("Enter item name and price");
    setCustomItems([...customItems, { id: Date.now(), name: customItemName, price: Number(customItemPrice), qty: Number(customItemQty) }]);
    setCustomItemName(''); setCustomItemPrice(''); setCustomItemQty(1);
  };
  const removeCustomItem = (id) => setCustomItems(customItems.filter(i => i.id !== id));
  const getCustomItemsTotal = () => customItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const getRecommendation = () => {
    switch(premisesType) {
      case 'home': return { qty: 4, cam: 'hikBullet', dvr: 'hik4', monitor: 'm22', desc: 'A standard 4-camera setup covering the gate, compound, and main living area. Bullet cameras offer good perimeter visibility.' };
      case 'shop': return { qty: 4, cam: 'hikDome', dvr: 'hik4', monitor: 'm22', desc: 'Dome cameras are discreet and tamper-resistant, perfect for shop counters and aisles.' };
      case 'warehouse': return { qty: 8, cam: 'hikPTZ', dvr: 'hik8', monitor: 'm32', desc: 'PTZ cameras allow you to pan and zoom across large warehouse spaces. 8 cameras provide full coverage.' };
      case 'office': return { qty: 6, cam: 'hikDome', dvr: 'hik8', monitor: 'none', desc: 'Dome cameras blend into office ceilings. 8-channel DVR leaves room for future expansion.' };
      default: return null;
    }
  };
  const recommendation = getRecommendation();

  const applyRecommendation = () => {
    setQuantity(recommendation.qty);
    setSelectedCamera(recommendation.cam);
    setSelectedDvr(recommendation.dvr);
    setSelectedMonitor(recommendation.monitor);
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
    let discount = customBundlePrice ? rawTotal - Number(customBundlePrice) : 0;
    if (discount < 0) discount = 0;

    return { rawTotal, discount, finalHardware: rawTotal - discount };
  };

  const hardwareCosts = calculateHardwareCost();
  const laborCost = CATALOG.labor[selectedLabor].price;
  const calculateCCTVTotal = () => hardwareCosts.finalHardware + laborCost + getCustomItemsTotal();

  const getRecordingDays = () => Math.floor(calcHdd / ((calcRes === 1080 ? 15 : 30) * quantity));

  const handleDownloadPDF = () => {
    setIsExporting(true);
    const element = document.getElementById('pdf-report-container');
    html2pdf().set({ margin: 0.5, filename: `Quote_${clientInfo.name}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } }).from(element).save().then(() => setIsExporting(false));
  };

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      <header className="sticky top-0 z-20 border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => setCurrentView('welcome')} className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl"><Cable className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-500">CableIQ</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Kenyan CCTV Planner</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setCurrentView('welcome')} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><HomeIcon className="w-5 h-5" /></button>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* WELCOME */}
        {currentView === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div onClick={() => setCurrentView('cctv-planner')} className="cursor-pointer p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-orange-500 transition-all shadow-sm hover:shadow-md">
              <Camera className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">CCTV Configurator</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Build custom kits with AI recommendations.</p>
            </div>
            <div onClick={() => setCurrentView('cabling-planner')} className="cursor-pointer p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all shadow-sm hover:shadow-md">
              <Network className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Cabling Planner</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Plan data drops and cabling infrastructure.</p>
            </div>
            <div onClick={() => setCurrentView('report')} className="cursor-pointer p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all shadow-sm hover:shadow-md">
              <FileSpreadsheet className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Export PDF Quote</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Preview and download client quotations.</p>
            </div>
          </div>
        )}

        {/* CCTV CONFIGURATOR */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* SMART RECOMMENDATION */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" /> <span>Smart Recommendation</span>
                </h3>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1">
                    <label className="text-sm text-blue-200 block mb-1">Client Premises</label>
                    <select value={premisesType} onChange={e => setPremisesType(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-blue-800 border-blue-700 text-white mb-3 outline-none">
                      <option value="home">🏠 Home / Residential</option>
                      <option value="shop">🏪 Shop / Retail</option>
                      <option value="office">🏢 Office / Corporate</option>
                      <option value="warehouse">🏭 Warehouse / Industrial</option>
                    </select>
                    {recommendation && (
                      <p className="text-sm text-blue-100 italic">"{recommendation.desc}"</p>
                    )}
                  </div>
                  <button onClick={applyRecommendation} className="px-6 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                    Apply Recommendation
                  </button>
                </div>
              </div>

              {/* HARDWARE SELECTION */}
              <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white"><Cpu className="w-5 h-5 text-blue-500" /> <span>Hardware Details</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">DVR</label>
                    <select value={selectedDvr} onChange={e => setSelectedDvr(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mb-3 outline-none">
                      {Object.entries(CATALOG.dvrs).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Camera Type</label>
                    <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none">
                      {Object.entries(CATALOG.cameras).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white mb-3 outline-none" />
                    <label className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Storage</label>
                    <select value={selectedStorage} onChange={e => setSelectedStorage(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none">
                      {Object.entries(CATALOG.storage).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* SITE SURVEY */}
              <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white"><ClipboardCheck className="w-5 h-5 text-blue-500" /> <span>Site Survey</span></h3>
                <div className="grid grid-cols-2 gap-2">
                  {['power', 'cableRoute', 'internet', 'mounting'].map(k => (
                    <label key={k} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input type="checkbox" checked={survey[k]} onChange={() => setSurvey({...survey, [k]: !survey[k]})} className="rounded text-blue-600 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600" />
                      <span className="capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - SUMMARY */}
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Cost Summary</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between"><span>Hardware:</span> <span>{formatKES(hardwareCosts.rawTotal)}</span></div>
                  {hardwareCosts.discount > 0 && <div className="flex justify-between text-red-500"><span>Discount:</span> <span>-{formatKES(hardwareCosts.discount)}</span></div>}
                  <div className="flex justify-between"><span>Labor:</span> <span>{formatKES(laborCost)}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2 mt-2"><span>Total:</span> <span className="text-green-500">{formatKES(calculateCCTVTotal())}</span></div>
                </div>
                <button onClick={() => setCurrentView('report')} className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">Preview PDF</button>
                <button onClick={() => setCurrentView('preview')} className="w-full mt-2 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">View Topology</button>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-gray-900 dark:text-white"><Calculator className="w-5 h-5 text-blue-500" /> <span>Storage Calculator</span></h3>
                <select value={calcHdd} onChange={e => setCalcHdd(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border mb-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none">
                  <option value={500}>500 GB</option>
                  <option value={1000}>1 TB</option>
                </select>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-xs text-blue-600 dark:text-blue-300 font-medium">Estimated Recording Time</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getRecordingDays()} Days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CABLING PLANNER (Placeholder for now) */}
        {currentView === 'cabling-planner' && (
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Cabling Planner</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Feature available in full version. (Use CCTV Configurator for now).</p>
            <button onClick={() => setCurrentView('welcome')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Back Home</button>
          </div>
        )}

        {/* REPORT / PDF EXPORT */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <button onClick={() => setCurrentView('cctv-planner')} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">← Back</button>
              <button onClick={handleDownloadPDF} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">Download PDF</button>
            </div>
            <div className="flex justify-center bg-gray-200 dark:bg-gray-800 p-4 rounded-xl overflow-x-auto">
              {/* PDF Container is explicitly forced to light theme for printing */}
              <div id="pdf-report-container" className="bg-white text-gray-900 shadow-2xl p-10" style={{ width: '800px' }}>
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px' }}>
                  <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>QUOTATION</h1>
                  <p style={{ marginTop: '10px' }}>Date: {new Date().toLocaleDateString()}</p>
                </div>
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold' }}>PREPARED FOR</h2>
                <p style={{ fontSize: '16px' }}>{clientInfo.name || 'Client Name'}</p>
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>YOUR SYSTEM</h2>
                <p style={{ fontSize: '16px' }}>{quantity}x {CATALOG.cameras[selectedCamera].name} + {CATALOG.dvrs[selectedDvr].name}</p>
                <p style={{ fontStyle: 'italic', color: '#666', marginTop: '10px' }}>Best Suited For: {CATALOG.cameras[selectedCamera].bestFor}</p>
                <h2 style={{ color: '#1e3a8a', fontSize: '20px', fontWeight: 'bold', marginTop: '30px' }}>TOTAL COST</h2>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(calculateCCTVTotal())}</p>
              </div>
            </div>
          </div>
        )}

        {/* NETWORK PREVIEW */}
        {currentView === 'preview' && (
          <div className="p-10 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Network Topology</h2>
              <button onClick={() => setCurrentView('cctv-planner')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">← Back to Configurator</button>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-6">
              
              {/* Top Layer: Cloud / Remote */}
              <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center p-4 rounded-xl border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <Cloud className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-2" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Remote Viewing</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Via Smartphone App</span>
                </div>
                {selectedMonitor !== 'none' && (
                  <div className="flex flex-col items-center p-4 rounded-xl border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <Monitor className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-2" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{CATALOG.monitors[selectedMonitor].name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">HDMI Cable</span>
                  </div>
                )}
              </div>

              <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>

              {/* Middle Layer: Main DVR & PSU */}
              <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center p-3 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <HardDrive className="w-6 h-6 text-gray-500 dark:text-gray-400 mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{CATALOG.storage[selectedStorage].name}</span>
                </div>
                
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                
                <div className="flex flex-col items-center p-5 rounded-xl bg-blue-900 text-white shadow-lg">
                  <Server className="w-10 h-10 mb-2 text-orange-400" />
                  <span className="text-lg font-bold">{CATALOG.dvrs[selectedDvr].name}</span>
                  <span className="text-xs opacity-80">Main Recorder</span>
                </div>

                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>

                <div className="flex flex-col items-center p-3 rounded-xl border bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <Zap className="w-6 h-6 text-yellow-500 mb-1" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Power Supply</span>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-xs font-bold text-orange-500 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-orange-500">Video (RG59) & Power Cables</span>
                <div className="w-0.5 h-6 bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-0.5 w-3/4 bg-gray-300 dark:bg-gray-600"></div>
              </div>

              {/* Bottom Layer: Cameras */}
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {Array.from({ length: quantity }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center p-3 rounded-xl border border-gray-200 dark:border-gray-600 w-24 bg-white dark:bg-gray-700">
                    <Camera className="w-6 h-6 text-orange-500 mb-1" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Cam {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-12">
              <button onClick={() => setCurrentView('welcome')} className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Back to Menu</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;