import React, { useState } from 'react';
import { AdminService } from '../../domain/services/admin.service';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onUploadSuccess, label = "Ajouter une image" }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const url = await AdminService.uploadImage(e.target.files[0]);
        onUploadSuccess(url);
      } catch (err) {
        alert("Erreur lors de l'upload");
        console.error(err);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="image-upload-container" style={{ margin: '1rem 0' }}>
      <label className="secondary-button" style={{ fontSize: '0.8rem', cursor: 'pointer', padding: '0.5rem 1rem' }}>
        {uploading ? 'Envoi...' : label}
        <input type="file" hidden onChange={handleFileChange} accept="image/*" />
      </label>
    </div>
  );
};

export default ImageUpload;
