// src/App.jsx
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Reorder } from 'framer-motion';
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
  Volume2, Unplug, Terminal, Eye, GripVertical, DollarSign, Edit, TrendingUp,
  CheckCircle2, Circle
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
  cabling: { cat6Box: { name: 'Cat6 Box (305m)', price: 19500 }, keystone: { name: 'Keystone', price: 150 }, faceplate: { name: 'Faceplate', price: 200 }, patchPanel: { name: '24-Port Panel', price: 4500 }, patchCord: { name: 'Patch Cord', price: 450 }, laborPerDrop: { name: 'Labor Per Drop', price: 1500 } }
};

const RACK_EQUIPMENT = {
  patchPanel: { name: '24-Port Patch Panel', size: 1, color: 'bg-blue-500' },
  switch: { name: '24-Port PoE Switch', size: 1, color: 'bg-green-500' },
  cableManager: { name: 'Cable Manager (1U)', size: 1, color: 'bg-yellow-500' }, 
  router: { name: 'Router / Firewall', size: 1, color: 'bg-purple-500' },
  ups: { name: 'UPS Backup Unit', size: 2, color: 'bg-red-500' },
  blank: { name: 'Blanking Panel', size: 1, color: 'bg-gray-600' }
};

const defaultChecklist = [
  { id: 1, text: 'Site survey and measurements completed', category: 'Pre-Installation', completed: false },
  { id: 2, text: 'Cable runs mapped out and approved', category: 'Pre-Installation', completed: false },
  { id: 3, text: 'Equipment and materials delivered to site', category: 'Pre-Installation', completed: false },
  { id: 4, text: 'Cable trays, conduits, or trunking installed', category: 'Installation', completed: false },
  { id: 5, text: 'Cables pulled, dressed, and secured', category: 'Installation', completed: false },
  { id: 6, text: 'RJ45 / Keystone terminations completed', category: 'Installation', completed: false },
  { id: 7, text: 'Patch panel dressed and labeled', category: 'Installation', completed: false },
  { id: 8, text: 'Continuity tested all drops (Fluke/Tester)', category: 'Testing & Commissioning', completed: false },
  { id: 9, text: 'Speed / Bandwidth tests passed', category: 'Testing & Commissioning', completed: false },
  { id: 10, text: 'Cameras focused and angles adjusted', category: 'Testing & Commissioning', completed: false },
  { id: 11, text: 'DVR/NVR configured and recording verified', category: 'Testing & Commissioning', completed: false },
  { id: 12, text: 'Client shown mobile app access and training', category: 'Handover', completed: false },
  { id: 13, text: 'Site cleaned and all debris removed', category: 'Handover', completed: false },
];

const defaultState = {
  clientName: '', clientPhone: '',
  systemType: 'Analog', cameraShape: 'Bullet', quantity: 4, cableLength: 50, selectedStorage: 'hdd500', lensType: '3.6',
  cabDevices: [], poeCams: 4, poeAps: 2, voltLength: 50, voltAmps: 0.5, runRooms: 5, runFloors: 1,
  wifiRooms: 4, wifiWalls: 2, isInvoice: false, depositPaid: 0,
  calcCams: 4, calcRes: '2MP', calcComp: 'H.265', calcHdd: 1000,
  fuelDistance: 20, fuelPrice: 190, fuelConsumption: 12, transportFee: 0,
  ipRecords: [],
  rackItems: [],
  hardwarePrices: {},
  markupPercent: 20,
  checklist: defaultChecklist,
  clientSignoff: { name: '', date: '' },
  subnetIp: '192.168.1.10',
  subnetCidr: 24
};

