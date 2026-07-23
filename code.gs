// Google Apps Script for Customer Survey Data Management
// This script handles saving form data to Google Sheets and retrieving dashboard data

// Sheet name where data will be stored
const SHEET_NAME = "SurveyResponses";

// Nepal districts data for province filtering
const DISTRICTS = {
  1: ['ताप्लेजुङ', 'पाँचथर', 'इलाम', 'झापा', 'मोरङ', 'सुनसरी', 'धनकुटा', 'तेह्रथुम', 'संखुवासभा', 'भोजपुर', 'सोलुखुम्बु', 'ओखलढुङ्गा', 'खोटाङ', 'उदयपुर'],
  2: ['सप्तरी', 'सिराहा', 'धनुषा', 'महोत्तरी', 'सर्लाही', 'रौतहट', 'बारा', 'पर्सा'],
  3: ['सिन्धुली', 'रामेछाप', 'दोलखा', 'सिन्धुपाल्चोक', 'काभ्रेपलाञ्चोक', 'ललितपुर', 'भक्तपुर', 'काठमाडौं', 'नुवाकोट', 'रसुवा', 'धादिङ', 'चितवन', 'मकवानपुर'],
  4: ['गोरखा', 'लमजुङ', 'तनहुँ', 'कास्की', 'मनाङ', 'मुस्ताङ', 'पर्वत', 'स्याङ्जा', 'म्याग्दी', 'बाग्लुङ', 'नवलपरासी (बर्दघाट सुस्ता पूर्व)'],
  5: ['नवलपरासी (बर्दघाट सुस्ता पश्चिम)', 'रुपन्देही', 'कपिलवस्तु', 'पाल्पा', 'अर्घाखाँची', 'गुल्मी', 'रोल्पा', 'प्युठान', 'दाङ', 'बाँके', 'बर्दिया', 'पूर्वी रुकुम'],
  6: ['पश्चिम रुकुम', 'सल्यान', 'सुर्खेत', 'दैलेख', 'जाजरकोट', 'डोल्पा', 'हुम्ला', 'जुम्ला', 'कालिकोट', 'मुगु'],
  7: ['बाजुरा', 'बझाङ', 'डोटी', 'अछाम', 'दार्चुला', 'बैतडी', 'डडेल्धुरा', 'कञ्चनपुर', 'कैलाली']
};

// Initialize the sheet with headers if it doesn't exist
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Set headers only for new sheet
    const headers = [
      "Timestamp",
      "District_Local_Level",
      "Age_Group",
      "Service_Date",
      "Final_Suggestion",
      "Good_Offices",
      "Bad_Offices",
      "Office_ID",
      "Office_Name",
      "Question_1",
      "Question_2",
      "Question_3",
      "Question_4",
      "Question_5",
      "Question_6",
      "Question_7",
      "Question_8",
      "Question_9",
      "Question_10",
      "Problem",
      "Suggestion"
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  } else {
    // Check if new columns need to be added to existing sheet
    const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (!currentHeaders.includes("Good_Offices")) {
      sheet.insertColumns(6, 2);
      sheet.getRange(1, 6).setValue("Good_Offices");
      sheet.getRange(1, 7).setValue("Bad_Offices");
    }
  }

  return sheet;
}

// Save survey data to Google Sheets
function saveSurveyData(data) {
  const sheet = setupSheet();
  const timestamp = new Date();
  
  const metadata = data.मेटाडाटा || {};
  const responses = data.जवाफहरू || {};
  
  const serviceDateValue = (metadata.मिति || '').toString().trim();
  const normalizedServiceDate = serviceDateValue ? "'" + serviceDateValue : "";
  
  const rows = [];

  // Iterate through each office's responses
  for (const officeName in responses) {
    const officeData = responses[officeName];
    const officeId = getOfficeIdByName(officeName);

    const row = [
      timestamp,
      metadata.जिल्ला_स्थानीय_तह || "",
      metadata.उमेर_समूह || "",
      normalizedServiceDate,
      metadata.सेवा_सुधार_सुझाव || "",
      metadata.राम्रो_सेवा_कार्यालयहरू || "",
      metadata.खराब_सेवा_कार्यालयहरू || "",
      officeId,
      officeName,
      officeData.q1 || "",
      officeData.q2 || "",
      officeData.q3 || "",
      officeData.q4 || "",
      officeData.q5 || "",
      officeData.q6 || "",
      officeData.q7 || "",
      officeData.q8 || "",
      officeData.q9 || "",
      officeData.q10 || "",
      officeData.समस्या || "",
      officeData.सुझाव || ""
    ];

    rows.push(row);
  }
  
  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).setNumberFormat('@');
  }
  
  return { success: true, message: "Data saved successfully" };
}

