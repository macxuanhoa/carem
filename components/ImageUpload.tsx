"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { X, Image as ImageIcon, Loader2, CloudUpload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useCallback } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
}: ImageUploadProps) {
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const urls = res.map((r) => r.url);
      onChange([...value, ...urls]);
      toast.success("Đã tải ảnh lên thành công!");
    },
    onUploadError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length > 0) {
        await startUpload(files);
    }
  }, [startUpload]);

  return (
    <div className="space-y-4">
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {value.map((url) => (
          <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-black/50 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Car Image"
              src={url}
            />
          </div>
        ))}

        {/* Loading State */}
        {isUploading && (
            <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center animate-pulse">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                <span className="text-xs text-gray-500 font-medium">Đang tải lên...</span>
            </div>
        )}

        {/* Custom Upload Button */}
        <label className={`relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                <CloudUpload size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 group-hover:text-blue-700">Thêm Ảnh</span>
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={onUpload}
                disabled={isUploading}
            />
        </label>
      </div>
      
      {value.length === 0 && !isUploading && (
          <p className="text-xs text-gray-400 text-center italic">
              Chưa có ảnh nào. Bấm vào ô trên để tải ảnh lên.
          </p>
      )}
    </div>
  );
}
