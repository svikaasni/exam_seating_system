package com.college.exam.seating.system.service;

import com.college.exam.seating.system.entity.SeatAllocation;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.properties.TextAlignment;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.*;

@Service
public class PdfService {

    private static final String COLLEGE_NAME = "RAJALAKSHMI INSTITUTE OF TECHNOLOGY";
    private static final int COLUMNS = 6;

    public byte[] generateAllocationPdf(String examName, List<SeatAllocation> allocations) {

        if (allocations == null || allocations.isEmpty()) {
            throw new RuntimeException("No allocations found");
        }

        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // ✅ SORT BY REGISTER NUMBER
            allocations.sort(Comparator.comparingInt(a -> {
                if (a.getStudent() == null || a.getStudent().getRegisterNo() == null)
                    return Integer.MAX_VALUE;

                String reg = a.getStudent().getRegisterNo().replaceAll("\\D", "");
                return reg.isEmpty() ? Integer.MAX_VALUE : Integer.parseInt(reg);
            }));

            // HEADER
            document.add(new Paragraph(COLLEGE_NAME).setBold().setFontSize(16).setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Exam: " + examName).setBold().setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("Student Seating Arrangement").setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph(" "));

            float[] columns = {40, 100, 200, 80, 80, 100, 100};
            Table table = new Table(columns);

            table.addHeaderCell(header("SL NO"));
            table.addHeaderCell(header("Reg No"));
            table.addHeaderCell(header("Name"));
            table.addHeaderCell(header("Hall"));
            table.addHeaderCell(header("Seat"));
            table.addHeaderCell(header("Course"));
            table.addHeaderCell(header("Class"));

            int sl = 1;
            int hallIndex = 0;
            Map<Long, String> hallMap = new HashMap<>();

            for (SeatAllocation a : allocations) {

                Long hallId = a.getExamHall().getHallId();

                if (!hallMap.containsKey(hallId)) {
                    hallMap.put(hallId, "A1-" + String.format("%02d", hallIndex + 1));
                    hallIndex++;
                }

                String hall = hallMap.get(hallId);

                String regNo = safe(a.getStudent().getRegisterNo());
                String name = safe(a.getStudent().getName());
                String seat = formatSeat(a.getSeatNumber());
                String course = safe(a.getCourseCode());

                String clazz = safe(a.getStudent().getYear() + " " +
                        a.getStudent().getDepartment().getDepartmentName());

                table.addCell(cell(String.valueOf(sl++)));
                table.addCell(cell(regNo));
                table.addCell(cell(name));
                table.addCell(cell(hall));   // ✅ FIXED
                table.addCell(cell(seat));
                table.addCell(cell(course));
                table.addCell(cell(clazz));
            }

            document.add(table);
            document.close();

            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed: " + e.getMessage());
        }
    }

    private String formatSeat(int seat) {
        int row = (seat - 1) / COLUMNS + 1;
        int col = (seat - 1) % COLUMNS;
        char letter = (char) ('A' + col);
        return letter + String.valueOf(row);
    }

    private String safe(String val) {
        return (val == null || val.isEmpty()) ? "N/A" : val;
    }

    private Cell header(String text) {
        return new Cell().add(new Paragraph(text).setBold())
                .setTextAlignment(TextAlignment.CENTER)
                .setBorder(new SolidBorder(1));
    }

    private Cell cell(String text) {
        return new Cell().add(new Paragraph(text))
                .setBorder(new SolidBorder(1));
    }
}