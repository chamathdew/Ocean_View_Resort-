import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadInvoice = (reservation) => {
    const doc = jsPDF();
    const { reservationNo, checkIn, checkOut, guestId, roomId } = reservation;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // --primary
    doc.text("OCEAN VIEW RESORT", 105, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // --text-light
    doc.text("Galle Road, South Coast, Sri Lanka", 105, 38, { align: "center" });
    doc.text("+94 11 234 5678 | stay@oceanviewresort.com", 105, 43, { align: "center" });

    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240); // --border
    doc.line(20, 50, 190, 50);

    // Invoice Details
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("OFFICIAL INVOICE", 20, 65);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Invoice No: ${reservationNo}`, 140, 65);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 70);

    // Guest & Stay Info
    doc.autoTable({
        startY: 80,
        head: [["Guest Details", "Stay Information"]],
        body: [
            [
                `Name: ${guestId?.fullName || "N/A"}\nContact: ${guestId?.contactNumber || "N/A"}\nAddress: ${guestId?.address || "N/A"}`,
                `Suite: ${roomId?.roomNumber} (${roomId?.roomType})\nCheck-in: ${new Date(checkIn).toLocaleDateString()}\nCheck-out: ${new Date(checkOut).toLocaleDateString()}`
            ]
        ],
        theme: "striped",
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        styles: { overflow: "linebreak", cellPadding: 8 }
    });

    // Fees
    const price = roomId?.roomType === "Suite" ? 42000 : 28000;
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1;
    const total = price * nights;

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Description", "Rate", "Nights", "Total"]],
        body: [
            [`${roomId?.roomType} Suite Accommodation`, `LKR ${price.toLocaleString()}`, nights, `LKR ${total.toLocaleString()}`]
        ],
        theme: "grid",
        headStyles: { fillColor: [212, 175, 55], textColor: [15, 23, 42] },
        styles: { cellPadding: 8 }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`GRAND TOTAL: LKR ${total.toLocaleString()}`, 190, finalY, { align: "right" });

    // Footer Note
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Thank you for choosing Ocean View Resort. We look forward to your arrival.", 105, 270, { align: "center" });

    // Download
    doc.save(`Invoice_${reservationNo}.pdf`);
};
