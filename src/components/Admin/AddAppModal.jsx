import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from '../../services/api';

const AddAppModal = ({ 
  isOpen, 
  onClose, 
  initialData = null, 
  onAppAdded 
}) => {
  // Category options
  const CATEGORY_CHOICES = [
    { value: 'GAMES', label: 'Games' },
    { value: 'PRODUCTIVITY', label: 'Productivity' },
    { value: 'SOCIAL', label: 'Social Media' },
    { value: 'UTILITY', label: 'Utility' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Initial form state
  const getInitialFormData = () => ({
    name: '',
    description: '',
    package_name: '',
    points_value: 10,
    category: 'OTHER',
    app_icon: null,
    playstore_link: '',
    is_active: true
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Reset form when modal opens or closes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsEditing(true);
    } else {
      setFormData(getInitialFormData());
      setIsEditing(false);
    }
    // Reset selected file
    setSelectedFile(null);
  }, [initialData, isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      app_icon: file
    }));
  };

  // Submit form for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const appData = new FormData();
    Object.keys(formData).forEach(key => {
      // Only append non-null values
      if (formData[key] !== null && formData[key] !== '') {
        // Special handling for app_icon
        if (key === 'app_icon') {
          // If no new file selected, don't append anything
          // This will keep the existing icon
          if (selectedFile) {
            appData.append(key, formData[key]);
          }
        } else {
          appData.append(key, formData[key]);
        }
      }
    });

    try {
      if (isEditing) {
        // Update existing app
        await api.put(`apps/${formData.id}/update/`, appData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('App updated successfully');
      } else {
        // Create new app
        await api.post('apps/upload/', appData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('App added successfully');
      }
      
      // Close modal and refresh apps
      onAppAdded();
      onClose();
    } catch (error) {
      console.error('Error submitting app:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        toast.error(error.response.data.message || 'Submission failed');
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response received from server');
      } else {
        // Something happened in setting up the request
        toast.error('Error: ' + error.message);
      }
    }
  };

  // If modal is not open, return null
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          {isEditing ? 'Edit App' : 'Add New App'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full bg-gray-800 text-gray-200"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="package_name" className="block font-medium text-gray-300">
              Package Name
            </label>
            <input
              type="text"
              id="package_name"
              name="package_name"
              value={formData.package_name}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label htmlFor="points_value" className="block font-medium text-gray-300">
              Points
            </label>
            <input
              type="number"
              id="points_value"
              name="points_value"
              value={formData.points_value}
              onChange={handleChange}
              min="1"
              className="border rounded px-3 py-2 w-full bg-gray-800 text-gray-200"
            />
          </div>

          <div>
            <label htmlFor="category" className="block font-medium text-gray-300">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full bg-gray-800 text-gray-200"
            >
              {CATEGORY_CHOICES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="app_icon" className="block font-medium text-gray-300">
              App Icon
            </label>
            <input
              type="file"
              id="app_icon"
              name="app_icon"
              onChange={handleFileChange}
              accept="image/*"
              className="border rounded px-3 py-2 w-full bg-gray-800 text-gray-200"
            />
            {selectedFile && (
              <p className="text-sm text-gray-400 mt-2">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="playstore_link" className="block font-medium text-gray-300">
              Play Store Link
            </label>
            <input
              type="url"
              id="playstore_link"
              name="playstore_link"
              value={formData.playstore_link}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full bg-gray-800 text-gray-200"
              placeholder="https://play.google.com/store/apps/details?id=..."
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="text-gray-300">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({
                  ...prev, 
                  is_active: e.target.checked
                }))}
                className="mr-2"
              />
              Active App
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-white text-black hover:bg-gray-200 font-bold py-2 px-4 rounded"
            >
              {isEditing ? 'Update App' : 'Add App'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-black hover:bg-gray-200 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppModal;