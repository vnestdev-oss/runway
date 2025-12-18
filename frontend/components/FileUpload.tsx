"use client";

import React, { useRef, useState } from "react";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  error,
  accept = ".ppt,.pptx",
  maxSize = 20,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }
    onChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative rounded-md p-8 text-center cursor-pointer transition duration-200 border-2 border-dashed bg-gray-900",
          isDragging
            ? "border-purple-600 bg-purple-900"
            : "border-[#545454] hover:border-purple-500",
          error && "border-red-500",
          value && "border-purple-600 bg-purple-900"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <File className="w-8 h-8 text-purple-400" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{value.name}</p>
              <p className="text-xs text-gray-400">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-red-900 rounded-sm transition-colors"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-white">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {accept} (max {maxSize}MB)
              </p>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
};

