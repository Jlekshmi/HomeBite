import React, { useState } from 'react';

const ImageUpload = ({ label, currentImageUrl, onImageUpload }) => {
  const [preview, setPreview] = useState(currentImageUrl); // Show the current image
  const [tempPreview, setTempPreview] = useState(null); // Temporary preview for new image selection
  const [error, setError] = useState(''); // State to store validation errors

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    // Reset the input field to allow re-selecting the same file
    e.target.value = '';

    // Validation for file type and size
    if (!file) {
      setError('No file selected.');
      return;
    }

    if (!validTypes.includes(file.type)) {
      setError('Only JPG, PNG, and WEBP formats are allowed.');
      return;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5 MB.');
      return;
    }

    setError(''); // Clear previous errors

    // Set a temporary preview immediately for visual feedback
    setTempPreview(URL.createObjectURL(file));

    // Prepare FormData for the file upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send the image to the backend
      const response = await fetch('https://homebite-app-c680d0ee15d5.herokuapp.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Update the actual preview and reset the temporary one
      setPreview(data.imageUrl);
      setTempPreview(null);

      // Pass the uploaded image URL to the parent component
      onImageUpload(data.imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error uploading image. Please try again.');
    }
  };

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="file"
        accept=".jpg,.png,.webp"
        onChange={handleImageChange}
      />
      {/* Display error message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {/* Display tempPreview during upload; fall back to current image otherwise */}
      {tempPreview ? (
        <img
          src={tempPreview}
          alt="Temporary Preview"
          style={{ width: '100px', height: '100px', marginTop: '10px' }}
        />
      ) : (
        preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ width: '100px', height: '100px', marginTop: '10px' }}
          />
        )
      )}
    </div>
  );
};

export default ImageUpload;
