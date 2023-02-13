/* --------------------------------------
Multi-file Export v1.3
by Aaron Troia (@atroia)
Modified Date: 2/13/22

Description: 
Multi-file Export allows you to export multiple PDFs (plus IDML & JPG ) at the same time. 

v1.1 - added sig check function, added script name & version to palette
v1.2 - removed redudnant code in sigCheck function
v1.3 - asyncronusExport + cover image export
-------------------------------------- */

#targetengine "session"

var scriptName = "Multi-File Export";
var version = "v1.3"

var g = {};
var d = app.activeDocument;
createDialog();
g.win.show();


/* ========================= */
/* ==== PALLETTE WINDOW ==== */
/* ========================= */

function createDialog() {
  // create panel
  g.win = new Window("palette", scriptName + " " + version);
  g.win.pnlScope = g.win.add("panel");


  // CHECKBOXES
  // PDF Export checkboxes
  g.win.pnlOps = g.win.add("panel", undefined, "PDF Export");
  g.win.pnlOps.alignChildren = "left";
  g.win.pnlOps.minimumSize = [235,20];

  g.win.pnlOps.chkLow = g.win.pnlOps.add(
    "checkbox",
    undefined,
    "Low Resolution"
  );
  g.win.pnlOps.chkPagesBld = g.win.pnlOps.add(
    "checkbox",
    undefined,
    "PrePress (bleed)"
  );
  g.win.pnlOps.chkSpreads = g.win.pnlOps.add(
    "checkbox",
    undefined,
    "Prepress (spreads)"
  );

  // Extra PDF Export checkbox
  g.win.pnlOps2 = g.win.add("panel", undefined, "PDF Export (Extra)");
  g.win.pnlOps2.alignChildren = "left";
  g.win.pnlOps2.minimumSize = [235,20];
  g.win.pnlOps2.chkPages = g.win.pnlOps2.add(
    "checkbox",
    undefined,
    "PrePress"
  );
  g.win.pnlOps2.chkSpreadsBld = g.win.pnlOps2.add(
    "checkbox",
    undefined,
    "Prepress (spreads + bleed)"
  );
  g.win.pnlOps2.chkHigh = g.win.pnlOps2.add(
    "checkbox",
    undefined,
    "High Quality - No Compression"
    );

  // IDML checkbox
  g.win.pnlIDML = g.win.add("panel", undefined, "IDML Export");
  g.win.pnlIDML.alignChildren = "left";
  g.win.pnlIDML.minimumSize = [235,20];
  g.win.pnlIDML.chkIDML = g.win.pnlIDML.add(
    "checkbox", 
    undefined, 
    "IDML"
    );
	
  // Cover Image checkbox
  g.win.coverIMG = g.win.add("panel", undefined, "JPG Export");
  g.win.coverIMG.alignChildren = "left";
  g.win.coverIMG.minimumSize = [235,20];
  g.win.coverIMG.chkIDML = g.win.coverIMG.add(
    "checkbox", 
    undefined, 
    "Cover JPG"
    );

  for (var i = 0; i < g.win.pnlOps.length; i++) {
    g.win.pnlOps.children[i].value = true;
  }

  // BUTTONS
  g.win.grButs = g.win.add("group");
  g.win.grButs.cancel = g.win.grButs.add("button", undefined, "Cancel");
  g.win.grButs.check = g.win.grButs.add("button", undefined, "Check");
  g.win.grButs.export = g.win.grButs.add("button", undefined, "Export");
  // export button
  g.win.grButs.export.onClick = function(){
      exportPDF();
    g.win.close();
  }
  // check button
   g.win.grButs.check.onClick = function() {
     SigCheck();
  };
  // cancel button
  g.win.grButs.cancel.onClick = function() {
    g.win.close();
  };
}

/* ======================== */
/* ====  PDF(s) Export ==== */
/* ======================== */

