import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { IconUpload } from "@tabler/icons-react";

interface VideoUploaderProps {
  onFileChange: (file: File) => void;
}

const VideoUploader = ({ onFileChange }: VideoUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      onFileChange(droppedFile);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "p-10 border-2 border-dashed rounded-lg cursor-pointer",
        "hover:border-primary transition-colors duration-200",
        "flex flex-col items-center justify-center space-y-2",
        "bg-gray-50 dark:bg-neutral-900"
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
      <IconUpload className="w-12 h-12 text-gray-400" />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {file
          ? "Click to change video"
          : "Drag and drop your video here or click to select"}
      </p>
      {file && (
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
};

export default VideoUploader;