// Get office ID by name
function getOfficeIdByName(officeName) {
  const officeMap = {
    "जिल्ला प्रशासन कार्यालय": "dao",
    "मालपोत कार्यालय": "malpot",
    "नापी कार्यालय": "napi",
    "यातायात व्यवस्था कार्यालय": "transport",
    "स्वास्थ्य सेवा (सरकारी अस्पताल/स्वास्थ्य केन्द्र)": "hospital",
    "शिक्षा (सामुदायिक विद्यालय, शिक्षा सँग सम्बन्धित कार्यालय, NOC शाखा)": "school",
    "वैदेशिक रोजगार विभाग/वैदेशिक रोजगार कार्यालय": "foreign_employment",
    "उद्योग, वाणिज्य आपूर्ति र कर सम्बन्धी कार्यालय": "industry",
    "नेपाल प्रहरी": "police",
    "स्थानीय तह (पालिका/वडा कार्यालय)": "local_level"
  };
  
  return officeMap[officeName] || "unknown";
}

// Get all survey data for dashboard
function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet || sheet.getLastRow() <= 1) {
    return { success: true, data: [], stats: {} };
  }
  
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  // Process data for dashboard
  const processedData = data.map(row => ({
    timestamp: row[0],
    district: row[1],
    ageGroup: row[2],
    serviceDate: row[3],
    finalSuggestion: row[4],
    goodOffices: row[5] || "",
    badOffices: row[6] || "",
    officeId: row[7],
    officeName: row[8],
    q1: row[9],
    q2: row[10],
    q3: row[11],
    q4: row[12],
    q5: row[13],
    q6: row[14],
    q7: row[15],
    q8: row[16],
    q9: row[17],
    q10: row[18],
    problem: row[19],
    suggestion: row[20]
  }));
  
  // Calculate statistics
  const stats = calculateStatistics(processedData);
  
  return { success: true, data: processedData, stats: stats };
}

// Calculate statistics for dashboard
function calculateStatistics(data) {
  const totalResponses = data.length;
  const officeStats = {};
  const districtStats = {};
  const ageGroupStats = {};
  const satisfactionScores = {};
  const goodOfficeStats = {};
  const badOfficeStats = {};

  data.forEach(row => {
    // Count by office
    if (!officeStats[row.officeName]) {
      officeStats[row.officeName] = { count: 0, scores: [] };
    }
    officeStats[row.officeName].count++;

    // Collect satisfaction scores (q9 or q10 depending on office)
    const score = row.q9 || row.q10;
    if (score && !isNaN(parseInt(score))) {
      officeStats[row.officeName].scores.push(parseInt(score));
    }

    // Count by district
    if (row.district) {
      districtStats[row.district] = (districtStats[row.district] || 0) + 1;
    }

    // Count by age group
    if (row.ageGroup) {
      ageGroupStats[row.ageGroup] = (ageGroupStats[row.ageGroup] || 0) + 1;
    }

    // Count good offices
    if (row.goodOffices) {
      const offices = row.goodOffices.split(',').map(o => o.trim()).filter(o => o);
      offices.forEach(office => {
        goodOfficeStats[office] = (goodOfficeStats[office] || 0) + 1;
      });
    }

    // Count bad offices
    if (row.badOffices) {
      const offices = row.badOffices.split(',').map(o => o.trim()).filter(o => o);
      offices.forEach(office => {
        badOfficeStats[office] = (badOfficeStats[office] || 0) + 1;
      });
    }
  });

  // Calculate average satisfaction scores
  for (const office in officeStats) {
    const scores = officeStats[office].scores;
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      satisfactionScores[office] = avg.toFixed(2);
    } else {
      satisfactionScores[office] = "N/A";
    }
  }

  return {
    totalResponses,
    officeStats,
    districtStats,
    ageGroupStats,
    satisfactionScores,
    goodOfficeStats,
    badOfficeStats
  };
}

