/**
 * Google Apps Script for SkyFynd BuildMyPlan — Admin Quote Management System
 *
 * Handles:
 *  - Customer quote submissions (doPost action=submit_quote)
 *  - Admin: list all quotes (doGet action=list_quotes)
 *  - Admin: get single quote JSON (doGet action=get_quote)
 *  - Admin: save discount (doPost action=save_discount)
 *  - Admin: toggle customer status (doPost action=toggle_customer)
 *  - Admin: send quote to client (doPost action=send_quote)
 *
 * Setup:
 *  1. Open Google Apps Script editor
 *  2. Paste this code into Code.gs
 *  3. Run setupMasterLead() once to create headers
 *  4. Deploy → New deployment → Web app (Execute as: Me, Access: Anyone)
 *  5. Copy deployment URL into .env.local as GOOGLE_APPS_SCRIPT_URL
 *
 * IMPORTANT: After updating this code, create a NEW deployment version.
 */

// ── Constants ──

var MASTER_LEAD_SHEET_ID = '1ESFbhqXwvV3douzXrX_VII1Eh8UqaU5s7mnSgKpd_6Q';
var CUSTOMER_SHEET_ID = '1UHWQJI4wu0qoM1UycPTLNZUxcBrKLWtlFu4_LJXxG3A';
var JSON_FOLDER_ID = '1o8KbnqJYpI4-A4cJ6uGcL5zBDHQSo72h';
var ADMIN_BASE_URL = 'https://buildmyplan.skyfynd.io/admin/quotes';
var NOTIFICATION_EMAIL = 'contact@skyfynd.io';
var LOGO_URL = 'https://f005.backblazeb2.com/file/SKYFYND-assets/Skyfynd+logo.png';

var MASTER_SHEET_NAME = 'Master Leads';
var CUSTOMER_SHEET_NAME = 'Customers';

// ── Master Lead Sheet Headers (20 columns) ──

function getMasterLeadHeaders() {
  return [
    'QR#',              // A - hyperlinked to admin
    'Customer ID',      // B
    'Date',             // C
    'Timestamp',        // D
    'Source',           // E
    'Name',             // F
    'Email',            // G
    'Company',          // H
    'Phone',            // I
    'Service Count',    // J
    'Service Names',    // K
    'One-Time Total',   // L
    'Monthly Total',    // M
    'Discount %',       // N
    'Grand Total',      // O
    'Has Custom Quote', // P
    'Customer',         // Q - checkbox
    'Service Started',  // R
    'Service Ended',    // S
    'Notes'             // T
  ];
}

// ── Customer Sheet Headers ──

function getCustomerHeaders() {
  return [
    'Customer ID',      // A
    'Name',             // B
    'Email',            // C
    'Company',          // D
    'Phone',            // E
    'Quote Count',      // F
    'Total Spent',      // G
    'Service Started',  // H
    'Service Ended',    // I
    'Last Quote Date'   // J
  ];
}

// ── Setup Functions ──

function setupMasterLead() {
  var ss = SpreadsheetApp.openById(MASTER_LEAD_SHEET_ID);
  var sheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(MASTER_SHEET_NAME);
  }

  var headers = getMasterLeadHeaders();
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4a148c');
  headerRange.setFontColor('#ffffff');

  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
  sheet.setColumnWidth(11, 300); // Service Names
  sheet.setColumnWidth(20, 250); // Notes
}

function setupCustomerSheet() {
  var ss = SpreadsheetApp.openById(CUSTOMER_SHEET_ID);
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CUSTOMER_SHEET_NAME);
  }

  var headers = getCustomerHeaders();
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4a148c');
  headerRange.setFontColor('#ffffff');

  for (var i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }
}

