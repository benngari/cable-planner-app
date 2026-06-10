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
  CheckCircle
} from 'lucide-react';

// Device type configurations
const deviceTypes = {
  cctv: { icon: Camera, label: "CCTV Camera", baseCable: 45, color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400", defaultPorts: 1 },
  data: { icon: Network, label: "Data Point", baseCable: 35, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", defaultPorts: 1 },
  ap: { icon: Wifi, label: "Access Point", baseCable: 40, color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400", defaultPorts: 1 },
  voip: { icon: Phone, label: "VoIP Phone", baseCable: 30, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", defaultPorts: 1 }
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [activeTab, setActiveTab] = useState('planner');
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
  const [cableLength, setCableLength] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [roomDimensions, setRoomDimensions] = useState({ width: 20, height: 15, floors: 1 });

  // Save to localStorage whenever data changes
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

  // Calculations
  const calculateTotalCableLength = () => {
    return devices.reduce((total, device) => total + (device.cableLength || deviceTypes[device.type].baseCable), 0);
  };

  const calculateTotalPorts = () => {
    return devices.reduce((total, device) => total + (device.ports || deviceTypes[device.type].defaultPorts), 0);
  };

  const calculateMaterials = () => {
    const totalCable = calculateTotalCableLength();
    const cableBoxes = Math.ceil(totalCable / 305);
    const keystoneJacks = calculateTotalPorts();
    const patchCords = calculateTotalPorts();
    const faceplates = Math.ceil(devices.length / 2);
    const patchPanels = Math.ceil(calculateTotalPorts() / 24);
    
    return { totalCable, cableBoxes, keystoneJacks, patchCords, faceplates, patchPanels };
  };

  // Export BOM functionality - FIXED
  const exportBOM = () => {
    const materials = calculateMaterials();
    const projectName = currentProject?.name || "Unnamed Project";
    const date = new Date().toLocaleString();
    
    // Create the BOM content
    let bomContent = `CABLEIQ BILL OF MATERIALS\n`;
    bomContent += `====================================\n\n`;
    bomContent += `Project: ${projectName}\n`;
    bomContent += `Date: ${date}\n`;
    bomContent += `Total Devices: ${devices.length}\n`;
    bomContent += `Total Ports: ${calculateTotalPorts()}\n`;
    bomContent += `Total Cable Length: ${materials.totalCable} meters\n\n`;
    
    bomContent += `MATERIALS LIST\n`;
    bomContent += `------------------------------------\n`;
    bomContent += `Item                          | Qty    | Unit\n`;
    bomContent += `------------------------------------\n`;
    bomContent += `Cat6 UTP Cable                | ${materials.totalCable.toString().padEnd(6)} | meters\n`;
    bomContent += `Cat6 Cable Box (305m)         | ${materials.cableBoxes.toString().padEnd(6)} | boxes\n`;
    bomContent += `Keystone Jack (Cat6)          | ${materials.keystoneJacks.toString().padEnd(6)} | pieces\n`;
    bomContent += `Patch Cord (Cat6)             | ${materials.patchCords.toString().padEnd(6)} | pieces\n`;
    bomContent += `Faceplate (2-port)            | ${materials.faceplates.toString().padEnd(6)} | pieces\n`;
    bomContent += `Patch Panel (24-port)         | ${materials.patchPanels.toString().padEnd(6)} | units\n\n`;
    
    bomContent += `DEVICE LIST\n`;
    bomContent += `------------------------------------\n`;
    devices.forEach((device, index) => {
      bomContent += `${index + 1}. ${device.name} - ${deviceTypes[device.type].label} (${device.cableLength}m, ${device.ports} port)\n`;
    });
    
    if (devices.length === 0) {
      bomContent += `No devices added yet.\n`;
    }
    
    bomContent += `\n====================================\n`;
    bomContent += `Generated by CableIQ - Structured Cabling Planner\n`;
    
    // Create and download file
    const blob = new Blob([bomContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BOM_${projectName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const addDevice = () => {
    if (!deviceName.trim()) {
      alert("Please enter a device name");
      return;
    }
    const newDevice = {
      id: Date.now(),
      name: deviceName,
      type: newDeviceType,
      cableLength: cableLength ? parseFloat(cableLength) : deviceTypes[newDeviceType].baseCable,
      ports: deviceTypes[newDeviceType].defaultPorts,
    };
    setDevices([...devices, newDevice]);
    setDeviceName('');
    setCableLength('');
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
      type: "Mixed",
      points: devices.length,
      cableLength: calculateTotalCableLength(),
      status: "planned"
    };
    setProjects([newProject, ...projects]);
    setCurrentProject(newProject);
    setShowNewProject(false);
    setNewProjectName('');
    setActiveTab('planner');
  };

  const loadProject = (project) => {
    setCurrentProject(project);
    setDevices([]);
    setActiveTab('planner');
  };

  const deleteProject = (projectId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this project?')) {
      const newProjects = projects.filter(p => p.id !== projectId);
      setProjects(newProjects);
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setDevices([]);
      }
    }
  };

  const materials = calculateMaterials();

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
        {/* Tabs */}
        <div className={`flex space-x-2 mb-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {['planner', 'projects', 'materials'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors relative capitalize ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                {tab === 'planner' && <MapPin className="w-4 h-4" />}
                {tab === 'projects' && <ClipboardList className="w-4 h-4" />}
                {tab === 'materials' && <Layers className="w-4 h-4" />}
                <span>{tab}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Planner Tab */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            {currentProject ? (
              <div className={`${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border rounded-xl p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>Active Project</p>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>{currentProject.name}</h2>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-12 text-center`}>
                <Cable className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Active Project</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Create a new project or select an existing one to start planning</p>
                <button onClick={() => setShowNewProject(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
                  Create New Project
                </button>
              </div>
            )}

            {currentProject && (
              <>
                {/* Building Config */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center space-x-2`}>
                    <Settings className="w-5 h-5" />
                    <span>Building Configuration</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Room Width (m)</label>
                      <input type="number" value={roomDimensions.width} onChange={(e) => setRoomDimensions({...roomDimensions, width: parseFloat(e.target.value)})} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Room Height (m)</label>
                      <input type="number" value={roomDimensions.height} onChange={(e) => setRoomDimensions({...roomDimensions, height: parseFloat(e.target.value)})} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Floors</label>
                      <input type="number" value={roomDimensions.floors} onChange={(e) => setRoomDimensions({...roomDimensions, floors: parseInt(e.target.value)})} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
                    </div>
                  </div>
                </div>

                {/* Add Device */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Add Device</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Device Type</label>
                      <select value={newDeviceType} onChange={(e) => setNewDeviceType(e.target.value)} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        {Object.entries(deviceTypes).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Device Name</label>
                      <input type="text" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="e.g., Lobby Camera" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Cable Length (m)</label>
                      <input type="number" value={cableLength} onChange={(e) => setCableLength(e.target.value)} placeholder="Auto-calc" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
                    </div>
                    <div className="flex items-end">
                      <button onClick={addDevice} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full">Add Device</button>
                    </div>
                  </div>
                </div>

                {/* Devices List */}
                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Planned Devices</h3>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Devices: {devices.length}</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Ports: {calculateTotalPorts()}</span>
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Total Cable: {calculateTotalCableLength()}m</span>
                    </div>
                  </div>
                  {devices.length === 0 ? (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No devices added yet. Add your first device above.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {devices.map(device => {
                        const DeviceIconComp = deviceTypes[device.type].icon;
                        return (
                          <div key={device.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${deviceTypes[device.type].color}`}>
                                <DeviceIconComp className="w-4 h-4" />
                              </div>
                              <div>
                                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{device.name}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{deviceTypes[device.type].label} • {device.cableLength}m cable • Ports: {device.ports}</p>
                              </div>
                            </div>
                            <button onClick={() => removeDevice(device.id)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Your Projects</h3>
            <div className="space-y-3">
              {projects.length === 0 ? (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No projects yet. Click "New Project" to create one.</p>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className={`flex items-center justify-between p-4 border rounded-lg transition-all cursor-pointer ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:shadow-md'}`} onClick={() => loadProject(project)}>
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.name}</p>
                      <div className={`flex items-center space-x-4 mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>{project.date}</span>
                        <span>{project.type}</span>
                        <span>{project.points} devices</span>
                        <span>{project.cableLength}m cable</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>Open</button>
                      <button onClick={(e) => deleteProject(project.id, e)} className="text-red-400 hover:text-red-600 text-sm">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && currentProject && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Materials List</h3>
              <button 
                onClick={exportBOM}
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} border font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2`}
              >
                <Download className="w-4 h-4" />
                <span>Export BOM</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Item</th>
                    <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quantity</th>
                    <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Unit</th>
                    <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  <tr className={darkMode ? 'text-gray-300' : ''}>
                    <td className="p-3">Cat6 UTP Cable</td>
                    <td className="p-3">{materials.totalCable}</td>
                    <td className="p-3">meters</td>
                    <td className={`p-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total cable length including service loops</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : ''}>
                    <td className="p-3">Cat6 Cable Box (305m)</td>
                    <td className="p-3">{materials.cableBoxes}</td>
                    <td className="p-3">boxes</td>
                    <td className={`p-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Add 10-15% spare for waste</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : ''}>
                    <td className="p-3">Keystone Jack (Cat6)</td>
                    <td className="p-3">{materials.keystoneJacks}</td>
                    <td className="p-3">pieces</td>
                    <td className={`p-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>One per port</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : ''}>
                    <td className="p-3">Patch Cord (Cat6)</td>
                    <td className="p-3">{materials.patchCords}</td>
                    <td className="p-3">pieces</td>
                    <td className={`p-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2m length recommended</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : ''}>
                    <td className="p-3">Faceplate (2-port)</td>
                    <td className="p-3">{materials.faceplates}</td>
                    <td className="p-3">pieces</td>
                    <td className={`p-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assuming 2 ports per faceplate</td>
                  </tr>
                  <tr className={darkMode ? 'text-gray-300' : ''}>
                    <td className="p-3">Patch Panel (24-port)</td>
                    <td className="p-3">{materials.patchPanels}</td>
                    <td className="p-3">units</td>
                    <td className={`p-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cat6, 19" rack mount</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'materials' && !currentProject && (
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-12 text-center`}>
            <FileText className={`w-16 h-16 ${darkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No Active Project</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Select or create a project to view materials</p>
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
                <input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="e.g., Office Renovation - Floor 3" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} autoFocus />
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