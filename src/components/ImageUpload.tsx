"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

const ImageUpload = ({ onChange, value, endpoint }: ImageUploadProps) => {
  if (value) {
    return (
      <div className="relative size-40">
        <img
          src={value}
          alt="upload"
          className="rounded-md h-40 w-40 object-cover"
        />
        <button className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm">
          <XIcon className="size-4 text-white" onClick={() => onChange("")} />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res[0].ufsUrl) {
          onChange(res?.[0].ufsUrl);
        }
      }}
      onUploadError={(error: Error) => {
        console.log(error.message);
        toast.error("Error in file upload");
      }}
    />
  );
};

export default ImageUpload;
