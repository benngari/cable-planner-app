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
    hikBullet: { name: 'Hikvision 2MP Bullet', type: 'Bullet', price: 1700, bestFor: 'Outdoor perimeters, long-range viewing.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' },
    hikDome: { name: 'Hikvision 2MP Dome', type: 'Dome', price: 1600, bestFor: 'Indoor ceilings, vandal-resistant.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dome_camera.jpg/640px-Dome_camera.jpg' },
    hikPTZ: { name: 'Hikvision 2MP PTZ', type: 'PTZ', price: 12000, bestFor: 'Large open areas, pan and zoom.', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/CCTV_camera_1.jpg/640px-CCTV_camera_1.jpg' }
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
  },
  labor: {
    diy: { name: 'Supply Only', price: 0 },
    basic: { name: 'Basic Installation', price: 4500 },
    complex: { name: 'Complex Installation', price: 8500 }
  },
  dvrImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Digital_Video_Recorder.jpg/640px-Digital_Video_Recorder.jpg',
};

function App() {
  // Default to LIGHT mode
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 
  
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [businessInfo, setBusinessInfo] = useState({ name: 'Ngari Tech Solutions', phone: '0711645837', email: 'info@ngaritech.co.ke', mpesa: 'Paybill 400200' });

  const [customItems, setCustomItems] = useState([]);
  const [premisesType, setPremisesType] = useState('home');
  const [quantity, setQuantity] = useState(4);
  const [selectedDvr, setSelectedDvr] = useState('hik4');
  const [selectedCamera, setSelectedCamera] = useState('hikBullet');
  const [selectedStorage, setSelectedStorage] = useState('hdd500');
  const [selectedMonitor, setSelectedMonitor] = useState('none');
  const [selectedLabor, setSelectedLabor] = useState('basic');
  const [cableLength, setCableLength] = useState(50);

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  const getRecommendation = () => {
    switch(premisesType) {
      case 'home': return { qty: 4, cam: 'hikBullet', dvr: 'hik4', monitor: 'm22', desc: 'Standard 4-camera setup for gate and compound.' };
      case 'shop': return { qty: 4, cam: 'hikDome', dvr: 'hik4', monitor: 'm22', desc: 'Discreet dome cameras for shop counters.' };
      case 'warehouse': return { qty: 8, cam: 'hikPTZ', dvr: 'hik8', monitor: 'none', desc: 'PTZ cameras for large warehouse spaces.' };
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
    return camPrice + dvrPrice + storagePrice + monitorPrice + psuPrice + cablePrice + connPrice;
  };

  const calculateCCTVTotal = () => calculateHardwareCost() + CATALOG.labor[selectedLabor].price;

  const handleDownloadPDF = () => {
    const element = document.getElementById('pdf-report-container');
    html2pdf().set({ margin: 0.5, filename: `Quote.pdf`, html2canvas: { scale: 2, useCORS: true } }).from(element).save();
  };

  // DYNAMIC CLASSES BASED ON STATE
  const bgMain = darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const bgCard = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const bgInput = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain}`}>
      
      <header className={`sticky top-0 z-20 border-b ${bgCard}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div onClick={() => setCurrentView('welcome')} className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl"><Cable className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">CableIQ</h1>
              <p className={`text-xs ${textMuted}`}>Kenyan CCTV Planner</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}><HomeIcon className="w-5 h-5" /></button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* WELCOME */}
        {currentView === 'welcome' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div onClick={() => setCurrentView('cctv-planner')} className={`cursor-pointer p-6 rounded-2xl border ${bgCard} hover:border-orange-500 shadow-sm transition-all`}>
              <Camera className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold">CCTV Configurator</h3>
              <p className={`text-sm ${textMuted}`}>Build custom kits with recommendations.</p>
            </div>
            <div onClick={() => setCurrentView('report')} className={`cursor-pointer p-6 rounded-2xl border ${bgCard} hover:border-green-500 shadow-sm transition-all`}>
              <FileSpreadsheet className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-lg font-bold">Export PDF Quote</h3>
              <p className={`text-sm ${textMuted}`}>Preview and download client quotations.</p>
            </div>
          </div>
        )}

        {/* CCTV CONFIGURATOR */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* SMART RECOMMENDATION */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-xl">
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Lightbulb className="w-5 h-5 text-yellow-400" /> <span>Smart Recommendation</span></h3>
                <select value={premisesType} onChange={e => setPremisesType(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-blue-800 border-blue-700 text-white mb-3 outline-none">
                  <option value="home">🏠 Home / Residential</option>
                  <option value="shop">🏪 Shop / Retail</option>
                  <option value="warehouse">🏭 Warehouse</option>
                </select>
                {recommendation && <p className="text-sm text-blue-100 italic mb-4">"{recommendation.desc}"</p>}
                <button onClick={applyRecommendation} className="w-full py-2 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100">Apply Recommendation</button>
              </div>

              {/* HARDWARE */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Cpu className="w-5 h-5 text-blue-500" /> <span>Hardware Details</span></h3>
                <div className="space-y-3">
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>DVR</label>
                    <select value={selectedDvr} onChange={e => setSelectedDvr(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${bgInput} outline-none`}>
                      {Object.entries(CATALOG.dvrs).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>Camera Type</label>
                    <select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${bgInput} outline-none`}>
                      {Object.entries(CATALOG.cameras).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm block mb-1 ${textMuted}`}>Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border ${bgInput} outline-none`} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4">Cost Summary</h3>
                <div className={`space-y-2 text-sm ${textMuted}`}>
                  <div className="flex justify-between"><span>Hardware:</span> <span className="text-gray-900 dark:text-white font-medium">{formatKES(calculateHardwareCost())}</span></div>
                  <div className="flex justify-between"><span>Labor:</span> <span className="text-gray-900 dark:text-white font-medium">{formatKES(CATALOG.labor[selectedLabor].price)}</span></div>
                  <div className={`flex justify-between font-bold text-lg border-t pt-2 mt-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <span>Total:</span> <span className="text-green-500">{formatKES(calculateCCTVTotal())}</span>
                  </div>
                </div>
                <button onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Preview PDF</button>
              </div>
            </div>
          </div>
        )}

        {/* REPORT */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between">
              <button onClick={() => setCurrentView('cctv-planner')} className={`px-4 py-2 font-bold rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>← Back</button>
              <button onClick={handleDownloadPDF} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg">Download PDF</button>
            </div>
            <div className={`flex justify-center p-4 rounded-xl overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              {/* Force light mode for PDF */}
              <div id="pdf-report-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px' }}>
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px' }}>
                  <h1 style={{ margin: 0, color: '#f97316' }}>QUOTATION</h1>
                </div>
                <h2 style={{ color: '#1e3a8a', marginTop: '30px' }}>TOTAL COST</h2>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>{formatKES(calculateCCTVTotal())}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;