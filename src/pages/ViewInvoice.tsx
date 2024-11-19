import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { Printer, ArrowLeft, FileEdit, Download } from "lucide-react";
import { useInvoices } from "../hooks/useInvoices";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ClassicTemplate from "../components/templates/ClassicTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import MinimalTemplate from "../components/templates/MinimalTemplate";
import ExcelTemplate from "../components/templates/ExcelTemplate";
import TemplateSwitcher, { TemplateType } from "../components/TemplateSwitcher";

export default function ViewInvoice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === id);
  const previewRef = useRef(null);
  const [template, setTemplate] = useState<TemplateType>("modern");

  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
  });

  const handleDownload = async () => {
    const element = previewRef.current;
    if (!element) return;

    try {
      // Set high quality options for html2canvas
      const canvas = await html2canvas(element, {
        scale: 4, // Higher scale for better quality
        useCORS: true,
        logging: true, // Enable logging for debugging
        backgroundColor: "#ffffff"
      });

      // A4 dimensions in points (1 inch = 72 points, A4 = 8.27 x 11.69 inches)
      const pageWidth = 8.27 * 72;
      const pageHeight = 11.69 * 72;

      // Calculate dimensions to maximize content size while maintaining aspect ratio
      const aspectRatio = canvas.width / canvas.height;
      let finalWidth = pageWidth;
      let finalHeight = finalWidth / aspectRatio;

      // If height exceeds page height, scale based on height instead
      if (finalHeight > pageHeight) {
        finalHeight = pageHeight;
        finalWidth = finalHeight * aspectRatio;
      }

      // Create PDF in portrait mode
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [pageWidth, pageHeight]
      });

      // Add the image at the top of the page
      const xOffset = (pageWidth - finalWidth) / 2;
      const yOffset = (pageHeight - finalHeight) / 2;

      // Add the image with high quality settings
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        xOffset,
        yOffset,
        finalWidth,
        finalHeight
      );

      // Save the PDF
      pdf.save(`invoice-${invoice?.invoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please check the console for details.");
    }
  };

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Invoice not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    excel: ExcelTemplate,
  }[template];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </button>
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/edit/${invoice.id}`)}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            title="Edit Invoice"
          >
            <FileEdit className="h-5 w-5" />
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            title="Print Invoice"
          >
            <Printer className="h-5 w-5" />
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            title="Download PDF"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <TemplateSwitcher currentTemplate={template} onTemplateChange={setTemplate} />

      <div ref={previewRef}>
        <TemplateComponent data={invoice} />
      </div>
    </motion.div>
  );
}