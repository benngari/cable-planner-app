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
  Image as ImageIcon, Activity, AlertTriangle, Table, Info, ShieldCheck, ShieldAlert, Sparkles
} from 'lucide-react';

const CATALOG = {
  dvrs: {
    hik4: { name: 'Hikvision 4-Ch DVR', price: 5700 },
    hik8: { name: 'Hikvision 8-Ch DVR', price: 8500 },
  },
  nvrs: {
    hik4: { name: 'Hikvision 4-Ch NVR', price: 8500 },
    hik8: { name: 'Hikvision 8-Ch NVR', price: 12500 },
  },
  cameras: {
    analogBullet: { name: 'Analog Bullet', price: 1700, type: 'Analog', shape: 'Bullet', desc: 'Best for outdoor perimeters and gates. Offers long-range visibility and acts as a visible deterrent.' },
    analogDome: { name: 'Analog Dome', price: 1600, type: 'Analog', shape: 'Dome', desc: 'Best for indoor ceilings or shops. Vandal-resistant and provides a wide-angle view.' },
    ipBullet: { name: 'IP Bullet (PoE)', price: 4500, type: 'IP', shape: 'Bullet', desc: 'High-resolution outdoor camera. Perfect for long driveways and boundaries.' },
    ipDome: { name: 'IP Dome (PoE)', price: 4300, type: 'IP', shape: 'Dome', desc: 'High-resolution indoor/outdoor camera. Discreet design, hard for criminals to tell where it is pointing.' }
  },
  storage: {
    hdd500: { name: '500GB HDD', price: 3100 },
    hdd1tb: { name: '1TB HDD', price: 5500 },
  },
  monitors: {
    none: { name: 'No Monitor', price: 0 },
    m22: { name: '22" CCTV Monitor', price: 13000 },
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
  },
  cabling: {
    cat6Box: { name: 'Cat6 Box (305m)', price: 19500 },
    keystone: { name: 'Keystone Jack', price: 150 },
    faceplate: { name: 'Faceplate', price: 200 },
    patchPanel: { name: '24-Port Patch Panel', price: 4500 },
    patchCord: { name: 'Patch Cord', price: 450 },
    laborPerDrop: 1500
  }
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 

  // Client Info
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });
  const [businessInfo, setBusinessInfo] = useState({ name: 'Ngari Tech Solutions', phone: '0711645837', mpesa: 'Paybill 400200' });

  // CCTV State
  const [systemType, setSystemType] = useState('Analog'); 
  const [cameraShape, setCameraShape] = useState('Bullet'); // NEW: Bullet or Dome
  const [quantity, setQuantity] = useState(4);
  const [selectedCamera, setSelectedCamera] = useState('analogBullet');
  const [selectedStorage, setSelectedStorage] = useState('hdd500');
  const [selectedMonitor, setSelectedMonitor] = useState('none');
  const [cableLength, setCableLength] = useState(50);
  const [lensType, setLensType] = useState('3.6'); 
  const [sitePhoto, setSitePhoto] = useState(null);

  // Cabling State
  const [cabDevices, setCabDevices] = useState([]);
  const [cabRoom, setCabRoom] = useState('');
  const [cabLength, setCabLength] = useState(30);
  const [showLabels, setShowLabels] = useState(false);

  // Tools State
  const [poeCams, setPoeCams] = useState(4);
  const [poeAps, setPoeAps] = useState(2);
  const [voltLength, setVoltLength] = useState(50);
  const [voltAmps, setVoltAmps] = useState(0.5);
  const [runRooms, setRunRooms] = useState(5);
  const [runFloors, setRunFloors] = useState(1);

  // Auto-update selected camera when systemType or cameraShape changes
  useEffect(() => {
    if (systemType === 'Analog') {
      setSelectedCamera(cameraShape === 'Bullet' ? 'analogBullet' : 'analogDome');
    } else {
      setSelectedCamera(cameraShape === 'Bullet' ? 'ipBullet' : 'ipDome');
    }
  }, [systemType, cameraShape]);

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

  // --- DETAILED PRICE CALCULATIONS ---
  const camPrice = CATALOG.cameras[selectedCamera].price * quantity;
  const recorderPrice = systemType === 'Analog' ? CATALOG.dvrs.hik4.price : CATALOG.nvrs.hik4.price;
  const storagePrice = CATALOG.storage[selectedStorage].price;
  const monitorPrice = CATALOG.monitors[selectedMonitor].price;
  const cablePrice = cableLength * (systemType === 'Analog' ? CATALOG.accessories.rg59.price : CATALOG.accessories.cat6.price);
  const accPrice = systemType === 'Analog' ? (CATALOG.accessories.psu.price + CATALOG.accessories.connectors.price) : 0;
  const laborPrice = CATALOG.labor.basic.price;
  
  const totalCCTV = camPrice + recorderPrice + storagePrice + monitorPrice + cablePrice + accPrice + laborPrice;

  const calculateCabling = () => {
    const ports = cabDevices.length;
    const rawLength = cabDevices.reduce((sum, d) => sum + d.length, 0);
    const lengthWithWaste = rawLength * 1.15;
    const boxes = Math.ceil(lengthWithWaste / 305) || 0;
    const patchPanels = Math.ceil(ports / 24) || 0;
    const cost = (boxes * CATALOG.cabling.cat6Box.price) + (ports * CATALOG.cabling.keystone.price) + (ports * CATALOG.cabling.faceplate.price) + (patchPanels * CATALOG.cabling.patchPanel.price) + (ports * CATALOG.cabling.patchCord.price) + (ports * CATALOG.cabling.laborPerDrop);
    return { ports, lengthWithWaste, boxes, patchPanels, cost };
  };
  const cabTotals = calculateCabling();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSitePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPDF = (containerId, filename) => {
    const element = document.getElementById(containerId);
    html2pdf().set({ margin: 0.5, filename: filename, html2canvas: { scale: 2, useCORS: true } }).from(element).save();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textMain}`}>
      {/* HEADER */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div onClick={() => setCurrentView('cctv-planner')} className={`cursor-pointer p-6 rounded-2xl border hover:border-orange-500 ${bgCard}`}>
              <Camera className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">CCTV Configurator</h3>
              <p className={`text-sm ${textMuted}`}>Quote systems, view FOV coverage, and run setup wizards.</p>
            </div>
            <div onClick={() => setCurrentView('cabling-planner')} className={`cursor-pointer p-6 rounded-2xl border hover:border-blue-500 ${bgCard}`}>
              <Network className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cabling Planner</h3>
              <p className={`text-sm ${textMuted}`}>Calculate Cat6 boxes and generate printable cable labels.</p>
            </div>
            <div onClick={() => setCurrentView('tools')} className={`cursor-pointer p-6 rounded-2xl border hover:border-green-500 ${bgCard}`}>
              <Wrench className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Engineer Tools</h3>
              <p className={`text-sm ${textMuted}`}>PoE, Voltage Drop, and Subnet Planner.</p>
            </div>
          </div>
        )}

        {/* ================= CCTV CONFIGURATOR ================= */}
        {currentView === 'cctv-planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* System Type & Camera Shape */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Settings className="w-5 h-5 text-blue-500" /> <span>System Configuration</span></h3>
                
                <div className="flex space-x-4 mb-6">
                  <button onClick={() => setSystemType('Analog')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${systemType === 'Analog' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : `border-transparent ${bgInput}`}`}>Analog (DVR)</button>
                  <button onClick={() => setSystemType('IP')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${systemType === 'IP' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>IP (NVR)</button>
                </div>

                <div className="flex space-x-4 mb-6">
                  <button onClick={() => setCameraShape('Bullet')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${cameraShape === 'Bullet' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>Bullet Shape</button>
                  <button onClick={() => setCameraShape('Dome')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${cameraShape === 'Dome' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>Dome Shape</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Quantity</label><input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Cable (m)</label><input type="number" value={cableLength} onChange={e => setCableLength(Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                  <div>
                    <label className={`text-xs mb-1 ${textMuted}`}>Storage (HDD)</label>
                    <select value={selectedStorage} onChange={e => setSelectedStorage(e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`}>
                      <option value="hdd500">500GB HDD</option>
                      <option value="hdd1tb">1TB HDD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ENGINEER ADVICE: BULLET VS DOME */}
              <div className={`p-6 rounded-xl border ${bgCard} border-l-4 border-l-purple-500`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Lightbulb className="w-5 h-5 text-yellow-500" /> <span>Engineer Advice: {cameraShape} Cameras</span></h3>
                
                {cameraShape === 'Bullet' ? (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm"><strong>Best For:</strong> Outdoor perimeters, gates, long driveways, and parking areas.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ShieldAlert className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm"><strong>Deterrence:</strong> High. The obvious, pointing shape signals active surveillance to intruders.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm"><strong>Brand Edge:</strong> Hikvision <em>ColorVu</em> is excellent for full-color night vision. Dahua <em>WizSense</em> is great for accurate human/vehicle detection.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm"><strong>Best For:</strong> Indoor ceilings, shop counters, offices, and protected outdoor areas.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ShieldAlert className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm"><strong>Deterrence:</strong> Low/Discreet. The dark dome hides where the lens is pointing, making it hard to avoid.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm"><strong>Brand Edge:</strong> Both brands offer <em>Vandal-Resistant (IK10)</em> domes which are very hard to smash or tamper with.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* FOV & Camera Type Simulator */}
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Video className="w-5 h-5 text-purple-500" /> <span>Camera Coverage (FOV)</span></h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`text-xs mb-1 font-bold ${textMuted}`}>Select Lens (FOV)</label>
                    <select value={lensType} onChange={e => setLensType(e.target.value)} className={`w-full px-3 py-2 rounded border mb-4 ${bgInput}`}>
                      <option value="2.8">2.8mm Lens (Wide Angle ~100°)</option>
                      <option value="3.6">3.6mm Lens (Standard ~80°)</option>
                      <option value="4">4.0mm Lens (Narrow ~70°)</option>
                      <option value="6">6.0mm Lens (Telephoto ~50°)</option>
                    </select>
                  </div>

                  {/* Visual FOV Cone */}
                  <div className="relative h-48 bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center">
                    <div className="absolute bottom-4 text-xs text-gray-500 z-10">Top-Down View</div>
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow z-10" />
                    <div 
                      className="absolute bottom-10 left-1/2 origin-bottom bg-gradient-to-t from-blue-500/40 to-transparent border-t border-l border-r border-blue-500/50"
                      style={{
                        width: lensType === '2.8' ? '300px' : lensType === '3.6' ? '220px' : lensType === '4' ? '180px' : '120px',
                        height: '150px',
                        transform: 'translateX(-50%)',
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* ================= FULLY DETAILED SUMMARY SIDEBAR ================= */}
            <div className={`p-6 rounded-xl border h-fit sticky top-24 ${bgCard}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><FileSpreadsheet className="w-5 h-5 text-green-500" /> <span>Quote Summary</span></h3>
              
              <div className={`space-y-2 text-sm ${textMuted}`}>
                <div className="flex justify-between"><span>Cameras ({quantity}x):</span> <span className={textMain}>{formatKES(camPrice)}</span></div>
                <div className="flex justify-between"><span>Recorder:</span> <span className={textMain}>{formatKES(recorderPrice)}</span></div>
                <div className="flex justify-between"><span>Storage:</span> <span className={textMain}>{formatKES(storagePrice)}</span></div>
                <div className="flex justify-between"><span>Cables & Acc:</span> <span className={textMain}>{formatKES(cablePrice + accPrice)}</span></div>
                <div className="flex justify-between"><span>Labor:</span> <span className={textMain}>{formatKES(laborPrice)}</span></div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span> 
                  <span className="text-green-500">{formatKES(totalCCTV)}</span>
                </div>
              </div>
              <button onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Printer className="w-5 h-5" /> <span>Preview PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* ... CABLING & TOOLS & REPORT REMAIN THE SAME ... */}
        {/* (Copy the remaining views from the previous code) */}
        
      </div>
    </div>
  );
}