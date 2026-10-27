// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Camera, Wifi, Phone, Network, Cable, MapPin, Layers, Download, Trash2, FileText, Moon, Sun, CheckCircle, Server, Home as HomeIcon, Building, TreePine, ArrowRight, DollarSign, Gauge, Sparkles, Star, Zap, Printer, Eye, Save, FolderOpen, X, User, Briefcase, PhoneCall
} from 'lucide-react';

const USD_TO_KES = 130;

const cableStandards = {
  cat5e: { name: "Cat5e", speed: "Up to 1 Gbps", distance: "100m", price: 0.3 * USD_TO_KES, description: "Budget option", color: "from-yellow-500 to-orange-500", recommended: false },
  cat6: { name: "Cat6", speed: "Up to 10 Gbps", distance: "55m", price: 0.5 * USD_TO_KES, description: "Recommended", color: "from-blue-500 to-cyan-500", recommended: true },
  cat6a: { name: "Cat6A", speed: "Up to 10 Gbps", distance: "100m", price: 0.85 * USD_TO_KES, description: "Best performance", color: "from-green-500 to-emerald-500", recommended: false },
  fiber: { name: "Fiber", speed: "Up to 100 Gbps", distance: "2000m", price: 2.5 * USD_TO_KES, description: "Backbone", color: "from-purple-500 to-pink-500", recommended: false },
  rg59: { name: "RG59 Coaxial", speed: "Analog/HD-TVI", distance: "300m", price: 50, description: "CCTV Standard", color: "from-gray-500 to-slate-500", recommended: false }
};

const defaultRooms = [
  { id: 1, name: "Main Entrance", icon: "Building" },
  { id: 2, name: "Parking / Compound", icon: "Home" },
  { id: 3, name: "Back / Side Access", icon: "TreePine" },
  { id: 4, name: "Inside Shop", icon: "Home" }
];

const deviceTypes = {
  cctv: { label: "CCTV Camera", baseCable: 15, icon: Camera, color: "from-red-500 to-rose-500", poe: true, category: "Security", price: 0, hasFaceplate: false },
  data: { label: "Data Point", baseCable: 35, icon: Network, color: "from-blue-500 to-indigo-500", poe: false, category: "Networking", price: 2000, hasFaceplate: true },
  ap: { label: "Access Point", baseCable: 40, icon: Wifi, color: "from-green-500 to-teal-500", poe: true, category: "Wireless", price: 8500, hasFaceplate: false },
  voip: { label: "VoIP Phone", baseCable: 30, icon: Phone, color: "from-purple-500 to-violet-500", poe: true, category: "Communications", price: 6500, hasFaceplate: false },
  custom: { label: "Custom Item", baseCable: 0, icon: Server, color: "from-gray-500 to-slate-500", poe: false, category: "Custom", price: 0, hasFaceplate: false }
};

const getRoomIcon = (iconName) => {
  switch(iconName) {
    case 'Home': return HomeIcon;
    case 'Building': return Building;
    case 'TreePine': return TreePine;
    default: return HomeIcon;
  }
};