// Get filtered data for dashboard
function getFilteredData(filters) {
  const result = getDashboardData();
  let filteredData = result.data;
  
  if (filters.provinceId && filters.provinceId !== "all") {
    // Filter by province - need to map district to province
    const provinceDistricts = DISTRICTS[parseInt(filters.provinceId)] || [];
    filteredData = filteredData.filter(row => {
      // Check if district is in this province
      return provinceDistricts.some(d => row.district && row.district.includes(d));
    });
  }
  
  if (filters.district && filters.district !== "all") {
    filteredData = filteredData.filter(row => row.district === filters.district);
  }
  
  if (filters.localLevel && filters.localLevel !== "all") {
    filteredData = filteredData.filter(row => row.district && row.district.includes(filters.localLevel));
  }
  
  if (filters.officeId && filters.officeId !== "all") {
    if (filters.officeId === "other") {
      // Show rows with finalSuggestion content (other offices)
      filteredData = filteredData.filter(row => row.finalSuggestion && row.finalSuggestion.trim() !== '');
    } else {
      filteredData = filteredData.filter(row => row.officeId === filters.officeId);
    }
  }
  
  if (filters.ageGroup && filters.ageGroup !== "all") {
    filteredData = filteredData.filter(row => row.ageGroup === filters.ageGroup);
  }
  
  if (filters.startDate) {
    filteredData = filteredData.filter(row => {
      // Compare with service date (BS format YYYY-MM-DD)
      if (row.serviceDate) {
        return row.serviceDate >= filters.startDate;
      }
      // Fallback to timestamp if service date not available
      const rowDate = new Date(row.timestamp);
      return rowDate >= new Date(filters.startDate);
    });
  }

  if (filters.endDate) {
    filteredData = filteredData.filter(row => {
      // Compare with service date (BS format YYYY-MM-DD)
      if (row.serviceDate) {
        return row.serviceDate <= filters.endDate;
      }
      // Fallback to timestamp if service date not available
      const rowDate = new Date(row.timestamp);
      return rowDate <= new Date(filters.endDate);
    });
  }
  
  if (filters.questionFilter && filters.questionFilter !== "all") {
    // Filter by specific question answer
    const questionNum = parseInt(filters.questionFilter.replace('q', ''));
    filteredData = filteredData.filter(row => {
      const answer = row['q' + questionNum];
      return answer !== undefined && answer !== null && answer !== '';
    });
  }
  
  if (filters.problemFilter && filters.problemFilter !== "all") {
    filteredData = filteredData.filter(row => row.problem === filters.problemFilter);
  }
  
  if (filters.suggestionFilter && filters.suggestionFilter !== "all") {
    filteredData = filteredData.filter(row => row.suggestion === filters.suggestionFilter);
  }
  
  const filteredStats = calculateStatistics(filteredData);
  
  return { success: true, data: filteredData, stats: filteredStats };
}

// Get unique values for filters
function getFilterOptions() {
  const result = getDashboardData();
  const offices = [...new Set(result.data.map(row => row.officeName))];
  const districts = [...new Set(result.data.map(row => row.district).filter(d => d))];
  const ageGroups = [...new Set(result.data.map(row => row.ageGroup).filter(a => a))];
  
  return {
    success: true,
    offices,
    districts,
    ageGroups
  };
}

// Web app endpoint for saving data
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = saveSurveyData(data);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Web app endpoint for getting dashboard data
function doGet(e) {
  try {
    const action = e.parameter.action || "getData";
    
    if (action === "getData") {
      const result = getDashboardData();
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (action === "getFilteredData") {
      const filters = {
        provinceId: e.parameter.provinceId || "all",
        district: e.parameter.district || "all",
        localLevel: e.parameter.localLevel || "all",
        officeId: e.parameter.officeId || "all",
        ageGroup: e.parameter.ageGroup || "all",
        startDate: e.parameter.startDate || "",
        endDate: e.parameter.endDate || "",
        questionFilter: e.parameter.questionFilter || "all",
        problemFilter: e.parameter.problemFilter || "all",
        suggestionFilter: e.parameter.suggestionFilter || "all"
      };
      const result = getFilteredData(filters);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (action === "getFilterOptions") {
      const result = getFilterOptions();
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
