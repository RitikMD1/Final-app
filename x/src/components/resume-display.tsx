
"use client";

import type { ExtractResumeDataOutput } from "@/ai/flows/extract-resume-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, ListChecks, UserCircle, Mail, Phone as PhoneIcon, FileText } from "lucide-react";

interface ResumeDisplayProps {
  data: ExtractResumeDataOutput;
}

export function ResumeDisplay({ data }: ResumeDisplayProps) {
  return (
    <div className="space-y-6 w-full">
      {(data.name || data.email || data.phone) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCircle className="mr-2 h-6 w-6 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.name && (
              <div className="flex items-center">
                <UserCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                <p className="text-lg font-semibold">{data.name}</p>
              </div>
            )}
            {data.email && (
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                <a href={`mailto:${data.email}`} className="text-sm hover:underline text-foreground">
                  {data.email}
                </a>
              </div>
            )}
            {data.phone && (
              <div className="flex items-center">
                <PhoneIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-foreground">{data.phone}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {data.summary && (
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{data.summary}</p>
          </CardContent>
        </Card>
      )}

      {data.skills && data.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="mr-2 h-6 w-6 text-primary" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.experience && data.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-6 w-6 text-primary" />
              Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Title</TableHead>
                  <TableHead className="w-[20%]">Company</TableHead>
                  <TableHead className="w-[15%]">Dates</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.experience.map((exp, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{exp.title}</TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.dates}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {exp.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {data.education && data.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-6 w-6 text-primary" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Institution</TableHead>
                  <TableHead className="w-[40%]">Degree</TableHead>
                  <TableHead className="w-[20%]">Dates</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.education.map((edu, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{edu.institution}</TableCell>
                    <TableCell>{edu.degree}</TableCell>
                    <TableCell>{edu.dates}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
