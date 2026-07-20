"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";

interface AvatarUploadProps {
  initialImage?: string;
  onImageSelect?: (file: File | null) => void;
}

export default function AvatarUpload({
  initialImage,
  onImageSelect,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file dialog on clicking the avatar wrapper
  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and local preview generation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onImageSelect?.(file);
    }
  };

  // Handle clearing the selected image
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from re-opening file picker
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageSelect?.(null);
  };

  return (
    <div className="relative inline-block">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Avatar Container */}
      <div
        onClick={handleContainerClick}
        className="relative group cursor-pointer w-24 h-24 rounded-2xl overflow-hidden border-4 border-card shadow-md bg-muted"
      >
        {preview ? (
          <Image
            width={96}
            height={96}
            src={preview}
            alt="User Profile Avatar"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-medium">
            No Image
          </div>
        )}

        {/* Hover Camera Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Optional: Clear Image Badge */}
      {preview && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground p-1 rounded-full shadow-md hover:scale-110 transition-transform"
          title="Remove photo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