// ── Routing ──

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action || 'submit_quote';

    switch (action) {
      case 'submit_quote':
        return jsonResponse(handleSubmitQuote(data));
      case 'save_discount':
        return jsonResponse(handleSaveDiscount(data));
      case 'toggle_customer':
        return jsonResponse(handleToggleCustomer(data));
      case 'send_quote':
        return jsonResponse(handleSendQuote(data));
      default:
        return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
    }
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function doGet(e) {
  try {
    var action = e.parameter.action || 'list_quotes';

    switch (action) {
      case 'list_quotes':
        return jsonResponse(handleListQuotes());
      case 'get_quote':
        var qr = e.parameter.qr || '';
        return jsonResponse(handleGetQuote(qr));
      default:
        return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
    }
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Quote Submission ──

function handleSubmitQuote(data) {
  var ss = SpreadsheetApp.openById(MASTER_LEAD_SHEET_ID);
  var sheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!sheet) {
    setupMasterLead();
    sheet = ss.getSheetByName(MASTER_SHEET_NAME);
  }

  // Generate QR number and Customer ID (does NOT create Customer Sheet entry)
  var qrNumber = generateNextQR(sheet);
  var customerId = assignCustomerId(data, sheet);
  var dateStr = new Date().toISOString().split('T')[0];

  // Save full JSON to Drive
  var fileName = qrNumber + '_' + dateStr + '.json';
  var quoteJSON = {
    qrNumber: qrNumber,
    customerId: customerId,
    submittedAt: new Date().toISOString(),
    source: data.source || '',
    customer: {
      name: data.name || '',
      email: data.email || '',
      company: data.company || '',
      phone: data.phone || '',
      notes: data.notes || ''
    },
    services: data.resolvedServices || [],
    totals: {
      oneTimeTotal: data.oneTimeTotal || 0,
      monthlyTotal: data.monthlyTotal || 0,
      hasCustomQuote: data.hasCustomQuote || false,
      discountPercentage: data.discountPercentage || 0,
      grandTotal: data.grandTotal || 0
    },
    discounts: null,
    rawPayload: {
      servicesDetail: data.servicesDetail || [],
      serviceCount: data.serviceCount || 0,
      serviceNames: data.serviceNames || ''
    }
  };

  var folder = DriveApp.getFolderById(JSON_FOLDER_ID);
  folder.createFile(fileName, JSON.stringify(quoteJSON, null, 2), MimeType.PLAIN_TEXT);

  // Build admin link
  var adminLink = ADMIN_BASE_URL + '?qr=' + qrNumber;

  // Append row to Master Lead (20 columns)
  var now = new Date();
  var timeStr = Utilities.formatDate(now, Session.getScriptTimeZone(), 'HH:mm:ss');
  var row = [
    qrNumber,                                            // A: QR#
    customerId,                                          // B: Customer ID
    dateStr,                                             // C: Date
    timeStr,                                             // D: Timestamp
    data.source || '',                                   // E: Source
    data.name || '',                                     // F: Name
    data.email || '',                                    // G: Email
    data.company || '',                                  // H: Company
    data.phone || '',                                    // I: Phone
    data.serviceCount || 0,                              // J: Service Count
    data.serviceNames || '',                             // K: Service Names
    data.oneTimeTotal || 0,                              // L: One-Time Total
    data.monthlyTotal || 0,                              // M: Monthly Total
    data.discountPercentage || 0,                        // N: Discount %
    data.grandTotal || 0,                                // O: Grand Total
    data.hasCustomQuote ? 'TRUE' : 'FALSE',              // P: Has Custom Quote
    false,                                               // Q: Customer (checkbox)
    '',                                                  // R: Service Started
    '',                                                  // S: Service Ended
    data.notes || ''                                     // T: Notes
  ];

  sheet.appendRow(row);

  // Make QR# a hyperlink
  var lastRow = sheet.getLastRow();
  var qrCell = sheet.getRange(lastRow, 1);
  var richText = SpreadsheetApp.newRichTextValue()
    .setText(qrNumber)
    .setLinkUrl(adminLink)
    .build();
  qrCell.setRichTextValue(richText);

  // Format currency columns
  sheet.getRange(lastRow, 12).setNumberFormat('$#,##0');  // One-Time Total
  sheet.getRange(lastRow, 13).setNumberFormat('$#,##0');  // Monthly Total
  sheet.getRange(lastRow, 15).setNumberFormat('$#,##0');  // Grand Total

  // Insert checkbox for Customer column
  sheet.getRange(lastRow, 17).insertCheckboxes();

  // Send email notification (pass full quoteJSON for detailed breakdown)
  sendNotificationEmail(quoteJSON, adminLink);

  return { status: 'success', qr_number: qrNumber };
}

// ── QR Number Generation ──

function generateNextQR(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return 'QR-00001';
  }

  // Read all QR numbers and find the highest
  var qrValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var maxNum = 0;
  for (var i = 0; i < qrValues.length; i++) {
    var val = String(qrValues[i][0]);
    var match = val.match(/QR-(\d+)/);
    if (match) {
      var num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }

  var next = maxNum + 1;
  return 'QR-' + ('00000' + next).slice(-5);
}

// ── Customer ID Assignment (does NOT write to Customer Sheet) ──

function assignCustomerId(data, masterSheet) {
  var email = (data.email || '').trim().toLowerCase();

  // Look for existing Customer ID in the Master Lead sheet by matching email
  var lastRow = masterSheet.getLastRow();
  if (lastRow > 1) {
    var emailCol = masterSheet.getRange(2, 7, lastRow - 1, 1).getValues(); // Column G = Email
    var idCol = masterSheet.getRange(2, 2, lastRow - 1, 1).getValues();    // Column B = Customer ID

    for (var i = 0; i < emailCol.length; i++) {
      if (String(emailCol[i][0]).trim().toLowerCase() === email) {
        return String(idCol[i][0]); // Reuse existing Customer ID
      }
    }
  }

  // Generate new Customer ID (based on highest existing in Master Lead)
  var maxNum = 0;
  if (lastRow > 1) {
    var allIds = masterSheet.getRange(2, 2, lastRow - 1, 1).getValues(); // Column B
    for (var j = 0; j < allIds.length; j++) {
      var val = String(allIds[j][0]);
      var match = val.match(/C-(\d+)/);
      if (match) {
        var num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    }
  }

  var next = maxNum + 1;
  return 'C-' + ('00000' + next).slice(-5);
}

// ═══════════════════════════════════════════════════════════
// ── HTML Email Builder (shared between admin & client)
// ═══════════════════════════════════════════════════════════

function buildQuoteHtml(quoteJSON, options) {
  var showAdminLink = options.showAdminLink || false;
  var adminLink = options.adminLink || '';

  var q = quoteJSON;
  var customer = q.customer || {};
  var services = q.services || [];
  var totals = q.totals || {};
  var discounts = q.discounts || null;
  var dateStr = q.submittedAt ? new Date(q.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  var html = '';

  // ── Wrapper ──
  html += '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>';
  html += '<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:20px 0;">';
  html += '<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">';

  // ── Header with gradient + logo ──
  html += '<tr><td style="background-color:#4a148c;background:linear-gradient(135deg,#4a148c 0%,#7b1fa2 50%,#9c27b0 100%);padding:30px 40px;text-align:center;">';
  html += '<img src="' + LOGO_URL + '" alt="SkyFynd" width="140" style="display:block;margin:0 auto 12px;max-width:140px;" />';
  html += '<h1 style="color:#ffffff;margin:0 0 4px;font-size:22px;font-weight:700;">Quote Estimate</h1>';
  html += '<p style="color:#e1bee7;margin:0;font-size:14px;">' + q.qrNumber + ' &bull; ' + dateStr + '</p>';
  html += '</td></tr>';

  // ── Client Info ──
  html += '<tr><td style="padding:24px 40px 16px;">';
  html += '<h2 style="color:#4a148c;font-size:16px;margin:0 0 12px;border-bottom:2px solid #f0e6ff;padding-bottom:8px;">Client Information</h2>';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#333;">';

  var clientFields = [
    ['Name', customer.name],
    ['Email', customer.email],
    ['Company', customer.company],
    ['Phone', customer.phone],
    ['Source', q.source]
  ];
  for (var ci = 0; ci < clientFields.length; ci++) {
    if (clientFields[ci][1]) {
      html += '<tr><td style="padding:4px 0;color:#888;width:100px;">' + clientFields[ci][0] + ':</td>';
      html += '<td style="padding:4px 0;font-weight:600;">' + clientFields[ci][1] + '</td></tr>';
    }
  }
  html += '</table></td></tr>';

  // ── Service Breakdown ──
  html += '<tr><td style="padding:16px 40px;">';
  html += '<h2 style="color:#4a148c;font-size:16px;margin:0 0 16px;border-bottom:2px solid #f0e6ff;padding-bottom:8px;">Service Breakdown</h2>';

  for (var si = 0; si < services.length; si++) {
    var svc = services[si];
    html += '<div style="margin-bottom:20px;">';

    // Service header
    html += '<table width="100%" cellpadding="0" cellspacing="0"><tr>';
    html += '<td style="background-color:#f5f0ff;padding:8px 12px;border-radius:6px;font-weight:700;color:#4a148c;font-size:14px;">';
    html += svc.serviceLabel;
    html += '</td>';
    html += '<td style="background-color:#f5f0ff;padding:8px 12px;border-radius:6px;text-align:right;font-weight:700;color:#4a148c;font-size:14px;">';
    var svcPrices = [];
    if (svc.oneTimeTotal > 0) svcPrices.push('$' + formatNumber(svc.oneTimeTotal));
    if (svc.monthlyTotal > 0) svcPrices.push('$' + formatNumber(svc.monthlyTotal) + '/mo');
    html += svcPrices.join(' + ') || '$0';
    html += '</td></tr></table>';

    // Steps
    var steps = svc.steps || [];
    if (steps.length > 0) {
      html += '<table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#555;margin-top:6px;">';
      for (var sti = 0; sti < steps.length; sti++) {
        var step = steps[sti];
        if (step.selectedId === null && step.children) {
          // Group header
          html += '<tr><td colspan="3" style="padding:6px 0 2px;font-weight:700;color:#666;font-size:12px;text-transform:uppercase;">' + step.stepName + '</td></tr>';
          var children = step.children || [];
          for (var chi = 0; chi < children.length; chi++) {
            var child = children[chi];
            html += '<tr>';
            html += '<td style="padding:2px 0 2px 12px;color:#888;width:35%;">' + child.stepName + '</td>';
            html += '<td style="padding:2px 0;">' + child.selectedLabel + '</td>';
            html += '<td style="padding:2px 0;text-align:right;color:#4a148c;font-weight:600;white-space:nowrap;">';
            if (child.priceImpact !== null && child.priceImpact > 0) {
              html += child.isRecurring ? '$' + formatNumber(child.priceImpact) + '/mo' : '$' + formatNumber(child.priceImpact);
            }
            html += '</td></tr>';
          }
        } else {
          html += '<tr>';
          html += '<td style="padding:2px 0 2px 4px;color:#888;width:35%;">' + step.stepName + '</td>';
          html += '<td style="padding:2px 0;">' + step.selectedLabel + '</td>';
          html += '<td style="padding:2px 0;text-align:right;color:#4a148c;font-weight:600;white-space:nowrap;">';
          if (step.priceImpact !== null && step.priceImpact > 0) {
            html += step.isRecurring ? '$' + formatNumber(step.priceImpact) + '/mo' : '$' + formatNumber(step.priceImpact);
          }
          html += '</td></tr>';
        }
      }
      html += '</table>';
    }

    html += '</div>'; // end service block
  }
  html += '</td></tr>';

  // ── Price Summary Table ──
  html += '<tr><td style="padding:0 40px 24px;">';
  html += '<h2 style="color:#4a148c;font-size:16px;margin:0 0 12px;border-bottom:2px solid #f0e6ff;padding-bottom:8px;">Price Summary</h2>';
  html += '<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e0f0;border-radius:8px;overflow:hidden;">';

  // Table header
  html += '<tr style="background-color:#f5f0ff;">';
  html += '<td style="padding:10px 14px;font-weight:700;color:#4a148c;font-size:13px;">Service</td>';
  html += '<td style="padding:10px 14px;font-weight:700;color:#4a148c;font-size:13px;text-align:center;">One-Time</td>';
  html += '<td style="padding:10px 14px;font-weight:700;color:#4a148c;font-size:13px;text-align:right;">Monthly</td>';
  html += '</tr>';

  // Per-service rows
  for (var pi = 0; pi < services.length; pi++) {
    var psvc = services[pi];
    var bgColor = pi % 2 === 0 ? '#ffffff' : '#faf8fd';
    html += '<tr style="background-color:' + bgColor + ';">';
    html += '<td style="padding:8px 14px;font-size:13px;color:#333;">' + psvc.serviceLabel + '</td>';
    html += '<td style="padding:8px 14px;font-size:13px;color:#333;text-align:center;">' + (psvc.oneTimeTotal > 0 ? '$' + formatNumber(psvc.oneTimeTotal) : '—') + '</td>';
    html += '<td style="padding:8px 14px;font-size:13px;color:#333;text-align:right;">' + (psvc.monthlyTotal > 0 ? '$' + formatNumber(psvc.monthlyTotal) + '/mo' : '—') + '</td>';
    html += '</tr>';
  }

  // Subtotal rows
  html += '<tr style="background-color:#f5f0ff;border-top:2px solid #e8e0f0;">';
  html += '<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;">Total One-Time</td>';
  html += '<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;text-align:center;">$' + formatNumber(totals.oneTimeTotal || 0) + '</td>';
  html += '<td style="padding:8px 14px;font-size:13px;color:#888;text-align:right;"></td></tr>';

  if ((totals.monthlyTotal || 0) > 0) {
    html += '<tr style="background-color:#f5f0ff;">';
    html += '<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;">Total Monthly</td>';
    html += '<td style="padding:8px 14px;font-size:13px;color:#888;text-align:center;"></td>';
    html += '<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#333;text-align:right;">$' + formatNumber(totals.monthlyTotal) + '/mo</td></tr>';
  }

  // Discount row
  if (discounts && discounts.totalSaved > 0) {
    html += '<tr style="background-color:#f0fff0;">';
    html += '<td style="padding:8px 14px;font-weight:700;font-size:13px;color:#2e7d32;">Discount (' + (totals.discountPercentage || 0) + '%)</td>';
    html += '<td colspan="2" style="padding:8px 14px;font-weight:700;font-size:13px;color:#2e7d32;text-align:right;">-$' + formatNumber(discounts.totalSaved) + '</td></tr>';
  }

  // Due Today row
  html += '<tr style="background-color:#4a148c;background:linear-gradient(135deg,#4a148c 0%,#7b1fa2 100%);">';
  html += '<td style="padding:14px;font-weight:700;font-size:16px;color:#ffffff;">DUE TODAY</td>';
  html += '<td colspan="2" style="padding:14px;font-weight:700;font-size:20px;color:#ffffff;text-align:right;">$' + formatNumber(totals.grandTotal || 0) + '</td></tr>';

  html += '</table></td></tr>';

  // ── Admin Link Button (optional) ──
  if (showAdminLink && adminLink) {
    html += '<tr><td style="padding:0 40px 24px;text-align:center;">';
    html += '<a href="' + adminLink + '" style="display:inline-block;background:linear-gradient(135deg,#8b5cf6 0%,#d946ef 50%,#ec4899 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;">View in Admin Dashboard</a>';
    html += '</td></tr>';
  }

  // ── Notes ──
  if (customer.notes) {
    html += '<tr><td style="padding:0 40px 24px;">';
    html += '<h2 style="color:#4a148c;font-size:14px;margin:0 0 8px;">Client Notes</h2>';
    html += '<p style="color:#555;font-size:13px;margin:0;background:#faf8fd;padding:12px;border-radius:6px;">' + customer.notes + '</p>';
    html += '</td></tr>';
  }

  // ── Footer ──
  html += '<tr><td style="background-color:#f9f7fc;padding:20px 40px;text-align:center;border-top:1px solid #e8e0f0;">';
  html += '<p style="color:#888;font-size:12px;margin:0 0 6px;font-style:italic;">Price may vary based on final project specifications.</p>';
  html += '<p style="color:#999;font-size:11px;margin:0 0 4px;">This is an estimate and not a binding contract.</p>';
  html += '<p style="color:#4a148c;font-size:12px;margin:0;font-weight:600;">SkyFynd — Creative & Digital Marketing</p>';
  html += '</td></tr>';

  html += '</table></td></tr></table></body></html>';

  return html;
}

function formatNumber(n) {
  return Number(n).toLocaleString('en-US');
}

// ── Email Notification (to contact@skyfynd.io) ──

function sendNotificationEmail(quoteJSON, adminLink) {
  try {
    var subject = 'New Quote Request: ' + quoteJSON.qrNumber + ' — ' + (quoteJSON.customer.name || 'Unknown');

    var htmlBody = buildQuoteHtml(quoteJSON, {
      showAdminLink: true,
      adminLink: adminLink
    });

    // Plain text fallback
    var plainText = 'New quote request received!\n\n' +
      'QR Number: ' + quoteJSON.qrNumber + '\n' +
      'Name: ' + (quoteJSON.customer.name || '') + '\n' +
      'Email: ' + (quoteJSON.customer.email || '') + '\n' +
      'Company: ' + (quoteJSON.customer.company || '') + '\n' +
      'Phone: ' + (quoteJSON.customer.phone || '') + '\n' +
      'Source: ' + (quoteJSON.source || '') + '\n\n' +
      'One-Time Total: $' + (quoteJSON.totals.oneTimeTotal || 0) + '\n' +
      'Monthly Total: $' + (quoteJSON.totals.monthlyTotal || 0) + '\n' +
      'Grand Total: $' + (quoteJSON.totals.grandTotal || 0) + '\n' +
      'Due Today: $' + (quoteJSON.totals.grandTotal || 0) + '\n\n' +
      'View in Admin: ' + adminLink + '\n';

    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, plainText, { htmlBody: htmlBody });
  } catch (err) {
    // Don't fail the quote submission if email fails
    Logger.log('Email notification failed: ' + err.toString());
  }
}

// ── Send Quote to Client (from Admin) ──

function handleSendQuote(data) {
  var qr = data.qrNumber;
  if (!qr) {
    return { status: 'error', message: 'QR number is required' };
  }

  // Read quote JSON from Drive
  var folder = DriveApp.getFolderById(JSON_FOLDER_ID);
  var files = folder.getFiles();
  var matchedFile = null;

  while (files.hasNext()) {
    var file = files.next();
    if (file.getName().indexOf(qr) === 0) {
      matchedFile = file;
      break;
    }
  }

  if (!matchedFile) {
    return { status: 'error', message: 'Quote not found for QR: ' + qr };
  }

  try {
    var content = matchedFile.getBlob().getDataAsString();
    var quoteJSON = JSON.parse(content);

    var clientEmail = quoteJSON.customer.email;
    if (!clientEmail) {
      return { status: 'error', message: 'No client email found for this quote' };
    }

    var subject = 'Your Quote from SkyFynd — ' + quoteJSON.qrNumber;

    var htmlBody = buildQuoteHtml(quoteJSON, {
      showAdminLink: false,
      adminLink: ''
    });

    var plainText = 'Your SkyFynd Quote\n\n' +
      'QR Number: ' + quoteJSON.qrNumber + '\n' +
      'One-Time Total: $' + (quoteJSON.totals.oneTimeTotal || 0) + '\n' +
      'Monthly Total: $' + (quoteJSON.totals.monthlyTotal || 0) + '\n' +
      'Due Today: $' + (quoteJSON.totals.grandTotal || 0) + '\n';

    MailApp.sendEmail(clientEmail, subject, plainText, { htmlBody: htmlBody });

    return { status: 'success', message: 'Quote sent to ' + clientEmail };
  } catch (err) {
    return { status: 'error', message: 'Failed to send quote: ' + err.toString() };
  }
}

// ── Admin: List All Quotes ──

function handleListQuotes() {
  var ss = SpreadsheetApp.openById(MASTER_LEAD_SHEET_ID);
  var sheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!sheet) {
    return { status: 'success', quotes: [] };
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { status: 'success', quotes: [] };
  }

  var headers = getMasterLeadHeaders();
  var dataRange = sheet.getRange(2, 1, lastRow - 1, headers.length);
  var values = dataRange.getValues();

  // Get rich text for QR column to extract hyperlinks
  var qrRange = sheet.getRange(2, 1, lastRow - 1, 1);
  var richTexts = qrRange.getRichTextValues();

  var quotes = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var qrLink = '';
    try {
      qrLink = richTexts[i][0].getLinkUrl() || '';
    } catch (e) {
      qrLink = '';
    }

    quotes.push({
      qrNumber: String(row[0]),
      qrLink: qrLink,
      customerId: String(row[1]),
      date: String(row[2]),
      timestamp: String(row[3] || ''),
      source: String(row[4]),
      name: String(row[5]),
      email: String(row[6]),
      company: String(row[7]),
      phone: String(row[8]),
      serviceCount: Number(row[9]) || 0,
      serviceNames: String(row[10]),
      oneTimeTotal: Number(row[11]) || 0,
      monthlyTotal: Number(row[12]) || 0,
      discountPercent: Number(row[13]) || 0,
      grandTotal: Number(row[14]) || 0,
      hasCustomQuote: String(row[15]) === 'TRUE',
      isCustomer: row[16] === true,
      serviceStarted: String(row[17] || ''),
      serviceEnded: String(row[18] || ''),
    });
  }

  return { status: 'success', quotes: quotes };
}

