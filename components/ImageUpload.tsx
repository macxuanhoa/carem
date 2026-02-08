"use client";

import { X, Image as ImageIcon, Loader2, CloudUpload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";

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
  const [isUploading, setIsUploading] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1920; // Tăng độ phân giải tối đa (cũ là 1200)
                const MAX_HEIGHT = 1920;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                // Compress to JPEG with 0.9 quality (High Quality)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    const newUrls: string[] = [];
    
    try {
        for (const file of files) {
            // Client-side compression to Base64
            const base64 = await compressImage(file);
            newUrls.push(base64);
        }
        
        onChange([...value, ...newUrls]);
        toast.success("Đã thêm ảnh thành công!");
    } catch (error) {
        console.error(error);
        toast.error("Lỗi xử lý ảnh. Vui lòng thử lại.");
    } finally {
        setIsUploading(false);
        // Reset input
        e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Gallery Grid - Mobile: Horizontal Scroll, Desktop: Grid */}
      <div className="flex overflow-x-auto pb-4 gap-3 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 scrollbar-hide snap-x">
        
        {/* Custom Upload Button - Always First */}
        <label className={`shrink-0 w-32 md:w-auto relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50 hover:bg-blue-100 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group snap-start ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                <CloudUpload size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-blue-700 group-hover:text-blue-800 text-center px-2">Thêm Ảnh</span>
            <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={onUpload}
                disabled={isUploading}
            />
        </label>

        {/* Loading State */}
        {isUploading && (
            <div className="shrink-0 w-32 md:w-auto relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center animate-pulse snap-start">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                <span className="text-xs text-gray-500 font-medium">Đang tải...</span>
            </div>
        )}

        {/* Images */}
        {value.map((url) => (
          <div key={url} className="shrink-0 w-32 md:w-auto relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 group bg-gray-100 snap-start shadow-sm">
            <div className="absolute top-1.5 right-1.5 z-10 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="bg-white/90 text-red-500 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors"
              >
                <X size={14} strokeWidth={2.5} />
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
      </div>
      
      {value.length === 0 && !isUploading && (
          <p className="text-xs text-gray-400 text-center italic md:hidden">
              Trượt ngang để xem thêm
          </p>
      )}
    </div>
  );
}
