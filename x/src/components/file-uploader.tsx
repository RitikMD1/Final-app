
"use client";

import type { ChangeEvent, DragEvent } from "react";
import React, { useState, useRef, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

interface FileUploaderProps {
  onFileUpload: (content: string) => void;
  disabled?: boolean;
}

export function FileUploader({ onFileUpload, disabled = false }: FileUploaderProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set workerSrc for pdfjs. Note: In a production Next.js app, you'd typically copy
    // pdf.worker.min.mjs to your /public folder and set workerSrc to '/pdf.worker.min.mjs'.
    // Using a CDN here for simplicity in this environment.
    // Ensure the version matches the installed pdfjs-dist version.
    if (typeof window !== 'undefined' && pdfjsLib) {
       pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }
  }, []);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          const textContent = e.target?.result as string;
          if (textContent) {
            onFileUpload(textContent);
          } else {
            throw new Error("Could not read text file content.");
          }
        } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) throw new Error("Could not read PDF file.");
          
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          let allText = "";
          const pagePromises = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            pagePromises.push(
              pdf.getPage(i).then(function(page) {
                return page.getTextContent().then(function(textContent) {
                  return textContent.items.map(item => (item as any).str).join(" ");
                });
              })
            );
          }
          const pageTexts = await Promise.all(pagePromises);
          allText = pageTexts.join("\\n\\n");
          onFileUpload(allText);

        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (!arrayBuffer) throw new Error("Could not read DOCX file.");

          const result = await mammoth.extractRawText({ arrayBuffer });
          onFileUpload(result.value);
        } else {
           throw new Error("Unsupported file type processed unexpectedly.");
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: "File Read Error",
          description: `Could not extract text from ${file.name}. Please ensure it's a valid file. Error: ${error instanceof Error ? error.message : String(error)}`,
          variant: "destructive",
        });
      }
    };

    reader.onerror = () => {
      toast({
        title: "File Read Error",
        description: `An error occurred while reading the file: ${file.name}.`,
        variant: "destructive",
      });
    };

    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else if (
      file.type === "application/pdf" || file.name.endsWith(".pdf") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")
    ) {
      reader.readAsArrayBuffer(file);
    } else {
       // Should be caught by isValidFileType, but as a fallback:
        toast({
          title: "Invalid File Type",
          description: "Please upload a .txt, .pdf, or .docx file.",
          variant: "destructive",
        });
    }
  };

  const isValidFileType = (file: File): boolean => {
    return (
      file.type === "text/plain" || file.name.endsWith(".txt") ||
      file.type === "application/pdf" || file.name.endsWith(".pdf") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")
    );
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (isValidFileType(file)) {
         handleFileRead(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a plain text (.txt), PDF (.pdf), or Word (.docx) file.",
          variant: "destructive",
        });
      }
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
       if (isValidFileType(file)) {
        handleFileRead(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a plain text (.txt), PDF (.pdf), or Word (.docx) file.",
          variant: "destructive",
        });
      }
      // Reset file input to allow uploading the same file again if needed
      e.target.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
        isDraggingOver ? "border-primary bg-accent" : "border-border hover:border-primary/70",
        disabled ? "cursor-not-allowed opacity-50 bg-muted" : ""
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={!disabled ? handleButtonClick : undefined}
      aria-disabled={disabled}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (!disabled) handleButtonClick();}}}
    >
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        disabled={disabled}
      />
      <UploadCloud className={cn("w-16 h-16 mb-4", isDraggingOver ? "text-primary" : "text-muted-foreground")} />
      <p className="mb-2 text-sm text-foreground">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-muted-foreground">Only plain text (.txt), PDF (.pdf), and Word (.docx) files are supported</p>
      {disabled && <p className="mt-2 text-xs text-destructive">Uploader is disabled during processing.</p>}
    </div>
  );
}
