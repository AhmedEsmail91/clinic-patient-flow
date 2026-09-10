"use client";

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import type { AppointmentFormData } from "@/types";

interface ImageUploadProps {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
}

function ImageUpload({ formData, setFormData }: ImageUploadProps) {
  const { t } = useTranslation();
  const objectUrlsRef = useRef(new Map<File, string>());

  // Object URLs created with URL.createObjectURL() are revoked as soon as a
  // file leaves formData.images, and all remaining ones are revoked on
  // unmount - otherwise each selected image leaks its blob URL for the
  // life of the tab.
  const imageUrls = useMemo(() => {
    const previousUrls = objectUrlsRef.current;
    const nextUrls = new Map<File, string>();
    formData.images.forEach((file) => {
      nextUrls.set(file, previousUrls.get(file) ?? URL.createObjectURL(file));
    });
    previousUrls.forEach((url, file) => {
      if (!nextUrls.has(file)) URL.revokeObjectURL(url);
    });
    objectUrlsRef.current = nextUrls;
    return nextUrls;
  }, [formData.images]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files ?? [])],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
  };

  return (
    <div className="space-y-3">
      <Label>{t("appointment.images.title", "Upload Images")}</Label>

      {formData.images.length === 0 && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/70 dark:border-border"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-muted-foreground"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5
                     5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5
                     5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">
                  {t("appointment.images.placeholder.bold", "Click to upload")}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (Max. 10MB)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}

      {formData.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.images.map((file, idx) => (
            <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden bg-muted">
              <img src={imageUrls.get(file)} alt={file.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>
            </div>
          ))}
          <label
            htmlFor="dropzone-file"
            className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded cursor-pointer text-muted-foreground hover:bg-muted/70"
          >
            +
            <input
              id="dropzone-file"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}

export { ImageUpload };