function exportPDF() {
  // These are the PDF Export settings names from InDesign
  var preset1 = app.pdfExportPresets.itemByName("PrePress (bleed)");
  var preset2 = app.pdfExportPresets.itemByName("Prepress (spreads)");
  var preset3 = app.pdfExportPresets.itemByName("Prepress (bleed + spreads)");
  var preset4 = app.pdfExportPresets.itemByName("First Chapter");
  var preset5 = app.pdfExportPresets.itemByName("PrePress");
  var preset6 = app.pdfExportPresets.itemByName("Highest Quality - No Compression");
 

  if (!(preset1.isValid && preset2.isValid && preset3.isValid && preset4.isValid && preset5.isValid && preset6.isValid)) {
    alert(
      "One of the presets does not exist. Please check spelling carefully."
    );
    exit();
  }

  if (d.saved){ 
    thePath = String(d.fullName).replace(/\..+$/, "") + ".pdf"; 
    thePath = String(new File(thePath)); 
  } else { 
    thePath = String((new File)); 
  } 

  thePath = thePath.replace(/\.pdf$/, "");
  thePath2 = thePath.replace(/(\d+b|\.pdf$)/, "");
  // Here you can set the suffix at the end of the file name
  name1 = thePath + ".pdf"; // Print PDF
  name2 = thePath2 + "_spreads.pdf"; // Spreads PDF
  name3 = thePath + ".idml"; // IDML file
  name4 = thePath +"_low.pdf"; // Low Resolution file
  name5 = thePath +"_high.pdf"; // High Resolutino file


  // Prepress (Bleed)
  if(g.win.pnlOps.chkPagesBld.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    // books
    // app.activeDocument.layers.item("Bookline").visible = false; // turn off Bookine layer (if it is visible) for single page export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name1), false, preset1);
  };

  // Prepress (bleed + spreads)
  if(g.win.pnlOps2.chkSpreadsBld.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    // app.activeDocument.layers.item("Bookline").visible = false; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name1), false, preset3);
  };

  // Prepress (spreads)
  if(g.win.pnlOps.chkSpreads.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    // app.activeDocument.layers.item("Bookline").visible = true; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name2), false, preset2);
  };

  // First Chapter / Low Resolution
  if(g.win.pnlOps.chkLow.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    // app.activeDocument.layers.item("Bookline").visible = true; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name4), false, preset4);
  };

  // High Resolution - No Compression
  if(g.win.pnlOps2.chkHigh.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    // app.activeDocument.layers.item("Bookline").visible = false; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name5), false, preset6);
  };

  // Prepress
  if(g.win.pnlOps2.chkPages.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    // books
    // app.activeDocument.layers.item("Bookline").visible = false; // turn off Bookine layer (if it is visible) for single page export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name1), false, preset5);
  };

  // IDML
  if(g.win.pnlIDML.chkIDML.value == true){
    // 1 page cover
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    d.exportFile(ExportFormat.INDESIGN_MARKUP, new File(name3)); // IDML EXPORT
  }
	
  // Cover Image
  if(g.win.coverIMG.chkIDML.value == true){
    exportCover();
  }
}

/* =========================== */
/* ====  Signature Check  ==== */
/* =========================== */

function sigCheck(){
	var pageCount = d.pages.length;
	if (pageCount >= 32) {
		var sigMod = 16;
	} else if (pageCount < 32 && pageCount > 8){
		var sigMod = 8;
	} else {
		alert("There are no sigs, your document is only " + pageCount + " page(s).");
		exit();
	}
	var addPages = ((Math.ceil(pageCount/sigMod)) * sigMod) - pageCount;
	var removePages = pageCount - (Math.floor(pageCount/sigMod) * sigMod);
	// var perfectBreak = "This document is " + pageCount + " pages. You're good.";
	var unperfectBreak = "Your page count " + pageCount + " is not an even signature break. Try adding " + addPages + " pages, or removing " + removePages + " pages.";
	if (pageCount % sigMod !== 0){
		alert(unperfectBreak);
	} 
}

/* =============================*/
/* ====  Cover JPG Export  ==== */
/* =============================*/

function exportCover() {

  app.jpegExportPreferences.properties = {
   jpegRenderingStyle: JPEGOptionsFormat.BASELINE_ENCODING,
   jpegExportRange: ExportRangeOrAllPages.EXPORT_RANGE,
   jpegQuality: JPEGOptionsQuality.MAXIMUM,
   jpegColorSpace: JpegColorSpaceEnum.RGB,
   // exportingSpread: true, // Uncomment if spreads
   simulateOverprint: false,
   useDocumentBleeds: false,
   embedColorProfile: true,
   exportResolution: 300,
   antiAlias: true,
}

  if (d.pages.length > 6 && d.pages.length <= 64 ) {
    // for Signs
    app.jpegExportPreferences.pageString = "1"; // Page range, only VALID if EXPORT_RANGE used
  } else if (d.pages.length == 3 || d.pages.length == 5) {
    // for book covers laid out as separate pages
    app.jpegExportPreferences.pageString = "3"; // Page range, only VALID if EXPORT_RANGE used
  } else if (d.pages.length == 1){
    // for book covers laid out as one page
    app.jpegExportPreferences.pageString = "1";
  } 

    if (d.saved) {
      thePath = String(d.fullName).replace(/\..+$/, "") + ".jpg";
      // thePath = String(d.fullName).replace(/\..+$/, "") + ".jpg";
      // thePath = String(new File(thePath).saveDlg()); // use this line if you want the save dialog to show
      thePath = String(new File(thePath));
    } else {
      // thePath = String((new File).saveDlg()); // use this line if you want the save dialog to show
      thePath = String(new File());
    } 


    thePath = thePath.replace(/\.jpg$/, ""); 
    // thePath2 = thePath.replace(/(\d+b|\.pdf$)/, ""); 
    name1 = thePath+".jpg"; 


    try {
      if (app.activeDocument.layers.item("Bookline").isValid == true){
        app.activeDocument.layers.item("Bookline").visible = false; // turn off Bookine layer (if it is visible) for single page export
        d.exportFile(ExportFormat.JPG, new File(name1), false);
        // alert("Your Cover Image has exported.");
      } else { // if no layer named "Bookline" exisits
        d.exportFile(ExportFormat.JPG, new File(name1), false);
        // alert("Your Cover Image has exported.");
      }
    } catch (errExport) {
      // alert('ERROR: The PDF file is either selected or open.');
      alert(errExport.line);
    }

}
