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
  TrendingUp,
  Edit2,
  Save,
  X,
  Zap,
  Home,
  Building,
  TreePine,
  ArrowRight,
  DollarSign,
  Gauge,
  Award,
  Shield,
  AlertCircle
} from 'lucide-react';

// Cable Standards
const cableStandards = {
  cat5e: {
    name: "Cat5e",
    speed: "Up to 1 Gbps",
    distance: "100m",
    price: 0.3,
    priceUnit: "$/m",
    description: "Budget option",
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    maxDistance: 100
  },
  cat6: {
    name: "Cat6",
    speed: "Up to 10 Gbps",
    distance: "55m",
    price: 0.5,
    priceUnit: "$/m",
    description: "Recommended",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    maxDistance: 55
  },
  cat6a: {
    name: "Cat6A",
    speed: "Up to 10 Gbps",
    distance: "100m",
    price: 0.85,
    priceUnit: "$/m",
    description: "Best performance",
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    maxDistance: 100
  },
  fiber: {
    name: "Fiber",
    speed: "Up to 100 Gbps",
    distance: "2000m",
    price: 2.5,
    priceUnit: "$/m",
    description: "Backbone / long runs",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    maxDistance: 2000
  }
};

// Default rooms
const defaultRooms = [
  { id: 1, name: "Garage", icon: "Home" },
  { id: 2, name: "Entrance/Lobby", icon: "Building" },
  { id: 3, name: "Backyard", icon: "TreePine" }
];

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [setupStep, setSetupStep] = useState('rooms'); // 'rooms', 'cable', 'devices'
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('cableiq_rooms');
    return saved ? JSON.parse(saved) : defaultRooms;
  });
  const [customRoomName, setCustomRoomName] = useState('');
  const [selectedCable, setSelectedCable] = useState('cat6');
  const [wastageFactor, setWastageFactor] = useState(15);
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('cableiq_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentProject, setCurrentProject] = useState(() => {
    const saved = localStorage.getItem('cableiq_current_project');
    return saved ? JSON.parse(saved) : null;
  });
  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem('cableiq_devices');
    return saved ? JSON.parse(saved) : [];
  });
  const [newDeviceType, setNewDeviceType] = useState('data');
  const [deviceName, setDeviceName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [cableLength, setCableLength] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [buildingConfig, setBuildingConfig] = useState({
    width: 20,
    height: 15,
    floors: 1,
    ceilingHeight: 3,
    serverRoomDistance: 25,
    serviceLoop: 3
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

  // Add custom room
  const addCustomRoom = () => {
    if (!customRoomName.trim()) return;
    const newRoom = {
      id: Date.now(),
      name: customRoomName,
      icon: "Home"
    };
    setRooms([...rooms, newRoom]);
    setCustomRoomName('');
  };

  // Remove room
  const removeRoom = (roomId) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  // Calculations
  const calculateTotalCableLength = () => {
    return devices.reduce((total, device) => total + (device.cableLength || 35), 0);
  };

  const calculateTotalPorts = () => {
    return devices.reduce((total, device) => total + (device.ports || 1), 0);
  };

  const calculateTotalPoEBudget = () => {
    const poeDevices = devices.filter(d => d.poe !== false);
    return poeDevices.length * 15;
  };

  const calculateMaterials = () => {
    const totalCableRaw = calculateTotalCableLength();
    const totalCable = totalCableRaw * (1 + wastageFactor / 100);
    const cableBoxes = Math.ceil(totalCable / 305);
    const keystoneJacks = calculateTotalPorts();
    const patchCords = calculateTotalPorts();
    const faceplates = Math.ceil(devices.length / 2);
    const patchPanels = Math.ceil(calculateTotalPorts() / 24);
    const cableManagers = Math.ceil(patchPanels / 2);
    const totalCost = totalCable * cableStandards[selectedCable].price;
    
    return { 
      totalCableRaw,
      totalCableWithWaste: totalCable,
      cableBoxes, 
      keystoneJacks, 
      patchCords, 
      faceplates, 
      patchPanels,
      cableManagers,
      totalCost
    };
  };

  // Export BOM
  const exportBOM = () => {
    const materials = calculateMaterials();
    const projectName = currentProject?.name || "Unnamed Project";
    const date = new Date().toLocaleString();
    const cableStandard = cableStandards[selectedCable];
    
    let csvContent = `"CABLEIQ BILL OF MATERIALS"\n`;
    csvContent += `"Project: ${projectName}"\n`;
    csvContent += `"Date: ${date}"\n`;
    csvContent += `"Cable Standard: ${cableStandard.name}"\n`;
    csvContent += `"Wastage Factor: ${wastageFactor}%"\n`;
    csvContent += `"Total Devices: ${devices.length}"\n`;
    csvContent += `"Total Ports: ${calculateTotalPorts()}"\n`;
    csvContent += `"Total Cable Length: ${Math.round(materials.totalCableRaw)} meters"\n`;
    csvContent += `"Total Cable with Waste: ${Math.round(materials.totalCableWithWaste)} meters"\n`;
    csvContent += `"Estimated Cable Cost: $${Math.round(materials.totalCost)}"\n\n`;
    
    csvContent += `"MATERIALS LIST"\n`;
    csvContent += `"Item","Quantity","Unit","Notes"\n`;
    csvContent += `"${cableStandard.name} Cable",${Math.round(materials.totalCableWithWaste)},"meters","${cableStandard.description}"\n`;
    csvContent += `"${cableStandard.name} Cable Box (305m)",${materials.cableBoxes},"boxes","Add 10-15% spare for waste"\n`;
    csvContent += `"Keystone Jack (${cableStandard.name})",${materials.keystoneJacks},"pieces","One per port"\n`;
    csvContent += `"Patch Cord (${cableStandard.name})",${materials.patchCords},"pieces","2m length recommended"\n`;
    csvContent += `"Faceplate (2-port)",${materials.faceplates},"pieces","Assuming 2 ports per faceplate"\n`;
    csvContent += `"Patch Panel (24-port)",${materials.patchPanels},"units","${cableStandard.name}, 19\" rack mount"\n`;
    csvContent += `"Cable Manager",${materials.cableManagers},"units","1U horizontal"\n\n`;
    
    csvContent += `"ROOMS"\n`;
    rooms.forEach(room => {
      csvContent += `"${room.name}"\n`;
    });
    
    csvContent += `\n"DEVICE LIST BY ROOM"\n`;
    const devicesByRoom = {};
    devices.forEach(device => {
      const room = device.room || "Unassigned";
      if (!devicesByRoom[room]) devicesByRoom[room] = [];
      devicesByRoom[room].push(device);
    });
    for (const [room, roomDevices] of Object.entries(devicesByRoom)) {
      csvContent += `\n"${room}"\n`;
      csvContent += `"Device Name","Type","Cable Length (m)","PoE"\n`;
      roomDevices.forEach(device => {
        csvContent += `"${device.name}","${device.type}",${device.cableLength},"${device.poe !== false ? 'Yes' : 'No'}"\n`;
      });
    }
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BOM_${projectName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
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
    const calculatedLength = (buildingConfig.width + buildingConfig.height) * 1.5 + 
                             buildingConfig.serverRoomDistance + 
                             buildingConfig.serviceLoop;
    const newDevice = {
      id: Date.now(),
      name: deviceName,
      type: newDeviceType,
      room: selectedRoom,
      cableLength: cableLength ? parseFloat(cableLength) : Math.round(calculatedLength),
      ports: 1,
      poe: newDeviceType !== 'data'
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
      cableStandard: selectedCable,
      wastageFactor: wastageFactor,
      rooms: rooms,
      status: "planned"
    };
    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setShowNewProject(false);
    setNewProjectName('');
    setSetupStep('rooms');
  };

  const continueToCable = () => {
    if (rooms.length === 0) {
      alert("Please add at least one room");
      return;
    }
    setSetupStep('cable');
  };

  const continueToDevices = () => {
    setSetupStep('devices');
  };

  const finishSetup = () => {
    if (currentProject) {
      setActiveTab('planner');
    } else {
      setShowNewProject(true);
    }
  };

  const materials = calculateMaterials();
  const cableStandard = cableStandards[selectedCable];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>BOM Exported Successfully!</span>
          </div>
        </div>
      )}
    
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Cable className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CableIQ</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Structured Cabling Planner</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setShowNewProject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Setup Wizard */}
        {(!currentProject || setupStep !== 'devices') && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Project Setup</h2>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${setupStep === 'rooms' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <div className={`w-12 h-0.5 ${setupStep === 'cable' || setupStep === 'devices' ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${setupStep === 'cable' ? 'bg-blue-600 text-white' : setupStep === 'devices' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <div className={`w-12 h-0.5 ${setupStep === 'devices' ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${setupStep === 'devices' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>3</div>
              </div>
            </div>

            {/* Step 1: Rooms */}
            {setupStep === 'rooms' && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Select Rooms / Areas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {rooms.map(room => (
                    <div key={room.id} className={`flex items-center justify-between p-3 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center space-x-2">
                        {room.name === "Garage" && <Home className="w-4 h-4 text-gray-500" />}
                        {room.name === "Entrance/Lobby" && <Building className="w-4 h-4 text-gray-500" />}
                        {room.name === "Backyard" && <TreePine className="w-4 h-4 text-gray-500" />}
                        {!["Garage", "Entrance/Lobby", "Backyard"].includes(room.name) && <Home className="w-4 h-4 text-gray-500" />}
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>{room.name}</span>
                      </div>
                      <button onClick={() => removeRoom(room.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  <input
                    type="text"
                    value={customRoomName}
                    onChange={(e) => setCustomRoomName(e.target.value)}
                    placeholder="Custom room name..."
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomRoom()}
                  />
                  <button onClick={addCustomRoom} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    Add
                  </button>
                </div>
                <div className="flex justify-end">
                  <button onClick={continueToCable} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center space-x-2">
                    <span>Continue to Cable</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Cable Standard */}
            {setupStep === 'cable' && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>PRIMARY CABLE STANDARD</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {Object.entries(cableStandards).map(([key, standard]) => (
                    <div
                      key={key}
                      onClick={() => setSelectedCable(key)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                        selectedCable === key 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold text-lg ${standard.color.split(' ')[2]}`}>{standard.name}</span>
                        {selectedCable === key && <CheckCircle className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Gauge className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{standard.speed}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{standard.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>${standard.price}/m</span>
                        </div>
                      </div>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{standard.description}</p>
                    </div>
                  ))}
                </div>

                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Wastage / Slack Factor</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {[5, 15, 30].map(factor => (
                    <button
                      key={factor}
                      onClick={() => setWastageFactor(factor)}
                      className={`px-6 py-2 rounded-lg font-medium transition-all ${
                        wastageFactor === factor
                          ? 'bg-blue-600 text-white'
                          : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {factor}% {factor === 5 ? '(tight)' : factor === 15 ? '(standard)' : '(generous)'}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setSetupStep('rooms')} className={`px-6 py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Back
                  </button>
                  <button onClick={continueToDevices} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg flex items-center space-x-2">
                    <span>Continue to Devices</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Devices */}
            {setupStep === 'devices' && (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Add Devices</h3>
                
                {/* Device Form */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Room</label>
                    <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="">Select Room</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.name}>{room.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Device Type</label>
                    <select value={newDeviceType} onChange={(e) => setNewDeviceType(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                      <option value="cctv">CCTV Camera</option>
                      <option value="data">Data Point</option>
                      <option value="ap">Access Point</option>
                      <option value="voip">VoIP Phone</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Device Name</label>
                    <input type="text" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="e.g., Main Lobby Cam" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Cable Length (m)</label>
                    <input type="number" value={cableLength} onChange={(e) => setCableLength(e.target.value)} placeholder="Auto" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
                  </div>
                  <div className="flex items-end">
                    <button onClick={addDevice} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full">Add Device</button>
                  </div>
                </div>

                {/* Devices List */}
                <div className="mb-6">
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Planned Devices ({devices.length})</h4>
                  {devices.length === 0 ? (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No devices added yet. Add your first device above.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {devices.map(device => (
                        <div key={device.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{device.room} • {device.type} • {device.cableLength}m • {device.poe ? 'PoE' : 'Non-PoE'}</p>
                          </div>
                          <button onClick={() => removeDevice(device.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cable Summary */}
                <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Devices</p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{devices.length}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Ports</p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{calculateTotalPorts()}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cable Length</p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{calculateTotalCableLength()}m</p>
                    </div>
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Est. Cost</p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${Math.round(calculateTotalCableLength() * cableStandard.price)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setSetupStep('cable')} className={`px-6 py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    Back
                  </button>
                  <button onClick={finishSetup} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Complete Setup</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats when project exists */}
        {currentProject && setupStep === 'devices' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Cable</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{calculateTotalCableLength()} m</p>
                </div>
                <Cable className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Ports</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{calculateTotalPorts()}</p>
                </div>
                <Network className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Est. Cost</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${Math.round(calculateTotalCableLength() * cableStandard.price)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cable Boxes</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{materials.cableBoxes}</p>
                </div>
                <Server className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl max-w-md w-full p-6`}>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Project Name</label>
                <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g., Office Building - Phase 1" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} autoFocus />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button onClick={createNewProject} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex-1">Create Project</button>
              <button onClick={() => setShowNewProject(false)} className={`${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border font-medium py-2 px-4 rounded-lg flex-1`}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;