"use client";

import React, { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import {
  Button,
  Slider,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import Imagess from "next/image";
import ContainedButton from "@/commons/button-contained";

interface AvatarUploaderProps {
  open: boolean;
  onClose: () => void;
  onSave: (croppedImage: File | null) => void;
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function getCroppedImg(
  imageSrc: string,
  cropAreaPixels: any
): Promise<File | null> {
  const image = new Image();
  image.src = imageSrc;

  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropAreaPixels.width;
      canvas.height = cropAreaPixels.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      ctx.drawImage(
        image,
        cropAreaPixels.x,
        cropAreaPixels.y,
        cropAreaPixels.width,
        cropAreaPixels.height,
        0,
        0,
        cropAreaPixels.width,
        cropAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "cropped-avatar.jpg", {
            type: "image/jpeg",
          });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/jpeg");
    };
  });
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedArea | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (_: any, croppedAreaPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleClose = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

    if (croppedImage) {
      const url = URL.createObjectURL(croppedImage);
      onSave(croppedImage);
    } else {
      console.error("Không tạo được ảnh đã crop");
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div
        id="modal-header"
        className="w-full h-fit flex flex-row justify-between items-center bg-primary-50 p-3"
      >
        <Typography
          variant="h6"
          component="h2"
          className="text-title-medium-strong font-normal opacity-60"
        >
          Cập nhật ảnh đại diện
        </Typography>
      </div>
      <DialogContent>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        {!imageSrc ? (
          <div className="h-[50vh] flex flex-col justify-center items-center gap-4">
            <Imagess
              src="/images/icons/Import.png"
              alt="import-timetable"
              width={50}
              height={50}
              unoptimized={true}
              className="!opacity-60"
            />
            <p className="text-body-small w-fit text-justify opacity-70">
              Hãy tải lên ảnh của bạn.
            </p>
          </div>
        ) : (
          <div style={{ position: "relative", width: "100%", height: 400 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false}
            />
          </div>
        )}

        {imageSrc && (
          <div className="mt-4">
            <Typography gutterBottom>Thu phóng</Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, newZoom) => setZoom(newZoom as number)}
            />
          </div>
        )}
      </DialogContent>
      <div className="w-full flex flex-row justify-end items-center gap-2 bg-basic-gray-hover p-3">
        <ContainedButton
          title="tải ảnh lên"
          disableRipple
          type="submit"
          styles="bg-primary-300 text-white !py-1 px-4"
          onClick={() => fileInputRef.current?.click()}
        />
        {imageSrc && (
          <ContainedButton
            title="Lưu"
            disableRipple
            type="submit"
            styles="bg-primary-300 text-white !py-1 px-4"
            onClick={handleSave}
          />
        )}

        <ContainedButton
          title="Huỷ"
          onClick={handleClose}
          disableRipple
          styles="!bg-basic-gray-active !text-basic-gray !py-1 px-4"
        />
      </div>
    </Dialog>
  );
};

export default AvatarUploader;
