"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ImageIcon, X, Loader2 } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Dropzone,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface AttachmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendImage: (imageUrl: string) => void;
}

export const AttachmentDialog = ({
  open,
  onOpenChange,
  onSendImage,
}: AttachmentDialogProps): React.ReactElement => {
  const generateUploadUrl = useMutation(api.private.files.generateUploadUrl);
  const getUrlFromStorageId = useMutation(api.private.files.getUrlFromStorageId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCancel = () => {
    clearSelection();
    onOpenChange(false);
  };

  const handleSend = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        body: selectedFile,
        headers: { "Content-Type": selectedFile.type },
      });

      if (!result.ok) {
        throw new Error("Upload failed");
      }

      const { storageId } = await result.json();

      const imageUrl = await getUrlFromStorageId({ storageId });

      if (!imageUrl) {
        throw new Error("Failed to get image URL");
      }

      onSendImage(imageUrl);
      handleCancel();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/50 px-6 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            Send Image
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Share a photo in this conversation
          </p>
        </DialogHeader>

        <div className="max-w-full overflow-hidden px-6 py-4">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="group relative mx-auto h-48 w-full max-w-full overflow-hidden rounded-xl bg-muted/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearSelection}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/70 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{selectedFile?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile && formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Dropzone
              accept={{
                "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
              }}
              maxSize={MAX_IMAGE_SIZE_BYTES}
              maxFiles={1}
              onDrop={handleFileDrop}
              disabled={isUploading}
              className="rounded-xl border-2 border-dashed border-border/50 bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/50"
            >
              <DropzoneEmptyState />
            </Dropzone>
          )}
        </div>

        <div className="flex gap-3 border-t border-border/50 bg-muted/30 px-6 py-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isUploading}
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selectedFile || isUploading}
            className="flex-1 rounded-xl font-medium shadow-sm transition-all hover:shadow-md disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