// Generate the beautiful PDF matching the Kenyan Quotation format
const generateQuotationPDF = (data) => {
  const printWindow = window.open('', '_blank');
  const { 
    clientInfo, businessInfo, devices, customItems, totalCost, 
    cableCost, laborCost, materialsCost, dateStr 
  } = data;

  // Filter cameras
  const cameras = devices.filter(d => d.type === 'cctv');
  
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
        .features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .feature-card { background: #f8fafc; border-left: 4px solid #f97316; padding: 12px; border-radius: 4px; font-size: 12px; }
        .feature-card strong { display: block; color: #1e3a8a; margin-bottom: 4px; font-size: 13px; }
        .camera-list { font-size: 13px; padding-left: 20px; }
        .process-grid { display: flex; justify-content: space-between; margin-top: 20px; text-align: center; font-size: 12px; }
        .process-step { flex: 1; background: #f8fafc; padding: 15px 10px; margin: 0 5px; border-radius: 8px; border-top: 3px solid #1e3a8a; }
        .process-step strong { display: block; color: #f97316; font-size: 18px; margin-bottom: 5px; }
        .terms { font-size: 12px; color: #4b5563; margin-top: 30px; }
        .terms ul { padding-left: 20px; margin-top: 5px; }
        .terms li { margin-bottom: 5px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }
        .sig-box { margin-top: 40px; display: flex; justify-content: space-between; }
        .sig-line { width: 45%; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 5px; }
        @media print {
          .page { max-width: 100%; padding: 20px; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- HEADER -->
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

        <!-- CLIENT DETAILS -->
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
        <div style="display: flex; gap: 20px; align-items: flex-start;">
          <div style="flex: 1;">
            <h4 style="margin-top:0; color:#1e3a8a;">Hikvision 4-Channel 1080p Full HD Kit</h4>
            <ul class="camera-list">
              ${customItems.map(item => `<li>${item.quantity} x ${item.name} (${item.description})</li>`).join('')}
              ${cameras.length > 0 ? `<li>${cameras.length} x Hikvision 2MP Cameras (Indoor/Outdoor)</li>` : ''}
              <li>${data.cableLength}m RG59 Two-in-one Coaxial Cable</li>
              <li>12 x BNC and DC Jack Connectors</li>
            </ul>
            <p style="font-size:11px; color:#666; margin-top:10px;"><strong>Storage:</strong> About 5-8 days of footage before oldest is overwritten.</p>
          </div>
          <div style="width: 200px; text-align: center;">
             <div style="background:#f3f4f6; height:150px; display:flex; align-items:center; justify-content:center; border:1px dashed #ccc; border-radius:8px; color:#999; font-size:12px;">
               [ Insert Kit Photo Here ]
             </div>
          </div>
        </div>

        <div class="section-title">WHY THIS SYSTEM</div>
        <div class="features-grid">
          <div class="feature-card"><strong>CRYSTAL CLEAR</strong> Full HD 2MP video. Faces, number plates, and detail you can actually use.</div>
          <div class="feature-card"><strong>SEES IN THE DARK</strong> Infrared night vision for 24/7 cover, even with the lights off.</div>
          <div class="feature-card"><strong>WATCH FROM ANYWHERE</strong> Live view and playback on your phone with the Hik-Connect app.</div>
          <div class="feature-card"><strong>MOTION ALERTS</strong> Instant phone notifications when movement is detected.</div>
          <div class="feature-card"><strong>BUILT FOR KENYAN WEATHER</strong> IP66 cameras handle rain, heat, and dust.</div>
          <div class="feature-card"><strong>EASY PLAYBACK</strong> Search and replay past footage straight from the recorder.</div>
        </div>

        <div class="section-title">RECOMMENDED CAMERA POSITIONS</div>
        <table style="font-size:12px;">
          <tr><th>#</th><th>Position</th><th>Purpose</th></tr>
          <tr><td>1</td><td>Main entrance / gate</td><td>Captures everyone coming in and out, face level.</td></tr>
          <tr><td>2</td><td>Parking / compound</td><td>Covers vehicles and approach to the house/shop.</td></tr>
          <tr><td>3</td><td>Back or side access</td><td>The most common entry point for break-ins.</td></tr>
          <tr><td>4</td><td>Inside: living area / shop counter</td><td>Covers valuables, cash point, or main passage.</td></tr>
        </table>
        <p style="font-size:11px; font-style:italic;">Final positions are agreed on site after a quick walk-through.</p>

        <!-- PAGE 2 -->
        <div class="page-break"></div>

        <div class="section-title">INSTALLATION PROCESS</div>
        <div class="process-grid">
          <div class="process-step"><strong>1</strong> SITE VISIT<br><span style="font-size:10px;">Agree camera positions and routes.</span></div>
          <div class="process-step"><strong>2</strong> INSTALLATION<br><span style="font-size:10px;">Mount cameras, run cables, fit DVR.</span></div>
          <div class="process-step"><strong>3</strong> SETUP<br><span style="font-size:10px;">Configure recording and motion alerts.</span></div>
          <div class="process-step"><strong>4</strong> HANDOVER<br><span style="font-size:10px;">Phone app setup and training.</span></div>
        </div>

        <div class="section-title">PRICE BREAKDOWN</div>
        <table>
          <tr><th>#</th><th>Description</th><th>Amount (KSh)</th></tr>
          <tr><td>1</td><td><strong>Hikvision CCTV Kit</strong><br><span style="font-size:11px;">DVR, 4 cameras, hard drive, power supply, cable, connectors</span></td><td>${data.kitPrice.toLocaleString()}</td></tr>
          <tr><td>2</td><td><strong>Installation materials</strong><br><span style="font-size:11px;">Cable clips, fixings, insulation tape</span></td><td>${data.materialsCost.toLocaleString()}</td></tr>
          <tr><td>3</td><td><strong>Installation labour</strong><br><span style="font-size:11px;">Mounting cameras and DVR, cable routing, testing</span></td><td>${data.laborCost.toLocaleString()}</td></tr>
          <tr><td>4</td><td><strong>Configuration and training</strong><br><span style="font-size:11px;">DVR setup, Hik-Connect app, client walkthrough</span></td><td>${data.setupCost.toLocaleString()}</td></tr>
          <tr class="total-row"><td colspan="2" style="text-align:right;">TOTAL</td><td>${totalCost.toLocaleString()}</td></tr>
        </table>

        <div class="section-title">OPTIONAL UPGRADES (NOT INCLUDED)</div>
        <table style="font-size:12px;">
          <tr><td>1TB surveillance drive (about 2x recording time)</td><td style="text-align:right;">+ KSh 3,500</td></tr>
          <tr><td>UPS / surge protector (protects against power cuts)</td><td style="text-align:right;">+ KSh 3,000</td></tr>
        </table>

        <div class="section-title">WARRANTY AND AFTER-SALES SUPPORT</div>
        <ul style="font-size:12px; padding-left:20px; color:#4b5563;">
          <li>12 months warranty on all equipment, 3 months on installation workmanship.</li>
          <li>Free phone support in the first month for app and playback questions.</li>
          <li>Warranty excludes damage from power surges, lightning, water inside unsealed connections, or tampering.</li>
        </ul>

        <div class="section-title">TERMS AND CONDITIONS</div>
        <div class="terms">
          <ul>
            <li><strong>Payment:</strong> 50% deposit to confirm, balance on completion. M-Pesa, bank, or cash: ${businessInfo.mpesa}</li>
            <li>Prices include VAT. Quote valid for 14 days.</li>
            <li>Client provides a power socket near the DVR location.</li>
            <li>Installation takes about one day, subject to site access.</li>
            <li>Please change the DVR password if you share access with others.</li>
          </ul>
        </div>

        <div class="sig-box">
          <div>
            <div class="sig-line"></div>
            <span style="font-size:12px;">Accepted by (Client Signature)</span>
          </div>
          <div>
            <div class="sig-line"></div>
            <span style="font-size:12px;">Date</span>
          </div>
        </div>

        <div class="footer">
          <span>Thank you for choosing us to protect what matters most.</span>
          <span>Generated by CableIQ</span>
        </div>
      </div>
      <script>
        window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('welcome');
  const [rooms, setRooms] = useState(defaultRooms);
  const [selectedCable, setSelectedCable] = useState('rg59');
  const [wastageFactor, setWastageFactor] = useState(15);
  const [devices, setDevices] = useState([]);
  const [customItems, setCustomItems] = useState([]); // For DVR, HDD, PSU, etc.
  
  // Client & Business Info for Quotation
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [businessInfo, setBusinessInfo] = useState({ name: 'Ngari Tech Solutions', phone: '0712 345 678', email: 'info@ngaritech.co.ke', mpesa: 'Paybill 400200, Acc: 0110...' });

  // Fixed costs for template
  const [kitPrice, setKitPrice] = useState(15999);
  const [materialsCost, setMaterialsCost] = useState(1000);
  const [laborCost, setLaborCost] = useState(3500);
  const [setupCost, setSetupCost] = useState(1000);

  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showLoadProjectModal, setShowLoadProjectModal] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cableiq_devices', JSON.stringify(devices));
    localStorage.setItem('cableiq_custom', JSON.stringify(customItems));
  }, [devices, customItems]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  const loadKenyanCCTVTemplate = () => {
    // 1. Load 4 Cameras
    const newDevices = [
      { id: 1, name: 'Camera 1 (Main Gate)', type: 'cctv', room: 'Main Entrance', cableLength: 15, poe: false },
      { id: 2, name: 'Camera 2 (Parking)', type: 'cctv', room: 'Parking / Compound', cableLength: 20, poe: false },
      { id: 3, name: 'Camera 3 (Backdoor)', type: 'cctv', room: 'Back / Side Access', cableLength: 25, poe: false },
      { id: 4, name: 'Camera 4 (Counter)', type: 'cctv', room: 'Inside Shop', cableLength: 10, poe: false },
    ];
    setDevices(newDevices);

    // 2. Load Kit Extras
    setCustomItems([
      { id: 101, name: 'Hikvision 4-Channel DVR', description: 'White, Turbo HD', quantity: 1, price: 0 },
      { id: 102, name: '500GB Surveillance Hard Drive', description: 'Camera recording memory', quantity: 1, price: 0 },
      { id: 103, name: '4-Port 5A Power Supply', description: 'Centralized CCTV PSU', quantity: 1, price: 0 },
      { id: 104, name: 'BNC & DC Connectors', description: '12 pieces', quantity: 12, price: 0 },
    ]);

    // 3. Reset Costs to match PDF
    setKitPrice(15999);
    setMaterialsCost(1000);
    setLaborCost(3500);
    setSetupCost(1000);

    setSelectedCable('rg59');
    setCurrentView('planner');
  };

  const calculateTotalCableLength = () => devices.reduce((sum, d) => sum + (d.cableLength || 15), 0);
  const calculateTotalCost = () => kitPrice + materialsCost + laborCost + setupCost;

  const addDevice = () => {
    const newDevice = {
      id: Date.now(),
      name: `Camera ${devices.length + 1}`,
      type: 'cctv',
      room: rooms[0].name,
      cableLength: 15,
      poe: false
    };
    setDevices([...devices, newDevice]);
  };

  const removeDevice = (id) => setDevices(devices.filter(d => d.id !== id));

  const exportQuotation = () => {
    generateQuotationPDF({
      clientInfo,
      businessInfo,
      devices,
      customItems,
      totalCost: calculateTotalCost(),
      cableLength: calculateTotalCableLength(),
      kitPrice,
      materialsCost,
      laborCost,
      setupCost,
      dateStr: new Date().toLocaleDateString('en-GB')
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
            <button onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl transition-all ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
              <HomeIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Welcome View */}
        {currentView === 'welcome' && (
          <div className="text-center py-12">
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Kenyan CCTV Quotation Engine
            </h2>
            <p className={`text-lg max-w-2xl mx-auto mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Generate professional, 2-page PDF quotations for Hikvision Kits instantly. Includes M-Pesa terms, installation breakdown, and local pricing.
            </p>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={loadKenyanCCTVTemplate} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-xl text-lg flex items-center space-x-3">
                <Sparkles className="w-5 h-5" />
                <span>Load 4-Camera KSh 21,499 Template</span>
              </button>
              <button onClick={() => setCurrentView('planner')} className={`border font-semibold py-4 px-8 rounded-xl transition-all text-lg flex items-center space-x-3 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                <Plus className="w-5 h-5" />
                <span>Start Blank Project</span>
              </button>
            </div>
          </div>
        )}

        {/* Planner View */}
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
                  <h4 className="text-sm font-semibold text-blue-500">Your Business Info (Prepared By)</h4>
                  <input type="text" placeholder="Business Name" value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <input type="text" placeholder="Phone & Email" value={`${businessInfo.phone} | ${businessInfo.email}`} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value, email: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <input type="text" placeholder="M-Pesa Till/Paybill" value={businessInfo.mpesa} onChange={e => setBusinessInfo({...businessInfo, mpesa: e.target.value})} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} />
                </div>
              </div>
            </div>

            {/* Cameras List */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CCTV Cameras & Cabling</h3>
                <button onClick={addDevice} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center space-x-2">
                  <Plus className="w-4 h-4" /> <span>Add Camera</span>
                </button>
              </div>
              <div className="space-y-2">
                {devices.map(device => (
                  <div key={device.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <Camera className="w-5 h-5 text-red-500" />
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{device.room} • {device.cableLength}m RG59 Cable</p>
                      </div>
                    </div>
                    <button onClick={() => removeDevice(device.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown Form */}
            <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quotation Costs (KSh)</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Kit Price</label>
                  <input type="number" value={kitPrice} onChange={e => setKitPrice(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Materials (Clips, Tape)</label>
                  <input type="number" value={materialsCost} onChange={e => setMaterialsCost(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Labour</label>
                  <input type="number" value={laborCost} onChange={e => setLaborCost(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Setup & Training</label>
                  <input type="number" value={setupCost} onChange={e => setSetupCost(Number(e.target.value))} className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                </div>
              </div>
              <div className={`mt-6 p-4 rounded-xl flex justify-between items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Total Quotation</span>
                <span className="text-2xl font-bold text-green-500">{formatKES(calculateTotalCost())}</span>
              </div>
            </div>

            {/* Generate Button */}
            <button onClick={exportQuotation} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center space-x-3 text-lg">
              <Printer className="w-6 h-6" />
              <span>Export Professional PDF Quotation</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;