const TiltCard = ({ children, className, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative rounded-2xl cursor-pointer ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const PriceInput = ({ category, itemKey, defaultPrice, currentPrice, onUpdate, bgInput, textMuted, isCustom, markup }) => {
  const cost = currentPrice ?? defaultPrice;
  const sellingPrice = cost + (cost * (markup / 100));
  
  return (
    <div className={`flex justify-between items-center p-3 rounded-lg transition-colors border ${isCustom ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-transparent bg-gray-50 dark:bg-gray-700/50'}`}>
      <div className="flex flex-col">
        <span className="text-sm font-medium pr-2 leading-tight">{itemKey}</span>
        {markup > 0 && (
          <span className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-0.5">
            Sell: KSh {Math.round(sellingPrice).toLocaleString()}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <span className={`text-xs ${textMuted}`}>Cost</span>
        <input 
          type="number" 
          value={currentPrice ?? defaultPrice} 
          onChange={(e) => onUpdate(category, itemKey, e.target.value)} 
          className={`w-24 p-1.5 text-right font-mono text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${bgInput} ${isCustom ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-bold' : ''}`} 
        />
        {isCustom && (
          <button 
            onClick={() => onUpdate(category, itemKey, defaultPrice)} 
            className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
            title="Reset to default"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentView, setCurrentView] = useState('welcome'); 
  const [showClientView, setShowClientView] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);

  const [newDevice, setNewDevice] = useState({ name: '', ip: '', gateway: '', vlan: '10' });

  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem('cableiq_current');
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
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

  const getPrice = (category, key) => {
    if (appData.hardwarePrices?.[category]?.[key] !== undefined) {
      return appData.hardwarePrices[category][key];
    }
    return CATALOG[category][key].price ?? CATALOG[category][key];
  };

  const updatePrice = (category, key, newPrice) => {
    const currentPrices = appData.hardwarePrices || {};
    const updatedCategory = { ...currentPrices[category], [key]: Number(newPrice) };
    updateData('hardwarePrices', { ...currentPrices, [category]: updatedCategory });
  };

  const selectedCameraKey = `${appData.systemType === 'Analog' ? 'analog' : 'ip'}${appData.cameraShape}`;
  const selectedCamera = CATALOG.cameras[selectedCameraKey];

  const isLight = theme === 'light';
  const isDark = theme === 'dark';
  const isBlack = theme === 'black';
  const bgMain = isLight ? 'bg-gray-50' : isDark ? 'bg-gray-900' : 'bg-black';
  const textMain = isLight ? 'text-gray-900' : 'text-gray-100';
  const textMuted = isLight ? 'text-gray-500' : isDark ? 'text-gray-400' : 'text-gray-500';
  const bgCard = isLight ? 'bg-white border-gray-200' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-[#0a0a0a] border-[#222]';
  const bgInput = `transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLight ? 'bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400' : isDark ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500' : 'bg-[#111] border-[#333] text-white hover:border-[#555]'}`;
  const bgButton = isLight ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-[#222] text-white hover:bg-[#333]';

  const formatKES = (amount) => `KSh ${Math.round(amount).toLocaleString()}`;

  const camPrice = getPrice('cameras', selectedCameraKey) * appData.quantity;
  const recorderPrice = appData.systemType === 'Analog' ? getPrice('dvrs', 'hik4') : getPrice('nvrs', 'hik4');
  const storagePrice = getPrice('storage', appData.selectedStorage);
  const cablePrice = appData.cableLength * (appData.systemType === 'Analog' ? getPrice('accessories', 'rg59') : getPrice('accessories', 'cat6'));
  const accPrice = appData.systemType === 'Analog' ? (getPrice('accessories', 'psu') + getPrice('accessories', 'connectors')) : 0;
  const laborPrice = getPrice('labor', 'basic');
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
    const cost = (boxes * getPrice('cabling', 'cat6Box')) + (ports * getPrice('cabling', 'keystone')) + (ports * getPrice('cabling', 'faceplate')) + (patchPanels * getPrice('cabling', 'patchPanel')) + (ports * getPrice('cabling', 'patchCord')) + (ports * getPrice('cabling', 'laborPerDrop'));
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
    setAppData({ ...defaultState, ...project.data });
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

  const toggleChecklistItem = (id) => {
    const updated = appData.checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    updateData('checklist', updated);
  };

  const checklistProgress = Math.round((appData.checklist.filter(c => c.completed).length / appData.checklist.length) * 100) || 0;

  // Subnet Calculator Logic
  const calculateSubnet = (ipStr, cidrStr) => {
    const cidr = parseInt(cidrStr, 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return null;
    
    const ipParts = ipStr.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some(isNaN) || ipParts.some(p => p < 0 || p > 255)) return null;
    
    const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
    const maskInt = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
    
    const network = (ipInt & maskInt) >>> 0;
    const broadcast = (network | (~maskInt)) >>> 0;
    
    const intToIp = (int) => {
      return [ (int >>> 24) & 255, (int >>> 16) & 255, (int >>> 8) & 255, int & 255 ].join('.');
    };
    
    const totalHosts = Math.pow(2, (32 - cidr));
    const usableHosts = totalHosts > 2 ? totalHosts - 2 : 0;
    
    return {
      network: intToIp(network),
      broadcast: intToIp(broadcast),
      firstIp: totalHosts > 2 ? intToIp(network + 1) : 'N/A',
      lastIp: totalHosts > 2 ? intToIp(broadcast - 1) : 'N/A',
      mask: intToIp(maskInt),
      usableHosts
    };
  };
  
  const subnetResult = calculateSubnet(appData.subnetIp || '192.168.1.10', appData.subnetCidr ?? 24);

  const pageVariants = {
    initial: { opacity: 0, rotateY: -20, scale: 0.95 },
    animate: { opacity: 1, rotateY: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { opacity: 0, rotateY: 20, scale: 0.95, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, rotateX: 90, scale: 0.8 },
    visible: { opacity: 1, rotateX: 0, scale: 1, transition: { type: 'spring', damping: 20, stiffness: 200 } },
    exit: { opacity: 0, rotateX: -90, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgMain} ${textMain} relative overflow-hidden`} style={{ perspective: '1200px' }}>
      
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
        <motion.div
          animate={{ backgroundPosition: ["0px 0px", "0px 40px"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 w-[200%] h-[200%] -left-1/2 -top-1/2 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'rotateX(60deg) translateY(-10%)',
          }}
        />
      </div>

      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${isLight ? 'bg-white/80 border-gray-200' : isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-black/80 border-[#222]'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center relative z-10">
          <motion.div whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('welcome')} className="flex items-center space-x-3 cursor-pointer">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30"><Cable className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className={`text-2xl font-bold ${isBlack ? 'text-white' : 'text-blue-600'}`}>CableIQ</h1>
              <p className={`text-xs ${textMuted}`}>Engineer Dashboard</p>
            </div>
          </motion.div>
          <div className="flex items-center space-x-2">
            <motion.button whileHover={{ scale: 1.05, rotateX: 10, rotateY: 10, boxShadow: "0px 10px 20px rgba(59,130,246,0.3)" }} whileTap={{ scale: 0.95 }} onClick={handleSaveProject} className={`px-3 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 transition-all`}>
              <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, rotateX: 10, rotateY: 10, boxShadow: "0px 10px 20px rgba(34,197,94,0.3)" }} whileTap={{ scale: 0.95 }} onClick={handleNewProject} className={`px-3 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-all`}>
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New</span>
            </motion.button>
            
            <motion.button whileHover={{ scale: 1.1, rotateY: -15 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentView('welcome')} className={`px-4 py-2 rounded-xl ${bgButton} transition-all`}><HomeIcon className="w-5 h-5" /></motion.button>
            
            <div className="relative">
              <motion.button whileHover={{ scale: 1.05, rotateX: 5 }} whileTap={{ scale: 0.95 }} onClick={() => setShowThemeMenu(!showThemeMenu)} className={`px-4 py-2 rounded-xl flex items-center space-x-2 font-medium ${bgButton} transition-all`}>
                {isLight ? <Sun className="w-5 h-5 text-orange-500" /> : isDark ? <Moon className="w-5 h-5 text-blue-400" /> : <CircleDot className="w-5 h-5 text-gray-300" />}
                <ChevronDown className="w-4 h-4" />
              </motion.button>
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div initial={{ opacity: 0, y: -10, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -10, rotateX: -90 }} className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border z-50 ${bgCard}`}>
                    <button onClick={() => { setTheme('light'); setShowThemeMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Light Mode</button>
                    <button onClick={() => { setTheme('dark'); setShowThemeMenu(false); }} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Dark Mode</button>
                    <button onClick={() => { setTheme('black'); setShowThemeMenu(false); }} className="w-full text-left px-4 py-3 text-sm border-t hover:bg-gray-100 dark:hover:bg-gray-700">AMOLED Black</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10" style={{ transformStyle: 'preserve-3d' }}>
        <AnimatePresence mode="wait">
          
          {currentView === 'welcome' && (
            <motion.div key="welcome" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12" style={{ perspective: 1000 }}>
              <TiltCard onClick={() => setCurrentView('saved-projects')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <FolderOpen className="w-8 h-8 text-yellow-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Saved Quotes</h3>
                <p className={`text-xs ${textMuted}`}>Load previous quotes ({savedProjects.length}).</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('cctv-planner')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <Camera className="w-8 h-8 text-orange-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">CCTV Configurator</h3>
                <p className={`text-xs ${textMuted}`}>Quote systems and calculate FOV.</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('cabling-planner')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <Network className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Cabling Planner</h3>
                <p className={`text-xs ${textMuted}`}>Cat6 BOM and printable labels.</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('rack-builder')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <Server className="w-8 h-8 text-pink-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Rack Builder</h3>
                <p className={`text-xs ${textMuted}`}>Visual 42U server rack diagram.</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('ip-tracker')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <Globe className="w-8 h-8 text-cyan-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">IP & VLAN Tracker</h3>
                <p className={`text-xs ${textMuted}`}>Manage static IPs.</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('checklist')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <ClipboardCheck className="w-8 h-8 text-teal-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Site Checklist</h3>
                <p className={`text-xs ${textMuted}`}>Track installation progress.</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('tools')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <Wrench className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Engineer Tools</h3>
                <p className={`text-xs ${textMuted}`}>Fuel, Storage, Cable Guide.</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('upsell')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <Star className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Upsell Showcase</h3>
                <p className={`text-xs ${textMuted}`}>Show clients the value of 4K.</p>
              </TiltCard>
              <TiltCard onClick={() => setCurrentView('pricing')} className={`p-4 border shadow-sm hover:shadow-2xl ${bgCard}`}>
                <DollarSign className="w-8 h-8 text-emerald-500 mb-3" />
                <h3 className="text-lg font-bold mb-1">Hardware Prices</h3>
                <p className={`text-xs ${textMuted}`}>Update costs & margins.</p>
              </TiltCard>
            </motion.div>
          )}

          {currentView === 'checklist' && (
            <motion.div key="checklist" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Site Handover Checklist</h2>
                  <p className={textMuted}>Track progress and ensure no steps are missed.</p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('welcome')} className={`px-4 py-2 font-bold rounded-lg flex items-center space-x-2 ${bgButton}`}>
                  <ArrowRight className="w-4 h-4 rotate-180" /> <span>Back</span>
                </motion.button>
              </div>

              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">Overall Progress</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{checklistProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${checklistProgress}%` }} 
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${checklistProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['Pre-Installation', 'Installation', 'Testing & Commissioning', 'Handover'].map(category => (
                  <div key={category} className={`p-6 rounded-xl border ${bgCard}`}>
                    <h3 className="text-lg font-bold mb-4 border-b pb-2 dark:border-gray-700">{category}</h3>
                    <div className="space-y-3">
                      {appData.checklist.filter(item => item.category === category).map(item => (
                        <div 
                          key={item.id} 
                          onClick={() => toggleChecklistItem(item.id)}
                          className="flex items-start space-x-3 cursor-pointer group"
                        >
                          <button className="mt-0.5 shrink-0 transition-colors">
                            {item.completed 
                              ? <CheckCircle2 className="w-5 h-5 text-green-500" /> 
                              : <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                            }
                          </button>
                          <span className={`text-sm ${item.completed ? 'line-through text-gray-400' : ''}`}>
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4">Client Sign-off</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs mb-1 font-bold">Client Name</label>
                    <input type="text" placeholder="John Doe" value={appData.clientSignoff.name} onChange={e => updateData('clientSignoff', { ...appData.clientSignoff, name: e.target.value })} className={`w-full p-2 rounded border ${bgInput}`} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 font-bold">Date Signed</label>
                    <input type="date" value={appData.clientSignoff.date} onChange={e => updateData('clientSignoff', { ...appData.clientSignoff, date: e.target.value })} className={`w-full p-2 rounded border ${bgInput}`} />
                  </div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.95 }} 
                  onClick={() => {
                    if(checklistProgress < 100) return alert("Please complete all tasks before printing the handover certificate.");
                    window.print();
                  }} 
                  className={`w-full py-3 font-bold rounded-lg flex items-center justify-center space-x-2 ${checklistProgress === 100 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                  <Printer className="w-5 h-5" /> <span>Print Handover Certificate</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentView === 'pricing' && (
            <motion.div key="pricing" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-5xl mx-auto space-y-6 pb-20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Hardware Pricing</h2>
                  <p className={textMuted}>Update supplier costs and set your markup margin.</p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('welcome')} className={`px-4 py-2 font-bold rounded-lg flex items-center space-x-2 ${bgButton}`}>
                  <ArrowRight className="w-4 h-4 rotate-180" /> <span>Back</span>
                </motion.button>
              </div>

              <div className={`p-4 rounded-xl border flex items-center justify-between ${bgCard} bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800`}>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Profit Margin / Markup</h3>
                    <p className={`text-xs ${textMuted}`}>Applied to calculate recommended selling prices.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    value={appData.markupPercent ?? 20} 
                    onChange={(e) => updateData('markupPercent', Number(e.target.value))} 
                    className={`w-20 p-2 text-right font-bold text-lg rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${bgInput}`} 
                  />
                  <span className="font-bold text-lg">%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(CATALOG).map(([categoryName, categoryData]) => {
                  if (!categoryData) return null; 
                  return (
                    <div key={categoryName} className={`p-6 rounded-2xl border shadow-sm ${bgCard}`}>
                      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 capitalize border-b pb-2 border-gray-200 dark:border-gray-700">
                        <DollarSign className="w-5 h-5 text-emerald-500" /> 
                        <span>{categoryName.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(categoryData).map(([key, item]) => {
                          const isCustom = appData.hardwarePrices?.[categoryName]?.[key] !== undefined;
                          const defaultPrice = typeof item === 'object' ? item.price : item;
                          const itemName = typeof item === 'object' ? item.name : key.replace(/([A-Z])/g, ' $1').trim();
                          
                          return (
                            <PriceInput 
                              key={key}
                              category={categoryName}
                              itemKey={itemName}
                              defaultPrice={defaultPrice}
                              currentPrice={appData.hardwarePrices?.[categoryName]?.[key]}
                              markup={appData.markupPercent ?? 20}
                              onUpdate={(cat, k, val) => {
                                if (Number(val) === defaultPrice) {
                                  const newPrices = { ...appData.hardwarePrices };
                                  if (newPrices[cat]) delete newPrices[cat][k];
                                  updateData('hardwarePrices', newPrices);
                                } else {
                                  updatePrice(cat, k, val);
                                }
                              }}
                              bgInput={bgInput}
                              textMuted={textMuted}
                              isCustom={isCustom}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentView === 'rack-builder' && (
            <motion.div key="rack" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Server Rack Builder</h2>
                  <p className={textMuted}>Click to add, then drag items up/down to re-arrange.</p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('welcome')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>Back</motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Available Equipment</h3>
                  {Object.entries(RACK_EQUIPMENT).map(([key, item]) => (
                    <motion.button whileHover={{ x: 5, scale: 1.02 }} whileTap={{ scale: 0.98 }} key={key} onClick={() => addRackItem(key)} className={`w-full flex items-center justify-between p-3 rounded-lg border shadow-sm hover:shadow-md transition-all ${bgCard}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className="font-medium text-sm">{item.name} ({item.size}U)</span>
                      </div>
                      <Plus className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  ))}
                </div>
                <div className="md:col-span-2">
                  <div className={`p-6 rounded-xl border ${bgCard}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Your Rack Layout</h3>
                      <div className="text-sm font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">{rackRemainingU}U Available</div>
                    </div>
                    
                    <motion.div 
                      initial={{ rotateX: 25, rotateY: -15, rotateZ: 5 }}
                      whileHover={{ rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="relative w-full max-w-sm mx-auto bg-gray-900 border-4 border-gray-700 rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] p-2" 
                      style={{ minHeight: '400px', transformStyle: 'preserve-3d', perspective: 1000 }}
                    >
                      {appData.rackItems.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm italic py-20">Click equipment on the left to add it.</div>
                      ) : (
                        <Reorder.Group axis="y" values={appData.rackItems} onReorder={(newOrder) => updateData('rackItems', newOrder)} className="flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
                          {appData.rackItems.map((item) => {
                            const eq = RACK_EQUIPMENT[item.type];
                            return (
                              <Reorder.Item 
                                key={item.id} 
                                value={item} 
                                whileDrag={{ scale: 1.1, rotateX: 10, zIndex: 50, boxShadow: "0px 20px 30px rgba(0,0,0,0.6)", backgroundColor: "#374151" }}
                                className={`relative w-full ${eq.color} border-b border-gray-800 flex items-center justify-between px-3 text-white font-bold text-sm shadow-inner cursor-grab active:cursor-grabbing`}
                                style={{ height: `${eq.size * 40}px`, listStyle: 'none' }}
                              >
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="w-4 h-4 opacity-50" />
                                  <span>{eq.name}</span>
                                </div>
                                <button onClick={() => removeRackItem(item.id)} className="p-1 bg-black/20 rounded hover:bg-black/40"><Trash2 className="w-3 h-3 text-white" /></button>
                              </Reorder.Item>
                            );
                          })}
                        </Reorder.Group>
                      )}
                      {rackRemainingU > 0 && (
                        <div className="w-full border-t border-gray-700/50 border-dashed flex items-center justify-center text-gray-600 text-xs transition-all duration-500" style={{ height: `${rackRemainingU * 40}px` }}>{rackRemainingU}U Empty Space</div>
                      )}
                    </motion.div>
                    
                    <div className="mt-6 flex justify-center">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                        const element = document.getElementById('pdf-rack-container');
                        html2pdf().set({ margin: 0.5, filename: 'Rack_Diagram.pdf', html2canvas: { scale: 2, useCORS: true } }).from(element).save();
                      }} disabled={appData.rackItems.length === 0} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
                        <Download className="w-5 h-5" /> <span>Export Rack PDF</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 left-0 -z-50 overflow-hidden h-0">
                <div id="pdf-rack-container" className="bg-white text-gray-900 p-10" style={{ width: '600px', fontFamily: 'Arial, sans-serif' }}>
                  <h1 style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '10px' }}>Server Rack Elevation</h1>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>Project: {appData.clientName || 'Client'}</p>
                  <div className="bg-gray-200 border-4 border-gray-400 rounded-lg p-2 mx-auto" style={{ width: '300px' }}>
                    {appData.rackItems.map((item) => {
                      const eq = RACK_EQUIPMENT[item.type];
                      return (
                        <div key={item.id} className={`${eq.color} border-b border-gray-400 flex items-center px-3 text-white font-bold text-sm`} style={{ height: `${eq.size * 30}px` }}>{eq.name}</div>
                      );
                    })}
                    {rackRemainingU > 0 && (
                      <div className="border-t border-gray-400 border-dashed flex items-center justify-center text-gray-500 text-xs" style={{ height: `${rackRemainingU * 30}px` }}>{rackRemainingU}U Empty</div>
                    )}
                  </div>
                  <p style={{ marginTop: '20px', fontSize: '12px', textAlign: 'center', color: '#666' }}>Generated by CableIQ - {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'ip-tracker' && (
            <motion.div key="ip" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-center mb-8">
                <div><h2 className="text-2xl font-bold">IP & VLAN Tracker</h2><p className={textMuted}>Log your devices to prevent IP conflicts on site.</p></div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('welcome')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>Back</motion.button>
              </div>
              <div className={`p-6 rounded-xl border ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4">Add Device</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div><label className="text-xs">Device Name</label><input type="text" value={newDevice.name} onChange={e => setNewDevice({...newDevice, name: e.target.value})} className={`w-full p-2 rounded border ${bgInput}`} /></div>
                  <div><label className="text-xs">IP Address</label><input type="text" placeholder="192.168.1.10" value={newDevice.ip} onChange={e => setNewDevice({...newDevice, ip: e.target.value})} className={`w-full p-2 rounded border ${bgInput}`} /></div>
                  <div><label className="text-xs">Gateway</label><input type="text" placeholder="192.168.1.1" value={newDevice.gateway} onChange={e => setNewDevice({...newDevice, gateway: e.target.value})} className={`w-full p-2 rounded border ${bgInput}`} /></div>
                  <div><label className="text-xs">VLAN ID</label><input type="text" placeholder="10" value={newDevice.vlan} onChange={e => setNewDevice({...newDevice, vlan: e.target.value})} className={`w-full p-2 rounded border ${bgInput}`} /></div>
                  <div className="flex items-end"><motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                    if(!newDevice.name || !newDevice.ip) return alert("Name and IP required");
                    if(appData.ipRecords.some(r => r.ip === newDevice.ip)) return alert("⚠️ IP Conflict! Address already used.");
                    updateData('ipRecords', [...appData.ipRecords, { id: Date.now(), ...newDevice }]);
                    setNewDevice({ name: '', ip: '', gateway: '', vlan: '10' });
                  }} className="w-full py-2 bg-cyan-600 text-white rounded font-bold hover:bg-cyan-700">Add Device</motion.button></div>
                </div>
              </div>
              <div className={`rounded-xl border overflow-hidden ${bgCard}`}>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={isLight ? 'bg-gray-100' : 'bg-gray-900/50'}>
                      <th className="p-4 text-sm font-bold">Device</th><th className="p-4 text-sm font-bold">IP Address</th><th className="p-4 text-sm font-bold">Gateway</th><th className="p-4 text-sm font-bold">VLAN</th><th className="p-4 text-sm font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appData.ipRecords.length === 0 ? (<tr><td colSpan="5" className="p-6 text-center text-muted">No devices added yet.</td></tr>) : (
                      appData.ipRecords.map(rec => (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={rec.id} className={`border-t ${isLight ? 'border-gray-200' : 'border-gray-700'}`}>
                          <td className="p-4 font-medium">{rec.name}</td><td className="p-4 font-mono text-cyan-600 dark:text-cyan-400">{rec.ip}</td><td className="p-4 font-mono text-gray-500">{rec.gateway || '-'}</td><td className="p-4"><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-bold">VLAN {rec.vlan}</span></td><td className="p-4 text-right"><button onClick={() => updateData('ipRecords', appData.ipRecords.filter(r => r.id !== rec.id))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4 inline" /></button></td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {currentView === 'saved-projects' && (
            <motion.div key="saved" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Saved Client Quotes</h2>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('welcome')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>Back</motion.button>
              </div>
              {savedProjects.length === 0 ? (
                <div className={`p-12 text-center rounded-xl border ${bgCard}`}>
                  <FolderOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" /><h3 className="text-xl font-bold mb-2">No Saved Quotes</h3><p className={textMuted}>Create a quote and click the "Save" button in the header.</p>
                </div>
              ) : (
                savedProjects.map((project, index) => (
                  <motion.div 
                    initial={{ opacity: 0, rotateX: 45, y: 50 }} 
                    animate={{ opacity: 1, rotateX: 0, y: 0 }} 
                    transition={{ type: "spring", stiffness: 100, delay: index * 0.1 }} 
                    whileHover={{ scale: 1.02, rotateY: -5, boxShadow: "0px 20px 30px rgba(0,0,0,0.1)" }} 
                    key={project.id} 
                    onClick={() => handleLoadProject(project)} 
                    className={`p-4 rounded-xl border cursor-pointer hover:border-blue-500 flex justify-between items-center ${bgCard}`}
                  >
                    <div><h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{project.client}</h3><p className={`text-sm ${textMuted}`}>Date Saved: {project.date}</p></div>
                    <div className="flex items-center space-x-4">
                      <button onClick={(e) => handleDeleteProject(project.id, e)} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded hover:bg-red-200"><Trash2 className="w-5 h-5" /></button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded font-bold text-sm">Load</button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {currentView === 'upsell' && (
            <motion.div key="upsell" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6" style={{ perspective: 1500 }}>
              <div className="text-center mb-8"><h2 className="text-3xl font-bold mb-2">Camera Quality Comparison</h2><p className={textMuted}>Click a card to flip it and see the specs.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <motion.div 
                  onClick={() => setFlippedCard(flippedCard === 'standard' ? null : 'standard')}
                  animate={{ rotateY: flippedCard === 'standard' ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  style={{ transformStyle: "preserve-3d", cursor: 'pointer' }}
                  className="relative h-[400px] w-full"
                >
                  <div className={`absolute inset-0 backface-hidden rounded-2xl border overflow-hidden ${bgCard}`} style={{ backfaceVisibility: 'hidden' }}>
                    <div className="h-64 bg-gray-300 dark:bg-gray-700 relative flex items-center justify-center">
                      <span className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold">Standard 2MP</span>
                      <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=600&auto=format&fit=crop" alt="Standard" className="w-full h-full object-cover opacity-70 grayscale-[30%]" />
                    </div>
                    <div className="p-6"><h3 className="text-xl font-bold mb-2">Standard 1080p</h3><p className={`text-sm ${textMuted}`}>Good for general indoor viewing. Tap to flip.</p></div>
                  </div>
                  <div className={`absolute inset-0 backface-hidden rounded-2xl border p-8 bg-gray-100 dark:bg-gray-800 flex flex-col justify-center`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <h3 className="text-2xl font-bold mb-4">Standard Tech Specs</h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <li><strong>Resolution:</strong> 2MP (1920x1080)</li>
                      <li><strong>Night Vision:</strong> Standard IR (Black & White)</li>
                      <li><strong>Lens:</strong> Fixed 3.6mm</li>
                      <li><strong>Audio:</strong> None</li>
                      <li><strong>Smart Features:</strong> Basic Motion Detection</li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div 
                  onClick={() => setFlippedCard(flippedCard === 'premium' ? null : 'premium')}
                  animate={{ rotateY: flippedCard === 'premium' ? 180 : 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  style={{ transformStyle: "preserve-3d", cursor: 'pointer' }}
                  className="relative h-[400px] w-full"
                >
                  <div className={`absolute inset-0 backface-hidden rounded-2xl border-2 border-purple-500 overflow-hidden shadow-lg ${bgCard}`} style={{ backfaceVisibility: 'hidden' }}>
                    <div className="h-64 bg-gray-300 relative flex items-center justify-center">
                      <span className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">Premium 4K / ColorVu</span>
                      <img src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=600&auto=format&fit=crop" alt="Premium" className="w-full h-full object-cover brightness-110 contrast-125" />
                    </div>
                    <div className="p-6"><h3 className="text-xl font-bold mb-2 text-purple-600 dark:text-purple-400">4K ColorVu</h3><p className={`text-sm ${textMuted}`}>Full color at night. Tap to flip.</p></div>
                  </div>
                  <div className={`absolute inset-0 backface-hidden rounded-2xl border-2 border-purple-500 p-8 bg-purple-50 dark:bg-purple-900/20 flex flex-col justify-center`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <h3 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-300">Premium Tech Specs</h3>
                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <li><strong>Resolution:</strong> 4K (3840x2160)</li>
                      <li><strong>Night Vision:</strong> Full Color (ColorVu)</li>
                      <li><strong>Lens:</strong> 2.8mm Wide Angle</li>
                      <li><strong>Audio:</strong> Built-in Mic & Speaker</li>
                      <li><strong>Smart Features:</strong> AI Human/Vehicle Detection</li>
                    </ul>
                  </div>
                </motion.div>

              </div>
              <div className="text-center mt-8"><motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('cctv-planner')} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg text-lg hover:bg-blue-700">Proceed to Build Quote</motion.button></div>
            </motion.div>
          )}

          {currentView === 'cabling-planner' && (
            <motion.div key="cabling" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`p-6 rounded-xl border lg:col-span-1 h-fit ${bgCard}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Plus className="w-5 h-5 text-blue-500" /> <span>Add Data Drop</span></h3>
                <div className="space-y-4">
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Room / Location</label><input type="text" placeholder="e.g. Reception" value={appData.cabRoom || ''} onChange={e => updateData('cabRoom', e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                  <div><label className={`text-xs mb-1 ${textMuted}`}>Cable Length (m)</label><input type="number" placeholder="30" value={appData.cabLength || ''} onChange={e => updateData('cabLength', Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                    if(!appData.cabRoom || !appData.cabLength) return alert("Enter room and length");
                    updateData('cabDevices', [...appData.cabDevices, { id: Date.now(), room: appData.cabRoom, length: appData.cabLength }]);
                    updateData('cabRoom', ''); updateData('cabLength', '');
                  }} className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Add Drop</motion.button>
                </div>
              </div>
              <div className={`p-6 rounded-xl border lg:col-span-2 ${bgCard}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Planned Drops ({cabTotals.ports})</h3>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowLabels(true)} className="px-3 py-1 bg-green-600 text-white rounded text-sm font-bold flex items-center space-x-1 hover:bg-green-700"><Tag className="w-4 h-4" /> <span>Print Labels</span></motion.button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto mb-6 pr-2">
                  {appData.cabDevices.length === 0 ? (<p className={`text-sm ${textMuted}`}>No drops added yet.</p>) : (
                    <AnimatePresence>
                      {appData.cabDevices.map((d, i) => (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} key={d.id} className={`flex justify-between items-center p-2 rounded text-sm ${bgInput}`}>
                          <span><strong className="text-blue-500">Port {i+1}</strong> • {d.room} • {d.length}m</span>
                          <button onClick={() => updateData('cabDevices', appData.cabDevices.filter(x => x.id !== d.id))} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 border-t pt-4">Bill of Materials (BOM)</h3>
                <div className={`space-y-1 text-sm ${textMuted}`}>
                  <div className="flex justify-between"><span>Total Drops:</span> <span className={textMain}>{cabTotals.ports} Ports</span></div>
                  <div className="flex justify-between"><span>Cable Required (with 15% slack):</span> <span className={textMain}>{Math.round(cabTotals.lengthWithWaste)}m</span></div>
                  <div className="flex justify-between"><span>Cat6 Boxes (305m):</span> <span className={textMain}>{cabTotals.boxes} boxes</span></div>
                  <div className="flex justify-between"><span>Patch Panels (24-port):</span> <span className={textMain}>{cabTotals.patchPanels} units</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><span>Total Cost:</span> <span className="text-green-500">{formatKES(cabTotals.cost)}</span></div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'tools' && (
            <motion.div key="tools" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-xl border ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Car className="w-5 h-5 text-red-500" /> <span>Fuel & Transport</span></h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs">Round Trip (km)</label><input type="number" value={appData.fuelDistance} onChange={e => updateData('fuelDistance', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Fuel Price (/L)</label><input type="number" value={appData.fuelPrice} onChange={e => updateData('fuelPrice', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Car Consumption (km/L)</label><input type="number" value={appData.fuelConsumption} onChange={e => updateData('fuelConsumption', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Extra Fee</label><input type="number" value={appData.transportFee} onChange={e => updateData('transportFee', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  </div>
                  <div className={`p-4 rounded text-center ${isLight ? 'bg-red-50' : 'bg-red-900/20'}`}><p className="text-sm">Transport Charge</p><p className="text-2xl font-bold text-red-600">KSh {transportTotal}</p></div>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-xl border md:col-span-2 ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-blue-600 dark:text-blue-400"><Database className="w-5 h-5" /> <span>Storage & Bandwidth</span></h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div><label className="text-xs">Cameras</label><input type="number" value={appData.calcCams} onChange={e => updateData('calcCams', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Resolution</label><select value={appData.calcRes} onChange={e => updateData('calcRes', e.target.value)} className={`w-full p-2 rounded ${bgInput}`}><option value="2MP">2MP (1080p)</option><option value="4MP">4MP (2K)</option><option value="8MP">8MP (4K)</option></select></div>
                    <div><label className="text-xs">Compression</label><select value={appData.calcComp} onChange={e => updateData('calcComp', e.target.value)} className={`w-full p-2 rounded ${bgInput}`}><option value="H.264">H.264</option><option value="H.265">H.265</option><option value="H.265+">H.265+</option></select></div>
                    <div><label className="text-xs">Hard Drive</label><select value={appData.calcHdd} onChange={e => updateData('calcHdd', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`}><option value={500}>500 GB</option><option value={1000}>1 TB</option><option value={2000}>2 TB</option><option value={4000}>4 TB</option></select></div>
                  </div>
                  <div className={`p-4 rounded-lg flex items-center justify-between ${isLight ? 'bg-gray-100' : 'bg-gray-900/50'}`}>
                    <div><p className="text-xs text-gray-500">Recording Days</p><p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{storageCalc.days} Days</p></div>
                    <div className="text-right"><p className="text-xs text-gray-500">Upload Speed Needed</p><p className="text-lg font-bold text-green-600 dark:text-green-400">{storageCalc.remoteBandwidth} Mbps</p></div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-xl border ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Zap className="w-5 h-5 text-yellow-500" /> <span>PoE Calculator</span></h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs">IP Cams (15W)</label><input type="number" value={appData.poeCams} onChange={e => updateData('poeCams', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">APs (20W)</label><input type="number" value={appData.poeAps} onChange={e => updateData('poeAps', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  </div>
                  <div className={`p-4 rounded text-center ${isLight ? 'bg-yellow-50' : 'bg-yellow-900/20'}`}><p className="text-2xl font-bold text-yellow-600">{(appData.poeCams*15) + (appData.poeAps*20)} Watts</p></div>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-xl border ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Wifi className="w-5 h-5 text-blue-500" /> <span>Wi-Fi Estimator</span></h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs">Number of Rooms</label><input type="number" value={appData.wifiRooms} onChange={e => updateData('wifiRooms', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Thick Walls</label><input type="number" value={appData.wifiWalls} onChange={e => updateData('wifiWalls', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  </div>
                  <div className={`p-4 rounded text-center ${isLight ? 'bg-blue-50' : 'bg-blue-900/20'}`}><p className="text-sm">Access Points Needed</p><p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.max(1, Math.ceil((appData.wifiRooms / 2) + (appData.wifiWalls / 3)))} APs</p></div>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-xl border ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Activity className="w-5 h-5 text-orange-500" /> <span>Voltage Drop</span></h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs">Length (m)</label><input type="number" value={appData.voltLength} onChange={e => updateData('voltLength', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                    <div><label className="text-xs">Load (Amps)</label><input type="number" step="0.1" value={appData.voltAmps} onChange={e => updateData('voltAmps', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  </div>
                  <div className={`p-4 rounded text-center ${isLight ? 'bg-orange-50' : 'bg-orange-900/20'}`}><p className="text-2xl font-bold text-orange-600">{(12 - (appData.voltLength * appData.voltAmps * 0.0164)).toFixed(2)}V</p></div>
                </motion.div>

                {/* NEW: Subnet Calculator */}
                <motion.div whileHover={{ y: -3 }} className={`p-6 rounded-xl border ${bgCard} md:col-span-2 lg:col-span-1`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Globe className="w-5 h-5 text-indigo-500" /> <span>Subnet Calculator</span></h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs">IP Address</label><input type="text" value={appData.subnetIp || ''} onChange={e => updateData('subnetIp', e.target.value)} className={`w-full p-2 rounded ${bgInput}`} placeholder="192.168.1.10" /></div>
                    <div><label className="text-xs">CIDR (0-32)</label><input type="number" min="0" max="32" value={appData.subnetCidr ?? 24} onChange={e => updateData('subnetCidr', Number(e.target.value))} className={`w-full p-2 rounded ${bgInput}`} /></div>
                  </div>
                  {subnetResult ? (
                    <div className={`p-4 rounded text-sm space-y-1 ${isLight ? 'bg-indigo-50' : 'bg-indigo-900/20'}`}>
                      <div className="flex justify-between"><span className="text-gray-500">Mask:</span> <span className="font-mono font-bold">{subnetResult.mask}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Network:</span> <span className="font-mono font-bold">{subnetResult.network}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Range:</span> <span className="font-mono font-bold">{subnetResult.firstIp} - {subnetResult.lastIp}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Broadcast:</span> <span className="font-mono font-bold">{subnetResult.broadcast}</span></div>
                      <div className="flex justify-between border-t border-indigo-200 dark:border-indigo-800 pt-1 mt-1"><span className="text-indigo-600 dark:text-indigo-400 font-bold">Usable IPs:</span> <span className="font-bold text-indigo-700 dark:text-indigo-300">{subnetResult.usableHosts.toLocaleString()}</span></div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-red-500 text-sm bg-red-50 dark:bg-red-900/20 rounded">Invalid IP or CIDR</div>
                  )}
                </motion.div>

              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-xl border mt-6 ${bgCard}`}>
                <h3 className="text-lg font-bold mb-6 flex items-center space-x-2"><Terminal className="w-5 h-5 text-cyan-500" /> <span>Field Cable Tester & Tracer Guide</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center space-x-2"><Unplug className="w-4 h-4"/> 1. RJ45 Continuity Test</h4>
                    <div className="flex justify-center space-x-12 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 flex space-x-1">
                          {[1,2,3,4,5,6,7,8].map(n => (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: n * 0.1 }} key={n} className={`w-2 h-4 rounded ${n === 3 ? 'bg-red-500' : 'bg-green-500'}`}></motion.div>))}
                        </div><span className="text-xs mt-2 font-bold">Main Unit</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 flex space-x-1">
                          {[1,2,3,4,5,6,7,8].map(n => (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: n * 0.1 + 0.5 }} key={n} className={`w-2 h-4 rounded ${n === 3 ? 'bg-red-500' : 'bg-green-500'}`}></motion.div>))}
                        </div><span className="text-xs mt-2 font-bold">Remote</span>
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
                    <div className="flex justify-center items-center space-x-8 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 p-2 rounded-lg border border-gray-600"><Terminal className="w-8 h-8 text-yellow-500" /></div><span className="text-xs mt-2 font-bold">Tone Gen</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-16 h-0.5 bg-gray-500 border-t border-dashed"></motion.div><span className="text-[10px] text-gray-500">Cable Bundle</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 p-2 rounded-lg border border-gray-600 flex flex-col items-center">
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}><Wifi className="w-6 h-6 text-green-400" /></motion.div><span className="text-[8px] font-bold">BEEP!</span>
                        </div><span className="text-xs mt-2 font-bold">Probe</span>
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
              </motion.div>
            </motion.div>
          )}

          {currentView === 'cctv-planner' && (
            <motion.div key="cctv" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateData('systemType', 'Analog')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.systemType === 'Analog' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' : `border-transparent ${bgInput}`}`}>Analog (DVR)</motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateData('systemType', 'IP')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.systemType === 'IP' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>IP (NVR)</motion.button>
                  </div>
                  <div className="flex space-x-4 mb-6">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateData('cameraShape', 'Bullet')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.cameraShape === 'Bullet' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>Bullet Shape</motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => updateData('cameraShape', 'Dome')} className={`flex-1 py-3 rounded-lg font-bold border-2 ${appData.cameraShape === 'Dome' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : `border-transparent ${bgInput}`}`}>Dome Shape</motion.button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className={`text-xs mb-1 ${textMuted}`}>Quantity</label><input type="number" value={appData.quantity} onChange={e => updateData('quantity', Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                    <div><label className={`text-xs mb-1 ${textMuted}`}>Cable (m)</label><input type="number" value={appData.cableLength} onChange={e => updateData('cableLength', Number(e.target.value))} className={`w-full px-3 py-2 rounded border ${bgInput}`} /></div>
                    <div>
                      <label className={`text-xs mb-1 ${textMuted}`}>Storage</label>
                      <select value={appData.selectedStorage} onChange={e => updateData('selectedStorage', e.target.value)} className={`w-full px-3 py-2 rounded border ${bgInput}`}>
                        <option value="hdd500">500GB HDD</option><option value="hdd1tb">1TB HDD</option><option value="hdd2tb">2TB HDD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border ${bgCard}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2"><Eye className="w-5 h-5 text-purple-500" /> <span>Camera Coverage (FOV)</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`text-xs mb-1 font-bold ${textMuted}`}>Select Lens (FOV)</label>
                      <select value={appData.lensType || '3.6'} onChange={e => updateData('lensType', e.target.value)} className={`w-full px-3 py-2 rounded border mb-4 ${bgInput}`}>
                        <option value="2.8">2.8mm Lens (Wide Angle ~100°)</option>
                        <option value="3.6">3.6mm Lens (Standard ~80°)</option>
                        <option value="4">4.0mm Lens (Narrow ~70°)</option>
                        <option value="6">6.0mm Lens (Telephoto ~50°)</option>
                      </select>
                    </div>
                    <div className="relative h-48 bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center" style={{ perspective: '800px' }}>
                      <div className="absolute bottom-4 text-xs text-gray-500 z-10">Top-Down View</div>
                      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow z-10" />
                      <motion.div 
                        animate={{ 
                          width: appData.lensType === '2.8' ? '300px' : appData.lensType === '3.6' ? '220px' : appData.lensType === '4' ? '180px' : '120px',
                          rotateX: 20
                        }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className="absolute bottom-10 left-1/2 origin-bottom bg-gradient-to-t from-blue-500/60 to-transparent border-t border-l border-r border-blue-500/80"
                        style={{
                          height: '150px',
                          transform: 'translateX(-50%)',
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                          filter: 'drop-shadow(0 10px 10px rgba(59, 130, 246, 0.5))'
                        }}
                      />
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
                </div>
                
                <motion.div
                  animate={{ y: [0, -5, 0], boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 15px 20px rgba(59,130,246,0.2)", "0px 0px 0px rgba(0,0,0,0)"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                >
                  <p className="text-sm opacity-80">Total</p>
                  <p className="text-3xl font-bold">{formatKES(totalCCTV)}</p>
                </motion.div>

                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('report')} className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700"><Printer className="w-5 h-5" /> <span>Preview Document</span></motion.button>
              </div>
            </motion.div>
          )}

          {currentView === 'report' && (
            <motion.div key="report" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCurrentView('cctv-planner')} className={`px-4 py-2 font-bold rounded-lg ${bgButton}`}>← Back</motion.button>
                <div className="flex space-x-2">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowClientView(true)} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg flex items-center space-x-2"><Monitor className="w-5 h-5" /> <span className="hidden sm:inline">Client View</span></motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleShareWhatsApp} disabled={isSharing} className="px-4 py-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold rounded-lg flex items-center space-x-2 disabled:opacity-50"><Share2 className="w-5 h-5" /> <span>{isSharing ? '...' : 'Share PDF'}</span></motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                    const element = document.getElementById('pdf-cctv-container');
                    html2pdf().set({ margin: 0.5, filename: 'Document.pdf', html2canvas: { scale: 2, useCORS: true } }).from(element).save();
                  }} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center space-x-2"><Download className="w-5 h-5" /> <span>Download</span></motion.button>
                </div>
              </div>
              <div className={`flex justify-center p-4 rounded-xl overflow-x-auto ${isLight ? 'bg-gray-200' : isDark ? 'bg-gray-800' : 'bg-[#111]'}`}>
                <div id="pdf-cctv-container" className="bg-white text-gray-900 p-10 shadow-2xl" style={{ width: '800px', fontFamily: 'Arial, sans-serif' }}>
                  <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '30px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <h1 style={{ margin: 0, color: '#f97316', fontSize: '28px', fontWeight: 'bold' }}>{appData.isInvoice ? 'INVOICE' : 'QUOTATION'}</h1>
                    <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontWeight: 'bold' }}>{businessInfo.name}</p><p style={{ margin: 0, fontSize: '12px' }}>Tel: {businessInfo.phone}</p></div>
                  </div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <div><p style={{ fontSize: '12px', color: '#666' }}>PREPARED FOR:</p><p style={{ fontSize: '16px', fontWeight: 'bold' }}>{appData.clientName || 'Client Name'}</p></div>
                    <div style={{ textAlign: 'right' }}><button onClick={() => updateData('isInvoice', !appData.isInvoice)} style={{ fontSize: '12px', padding: '5px 10px', backgroundColor: '#e5e7eb', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Toggle Quote/Invoice</button></div>
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
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '14px', marginRight: '10px' }}>Amount Paid (Deposit):</span>
                            <input type="number" value={appData.depositPaid} onChange={e => updateData('depositPaid', Number(e.target.value))} style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '4px', width: '120px', textAlign: 'right', fontSize: '14px' }} />
                          </div>
                          <button onClick={copyMpesa} style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
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
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showClientView && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 flex flex-col p-4 md:p-12 overflow-y-auto" style={{ perspective: 1000 }}>
              <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="max-w-4xl mx-auto w-full bg-white rounded-3xl p-8 md:p-12 relative shadow-2xl text-gray-900 mt-10">
                <button onClick={() => setShowClientView(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Trash2 className="w-6 h-6 text-gray-600" /></button>
                <div className="text-center mb-10"><h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-2">{businessInfo.name}</h1><p className="text-xl text-gray-500">CCTV Security Proposal</p></div>
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLabels && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className={`w-full max-w-2xl p-6 rounded-xl shadow-2xl ${bgCard}`}>
                <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Cable Labels</h2><button onClick={() => setShowLabels(false)} className="text-red-500 font-bold">Close</button></div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2 bg-white text-black">
                  {appData.cabDevices.map((d, i) => (
                    <div key={d.id} className="border-2 border-dashed border-gray-400 p-2 text-center rounded"><p className="font-bold text-sm">{d.room}</p><p className="text-xs text-gray-600">Port {i + 1}</p></div>
                  ))}
                </div>
                <button onClick={() => window.print()} className="w-full mt-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">Print Labels</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