// ── Admin: Get Single Quote JSON ──

function handleGetQuote(qr) {
  if (!qr) {
    return { status: 'error', message: 'QR number is required' };
  }

  var folder = DriveApp.getFolderById(JSON_FOLDER_ID);
  var files = folder.getFiles();
  var matchedFile = null;

  while (files.hasNext()) {
    var file = files.next();
    var name = file.getName();
    if (name.indexOf(qr) === 0) {
      matchedFile = file;
      break;
    }
  }

  if (!matchedFile) {
    return { status: 'error', message: 'Quote not found for QR: ' + qr };
  }

  try {
    var content = matchedFile.getBlob().getDataAsString();
    var quoteData = JSON.parse(content);
    return { status: 'success', quote: quoteData, fileName: matchedFile.getName() };
  } catch (err) {
    return { status: 'error', message: 'Failed to parse quote JSON: ' + err.toString() };
  }
}

// ── Admin: Save Discount ──

function handleSaveDiscount(data) {
  var qr = data.qrNumber;
  if (!qr) {
    return { status: 'error', message: 'QR number is required' };
  }

  // Find and update the Drive JSON
  var folder = DriveApp.getFolderById(JSON_FOLDER_ID);
  var files = folder.getFiles();
  var matchedFile = null;

  while (files.hasNext()) {
    var file = files.next();
    if (file.getName().indexOf(qr) === 0) {
      matchedFile = file;
      break;
    }
  }

  if (!matchedFile) {
    return { status: 'error', message: 'Quote not found for QR: ' + qr };
  }

  try {
    var content = matchedFile.getBlob().getDataAsString();
    var quoteData = JSON.parse(content);

    // Update discount fields
    quoteData.discounts = {
      serviceDiscounts: data.serviceDiscounts || [],
      quoteDiscount: data.quoteDiscount || null,
      totalSaved: 0
    };

    // Recalculate totals with discounts
    var oneTimeTotal = quoteData.totals.oneTimeTotal;
    var monthlyTotal = quoteData.totals.monthlyTotal;
    var totalSaved = 0;

    // Apply service-level discounts
    var serviceDiscounts = data.serviceDiscounts || [];
    for (var i = 0; i < serviceDiscounts.length; i++) {
      var sd = serviceDiscounts[i];
      // Find the matching service to get its subtotals
      var svc = null;
      for (var j = 0; j < (quoteData.services || []).length; j++) {
        if (quoteData.services[j].serviceType === sd.serviceType) {
          svc = quoteData.services[j];
          break;
        }
      }
      if (svc) {
        if (sd.type === 'percentage') {
          if (sd.appliesTo === 'one-time' || sd.appliesTo === 'both') {
            totalSaved += svc.oneTimeTotal * (sd.value / 100);
          }
          if (sd.appliesTo === 'monthly' || sd.appliesTo === 'both') {
            totalSaved += svc.monthlyTotal * (sd.value / 100);
          }
        } else {
          totalSaved += sd.value;
        }
      }
    }

    // Apply quote-level discount
    var qd = data.quoteDiscount;
    if (qd) {
      if (qd.type === 'percentage') {
        if (qd.appliesTo === 'one-time' || qd.appliesTo === 'both') {
          totalSaved += oneTimeTotal * (qd.value / 100);
        }
        if (qd.appliesTo === 'monthly' || qd.appliesTo === 'both') {
          totalSaved += monthlyTotal * (qd.value / 100);
        }
      } else {
        totalSaved += qd.value;
      }
    }

    quoteData.discounts.totalSaved = totalSaved;
    quoteData.totals.grandTotal = (oneTimeTotal + monthlyTotal) - totalSaved;
    var totalBeforeDiscount = oneTimeTotal + monthlyTotal;
    quoteData.totals.discountPercentage = totalBeforeDiscount > 0 ? Math.round((totalSaved / totalBeforeDiscount) * 100) : 0;

    // Save updated JSON back to Drive
    matchedFile.setContent(JSON.stringify(quoteData, null, 2));

    // Update Master Lead row
    updateMasterLeadDiscount(qr, quoteData.totals.discountPercentage, quoteData.totals.grandTotal);

    return { status: 'success', quote: quoteData };
  } catch (err) {
    return { status: 'error', message: 'Failed to save discount: ' + err.toString() };
  }
}

