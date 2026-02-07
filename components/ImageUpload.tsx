"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
        </div>
      )}

      {/* Upload Dropzone */}
      <UploadDropzone
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          const urls = res.map((r) => r.url);
          onChange([...value, ...urls]);
          toast.success("Đã tải ảnh lên thành công!");
        }}
        onUploadError={(error: Error) => {
          toast.error(`Lỗi: ${error.message}`);
        }}
        appearance={{
            container: "border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-8 hover:bg-blue-50 transition-colors cursor-pointer",
            label: "text-blue-600 font-bold hover:text-blue-700",
            allowedContent: "text-gray-400 text-xs",
            button: "bg-blue-600 text-white font-bold px-4 py-2 rounded-xl mt-4 hover:bg-blue-700 transition-colors",
        }}
        content={{
            label: "Kéo thả hoặc bấm để chọn ảnh",
            allowedContent: "Chỉ chấp nhận ảnh (tối đa 4MB)",
        }}
      />
    </div>
  );
}
