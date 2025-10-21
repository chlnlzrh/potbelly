'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (isDesktop) {
    return (
      <div className="h-screen bg-gray-50 flex">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col p-6">
          <h1 className="text-xs font-bold text-gray-900 mb-6">POTBELLY BUILD COMMAND CENTER</h1>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-xs font-bold mb-2">Project Overview</h3>
              <p className="text-xs text-gray-600">Desktop Command Center for Arushi</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-xs font-bold mb-2">System Status</h3>
              <p className="text-xs text-green-600">✅ System Running Successfully</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold mb-4">Welcome to Potbelly Build Management</h2>
          <p className="text-gray-600 mb-4">Desktop Command Center is running successfully!</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-lg border">
              <h3 className="font-bold mb-2">Task Management</h3>
              <p className="text-sm text-gray-600">Complete project oversight</p>
            </div>
            <div className="p-6 bg-white rounded-lg border">
              <h3 className="font-bold mb-2">Team Coordination</h3>
              <p className="text-sm text-gray-600">Contractor management</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xs font-bold text-gray-900">MY RESTAURANT BUILD</h1>
        <p className="text-xs text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })}
        </p>
      </header>

      <div className="flex-1 p-4">
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-xs font-bold mb-3">PROJECT OVERVIEW</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-bold">78% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-xs font-bold mb-3">MOBILE PWA FOR POOJA</h2>
            <p className="text-xs text-gray-600 mb-3">iPhone 17 Pro Max optimized interface</p>
            <div className="grid grid-cols-3 gap-2">
              {['Home', 'Tasks', 'Team'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`p-2 rounded text-xs ${
                    activeTab === tab.toLowerCase() 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-xs font-bold mb-3">SYSTEM STATUS</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Server Running Successfully</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Mobile & Desktop Interfaces Ready</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Data Management Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">🎉 Potbelly Build Management System</p>
          <p className="text-xs text-gray-400">Ready for Pooja and Arushi</p>
        </div>
      </div>
    </div>
  )
}