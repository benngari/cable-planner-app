// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Camera, Wifi, Phone, Network, Cable, MapPin, Layers, Download, Trash2, FileText, Moon, Sun, CheckCircle, Server, Home as HomeIcon, Building, TreePine, ArrowRight, DollarSign, Gauge, Sparkles, Star, Zap, Printer, Eye, Save, FolderOpen, X, User, Briefcase, FileSpreadsheet, MonitorPlay, Monitor
} from 'lucide-react';

const USD_TO_KES = 130;

// Kenyan Market Pricing (Based on online research)
const PRICING = {
  brands: {
    hikvision: {
      name: 'Hikvision',
      cameras: {
        dome: { name: '2MP Dome Camera', price: 10200, image: 'https://imgbin.com/png/asNFEVrf/product-design-camera-lens-closed-circuit-television-png' },
        bullet: { name: '2MP Bullet Camera', price: 7500, image: 'https://imgbin.com/png/asNFEVrf/product-design-camera-lens-closed-circuit-television-png' },
        ptz: { name: '2MP PTZ Camera', price: 28500, image: 'https://imgbin.com/png/asNFEVrf/product-design-camera-lens-closed-circuit-television-png' }
      },
      dvr4: { name: '4-Channel DVR', price: 12000 },
      dvr8: { name: '8-Channel DVR', price: 16600 }
    },
    dahua: {
      name: 'Dahua',
      cameras: {
        dome: { name: '2MP Dome Camera', price: 3900, image: 'https://imgbin.com/png/asNFEVrf/product-design-camera-lens-closed-circuit-television-png' },
        bullet: { name: '2MP Bullet Camera', price: 4550, image: 'https://imgbin.com/png/asNFEVrf/product-design-camera-lens-closed-circuit-television-png' },
        ptz: { name: '4MP PTZ Camera', price: 28000, image: 'https://imgbin.com/png/asNFEVrf/product-design-camera-lens-closed-circuit-television-png' }
      },
      dvr4: { name: '4-Channel DVR', price: 4500 },
      dvr8: { name: '8-Channel DVR', price: 8500 }
    }
  },
  monitor: {
    name: '22" CCTV Monitor',
    price: 10000
  },
  hdd500: { name: '500GB Surveillance Hard Drive', price: 3500 },
  hdd1tb: { name: '1TB Surveillance Hard Drive', price: 5500 },
  psu: { name: 'Centralized Power Supply', price: 2000 },
  cablePerMeter: { name: 'RG59 Coaxial Cable', price: 50 },
  connectors: { name: 'BNC & DC Connectors (12 pcs)', price: 1500 }
};

const defaultRooms = [
  { id: 1, name: "Main Entrance", icon: "Building" },
  { id: 2, name: "Parking / Compound", icon: "Home" },
  { id: 3, name: "Back / Side Access", icon: "TreePine" },
  { id: 4, name: "Inside Shop", icon: "Home" }
];

const getRoomIcon = (iconName) => {
  switch(iconName) {
    case 'Home': return HomeIcon;
    case 'Building': return Building;
    case 'TreePine': return TreePine;
    default: return HomeIcon;
  }
};

