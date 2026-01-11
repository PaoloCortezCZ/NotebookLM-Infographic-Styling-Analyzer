
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { VisualStyleDefinition, SavedStyle } from "../types";

export async function exportStylesToPDF(styles: (VisualStyleDefinition | SavedStyle)[], fileName: string) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "1000px"; 
  container.style.padding = "40px";
  container.style.backgroundColor = "white";
  container.style.fontFamily = "'Inter', sans-serif";
  document.body.appendChild(container);

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    const refImage = (style as any).originalImage || style.previewImage;

    if (i > 0) pdf.addPage();

    // 1. HEADER
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(239, 68, 68); // Rose-500
    pdf.text("ARCHITECTURAL STYLE GUIDE", margin, 20);
    
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42); // Slate-900
    pdf.text(style.styleName.toUpperCase(), margin, 30);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // Slate-400
    pdf.text(`ID: ${style.styleId} | EXTRACTION SCORE: ${style.totalScore}/50`, margin, 36);

    // 2. VISUAL IDENTITY & DETAILS (HTML RENDER)
    container.innerHTML = "";
    const layout = document.createElement("div");
    layout.style.display = "grid";
    layout.style.gridTemplateColumns = "1.2fr 1fr";
    layout.style.gap = "24px";
    layout.style.alignItems = "start";
    
    const detailsLeftColumn = document.createElement("div");
    detailsLeftColumn.style.display = "flex";
    detailsLeftColumn.style.flexDirection = "column";
    detailsLeftColumn.style.gap = "20px";
    
    const secondaryColorsHtml = style.visualIdentity.secondaryColors?.length > 0 
      ? `
        <div style="margin-top: 20px; border-top: 1px solid #f1f5f9; pt: 15px;">
          <div style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.1em;">Secondary Palette</div>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${style.visualIdentity.secondaryColors.map(c => `
              <div style="display: flex; align-items: center; gap: 6px; background: #fff; padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <div style="width: 16px; height: 16px; border-radius: 3px; background-color: ${c.split(' ')[0]}"></div>
                <div style="font-size: 9px; font-family: monospace; color: #64748b;">${c.split(' ')[0]}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : '';

    detailsLeftColumn.innerHTML = `
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Visual Palette</h3>
          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <div>
              <div style="width: 44px; height: 44px; border-radius: 8px; border: 1px solid #e2e8f0; background-color: ${style.visualIdentity.backgroundColor.split(' ')[0]}"></div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 700; margin-top: 5px;">BG</div>
              <div style="font-size: 10px; font-weight: 700; color: #1e293b; font-family: monospace;">${style.visualIdentity.backgroundColor.split(' ')[0]}</div>
            </div>
            <div>
              <div style="width: 44px; height: 44px; border-radius: 8px; border: 1px solid #e2e8f0; background-color: ${style.visualIdentity.textColor.split(' ')[0]}"></div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 700; margin-top: 5px;">TEXT</div>
              <div style="font-size: 10px; font-weight: 700; color: #1e293b; font-family: monospace;">${style.visualIdentity.textColor.split(' ')[0]}</div>
            </div>
            <div>
              <div style="width: 44px; height: 44px; border-radius: 8px; border: 1px solid #e2e8f0; background-color: ${style.visualIdentity.accentColor.split(' ')[0]}"></div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 700; margin-top: 5px;">ACCENT</div>
              <div style="font-size: 10px; font-weight: 700; color: #1e293b; font-family: monospace;">${style.visualIdentity.accentColor.split(' ')[0]}</div>
            </div>
          </div>
          ${secondaryColorsHtml}
        </div>

        <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 0.1em;">Architectural Details</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Texture</div>
              <div style="font-size: 11px; color: #1e293b; font-weight: 500; line-height: 1.4;">${style.imageStyle.texture}</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Composition</div>
              <div style="font-size: 11px; color: #1e293b; font-weight: 500; line-height: 1.4;">${style.imageStyle.composition}</div>
            </div>
            <div>
              <div style="font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Lighting</div>
              <div style="font-size: 11px; color: #1e293b; font-weight: 500; line-height: 1.4;">${style.imageStyle.lighting}</div>
            </div>
          </div>
        </div>
    `;

    const detailsRightColumn = document.createElement("div");
    detailsRightColumn.style.display = "flex";
    detailsRightColumn.style.flexDirection = "column";
    detailsRightColumn.style.gap = "20px";
    detailsRightColumn.innerHTML = `
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <h3 style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.1em;">Typography DNA</h3>
          <div style="margin-bottom: 12px;"><div style="font-size: 9px; color: #94a3b8; font-weight: 700;">HEADING</div><div style="font-size: 12px; font-weight: 700; color: #1e293b;">${style.typography.heading}</div></div>
          <div style="font-size: 10px; color: #475569; line-height: 1.6;">${style.typography.details.map(d => `<span style="font-weight: 800; color: #94a3b8; text-transform: uppercase; font-size: 8px;">${d.label}:</span> ${d.value}`).join('<br/>')}</div>
        </div>
    `;

    const imgWrapper = document.createElement("div");
    imgWrapper.style.position = "relative";
    imgWrapper.style.borderRadius = "16px";
    imgWrapper.style.overflow = "hidden";
    imgWrapper.style.backgroundColor = "#f1f5f9";
    imgWrapper.style.border = "1px solid #e2e8f0";
    imgWrapper.style.display = "flex";
    imgWrapper.style.alignItems = "center";
    imgWrapper.style.justifyContent = "center";
    imgWrapper.style.aspectRatio = "1/1";

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = refImage;
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
    img.style.display = "block";

    const label = document.createElement("div");
    label.style.position = "absolute";
    label.style.bottom = "12px";
    label.style.left = "12px";
    label.style.right = "12px";
    label.style.background = "rgba(255,255,255,0.95)";
    label.style.padding = "8px";
    label.style.borderRadius = "8px";
    label.style.fontSize = "9px";
    label.style.fontWeight = "800";
    label.style.color = "#475569";
    label.style.textAlign = "center";
    label.style.border = "1px solid #e2e8f0";
    label.innerText = "STYLE REFERENCE SAMPLE";

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(label);
    
    detailsRightColumn.appendChild(imgWrapper);
    layout.appendChild(detailsLeftColumn);
    layout.appendChild(detailsRightColumn);
    container.appendChild(layout);

    await new Promise((resolve) => {
      if (img.complete) resolve(true);
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      setTimeout(() => resolve(false), 5000);
    });

    const canvas = await html2canvas(container, { 
      scale: 2, 
      backgroundColor: "#ffffff",
      useCORS: true,
      allowTaint: false,
      logging: false
    });
    
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const canvasWidth = contentWidth;
    const canvasHeight = (canvas.height * contentWidth) / canvas.width;
    
    pdf.addImage(imgData, "JPEG", margin, 42, canvasWidth, canvasHeight);

    // 3. PROMPT BOX (CLEAN BLACK FRAME)
    const promptLines = [
      `Overall Tone: ${style.overallDesignSettings.tone}`,
      `Colors: BG ${style.visualIdentity.backgroundColor}, Text ${style.visualIdentity.textColor}, Accent ${style.visualIdentity.accentColor}`,
      `Secondary Palette: ${style.visualIdentity.secondaryColors?.join(', ')}`,
      `Image Style: ${style.imageStyle.features}`,
      `Texture: ${style.imageStyle.texture}`,
      `Composition: ${style.imageStyle.composition}`,
      `Lighting: ${style.imageStyle.lighting}`,
      `Typography Style: ${style.typography.heading}`,
      `Categories: ${style.tags?.join(', ')}`,
      ``,
      `Instruction: Create a high-fidelity infographic matching the visual DNA of "${style.styleName}".`,
      `Reference extracted metadata for exact aesthetic and structural adherence.`
    ];

    const promptStartY = 42 + canvasHeight + 10;
    const lineHeight = 5;
    const padding = 8;
    
    pdf.setFont("courier", "normal");
    pdf.setFontSize(8);
    
    // Calculate split text before drawing to determine box height
    const wrappedPromptLines: string[][] = promptLines.map(line => 
      pdf.splitTextToSize(line, contentWidth - (padding * 2))
    );
    const totalPromptLines = wrappedPromptLines.reduce((acc, val) => acc + val.length, 0);
    const boxHeight = (totalPromptLines * lineHeight) + (padding * 2) + 12;

    // Background & Black Frame
    pdf.setFillColor(252, 252, 252); 
    pdf.setDrawColor(0, 0, 0); 
    pdf.setLineWidth(0.3);
    pdf.roundedRect(margin, promptStartY, contentWidth, boxHeight, 1, 1, "FD");

    pdf.setFont("courier", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(15, 23, 42); 
    pdf.text("NOTEBOOKLM INFOGRAPHIC PROMPT DNA", margin + padding, promptStartY + 10);

    pdf.setFont("courier", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(30, 41, 59); 
    
    let currentLineY = promptStartY + 17;
    wrappedPromptLines.forEach((lines) => {
      lines.forEach(line => {
        pdf.text(line, margin + padding, currentLineY);
        currentLineY += lineHeight;
      });
    });

    pdf.setFontSize(7);
    pdf.setTextColor(148, 163, 184);
    pdf.text("----------------------------------------------------------------------", margin + padding, promptStartY + boxHeight - 5);
    pdf.text("SELECT AND COPY TEXT ABOVE FOR NOTEBOOKLM INTEGRATION", margin + padding, promptStartY + boxHeight - 2);

    // Footer
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(203, 213, 225);
    pdf.text(`STYLEARCHITECT SYSTEM | PAGE ${i + 1} OF ${styles.length}`, pageWidth / 2, pageHeight - 10, { align: "center" });
  }

  pdf.save(`${fileName}.pdf`);
  document.body.removeChild(container);
}
