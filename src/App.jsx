{/* Header */}
<header className={`sticky top-0 z-20 backdrop-blur-xl border-b transition-all duration-300 ${darkMode ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200'}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex items-center justify-between flex-wrap gap-3">
      {/* Logo Section - Clickable Home */}
      <div 
        onClick={() => setCurrentView('welcome')}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-lg opacity-60 animate-pulse group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 p-2.5 rounded-xl shadow-lg">
            <Cable className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">CableIQ</h1>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Professional Structured Cabling Planner</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Home Button */}
        <button 
          onClick={() => setCurrentView('welcome')}
          className={`p-2.5 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
            currentView === 'welcome' 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
              : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Go to Home"
        >
          <HomeIcon className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Home</span>
        </button>
        
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
      </div>
    </div>
    
    {/* Navigation Tabs - Only show when not on welcome page */}
    {currentView !== 'welcome' && (
      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          onClick={() => setCurrentView('planner')} 
          className={`px-4 py-2 rounded-lg font-medium transition-all ${currentView === 'planner' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Planner</span>
          </div>
        </button>
        <button 
          onClick={() => setShowLoadProjectModal(true)} 
          className={`px-4 py-2 rounded-lg font-medium transition-all ${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </div>
        </button>
        <button 
          onClick={() => setCurrentView('materials')} 
          className={`px-4 py-2 rounded-lg font-medium transition-all ${currentView === 'materials' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Materials</span>
          </div>
        </button>
        <button 
          onClick={() => setCurrentView('preview')} 
          className={`px-4 py-2 rounded-lg font-medium transition-all ${currentView === 'preview' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </div>
        </button>
      </div>
    )}
  </div>
</header>