import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Application, Company, JobOpportunity } from '../types';

interface ExportPdfOptions {
  company: Company;
  job: JobOpportunity;
  applicants: Application[];
  filterLabel?: string;
  collegeName?: string;
}

export function exportApplicantsToPdf({
  company,
  job,
  applicants,
  filterLabel = 'All Applicants',
  collegeName = 'Apex Institute of Technology — Placement Cell',
}: ExportPdfOptions) {
  // Use A4 Landscape for clean spacing across all 12 data columns
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const reportId = `RPT-${Date.now().toString(36).toUpperCase()}`;
  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // 1. Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title & Branding
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CAMPUSHIRE OS — APPLICANT RECRUITMENT REPORT', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(collegeName.toUpperCase(), 14, 18);
  doc.text(`Report ID: ${reportId}   |   Export Filter: ${filterLabel}`, 14, 23);

  // Right-aligned header metadata
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`Generated: ${generatedAt}`, pageWidth - 14, 13, { align: 'right' });
  doc.text(`Total Applicants: ${applicants.length}`, pageWidth - 14, 20, { align: 'right' });

  // 2. Opportunity Summary Bar
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(14, 32, pageWidth - 28, 16, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 32, pageWidth - 28, 16, 'S');

  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`Company: ${company.name}`, 18, 38);
  doc.text(`Position: ${job.title}`, 18, 44);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Work Mode: ${job.workMode} | Type: ${job.jobType}`, 120, 38);
  doc.text(`Package / Stipend: ${job.compensation.salaryRange}`, 120, 44);

  const deadlineFormatted = new Date(job.deadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.text(`Application Deadline: ${deadlineFormatted}`, pageWidth - 18, 38, { align: 'right' });
  doc.text(`Min CGPA: ${job.eligibilityRules.minCgpa} | Backlogs: ${job.eligibilityRules.allowActiveBacklogs ? 'Allowed' : 'Strict 0'}`, pageWidth - 18, 44, { align: 'right' });

  // 3. Prepare Applicant Rows
  const tableRows = applicants.map((app, index) => {
    const snap = app.submittedProfileSnapshot;
    const appDate = new Date(app.appliedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return [
      (index + 1).toString(),
      app.studentName,
      app.studentRollNo,
      app.studentEmail,
      snap.course || 'B.Tech',
      snap.department || 'CSE',
      snap.graduationYear ? snap.graduationYear.toString() : '2026',
      snap.cgpa ? snap.cgpa.toFixed(2) : 'N/A',
      snap.tenthPercentage ? `${snap.tenthPercentage}%` : 'N/A',
      snap.twelfthPercentage ? `${snap.twelfthPercentage}%` : 'N/A',
      snap.activeBacklogs !== undefined ? snap.activeBacklogs.toString() : '0',
      appDate,
      app.eligibilityEvaluation.status,
      app.currentStatus,
    ];
  });

  // 4. AutoTable with repeated headers and footer
  autoTable(doc, {
    startY: 52,
    head: [[
      '#',
      'Student Name',
      'Roll No',
      'Email Address',
      'Deg',
      'Branch',
      'Batch',
      'CGPA',
      '10th',
      '12th',
      'Backlogs',
      'Applied',
      'Eligibility',
      'Status',
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2,
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32 },
      2: { cellWidth: 20 },
      3: { cellWidth: 38 },
      4: { cellWidth: 12 },
      5: { cellWidth: 34 },
      6: { cellWidth: 12, halign: 'center' },
      7: { cellWidth: 12, halign: 'right' },
      8: { cellWidth: 12, halign: 'right' },
      9: { cellWidth: 12, halign: 'right' },
      10: { cellWidth: 14, halign: 'center' },
      11: { cellWidth: 16 },
      12: { cellWidth: 22 },
      13: { cellWidth: 26 },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: (data) => {
      // Confidentiality Footer on every page
      const pageNumber = (doc.internal as any).getNumberOfPages
        ? (doc.internal as any).getNumberOfPages()
        : doc.getNumberOfPages();
      
      const str = `Page ${data.pageNumber} of ${pageNumber}`;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);

      // Line divider
      doc.setDrawColor(226, 232, 240);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

      // Notice
      doc.text(
        'CONFIDENTIAL: For placement cell and authorized recruiter evaluation only. Unauthorized distribution strictly prohibited.',
        14,
        pageHeight - 7
      );
      doc.text(str, pageWidth - 14, pageHeight - 7, { align: 'right' });
    },
  });

  const sanitizedFileName = `${company.name.replace(/[^a-zA-Z0-9]/g, '_')}_${job.title.replace(/[^a-zA-Z0-9]/g, '_')}_Applicants.pdf`;
  doc.save(sanitizedFileName);
}

/**
 * Clean CSV Export utility
 */
export function exportApplicantsToCsv({
  company,
  job,
  applicants,
}: {
  company: Company;
  job: JobOpportunity;
  applicants: Application[];
}) {
  const headers = [
    'Serial No',
    'Student Name',
    'Roll Number',
    'Email',
    'Course',
    'Department / Branch',
    'Graduation Year',
    'Current CGPA',
    '10th Percentage',
    '12th / Diploma Percentage',
    'Active Backlogs',
    'Applied Date',
    'Eligibility Status',
    'Current Recruitment Stage',
    'Internal Notes',
  ];

  const rows = applicants.map((app, index) => {
    const snap = app.submittedProfileSnapshot;
    return [
      index + 1,
      `"${(app.studentName || '').replace(/"/g, '""')}"`,
      `"${(app.studentRollNo || '').replace(/"/g, '""')}"`,
      `"${(app.studentEmail || '').replace(/"/g, '""')}"`,
      `"${(snap.course || '').replace(/"/g, '""')}"`,
      `"${(snap.department || '').replace(/"/g, '""')}"`,
      snap.graduationYear || '',
      snap.cgpa || '',
      snap.tenthPercentage || '',
      snap.twelfthPercentage || '',
      snap.activeBacklogs || 0,
      `"${new Date(app.appliedAt).toISOString().split('T')[0]}"`,
      `"${app.eligibilityEvaluation.status}"`,
      `"${app.currentStatus}"`,
      `"${(app.internalNotes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `${company.name.replace(/[^a-zA-Z0-9]/g, '_')}_Applicants_${Date.now()}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
