// src/App.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Camera, 
  Wifi, 
  Phone, 
  Network, 
  Cable,
  MapPin,
  ClipboardList,
  Layers,
  Download,
  Trash2,
  Settings,
  FileText,
  Moon,
  Sun,
  CheckCircle,
  Server,
  Home,
  Building,
  TreePine,
  ArrowRight,
  DollarSign,
  Gauge,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';

// Exchange rate: 1 USD = 130 KES
const USD_TO_KES = 130;

// Cable Standards
const cableStandards = {
  cat5e: {
    name: "Cat5e",
    speed: "Up to 1 Gbps",
    distance: "100m",
    price: 0.3 * USD_TO_KES,
    priceUnit: "KES/m",
    description: "Budget option",
    color: "from-yellow-500 to-orange-500",
    maxDistance: 100,
    recommended: false
  },
  cat6: {
    name: "Cat6",
    speed: "Up to 10 Gbps",
    distance: "55m",
    price: 0.5 * USD_TO_KES,
    priceUnit: "KES/m",
    description: "Recommended for most deployments",
    color: "from-blue-500 to-cyan-500",
    maxDistance: 55,
    recommended: true
  },
  cat6a: {
    name: "Cat6A",
    speed: "Up to 10 Gbps",
    distance: "100m",
    price: 0.85 * USD_TO_KES,
    priceUnit: "KES/m",
    description: "Best performance, future-proof",
    color: "from-green-500 to-emerald-500",
    maxDistance: 100,
    recommended: false
  },
  fiber: {
    name: "Fiber",
    speed: "Up to 100 Gbps",
    distance: "2000m",
    price: 2.5 * USD_TO_KES,
    priceUnit: "KES/m",
    description: "Backbone / long runs",
    color: "from-purple-500 to-pink-500",
    maxDistance: 2000,
    recommended: false
  }
};

// Default rooms
const defaultRooms = [
  { id: 1, name: "Garage", icon: "Home" },
  { id: 2, name: "Entrance/Lobby", icon: "Building" },
  { id: 3, name: "Backyard", icon: "TreePine" }
];

// Device types
const deviceTypes = {
  cctv: { 
    label: "CCTV Camera", 
    baseCable: 45, 
    icon: Camera,
    color: "from-red-500 to-rose-500",
    poe: true,
    category: "Security"
  },
  data: { 
    label: "Data Point", 
    baseCable: 35, 
    icon: Network,
    color: "from-blue-500 to-indigo-500",
    poe: false,
    category: "Networking"
  },
  ap: { 
    label: "Access Point", 
    baseCable: 40, 
    icon: Wifi,
    color: "from-green-500 to-teal-500",
    poe: true,
    category: "Wireless"
  },
  voip: { 
    label: "VoIP Phone", 
    baseCable: 30, 
    icon: Phone,
    color: "from-purple-500 to-violet-500",
    poe: true,
    category: "Communications"
  }
};

