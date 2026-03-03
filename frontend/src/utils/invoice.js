import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ROOM_DATA } from "./roomData";

export const downloadInvoice = (reservation) => {
    try {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });
        
        const { reservationNo, checkIn, checkOut, guestId, roomId } = reservation;
        
        // Add Accent Background header
        doc.setFillColor(15, 23, 42); // Very dark blue/slate
        doc.rect(0, 0, 210, 40, "F");
        
        // Add subtle accent rectangle
        doc.setFillColor(14, 165, 233); // Sky blue
        doc.rect(0, 40, 210, 2, "F");

        // Header Text - White
        doc.setFontSize(26);
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.text("OCEAN VIEW", 20, 25);
        doc.setFont("helvetica", "normal");
        doc.text("RESORTS", 85, 25);
        
        // Header Right - Contact
        doc.setFontSize(10);
        doc.text("Galle Road, South Coast, Sri Lanka", 190, 20, { align: "right" });
        doc.text("+94 11 234 5678", 190, 26, { align: "right" });
        doc.text("stay@oceanviewresort.com", 190, 32, { align: "right" });

        // Invoice Titling
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 20, 65);
        
        // Invoice Details right aligned
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Invoice Number", 190, 60, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(`${reservationNo}`, 190, 65, { align: "right" });
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Date of Issue", 190, 75, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(`${new Date().toLocaleDateString()}`, 190, 80, { align: "right" });

        // Bill to section
        doc.setFillColor(248, 250, 252);
        doc.rect(20, 95, 80, 45, "F");
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "bold");
        doc.text("BILLED TO:", 25, 105);
        
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(`${guestId?.fullName || "Valued Guest"}`, 25, 115);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`Contact: ${guestId?.contactNumber || "N/A"}`, 25, 122);
        doc.text(`ID/Passport: ${guestId?.idNumber || "N/A"}`, 25, 129);

        // Stay details section
        doc.setFillColor(248, 250, 252);
        doc.rect(110, 95, 80, 45, "F");
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.setFont("helvetica", "bold");
        doc.text("STAY DETAILS:", 115, 105);
        
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(`Suite ${roomId?.roomNumber || ""} • ${roomId?.roomType || ""}`, 115, 115);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text(`Check In: ${new Date(checkIn).toLocaleDateString()}`, 115, 122);
        doc.text(`Check Out: ${new Date(checkOut).toLocaleDateString()}`, 115, 129);

        // Get proper price from data
        const roomTypeKey = roomId?.roomType && ROOM_DATA[roomId.roomType] ? roomId.roomType : "Single";
        const pricePerNight = ROOM_DATA[roomTypeKey].price;
        const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        const total = pricePerNight * nights;

        // Table
        autoTable(doc, {
            startY: 155,
            head: [["DESCRIPTION", "NIGHTS", "PRICE / NIGHT", "TOTAL"]],
            body: [
                [`${ROOM_DATA[roomTypeKey].name} Accommodation`, nights, `LKR ${pricePerNight.toLocaleString()}`, `LKR ${total.toLocaleString()}`]
            ],
            theme: "plain",
            headStyles: { 
                fillColor: [241, 245, 249], 
                textColor: [100, 116, 139],
                fontStyle: 'bold',
                halign: 'left',
                cellPadding: 6
            },
            bodyStyles: {
                textColor: [15, 23, 42],
                fontSize: 11,
                cellPadding: 8
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255]
            },
            columnStyles: {
                1: { halign: 'center' },
                2: { halign: 'right' },
                3: { halign: 'right', fontStyle: 'bold' }
            },
        });

        // Totals Box
        const finalY = doc.lastAutoTable.finalY + 15;
        
        doc.setDrawColor(226, 232, 240);
        doc.line(120, finalY, 190, finalY);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Subtotal:", 140, finalY + 8);
        doc.setTextColor(15, 23, 42);
        doc.text(`LKR ${total.toLocaleString()}`, 190, finalY + 8, { align: "right" });

        doc.line(120, finalY + 12, 190, finalY + 12);

        // Grand total highlight
        doc.setFillColor(14, 165, 233); // Primary Blue
        doc.rect(120, finalY + 18, 70, 12, "F");
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("GRAND TOTAL", 125, finalY + 26);
        doc.text(`LKR ${total.toLocaleString()}`, 185, finalY + 26, { align: "right" });

        // Footer Note
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(148, 163, 184);
        doc.text("Thank you for your business. We look forward to welcoming you.", 105, 280, { align: "center" });

        // Save
        doc.save(`OceanView_Invoice_${reservationNo}.pdf`);

    } catch (err) {
        console.error("PDF Generation Error:", err);
        alert("Failed to generate PDF. Check console for details.");
    }
};
