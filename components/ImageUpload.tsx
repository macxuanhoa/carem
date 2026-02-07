"use client";

import { UploadButton } from "@/lib/uploadthing";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
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

  return (
    <div className="space-y-4">
      {/* Gallery Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {value.map((url) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
              <div className="absolute top-2 right-2 z-10">
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  className="bg-red-500 text-white p-1.5 rounded-full shadow-sm hover:bg-red-600 transition-colors"
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
          {/* Loading Placeholder */}
          {isUploading && (
            <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 mb-2" size={24} />
                <span className="text-xs text-gray-500 font-medium">Đang tải...</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-100 bg-blue-50/30 rounded-2xl hover:bg-blue-50 transition-colors">
          <UploadButton
            endpoint="imageUploader"
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              const urls = res.map((r) => r.url);
              onChange([...value, ...urls]);
              toast.success("Đã tải ảnh lên thành công!");
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              toast.error(`Lỗi: ${error.message}`);
            }}
            appearance={{
                button: "bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors ut-uploading:cursor-not-allowed",
                allowedContent: "text-gray-500 text-xs mt-2",
                container: "w-full flex flex-col items-center"
            }}
            content={{
                button({ ready }) {
                    if (ready) return <span className="flex items-center gap-2"><ImageIcon size={18} /> Chọn Ảnh</span>;
                    return "Đang chuẩn bị...";
                },
                allowedContent: "Ảnh tối đa 16MB (JPG, PNG, WEBP)"
            }}
          />
      </div>
    </div>
  );
}