function updateMasterLeadDiscount(qr, discountPercent, grandTotal) {
  var ss = SpreadsheetApp.openById(MASTER_LEAD_SHEET_ID);
  var sheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  var qrValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < qrValues.length; i++) {
    if (String(qrValues[i][0]) === qr) {
      var rowIndex = i + 2;
      sheet.getRange(rowIndex, 14).setValue(discountPercent); // Discount %
      sheet.getRange(rowIndex, 15).setValue(grandTotal);      // Grand Total
      sheet.getRange(rowIndex, 15).setNumberFormat('$#,##0');
      break;
    }
  }
}

// ── Admin: Toggle Customer Status ──

function handleToggleCustomer(data) {
  var qr = data.qrNumber;
  var isCustomer = data.isCustomer;
  var serviceStarted = data.serviceStarted || '';
  var serviceEnded = data.serviceEnded || '';

  if (!qr) {
    return { status: 'error', message: 'QR number is required' };
  }

  // Update Master Lead row
  var ss = SpreadsheetApp.openById(MASTER_LEAD_SHEET_ID);
  var sheet = ss.getSheetByName(MASTER_SHEET_NAME);
  if (!sheet) {
    return { status: 'error', message: 'Master Lead sheet not found' };
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { status: 'error', message: 'No quotes found' };
  }

  var qrValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var rowIndex = -1;
  var customerId = '';
  for (var i = 0; i < qrValues.length; i++) {
    if (String(qrValues[i][0]) === qr) {
      rowIndex = i + 2;
      customerId = String(sheet.getRange(rowIndex, 2).getValue());
      break;
    }
  }

  if (rowIndex === -1) {
    return { status: 'error', message: 'Quote not found: ' + qr };
  }

  // Update Master Lead
  sheet.getRange(rowIndex, 17).setValue(isCustomer);       // Customer checkbox
  sheet.getRange(rowIndex, 18).setValue(serviceStarted);   // Service Started
  sheet.getRange(rowIndex, 19).setValue(serviceEnded);     // Service Ended

  // Get customer info from Master Lead row for Customer Sheet
  var name = String(sheet.getRange(rowIndex, 6).getValue());
  var email = String(sheet.getRange(rowIndex, 7).getValue());
  var company = String(sheet.getRange(rowIndex, 8).getValue());
  var phone = String(sheet.getRange(rowIndex, 9).getValue());
  var grandTotal = Number(sheet.getRange(rowIndex, 15).getValue()) || 0;

  // Update or create Customer Sheet entry
  if (customerId) {
    updateCustomerSheet(customerId, isCustomer, serviceStarted, serviceEnded, {
      name: name,
      email: email,
      company: company,
      phone: phone,
      grandTotal: grandTotal
    });
  }

  return { status: 'success' };
}

