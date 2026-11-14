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
  Wifi, Star, Smartphone, Database, Car, Copy, CheckCircle, Package, Share2
} from 'lucide-react';

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

const defaultState = {
  clientName: '', clientPhone: '',
  systemType: 'Analog', cameraShape: 'Bullet', quantity: 4, cableLength: 50, selectedStorage: 'hdd500', lensType: '3.6',
  cabDevices: [], poeCams: 4, poeAps: 2, voltLength: 50, voltAmps: 0.5, runRooms: 5, runFloors: 1,
  wifiRooms: 4, wifiWalls: 2, isInvoice: false, depositPaid: 0,
  calcCams: 4, calcRes: '2MP', calcComp: 'H.265', calcHdd: 1000,
  fuelDistance: 20, fuelPrice: 190, fuelConsumption: 12, transportFee: 0
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 
  const [showClientView, setShowClientView] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem('cableiq_data');
    return saved ? JSON.parse(saved) : defaultState;
  });

  const updateData = (key, value) => setAppData(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    localStorage.setItem('cableiq_data', JSON.stringify(appData));
  }, [appData]);

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

  const copyMpesa = () => {
    navigator.clipboard.writeText(businessInfo.mpesa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- WHATSAPP SHARE LOGIC ---
  const handleShareWhatsApp = async () => {
    setIsSharing(true);
    const element = document.getElementById('pdf-cctv-container');
    
    try {
      // Generate PDF as Blob
      const pdfBlob = await html2pdf().set({
        margin: 0.5,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).from(element).outputPdf('blob');

      const fileName = `Quote_${appData.clientName || 'Client'}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      // Check if native share is supported (Mobile Phones)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'CCTV Quotation',
          text: `Hello ${appData.clientName}, here is your quotation from ${businessInfo.name}.`
        });
      } else {
        // Fallback for Desktop (Download + Open WhatsApp Web)
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);

        // Format phone for Kenya (+254)
        let phoneStr = appData.clientPhone.replace(/\D/g, ''); 
        if (phoneStr.startsWith('0')) phoneStr = '254' + phoneStr.slice(1);
        
        const message = encodeURIComponent(`Hello ${appData.clientName}, here is your quotation from ${businessInfo.name}. Total: ${formatKES(totalCCTV)}.`);
        window.open(`https://wa.me/${phoneStr}?text=${message}`, '_blank');
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      alert("Could not share the PDF. Please try downloading it instead.");
    } finally {
      setIsSharing(false);
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div onClick={() => setCurrentView('cctv-planner')} className={`cursor-pointer p-6 rounded-2xl border hover:border-orange-500 ${bgCard}`}>
              <Camera className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">CCTV Configurator</h3>
              <p className={`text-sm ${textMuted}`}>Quote systems and calculate FOV.</p>
            </div>
            <div onClick={() => setCurrentView('cabling-planner')} className={`cursor-pointer p-6 rounded-2xl border hover:border-blue-500 ${bgCard}`}>
              <Network className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Cabling Planner</h3>
              <p className={`text-sm ${textMuted}`}>Cat6 BOM and printable labels.</p>
            </div>
            <div onClick={() => setCurrentView('tools')} className={`cursor-pointer p-6 rounded-2xl border hover:border-green-500 ${bgCard}`}>
              <Wrench className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Engineer Tools</h3>
              <p className={`text-sm ${textMuted}`}>Fuel, Storage, Wi-Fi & more.</p>
            </div>
            <div onClick={() => setCurrentView('upsell')} className={`cursor-pointer p-6 rounded-2xl border hover:border-purple-500 ${bgCard}`}>
              <Star className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Upsell Showcase</h3>
              <p className={`text-sm ${textMuted}`}>Show clients the value of 4K & ColorVu.</p>
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
                
                {/* NEW: WHATSAPP SHARE BUTTON */}
                <button onClick={handleShareWhatsApp} disabled={isSharing} className="px-4 py-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold rounded-lg flex items-center space-x-2 disabled:opacity-50">
                  <Share2 className="w-5 h-5" /> <span>{isSharing ? 'Generating...' : 'Share PDF'}</span>
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

      </div>
    </div>
  );
}