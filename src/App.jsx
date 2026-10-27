// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js'; // <-- Import the PDF library
import { 
  Plus, Camera, Wifi, Phone, Network, Cable, MapPin, Layers, Download, 
  Trash2, FileText, Moon, Sun, CheckCircle, Server, Home as HomeIcon, 
  Building, TreePine, ArrowRight, DollarSign, Gauge, Sparkles, Star, 
  Zap, Printer, Eye, Save, FolderOpen, X, User, Briefcase, 
  FileSpreadsheet, MonitorPlay, Monitor, Settings, Package
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
  installationCost: 4500
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('welcome'); // welcome, planner, report
  
  // Configuration State
  const [brand, setBrand] = useState('hikvision');
  const [cameraType, setCameraType] = useState('bullet');
  const [quantity, setQuantity] = useState(4);
  const [hasMonitor, setHasMonitor] = useState(false);
  const [cableLength, setCableLength] = useState(50);
  
  // Client & Business Info
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [businessInfo, setBusinessInfo] = useState({ 
    name: 'Ngari Tech Solutions', 
    phone: '0711645837', 
    email: 'info@ngaritech.co.ke', 
    mpesa: 'Paybill 400200, Acc: 0110...' 
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  const loadJumiaKit = () => {
    setBrand('hikvision');
    setCameraType('bullet');
    setQuantity(4);
    setHasMonitor(false);
    setCableLength(50);
    setCurrentView('planner');
  };

  const calculateHardwareCost = () => {
    const brandData = PRICING.brands[brand];
    const cameraData = brandData.cameras[cameraType];
    const selectedDvr = quantity <= 4 ? brandData.dvr4 : brandData.dvr8;
    
    let total = (cameraData.price * quantity) 
              + selectedDvr.price 
              + PRICING.hdd500.price 
              + PRICING.psu.price 
              + (cableLength * PRICING.cablePerMeter.price) 
              + PRICING.connectors.price;
    if (hasMonitor) total += PRICING.monitor.price;
    return total;
  };

  const calculateTotalCost = () => calculateHardwareCost() + PRICING.installationCost;

  const selectedDvr = quantity <= 4 ? PRICING.brands[brand].dvr4 : PRICING.brands[brand].dvr8;

  // The PDF generation function
  const handleDownloadPDF = () => {
    setIsExporting(true);
    const element = document.getElementById('pdf-report-container');
    
    const opt = {
      margin:       0.5,
      filename:     `CCTV_Quotation_${clientInfo.name || 'Client'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false }, // useCORS allows external images to load
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate the PDF
    html2pdf().set(opt).from(element).save().then(() => {
      setIsExporting(false);
    });
  };

  const brandData = PRICING.brands[brand];
  const cameraData = brandData.cameras[cameraType];

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
        
        {/* --- LANDING PAGE --- */}
        {currentView === 'welcome' && (
          <div className="text-center py-10">
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What would you like to do?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
              
              <div onClick={() => setCurrentView('planner')} className={`group cursor-pointer p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500' : 'bg-white border-gray-200 hover:border-orange-500'}`}>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>CCTV Quotation Builder</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure your kit and generate a professional PDF.</p>
              </div>

              <div onClick={() => setCurrentView('report')} className={`group cursor-pointer p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-white border-gray-200 hover:border-blue-500'}`}>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>View Quotation Report</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Preview the exact PDF document and download it.</p>
              </div>

              <div onClick={() => setCurrentView('preview')} className={`group cursor-pointer p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-white border-gray-200 hover:border-purple-500'}`}>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <MonitorPlay className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Network Preview</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visualize the camera and DVR setup.</p>
              </div>

            </div>
          </div>
        )}

        {/* --- PLANNER VIEW --- */}
        {currentView === 'planner' && (
          <div className="space-y-6">
            
            <div className={`p-4 rounded-xl border flex items-center justify-between ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
              <div>
                <p className={`font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>Want the exact Jumia Kenya 4-Camera Kit?</p>
                <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>Loads the KSh 15,850 hardware package.</p>
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

            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Quotation Summary</h3>
                  <div className="mt-2 text-sm">
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Hardware: {formatKES(calculateHardwareCost())}</p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Installation: {formatKES(PRICING.installationCost)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Estimated Cost</p>
                  <p className="text-3xl font-bold text-green-500">{formatKES(calculateTotalCost())}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentView('welcome')} className={`px-6 py-4 rounded-xl font-bold flex items-center space-x-2 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                <ArrowRight className="w-5 h-5 rotate-180" /> <span>Back</span>
              </button>
              <button onClick={() => setCurrentView('report')} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center space-x-3 text-lg">
                <Eye className="w-6 h-6" /> <span>Preview & Export PDF Report</span>
              </button>
            </div>

          </div>
        )}

        {/* --- REPORT / EXPORT VIEW --- */}
        {currentView === 'report' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button onClick={() => setCurrentView('planner')} className={`px-4 py-2 rounded-xl text-sm font-bold ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
                ← Edit Configuration
              </button>
              <button 
                onClick={handleDownloadPDF} 
                disabled={isExporting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold rounded-xl shadow-lg flex items-center space-x-2"
              >
                <Download className="w-5 h-5" /> 
                <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
              </button>
            </div>

            {/* This is the actual Report Document (Styled beautifully for A4) */}
            <div className="overflow-x-auto pb-10 bg-gray-200 dark:bg-gray-800 p-4 rounded-xl flex justify-center">
              
              <div 
                id="pdf-report-container" 
                className="bg-white text-gray-900 shadow-2xl"
                style={{ width: '800px', padding: '40px', fontFamily: 'Arial, sans-serif' }}
              >
                {/* HEADER */}
                <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <div>
                    <h1 style={{ margin: 0, fontSize: '28px', color: '#f97316', letterSpacing: '1px' }}>QUOTATION</h1>
                    <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.9 }}>Date: {new Date().toLocaleDateString('en-GB')} | Valid: 14 days</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>{businessInfo.name}</h2>
                    <p style={{ margin: '5px 0', fontSize: '12px' }}>Tel: {businessInfo.phone} | Email: {businessInfo.email}</p>
                  </div>
                </div>

                {/* CLIENT DETAILS */}
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

                {/* SYSTEM OVERVIEW */}
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

                {/* WHY THIS SYSTEM */}
                <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>WHY THIS SYSTEM</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #f97316', padding: '12px', borderRadius: '4px', fontSize: '12px' }}><strong style={{ display: 'block', color: '#1e3a8a', marginBottom: '4px', fontSize: '13px' }}>CRYSTAL CLEAR</strong> Full HD 2MP video. Faces, number plates, and detail you can actually use.</div>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #f97316', padding: '12px', borderRadius: '4px', fontSize: '12px' }}><strong style={{ display: 'block', color: '#1e3a8a', marginBottom: '4px', fontSize: '13px' }}>SEES IN THE DARK</strong> Infrared night vision for 24/7 cover, even with the lights off.</div>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #f97316', padding: '12px', borderRadius: '4px', fontSize: '12px' }}><strong style={{ display: 'block', color: '#1e3a8a', marginBottom: '4px', fontSize: '13px' }}>WATCH FROM ANYWHERE</strong> Live view and playback on your phone with the mobile app.</div>
                  <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #f97316', padding: '12px', borderRadius: '4px', fontSize: '12px' }}><strong style={{ display: 'block', color: '#1e3a8a', marginBottom: '4px', fontSize: '13px' }}>BUILT FOR KENYAN WEATHER</strong> IP66 cameras handle rain, heat, and dust.</div>
                </div>

                {/* PAGE BREAK FOR PDF */}
                <div className="html2pdf__page-break"></div>

                {/* PRICE BREAKDOWN */}
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
                    <tr><td colSpan="2" style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}><strong>Hardware Subtotal</strong></td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}><strong>{calculateHardwareCost().toLocaleString()}</strong></td></tr>
                    <tr><td colSpan="2" style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', textAlign: 'right' }}>Installation & Configuration</td><td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb' }}>{PRICING.installationCost.toLocaleString()}</td></tr>
                    <tr><td colSpan="2" style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a' }}>TOTAL</td><td style={{ padding: '10px', fontWeight: 'bold', fontSize: '16px', color: '#1e3a8a', borderTop: '2px solid #1e3a8a' }}>{calculateTotalCost().toLocaleString()}</td></tr>
                  </tbody>
                </table>

                {/* TERMS */}
                <div style={{ color: '#1e3a8a', textTransform: 'uppercase', fontSize: '16px', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginTop: '30px', marginBottom: '15px', fontWeight: 'bold' }}>TERMS AND CONDITIONS</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>
                  <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                    <li style={{ marginBottom: '5px' }}><strong>Payment:</strong> 50% deposit to confirm, balance on completion. M-Pesa: {businessInfo.mpesa}</li>
                    <li style={{ marginBottom: '5px' }}>Prices include VAT. Quote valid for 14 days.</li>
                    <li style={{ marginBottom: '5px' }}>Client provides a power socket near the DVR location.</li>
                    <li style={{ marginBottom: '5px' }}>Installation takes about one day, subject to site access.</li>
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

        {/* Preview View */}
        {currentView === 'preview' && (
          <div className={`p-10 rounded-xl text-center border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <MonitorPlay className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Network Topology</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your system will include {quantity} {cameraType} cameras connected to a {selectedDvr.name}.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {Array.from({ length: quantity }).map((_, i) => (
                <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Camera className="w-6 h-6 text-blue-500 mx-auto" />
                  <p className="text-xs mt-1">Cam {i + 1}</p>
                </div>
              ))}
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Server className="w-6 h-6 text-green-500 mx-auto" />
                <p className="text-xs mt-1">{selectedDvr.name}</p>
              </div>
            </div>
            <button onClick={() => setCurrentView('welcome')} className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Home</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;