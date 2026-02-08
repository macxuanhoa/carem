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
      {/* Gallery Grid - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        
        {/* Custom Upload Button - Modern Design */}
        <label className={`relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                <CloudUpload size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="text-center px-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 block">Thêm Ảnh</span>
                <span className="text-[10px] text-gray-400 mt-1 block">Tối đa 10MB</span>
            </div>
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
            <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center animate-pulse">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={28} />
                <span className="text-xs text-gray-500 font-medium">Đang xử lý...</span>
            </div>
        )}

        {/* Images */}
        {value.map((url) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove(url);
                        }}
                        className="bg-white/90 dark:bg-black/70 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full shadow-sm backdrop-blur-sm transition-all hover:scale-110"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>
                <Image
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    alt="Car Image"
                    src={url}
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
            </div>
        ))}
      </div>
    </div>
  );
}