// Generate PDF with Images
const generateQuotationPDF = (data) => {
  const printWindow = window.open('', '_blank');
  const { 
    clientInfo, businessInfo, brand, cameraType, quantity, hasMonitor, 
    cableLength, totalCost, dateStr, selectedDvr 
  } = data;

  const brandData = PRICING.brands[brand];
  const cameraData = brandData.cameras[cameraType];

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CCTV Quotation - ${clientInfo.name || 'Client'}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 0; margin: 0; color: #333; line-height: 1.5; }
        .page { max-width: 800px; margin: 0 auto; padding: 40px; }
        .header { background-color: #1e3a8a; color: white; padding: 30px; border-radius: 10px; display: flex; justify-content: space-between; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 28px; color: #f97316; letter-spacing: 1px; }
        .header p { margin: 5px 0; font-size: 12px; opacity: 0.9; }
        .details { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 13px; }
        .details div { width: 48%; }
        .details h3 { border-bottom: 2px solid #1e3a8a; padding-bottom: 5px; margin-bottom: 10px; color: #1e3a8a; font-size: 14px; }
        .section-title { color: #1e3a8a; text-transform: uppercase; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; margin-bottom: 15px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f3f4f6; color: #1e3a8a; font-weight: bold; }
        .total-row td { font-weight: bold; font-size: 16px; color: #1e3a8a; border-top: 2px solid #1e3a8a; border-bottom: none; }
        .product-grid { display: flex; justify-content: space-around; align-items: center; margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 10px; }
        .product-item { text-align: center; width: 30%; }
        .product-item img { max-width: 120px; height: auto; margin-bottom: 10px; border-radius: 8px; }
        .product-item p { font-size: 12px; font-weight: bold; color: #1e3a8a; margin: 5px 0; }
        .product-item span { font-size: 11px; color: #666; }
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .feature-card { background: #f8fafc; border-left: 4px solid #f97316; padding: 12px; border-radius: 4px; font-size: 12px; }
        .feature-card strong { display: block; color: #1e3a8a; margin-bottom: 4px; font-size: 13px; }
        .terms { font-size: 12px; color: #4b5563; margin-top: 30px; }
        .terms ul { padding-left: 20px; margin-top: 5px; }
        .terms li { margin-bottom: 5px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }
        .sig-box { margin-top: 40px; display: flex; justify-content: space-between; }
        .sig-line { width: 45%; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px; }
        @media print { .page { max-width: 100%; padding: 20px; } .page-break { page-break-before: always; } }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div>
            <h1>QUOTATION</h1>
            <p>No: 001 | Date: ${dateStr} | Valid: 14 days</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin:0; font-size: 20px;">${businessInfo.name}</h2>
            <p>Tel: ${businessInfo.phone} | Email: ${businessInfo.email}</p>
          </div>
        </div>

        <div class="details">
          <div>
            <h3>PREPARED BY</h3>
            <p><strong>${businessInfo.name}</strong></p>
            <p>Tel: ${businessInfo.phone}</p>
            <p>Email: ${businessInfo.email}</p>
          </div>
          <div>
            <h3>PREPARED FOR</h3>
            <p><strong>${clientInfo.name || '[Client Name]'}</strong></p>
            <p>${clientInfo.address || '[Address]'}</p>
            <p>Tel: ${clientInfo.phone || '[Phone]'}</p>
          </div>
        </div>

        <div class="section-title">YOUR SYSTEM: WHAT YOU GET</div>
        
        <div class="product-grid">
          <div class="product-item">
            <img src="${cameraData.image}" alt="Camera" onerror="this.style.display='none'">
            <p>${quantity}x ${brandData.name} ${cameraData.name}</p>
            <span>2MP 1080p • Night Vision • Weatherproof</span>
          </div>
          <div class="product-item">
            <img src="${brand === 'hikvision' ? 'https://toppng.com/free-image/hik-camera-hikvision-cctv-camera-PNG-free-PNG-Images_176907' : cameraData.image}" alt="DVR" onerror="this.style.display='none'">
            <p>1x ${brandData.name} ${selectedDvr.name}</p>
            <span>H.265 Compression • Smartphone App</span>
          </div>
          ${hasMonitor ? `
          <div class="product-item">
            <img src="https://www.pngall.com/cctv-camera-png/download/105818/" alt="Monitor" onerror="this.style.display='none'">
            <p>1x ${PRICING.monitor.name}</p>
            <span>Full HD • HDMI & VGA</span>
          </div>
          ` : ''}
        </div>

        <div style="font-size:13px; padding-left:20px; margin-bottom:20px;">
          <p>• ${quantity}x ${brandData.name} ${cameraData.name}</p>
          <p>• 1x ${brandData.name} ${selectedDvr.name}</p>
          <p>• 1x ${PRICING.hdd500.name}</p>
          <p>• 1x ${PRICING.psu.name}</p>
          <p>• ${cableLength}m ${PRICING.cablePerMeter.name}</p>
          <p>• 12x BNC & DC Connectors</p>
          ${hasMonitor ? `<p>• 1x ${PRICING.monitor.name}</p>` : ''}
        </div>

        <div class="section-title">WHY THIS SYSTEM</div>
        <div class="features-grid">
          <div class="feature-card"><strong>CRYSTAL CLEAR</strong> Full HD 2MP video. Faces, number plates, and detail you can actually use.</div>
          <div class="feature-card"><strong>SEES IN THE DARK</strong> Infrared night vision for 24/7 cover, even with the lights off.</div>
          <div class="feature-card"><strong>WATCH FROM ANYWHERE</strong> Live view and playback on your phone with the mobile app.</div>
          <div class="feature-card"><strong>MOTION ALERTS</strong> Instant phone notifications when movement is detected.</div>
          <div class="feature-card"><strong>BUILT FOR KENYAN WEATHER</strong> IP66 cameras handle rain, heat, and dust.</div>
          <div class="feature-card"><strong>EASY PLAYBACK</strong> Search and replay past footage straight from the recorder.</div>
        </div>

        <div class="page-break"></div>

        <div class="section-title">PRICE BREAKDOWN</div>
        <table>
          <tr><th>#</th><th>Description</th><th>Amount (KSh)</th></tr>
          <tr><td>1</td><td><strong>${brandData.name} ${cameraData.name}</strong> (${quantity} pcs @ ${cameraData.price.toLocaleString()})</td><td>${(cameraData.price * quantity).toLocaleString()}</td></tr>
          <tr><td>2</td><td><strong>${brandData.name} ${selectedDvr.name}</strong></td><td>${selectedDvr.price.toLocaleString()}</td></tr>
          <tr><td>3</td><td>${PRICING.hdd500.name}</td><td>${PRICING.hdd500.price.toLocaleString()}</td></tr>
          <tr><td>4</td><td>${PRICING.psu.name}</td><td>${PRICING.psu.price.toLocaleString()}</td></tr>
          <tr><td>5</td><td>${cableLength}m ${PRICING.cablePerMeter.name}</td><td>${(cableLength * PRICING.cablePerMeter.price).toLocaleString()}</td></tr>
          <tr><td>6</td><td>${PRICING.connectors.name}</td><td>${PRICING.connectors.price.toLocaleString()}</td></tr>
          ${hasMonitor ? `<tr><td>7</td><td>${PRICING.monitor.name}</td><td>${PRICING.monitor.price.toLocaleString()}</td></tr>` : ''}
          <tr><td colspan="2" style="text-align:right;"><strong>Installation & Configuration</strong></td><td>4,500</td></tr>
          <tr class="total-row"><td colspan="2" style="text-align:right;">TOTAL</td><td>${totalCost.toLocaleString()}</td></tr>
        </table>

        <div class="section-title">WARRANTY AND AFTER-SALES SUPPORT</div>
        <ul style="font-size:12px; padding-left:20px; color:#4b5563;">
          <li>12 months warranty on all equipment, 3 months on installation workmanship.</li>
          <li>Free phone support in the first month for app and playback questions.</li>
        </ul>

        <div class="section-title">TERMS AND CONDITIONS</div>
        <div class="terms">
          <ul>
            <li><strong>Payment:</strong> 50% deposit to confirm, balance on completion. M-Pesa: ${businessInfo.mpesa}</li>
            <li>Prices include VAT. Quote valid for 14 days.</li>
            <li>Client provides a power socket near the DVR location.</li>
            <li>Installation takes about one day, subject to site access.</li>
          </ul>
        </div>

        <div class="sig-box">
          <div><div class="sig-line"></div><span style="font-size:12px;">Accepted by (Client Signature)</span></div>
          <div><div class="sig-line"></div><span style="font-size:12px;">Date</span></div>
        </div>

        <div class="footer">
          <span>Thank you for choosing us to protect what matters most.</span>
          <span>Generated by CableIQ</span>
        </div>
      </div>
      <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };<\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('welcome');
  
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

  const [showExportSuccess, setShowExportSuccess] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  // Dynamic Pricing Calculation
  const calculateTotalCost = () => {
    const brandData = PRICING.brands[brand];
    const cameraData = brandData.cameras[cameraType];
    const selectedDvr = quantity <= 4 ? brandData.dvr4 : brandData.dvr8;
    
    let total = (cameraData.price * quantity) 
              + selectedDvr.price 
              + PRICING.hdd500.price 
              + PRICING.psu.price 
              + (cableLength * PRICING.cablePerMeter.price) 
              + PRICING.connectors.price 
              + 4500; // Labor
              
    if (hasMonitor) total += PRICING.monitor.price;
    return total;
  };

  const selectedDvr = quantity <= 4 ? PRICING.brands[brand].dvr4 : PRICING.brands[brand].dvr8;

  const exportQuotation = () => {
    generateQuotationPDF({
      clientInfo, businessInfo, brand, cameraType, quantity, hasMonitor, 
      cableLength, totalCost: calculateTotalCost(), dateStr: new Date().toLocaleDateString('en-GB'), selectedDvr
    });
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      
      {showExportSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Quotation PDF Generated!</span>
          </div>
        </div>
      )}
    
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
        
        {/* --- LANDING PAGE / MENU --- */}
        {currentView === 'welcome' && (
          <div className="text-center py-10">
            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              What would you like to do?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose an option below to start planning, generating quotations, or viewing materials.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              
              {/* Option 1: CCTV Planner */}
              <div onClick={() => setCurrentView('planner')} className={`group cursor-pointer p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-orange-500' : 'bg-white border-gray-200 hover:border-orange-500'}`}>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-pulse">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>CCTV Quotation Builder</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Choose brand, camera type, quantity, and generate a professional PDF quote.</p>
              </div>

              {/* Option 2: Materials */}
              <div onClick={() => setCurrentView('materials')} className={`group cursor-pointer p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-white border-gray-200 hover:border-green-500'}`}>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-pulse">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>View Pricing Guide</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>See current Kenyan market prices for Hikvision and Dahua equipment.</p>
              </div>

              {/* Option 3: Preview */}
              <div onClick={() => setCurrentView('preview')} className={`group cursor-pointer p-8 rounded-2xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-white border-gray-200 hover:border-purple-500'}`}>
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:animate-pulse">
                  <MonitorPlay className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Network Preview</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visualize the DVR and camera topology for your setup.</p>
              </div>

            </div>
          </div>
        )}

        {/* --- PLANNER VIEW --- */}
        {currentView === 'planner' && (
          <div className="space-y-6">
            
            {/* Client & Business Details */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <User className="w-5 h-5 text-blue-500" />
                <span>Quotation Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-blue-500">Client Info (Prepared For)</h4>
                  <input type="text" placeholder="Client Name" value={clientInfo.name} onChange={e => setClientInfo({...clientInfo, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <input type="text" placeholder="Client Phone" value={clientInfo.phone} onChange={e => setClientInfo({...clientInfo, phone: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <input type="text" placeholder="Location / Address" value={clientInfo.address} onChange={e => setClientInfo({...clientInfo, address: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-blue-500">Your Business Info</h4>
                  <input type="text" placeholder="Business Name" value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <input type="text" placeholder="Phone" value={businessInfo.phone} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <input type="text" placeholder="M-Pesa Till/Paybill" value={businessInfo.mpesa} onChange={e => setBusinessInfo({...businessInfo, mpesa: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                </div>
              </div>
            </div>

            {/* Configuration Panel */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-6 flex items-center space-x-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Settings className="w-5 h-5 text-blue-500" />
                <span>System Configuration</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Brand */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Brand</label>
                  <select value={brand} onChange={e => setBrand(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="hikvision">Hikvision (Premium)</option>
                    <option value="dahua">Dahua (Value)</option>
                  </select>
                </div>

                {/* Camera Type */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Camera Design</label>
                  <select value={cameraType} onChange={e => setCameraType(e.target.value)} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                    <option value="bullet">Bullet (Outdoor Long Range)</option>
                    <option value="dome">Dome (Indoor/Outdoor Vandal-proof)</option>
                    <option value="ptz">PTZ (Pan-Tilt-Zoom)</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Number of Cameras</label>
                  <input type="number" min="1" max="16" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                </div>

                {/* Cable Length */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Cable Required (meters)</label>
                  <input type="number" value={cableLength} onChange={e => setCableLength(Number(e.target.value))} className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                </div>
              </div>

              {/* Monitor Toggle */}
              <div className={`mt-6 p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center space-x-3">
                  <Monitor className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Add 22" CCTV Monitor</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Perfect for viewing footage live at the shop/home</p>
                  </div>
                </div>
                <button onClick={() => setHasMonitor(!hasMonitor)} className={`px-6 py-2 rounded-lg font-bold transition-all ${hasMonitor ? 'bg-green-500 text-white' : darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600'}`}>
                  {hasMonitor ? 'Added ✓' : `+ ${formatKES(PRICING.monitor.price)}`}
                </button>
              </div>
            </div>

            {/* Live Price Summary */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Live Quotation Summary</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {quantity}x {PRICING.brands[brand].name} {PRICING.brands[brand].cameras[cameraType].name} + {selectedDvr.name} {hasMonitor ? '+ Monitor' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Estimated Cost</p>
                  <p className="text-3xl font-bold text-green-500">{formatKES(calculateTotalCost())}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setCurrentView('welcome')} className={`px-6 py-4 rounded-xl font-bold flex items-center space-x-2 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                <ArrowRight className="w-5 h-5 rotate-180" /> <span>Back Home</span>
              </button>
              <button onClick={exportQuotation} className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center space-x-3 text-lg">
                <Printer className="w-6 h-6" /> <span>Export Professional PDF Quotation</span>
              </button>
            </div>

          </div>
        )}

        {/* Pricing Guide View */}
        {currentView === 'materials' && (
          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kenyan Market Pricing Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                  <tr>
                    <th className={`p-3 text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>Item</th>
                    <th className={`p-3 text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hikvision</th>
                    <th className={`p-3 text-left ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dahua</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <tr className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <td className="p-3">Dome Camera (2MP)</td>
                    <td className="p-3">{formatKES(PRICING.brands.hikvision.cameras.dome.price)}</td>
                    <td className="p-3">{formatKES(PRICING.brands.dahua.cameras.dome.price)}</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <td className="p-3">Bullet Camera (2MP)</td>
                    <td className="p-3">{formatKES(PRICING.brands.hikvision.cameras.bullet.price)}</td>
                    <td className="p-3">{formatKES(PRICING.brands.dahua.cameras.bullet.price)}</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <td className="p-3">4-Channel DVR</td>
                    <td className="p-3">{formatKES(PRICING.brands.hikvision.dvr4.price)}</td>
                    <td className="p-3">{formatKES(PRICING.brands.dahua.dvr4.price)}</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    <td className="p-3">22" Monitor</td>
                    <td className="p-3" colSpan="2">{formatKES(PRICING.monitor.price)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-gray-500">* Prices are estimates based on Kenyan market rates and may vary by supplier.</p>
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
          </div>
        )}

      </div>
    </div>
  );
}

export default App;