// Icon mapping for rooms
const getRoomIcon = (iconName) => {
  switch(iconName) {
    case 'Home': return Home;
    case 'Building': return Building;
    case 'TreePine': return TreePine;
    default: return Home;
  }
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [setupStep, setSetupStep] = useState('welcome');
  const [rooms, setRooms] = useState(defaultRooms);
  const [customRoomName, setCustomRoomName] = useState('');
  const [selectedCable, setSelectedCable] = useState('cat6');
  const [wastageFactor, setWastageFactor] = useState(15);
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [devices, setDevices] = useState([]);
  const [newDeviceType, setNewDeviceType] = useState('data');
  const [deviceName, setDeviceName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [cableLength, setCableLength] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('planner');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stats, setStats] = useState({
    totalLength: 0,
    totalPorts: 0,
    totalCost: 0,
    poeBudget: 0
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('cableiq_rooms', JSON.stringify(rooms));
  }, [rooms]);
  
  useEffect(() => {
    localStorage.setItem('cableiq_projects', JSON.stringify(projects));
  }, [projects]);
  
  useEffect(() => {
    localStorage.setItem('cableiq_current_project', JSON.stringify(currentProject));
  }, [currentProject]);
  
  useEffect(() => {
    localStorage.setItem('cableiq_devices', JSON.stringify(devices));
  }, [devices]);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update stats whenever devices change
  useEffect(() => {
    const totalLength = devices.reduce((sum, d) => sum + (d.cableLength || 35), 0);
    const totalPorts = devices.length;
    const totalCost = totalLength * cableStandards[selectedCable].price * (1 + wastageFactor / 100);
    const poeBudget = devices.filter(d => deviceTypes[d.type]?.poe).length * 15;
    setStats({ totalLength, totalPorts, totalCost, poeBudget });
  }, [devices, selectedCable, wastageFactor]);

  const formatKES = (amount) => `KES ${Math.round(amount).toLocaleString()}`;

  const addCustomRoom = () => {
    if (!customRoomName.trim()) return;
    setRooms([...rooms, { id: Date.now(), name: customRoomName, icon: "Home" }]);
    setCustomRoomName('');
  };

  const removeRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const addDevice = () => {
    if (!deviceName.trim()) {
      alert("Please enter a device name");
      return;
    }
    if (!selectedRoom) {
      alert("Please select a room");
      return;
    }
    
    const newDevice = {
      id: Date.now(),
      name: deviceName,
      type: newDeviceType,
      room: selectedRoom,
      cableLength: cableLength ? parseFloat(cableLength) : 35,
      ports: 1,
      poe: deviceTypes[newDeviceType].poe
    };
    setDevices([...devices, newDevice]);
    setDeviceName('');
    setCableLength('');
    setSelectedRoom('');
  };

  const removeDevice = (id) => {
    setDevices(devices.filter(device => device.id !== id));
  };

  const createNewProject = () => {
    if (!newProjectName.trim()) return;
    const newProject = {
      id: Date.now(),
      name: newProjectName,
      date: new Date().toISOString().split('T')[0],
      devices: devices.length,
      cableLength: stats.totalLength,
      cost: stats.totalCost
    };
    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setShowNewProject(false);
    setNewProjectName('');
    setSetupStep('rooms');
  };

  const exportBOM = () => {
    const cableStandard = cableStandards[selectedCable];
    let csvContent = `"CABLEIQ - PROFESSIONAL BILL OF MATERIALS"\n`;
    csvContent += `"Generated: ${new Date().toLocaleString()}"\n`;
    csvContent += `"Project: ${currentProject?.name || 'New Project'}"\n`;
    csvContent += `"Cable Type: ${cableStandard.name} (${cableStandard.speed})"\n`;
    csvContent += `"Wastage Factor: ${wastageFactor}%"\n`;
    csvContent += `"Exchange Rate: 1 USD = ${USD_TO_KES} KES"\n\n`;
    csvContent += `"SUMMARY","Value"\n`;
    csvContent += `"Total Devices",${devices.length}\n`;
    csvContent += `"Total Cable Length",${stats.totalLength} meters\n`;
    csvContent += `"Cable with Waste",${Math.round(stats.totalLength * (1 + wastageFactor / 100))} meters\n`;
    csvContent += `"Total Ports",${stats.totalPorts}\n`;
    csvContent += `"PoE Budget",${stats.poeBudget}W\n`;
    csvContent += `"Estimated Cost",${formatKES(stats.totalCost)}\n\n`;
    csvContent += `"MATERIALS LIST","Quantity","Unit","Unit Price","Total"\n`;
    csvContent += `"${cableStandard.name} Cable",${Math.round(stats.totalLength * (1 + wastageFactor / 100))},"meters",${Math.round(cableStandard.price)},${formatKES(stats.totalCost)}\n`;
    csvContent += `"Cable Box (305m)",${Math.ceil(stats.totalLength / 305)},"boxes","-","-"\n`;
    csvContent += `"Keystone Jacks",${devices.length},"pieces","150",${formatKES(devices.length * 150)}\n`;
    csvContent += `"Patch Cords",${devices.length},"pieces","450",${formatKES(devices.length * 450)}\n`;
    csvContent += `"Faceplates",${Math.ceil(devices.length / 2)},"pieces","200",${formatKES(Math.ceil(devices.length / 2) * 200)}\n`;
    csvContent += `"Patch Panel (24-port)",${Math.ceil(devices.length / 24)},"units","4500",${formatKES(Math.ceil(devices.length / 24) * 4500)}\n\n`;
    csvContent += `"DEVICES BY ROOM","Type","Cable Length","PoE"\n`;
    devices.forEach(d => {
      csvContent += `"${d.room}","${d.name} (${deviceTypes[d.type]?.label})",${d.cableLength}m,"${d.poe ? 'Yes' : 'No'}"\n`;
    });
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BOM_${currentProject?.name || 'Project'}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const totalDevicesByRoom = (roomName) => {
    return devices.filter(d => d.room === roomName).length;
  };

  const whatYouCanPlan = [
    { icon: Camera, title: "CCTV Planning", desc: "Calculate cable runs for IP and analog cameras", color: "from-red-500 to-rose-500" },
    { icon: Network, title: "Data Points", desc: "Plan ethernet drops for workstations and servers", color: "from-blue-500 to-indigo-500" },
    { icon: Wifi, title: "Access Points", desc: "Position wireless APs with proper cable routing", color: "from-green-500 to-teal-500" },
    { icon: Phone, title: "VoIP / Phones", desc: "Route structured cabling for desk phones", color: "from-purple-500 to-violet-500" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'}`}>
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">BOM Exported Successfully!</span>
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      )}
    
      {/* Header */}
      <header className={`sticky top-0 z-20 backdrop-blur-xl border-b transition-all duration-300 ${darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2.5 rounded-xl shadow-lg">
                  <Cable className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">CableIQ</h1>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Professional Structured Cabling Planner</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1.5 rounded-lg text-xs font-mono ${darkMode ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-green-600'}`}>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                ONLINE
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowNewProject(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Welcome Section */}
        {setupStep === 'welcome' && (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="inline-block p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-2xl mb-6">
                <Cable className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                Structured Cabling Planner
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Plan your installation before you pull a single cable. Map out CCTV cameras, data points, access points, and more.
              </p>
            </div>

            {/* What You Can Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {whatYouCanPlan.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`relative group cursor-pointer transition-all duration-500 ${hoveredCard === i ? 'scale-105' : 'scale-100'}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    <div className={`relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} shadow-xl`}>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      <div className="mt-4 flex items-center text-blue-500 text-sm font-medium">
                        <span>Plan now</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setSetupStep('rooms')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl text-lg flex items-center space-x-3 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start New Project</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Setup Wizard - Rooms */}
        {setupStep === 'rooms' && (
          <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm shadow-xl`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="relative p-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                <MapPin className="w-6 h-6 text-blue-500" />
                <span>Project Setup</span>
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select rooms or areas where devices will be installed</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {rooms.map(room => {
                  const IconComponent = getRoomIcon(room.icon);
                  const deviceCount = totalDevicesByRoom(room.name);
                  return (
                    <div key={room.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${darkMode ? 'border-gray-600 bg-gray-700/50' : 'border-gray-200 bg-gray-50'} group hover:shadow-lg`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{room.name}</span>
                          {deviceCount > 0 && (
                            <span className="text-xs text-blue-500 block">{deviceCount} device{deviceCount !== 1 ? 's' : ''}</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => removeRoom(room.id)} className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center space-x-3 mb-8">
                <input
                  type="text"
                  value={customRoomName}
                  onChange={(e) => setCustomRoomName(e.target.value)}
                  placeholder="Custom room name..."
                  className={`flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomRoom()}
                />
                <button onClick={addCustomRoom} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg">
                  Add Room
                </button>
              </div>
              
              <div className="flex justify-end">
                <button onClick={() => setSetupStep('cable')} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center space-x-2 shadow-lg">
                  <span>Continue to Cable</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Setup Wizard - Cable */}
        {setupStep === 'cable' && (
          <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm shadow-xl`}>
            <div className="relative p-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                <Cable className="w-6 h-6 text-blue-500" />
                <span>Primary Cable Standard</span>
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select the cable type that best fits your requirements</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {Object.entries(cableStandards).map(([key, standard]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedCable(key)}
                    className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 hover:scale-105 ${
                      selectedCable === key 
                        ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 shadow-xl' 
                        : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {standard.recommended && (
                      <div className="mb-2">
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-semibold">
                          <Star className="w-3 h-3" />
                          <span>Recommended</span>
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-bold text-xl bg-gradient-to-r ${standard.color} bg-clip-text text-transparent`}>{standard.name}</span>
                      {selectedCable === key && <CheckCircle className="w-6 h-6 text-blue-500" />}
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Gauge className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{standard.speed}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{standard.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs font-semibold text-blue-500`}>{formatKES(standard.price)}/m</span>
                      </div>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{standard.description}</p>
                  </div>
                ))}
              </div>

              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Wastage / Slack Factor</h3>
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { value: 5, label: "Tight", desc: "Minimal waste" },
                  { value: 15, label: "Standard", desc: "Recommended" },
                  { value: 30, label: "Generous", desc: "Extra slack" }
                ].map(factor => (
                  <button
                    key={factor.value}
                    onClick={() => setWastageFactor(factor.value)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      wastageFactor === factor.value
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                        : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {factor.value}% <span className="text-xs opacity-75">({factor.label})</span>
                  </button>
                ))}
              </div>

              <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong className="text-blue-500">Pro Tip:</strong> Adding {wastageFactor}% waste factor accounts for vertical rises, service loops, and termination slack.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setSetupStep('rooms')} className={`px-6 py-3 rounded-xl font-medium transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Back
                </button>
                <button onClick={() => setSetupStep('devices')} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center space-x-2 shadow-lg">
                  <span>Continue to Devices</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Setup Wizard - Devices */}
        {setupStep === 'devices' && (
          <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80 border-gray-200'} backdrop-blur-sm shadow-xl`}>
            <div className="relative p-8">
              <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
                <Server className="w-6 h-6 text-blue-500" />
                <span>Add Network Devices</span>
              </h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add all devices that will be connected to your network</p>
              
              {/* Stats Dashboard */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500 mb-1">Total Devices</p>
                  <p className="text-2xl font-bold text-blue-500">{devices.length}</p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500 mb-1">Cable Length</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.totalLength}m</p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500 mb-1">PoE Budget</p>
                  <p className="text-2xl font-bold text-blue-500">{stats.poeBudget}W</p>
                </div>
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <p className="text-xs text-gray-500 mb-1">Est. Cost</p>
                  <p className="text-2xl font-bold text-green-500">{formatKES(stats.totalCost)}</p>
                </div>
              </div>

              {/* Add Device Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Room</label>
                  <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.id} value={room.name}>{room.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Device Type</label>
                  <select value={newDeviceType} onChange={(e) => setNewDeviceType(e.target.value)} className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="cctv">CCTV Camera</option>
                    <option value="data">Data Point</option>
                    <option value="ap">Access Point</option>
                    <option value="voip">VoIP Phone</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Device Name</label>
                  <input type="text" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="e.g., Lobby Camera" className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cable Length (m)</label>
                  <input type="number" value={cableLength} onChange={(e) => setCableLength(e.target.value)} placeholder="Auto" className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
                </div>
                <div className="flex items-end">
                  <button onClick={addDevice} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2 px-4 rounded-lg w-full shadow-lg">
                    Add Device
                  </button>
                </div>
              </div>

              {/* Devices List */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Planned Devices ({devices.length})</h4>
                {devices.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No devices added yet. Add your first device above.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {devices.map(device => {
                      const DeviceIcon = deviceTypes[device.type].icon;
                      return (
                        <div key={device.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${deviceTypes[device.type].color}`}>
                              <DeviceIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{device.room} • {deviceTypes[device.type].label} • {device.cableLength}m • {device.poe ? 'PoE' : 'Non-PoE'}</p>
                            </div>
                          </div>
                          <button onClick={() => removeDevice(device.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button onClick={() => setSetupStep('cable')} className={`px-6 py-3 rounded-xl font-medium transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  Back
                </button>
                <button onClick={() => {
                  if (currentProject) {
                    alert(`Project "${currentProject.name}" ready! View materials in BOM export.`);
                  } else {
                    setShowNewProject(true);
                  }
                }} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center space-x-2 shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Setup</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Project Name</label>
                <input 
                  type="text" 
                  value={newProjectName} 
                  onChange={(e) => setNewProjectName(e.target.value)} 
                  placeholder="e.g., Office Building - Phase 1" 
                  className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} 
                  autoFocus 
                />
              </div>
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Exchange Rate: 1 USD = {USD_TO_KES} KES</p>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={createNewProject} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3 px-4 rounded-xl flex-1 transition-all shadow-lg">
                Create Project
              </button>
              <button onClick={() => setShowNewProject(false)} className={`${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} font-medium py-3 px-4 rounded-xl flex-1 transition-all`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;