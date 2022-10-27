/* --------------------------------------
Multi-file Export v1.1
by Aaron Troia (@atroia)
Modified Date: 10/26/22

Description: 
Multi-file Export allows you to export multiple PDFs with different 
InDesign export options (1 per) and an IDML at the same time. 


v1.1 update - added sig check function
-------------------------------------- */

#targetengine "session"

var g = {};
var d = app.activeDocument;
createDialog();
g.win.show();


// pallette window
function createDialog() {
  // create panel
  g.win = new Window("palette", "Export Options");
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
     check();
  };
  // cancel button
  g.win.grButs.cancel.onClick = function() {
    g.win.close();
  };
}

// this is the PDF export function
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
    app.activeDocument.layers.item("Bookline").visible = false; // turn off Bookine layer (if it is visible) for single page export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name1), false, preset1);
  };

  // Prepress (bleed + spreads)
  if(g.win.pnlOps2.chkSpreadsBld.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    app.activeDocument.layers.item("Bookline").visible = false; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name1), false, preset3);
  };

  // Prepress (spreads)
  if(g.win.pnlOps.chkSpreads.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    app.activeDocument.layers.item("Bookline").visible = true; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name2), false, preset2);
  };

  // First Chapter / Low Resolution
  if(g.win.pnlOps.chkLow.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    app.activeDocument.layers.item("Bookline").visible = true; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name4), false, preset4);
  };

  // High Resolution - No Compression
  if(g.win.pnlOps2.chkHigh.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    app.activeDocument.layers.item("Bookline").visible = false; // turn on Bookline for spreads export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name5), false, preset6);
  };

  // Prepress
  if(g.win.pnlOps2.chkPages.value == true){
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    // books
    app.activeDocument.layers.item("Bookline").visible = false; // turn off Bookine layer (if it is visible) for single page export
    d.exportFile(ExportFormat.PDF_TYPE, new File(name1), false, preset5);
  };

  // IDML
  if(g.win.pnlIDML.chkIDML.value == true){
    // 1 page cover
    app.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
    d.exportFile(ExportFormat.INDESIGN_MARKUP, new File(name3)); // IDML EXPORT
  }
}

// This function checks the page length to 16 page signatures for publishing
function check(){
  if (d.pages.length > 32) {
    if (d.pages.length % 16 !== 0){
        var round_under = (Math.round(d.pages.length/16) * 16);
        var round_over = (((Math.round(d.pages.length/16)) + 1) * 16);
        alert(
          d.pages.length + " pages is not an even sig break.\nTry either " + round_under + " pages or " + round_over + " pages."
        );
    } else {
        alert("Looing good. Your book is at an even sig marker. " + d.pages.length + " pages.")
    }
  // for smaller publications, less that 32 pages, its checking against 8 page signatures
  } else if (d.pages.length < 32) {
    if (d.pages.length % 8 !== 0) {
        alert("Hold on there, this page count isnt adding up.");
      } else {
      alert("Looking good. Your book is at an even sig marker. " + d.pages.length + " pages.")
    }
  }
}