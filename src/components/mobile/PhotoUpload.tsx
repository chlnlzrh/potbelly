'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PhotoUploadProps {
  onUpload?: (photo: any) => void
  onClose?: () => void
}

export function PhotoUpload({ onUpload, onClose }: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    location: '',
    uploadedBy: 'Pooja'
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { id: 'general', label: 'General', icon: '📋' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'bar', label: 'Bar Area', icon: '🍺' },
    { id: 'electrical', label: 'Electrical', icon: '⚡' },
    { id: 'plumbing', label: 'Plumbing', icon: '🔧' },
    { id: 'exterior', label: 'Exterior', icon: '🏠' },
    { id: 'progress', label: 'Progress', icon: '📈' }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Auto-generate title from timestamp
      const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
      setFormData(prev => ({
        ...prev,
        title: prev.title || `Photo ${timestamp}`
      }))
    }
  }

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleVideoCapture = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click()
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('title', formData.title)
      uploadFormData.append('description', formData.description)
      uploadFormData.append('category', formData.category)
      uploadFormData.append('location', formData.location)
      uploadFormData.append('uploadedBy', formData.uploadedBy)

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: uploadFormData
      })

      if (response.ok) {
        const result = await response.json()
        onUpload?.(result.data)
        
        // Reset form
        setSelectedFile(null)
        setPreview('')
        setFormData({
          title: '',
          description: '',
          category: 'general',
          location: '',
          uploadedBy: 'Pooja'
        })
        
        onClose?.()
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload photo. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreview('')
    setFormData(prev => ({ ...prev, title: '', description: '' }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold">UPLOAD PHOTO</h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Capture Options */}
          {!selectedFile && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleCameraCapture}
                className="h-24 flex flex-col items-center justify-center space-y-2"
                variant="outline"
              >
                <Camera className="h-6 w-6" />
                <span className="text-xs">Take Photo</span>
              </Button>
              
              <Button 
                onClick={handleVideoCapture}
                className="h-24 flex flex-col items-center justify-center space-y-2"
                variant="outline"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">Upload Video</span>
              </Button>
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Preview */}
          {preview && (
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 bg-white bg-opacity-80"
                    onClick={clearSelection}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Fields */}
          {selectedFile && (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter photo title..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe what's shown in this photo..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={formData.category === category.id ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Where was this taken? (e.g., Kitchen, Bar Area)"
                />
              </div>

              {/* Upload Button */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={clearSelection}
                  variant="outline"
                  className="flex-1"
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1"
                  disabled={uploading || !formData.title.trim()}
                >
                  {uploading ? (
                    <>
                      <Upload className="h-3 w-3 mr-1 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}