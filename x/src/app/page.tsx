"use client";

import React, { useState } from "react";
import { extractResumeData, type ExtractResumeDataOutput } from "@/ai/flows/extract-resume-data";
import { FileUploader } from "@/components/file-uploader";
import { ResumeDisplay } from "@/components/resume-display";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [parsedData, setParsedData] = useState<ExtractResumeDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // Not used in current FileUploader, but good to have

  const handleFileUpload = async (resumeText: string) => {
    setIsLoading(true);
    setError(null);
    setParsedData(null); // Clear previous data

    try {
      // Basic check for very short/empty text which might not be a valid resume
      if (resumeText.trim().length < 50) {
        throw new Error("The uploaded file content seems too short to be a valid resume. Please upload a valid resume file.");
      }
      const data = await extractResumeData({ resumeText });
      setParsedData(data);
    } catch (err) {
      console.error("Error parsing resume:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during parsing.";
      setError(`Failed to parse resume: ${errorMessage}. Please ensure the file is a text-based resume and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setParsedData(null);
    setError(null);
    setIsLoading(false);
    setFileName(null);
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Resume Insights</h1>
          <p className="mt-2 text-lg text-foreground/80">
            Upload your resume to intelligently extract skills, experience, and education.
          </p>
        </header>

        {!parsedData && !isLoading && (
          <FileUploader onFileUpload={handleFileUpload} disabled={isLoading} />
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 bg-card rounded-lg shadow-md">
            <LoadingSpinner size={48} />
            <p className="mt-4 text-lg text-foreground">Parsing your resume...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments.</p>
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive" className="shadow-md">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Parsing Resume</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button onClick={handleReset} variant="outline" className="mt-4">
              Try Again
            </Button>
          </Alert>
        )}

        {parsedData && !isLoading && !error && (
          <>
            <div className="text-center">
               <Button onClick={handleReset} variant="outline" className="mb-6">
                 Upload Another Resume
               </Button>
            </div>
            <ResumeDisplay data={parsedData} />
          </>
        )}
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Resume Insights. Powered by AI.</p>
      </footer>
    </main>
  );
}