function updateCustomerSheet(customerId, isCustomer, serviceStarted, serviceEnded, info) {
  var ss = SpreadsheetApp.openById(CUSTOMER_SHEET_ID);
  var sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  if (!sheet) {
    setupCustomerSheet();
    sheet = ss.getSheetByName(CUSTOMER_SHEET_NAME);
  }

  // Search for existing customer row
  var lastRow = sheet.getLastRow();
  var existingRow = -1;
  if (lastRow > 1) {
    var idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    for (var i = 0; i < idValues.length; i++) {
      if (String(idValues[i][0]) === customerId) {
        existingRow = i + 2;
        break;
      }
    }
  }

  if (isCustomer) {
    if (existingRow > 0) {
      // Update existing row
      sheet.getRange(existingRow, 2).setValue(info.name);
      sheet.getRange(existingRow, 3).setValue(info.email);
      sheet.getRange(existingRow, 4).setValue(info.company);
      sheet.getRange(existingRow, 5).setValue(info.phone);
      sheet.getRange(existingRow, 7).setValue(info.grandTotal);
      sheet.getRange(existingRow, 7).setNumberFormat('$#,##0');
      sheet.getRange(existingRow, 8).setValue(serviceStarted);
      sheet.getRange(existingRow, 9).setValue(serviceEnded);
      sheet.getRange(existingRow, 10).setValue(new Date().toISOString().split('T')[0]);
    } else {
      // Create new customer row
      var customerRow = [
        customerId,
        info.name || '',
        info.email || '',
        info.company || '',
        info.phone || '',
        1,                      // Quote Count
        info.grandTotal || 0,   // Total Spent
        serviceStarted,         // Service Started
        serviceEnded,           // Service Ended
        new Date().toISOString().split('T')[0] // Last Quote Date
      ];
      sheet.appendRow(customerRow);
      var newLastRow = sheet.getLastRow();
      sheet.getRange(newLastRow, 7).setNumberFormat('$#,##0');
    }
  } else {
    // Toggling OFF — remove the customer row if it exists
    if (existingRow > 0) {
      sheet.deleteRow(existingRow);
    }
  }
}
