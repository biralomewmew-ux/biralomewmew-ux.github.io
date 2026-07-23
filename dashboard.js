// Dashboard JavaScript for Customer Survey
// Replace this URL with your deployed Google Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx885OFPHkK7-SabPp5igoV4LIjD6dibBYq9e1T1oeHJ-fdRqFWo9QVX3vgJGF5QarQHA/exec';

// Pagination state
let currentPage = 1;
let itemsPerPage = 20;
let tableData = [];

// Office data from index.html
const OFFICES = [{
  id: 'dao',
  name: 'जिल्ला प्रशासन कार्यालय',
  q: [
    '१. नागरिकता/पासपोर्ट/राष्ट्रिय परिचयपत्र/सिफारिसको लागि पालो पाउन सहज थियो ?',
    '२. कर्मचारीको व्यवहार मैत्रीपूर्ण थियो ?',
    '३. सेवा प्रक्रिया सहज र पारदर्शी थियो ?',
    '४. कागजातको सूची स्पष्ट र सहज थियो ?',
    '५. सेवा समयमै (समय सीमा भित्र) प्राप्त भयो ?',
    '६. शुल्क/दस्तुर उचित र पारदर्शी थियो ?',
    '७. अनलाइन/डिजिटल सेवाको सुविधा उपलब्ध थियो ?',
    '८. उजुरी/गुनासो दर्ता गर्ने प्रणाली प्रभावकारी थियो?',
    '९. समग्र सेवा अनुभवलाई कति स्कोर दिनुहुन्छ ? (१–५)',
  ]
}, {
  id: 'malpot',
  name: 'मालपोत कार्यालय',
  q: [
    '१.�जिष्ट्रेशन, नामसारी, हाल-साविकको प्रक्रिया सहज थियो ?',
    '२. राजस्व/शुल्कको दर स्पष्ट र उचित थियो ?',
    '३. कर्मचारीको सहयोगीपन कस्तो थियो ?',
    '४. सेवा प्राप्ति समयमै भयो ?',
    '५. मालपोत कार्यालयको सेवा केन्द्रको भौतिक वातावरण सहज थियो ?',
    '६. अनलाइन भुक्तानी/फारमको सुविधा थियो ?',
    '७. जग्गा नामसारी, लिखत पास गर्न समस्या भएन ?',
    '८. सेवा शुल्कको रसिद/बिल प्राप्त भयो ?',
    '९. मालपोत सेवाको समग्र सन्तुष्टि (१–५)',
  ]
}, {
  id: 'napi',
  name: 'नापी कार्यालय',
  q: [
    '१. नक्सा/नापीको प्रतिलिपि पाउन सजिलो थियो ?',
    '२. सेवामा पहुँच र सहयोग राम्रो थियो ?',
    '३. सीमा विवाद समाधान गर्न सहज भयो ?',
    '४. अनलाइन नक्सा सेवा उपलब्ध थियो ?',
    '५. सेवाको समयमै प्राप्त भयो ?',
    '६. कार्यालयको शुल्क दस्तूरको जानकारी स्पष्ट थियो ?',
    '७. कागजातको झन्झट कम थियो ?',
    '८. सेवा प्राप्त गर्न धेरै पटक आउनुपर्यो ?',
    '९. समग्र सेवाको सन्तुष्टि (१–५)',
  ]
}, {
  id: 'transport',
  name: 'यातायात व्यवस्था कार्यालय',
  q: [
    '१. सवारी चालक अनुमतिपत्र (लाइसेन्स) को परीक्षा प्रक्रिया सरल थियो ?',
    '२. इम्बोस्ड नम्बर प्लेट/फिटनेसको काम समयमै भयो ?',
    '३. कर्मचारीको व्यवहार व्यावसायिक थियो ?',
    '४. अनलाइन आवेदन/ट्रायलको मिति प्राप्ति सहज थियो ?',
    '५. ट्रायल/परीक्षाको लागि पर्याप्त सुविधा थियो ?',
    '६. शुल्क पारदर्शी र उचित थियो ?',
    '७. सवारी दर्ता/नवीकरण प्रक्रिया सहज थियो ?',
    '८. पालो व्यवस्थापन प्रभावकारी थियो ?',
    '९. यातायात कार्यालयको सेवाको समग्र अनुभव (१–५)',
  ]
}, {
  id: 'hospital',
  name: 'स्वास्थ्य सेवा (सरकारी अस्पताल/स्वास्थ्य केन्द्र)',
  q: [
    '१. स्वास्थ्य संस्थामा पालो/टिकट प्रणाली सहज थियो ?',
    '२. चिकित्सक/कर्मचारीको व्यवहार मैत्रीपूर्ण थियो ?',
    '३. औषधि/उपचारको उपलब्धता पर्याप्त थियो ?',
    '४. सेवा शुल्क/बिल पारदर्शी थियो ?',
    '५. आपत्कालीन सेवा (Emergency) सहज उपलब्ध थियो ?',
    '६. पूर्वाधार (भवन, शौचालय, बस्ने ठाउँ) सफा र सहज थियो ?',
    '७. परामर्श/उपचारको समय पर्याप्त थियो ?',
    '८. स्वास्थ्य बीमा/सुविधाको जानकारी स्पष्ट थियो ?',
    '९. समग्र स्वास्थ्य सेवाको स्कोर (१–५)',
  ]
}, {
  id: 'school',
  name: 'शिक्षा (सामुदायिक विद्यालय, शिक्षा सँग सम्बन्धित कार्यालय, NOC शाखा)',
  q: [
    '१. विद्यालय भर्ना/नाम दर्ता प्रक्रिया सहज थियो ?',
    '२. शिक्षक/प्रशासनको व्यवहार राम्रो थियो ?',
    '३. छात्रवृत्ति/अनुदानको जानकारी स्पष्ट थियो ?',
    '४. विद्यालयको भौतिक सुविधा (पानी, शौचालय, पुस्तकालय) पर्याप्त थियो ?',
    '५. पाठ्यक्रम र शिक्षण विधि प्रभावकारी थियो ?',
    '६. No Objection Letter/Equivalence लिने प्रक्रिया सहज थियो ?',
    '७. No Objection Letter/Equivalence लिनका लागि अतिरिक्त दस्तूर बुझाउनु परेन ?',
    '८. No Objection Letter/Equivalence लिने प्रक्रिया पारदर्शी थियो ?',
    '९. समग्र सामुदायिक विद्यालय, शिक्षा सँग सम्बन्धित कार्यालय, NOC शाखाको स्कोर (१–५)',
  ]
}, {
  id: 'foreign_employment',
  name: 'वैदेशिक रोजगार विभाग/वैदेशिक रोजगार कार्यालय',
  q: [
        '१. सेवा सम्बन्धी सूचना तथा आवश्यक कागजातको जानकारी सहज रूपमा प्राप्त गर्नुभयो ?',
        '२. सेवा प्रक्रिया स्पष्ट र बुझ्न सजिलो थियो ?',
        '३. कर्मचारीले शिष्ट र सहयोगी व्यवहार गरे ?',
        '४. सेवा निर्धारित समयभित्र प्राप्त गर्नुभयो ?',
        '५. अनलाइन प्रणाली (FEIMS आदि) प्रभावकारी थियो ?',
        '६. सेवा शुल्क तथा प्रक्रिया पारदर्शी थियो ?',
        '७. अनावश्यक झन्झट वा धेरै पटक कार्यालय धाउनुपरेन ?',
        '८. गुनासो वा जिज्ञासाको उचित सम्बोधन भयो ?',
        '९. सेवा निष्पक्ष र पारदर्शी रूपमा प्रदान गरियो ?',
        '१०. वैदेशिक रोजगार सेवाको समग्र स्कोर (१–५) ?'
      ]
}, {
  id: 'industry',
  name: 'खानेपानी तथा ढल निकास (नेपाल खानेपानी संस्थान)',
  q: [
        '१. तपाईंले आवश्यक सेवा, प्रक्रिया र आवश्यक कागजात सम्बन्धी सूचना सहज रूपमा प्राप्त गर्नुभयो ?',
        '२. सेवा प्राप्त गर्ने प्रक्रिया स्पष्ट, सरल र बुझ्न सजिलो थियो ?',
        '३. कर्मचारीहरूले शिष्ट, सम्मानजनक र सहयोगी व्यवहार गरे ?',
        '४. सेवा निर्धारित समयभित्र प्राप्त गर्नुभयो ?',
        '५. सेवा शुल्क, कर वा दस्तुर सम्बन्धी जानकारी स्पष्ट र पारदर्शी थियो ?',
        '६. अनलाइन सेवा, डिजिटल प्रणाली वा विद्युतीय माध्यम (लागू भएमा) प्रयोग गर्न सहज र प्रभावकारी थियो ?',
        '७. सेवामा निष्पक्षता, पारदर्शिता तथा उत्तरदायित्वको अनुभव गर्नुभयो ?',
        '८. गुनासो, सुझाव वा जिज्ञासा राख्ने तथा त्यसको सुनुवाइ हुने व्यवस्था प्रभावकारी थियो ?',
        '९. सेवा प्राप्त गर्ने क्रममा अनावश्यक ढिलाइ, झन्झट वा अतिरिक्त खर्च व्यहोर्नुपरेन?',
        '१०. उद्योग, वाणिज्य आपूर्ति र कर सम्बन्धी कार्यालयको सेवाको समग्र स्कोर (१–५) ?'
      ]
}, {
  id: 'police',
  name: 'नेपाल प्रहरी',
  q: [
    '१. चारित्रिक प्रमाणपत्र/उजुरी दर्ता प्रक्रिया सहज थियो ?',
    '२. प्रहरी कर्मचारीको व्यवहार व्यावसायिक थियो ?',
    '३. सेवा समयमै प्राप्त भयो ?',
    '४. शुल्क पारदर्शी थियो ?',
    '५. उजुरी दर्ता गर्ने प्रणाली प्रभावकारी थियो ?',
    '६. अनलाइन सेवा उपलब्ध थियो ?',
    '७. कागजातको सूची स्पष्ट थियो ?',
    '८. प्रहरी कार्यालयको वातावरण सहज थियो ?',
    '९. समग्र प्रहरी सेवाको स्कोर (१–५)',
  ]
}, {
  id: 'local_level',
  name: 'स्थानीय तह (पालिका/वडा कार्यालय)',
  q: [
    '१. सिफारिस, नक्सापास, व्यक्तिगत घटना दर्ता, सामाजिक सुरक्षा आदिको प्रक्रिया सहज थियो ?',
    '२. तोकिएको समयभित्रै सेवा पाउनुभयो ?',
    '३. सेवा शुल्क सम्बन्धी जानकारी सूचना पाटी, नागरिक बडापत्र वा वेबसाइटमा स्पष्ट रुपमा राखिएको थियो ?',
    '४. आवश्यक पर्ने कागजातको जानकारी कर्मचारीले अग्रिमरुपमा दिए ?',
    '५. शुल्क/दस्तुर उचित थियो ?',
    '६. सेवा प्राप्त गर्न अतिरिक्त रकम दिनु परेन ?',
    '७. अनलाइन र डिजिटल सुविधा उपलब्ध र प्रयोगयोग्य थियो ?',
    '८. गुनासो व्यवस्थापन प्रभावकारी थियो ?',
    '९. स्थानीय तह सेवाको समग्र स्कोर (१–५)',
  ]
}];

// Global variables for charts
let officeChart, satisfactionChart, ageGroupChart, professionChart, districtChart, goodOfficeChart, badOfficeChart;
let currentData = [];

function toNepaliDigits(value) {
  if (value === null || value === undefined) return '';
  const map = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' };
  return String(value).split('').map(char => map[char] || char).join('');
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', function() {
  initializeProvinceFilter();
  initializeOfficeFilter();
  initializeNepaliDatePicker();
  loadDashboardData();
});

// Initialize province filter from nepalData.js
function initializeProvinceFilter() {
  const provinceFilter = document.getElementById('provinceFilter');
  if (window.nepalData && window.nepalData.PROVINCE) {
    for (const [id, name] of Object.entries(window.nepalData.PROVINCE)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      provinceFilter.appendChild(option);
    }
  }
}

// Initialize office filter
function initializeOfficeFilter() {
  const officeFilter = document.getElementById('officeFilter');
  OFFICES.forEach(office => {
    const option = document.createElement('option');
    option.value = office.id;
    option.textContent = office.name;
    officeFilter.appendChild(option);
  });
  
  // Add 'अन्य कार्यालय' option
  const otherOption = document.createElement('option');
  otherOption.value = 'other';
  otherOption.textContent = 'अन्य कार्यालय';
  officeFilter.appendChild(otherOption);
}

// Initialize Nepali date picker
function initializeNepaliDatePicker() {
  if (typeof NepaliDatePicker !== 'undefined') {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (startDateInput) {
      new NepaliDatePicker('#startDate', {
        format: 'YYYY-MM-DD',
        mode: 'basic',
        locale: 'np',
        closeOnDateSelect: true,
        disableDaysBeforeToday: false,
        onChange: function(date) {
          const nepaliDate = toNepaliDigits(date);
          startDateInput.value = nepaliDate;
          startDateInput.dataset.nepaliDate = nepaliDate;
        }
      });
    }

    if (endDateInput) {
      new NepaliDatePicker('#endDate', {
        format: 'YYYY-MM-DD',
        mode: 'basic',
        locale: 'np',
        closeOnDateSelect: true,
        disableDaysBeforeToday: false,
        onChange: function(date) {
          const nepaliDate = toNepaliDigits(date);
          endDateInput.value = nepaliDate;
          endDateInput.dataset.nepaliDate = nepaliDate;
        }
      });
    }
  }
}

// Convert Nepali date (BS) to English date (AD)
function nepaliToEnglish(nepaliDateStr) {
  if (!nepaliDateStr) return '';
  
  try {
    const parts = nepaliDateStr.split('-');
    if (parts.length !== 3) return '';
    
    const bsYear = parseInt(parts[0]);
    const bsMonth = parseInt(parts[1]);
    const bsDay = parseInt(parts[2]);
    
    // Simple conversion formula (approximate)
    // BS year - 57 = AD year (approximately)
    // For accurate conversion, use a library like 'nepali-date-converter'
    // This is a simplified version for demonstration
    
    const adYear = bsYear - 57;
    const adMonth = bsMonth - 3; // Approximate month offset
    const adDay = bsDay - 15; // Approximate day offset
    
    // Adjust for negative values
    let finalYear = adYear;
    let finalMonth = adMonth;
    let finalDay = adDay;
    
    if (adMonth <= 0) {
      finalYear -= 1;
      finalMonth += 12;
    }
    
    if (adDay <= 0) {
      finalMonth -= 1;
      if (finalMonth <= 0) {
        finalYear -= 1;
        finalMonth += 12;
      }
      // Get days in the previous month (simplified)
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      finalDay += daysInMonth[finalMonth - 1] || 30;
    }
    
    // Format as YYYY-MM-DD
    return `${finalYear}-${String(finalMonth).padStart(2, '0')}-${String(finalDay).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error converting Nepali date:', error);
    return nepaliDateStr; // Return original if conversion fails
  }
}

// Handle province change
function onProvinceChange() {
  const provinceId = document.getElementById('provinceFilter').value;
  const districtFilter = document.getElementById('districtFilter');
  const localLevelFilter = document.getElementById('localLevelFilter');

  // Clear district and local level filters
  districtFilter.innerHTML = '<option value="all">सबै जिल्लाहरू</option>';
  localLevelFilter.innerHTML = '<option value="all">सबै स्थानीय तह</option>';

  if (provinceId !== 'all' && window.nepalData && window.nepalData.DISTRICTS) {
    const districts = window.nepalData.DISTRICTS[provinceId] || [];
    districts.forEach(district => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtFilter.appendChild(option);
    });
  }
}

// Handle district change
function onDistrictChange() {
  const provinceId = document.getElementById('provinceFilter').value;
  const districtName = document.getElementById('districtFilter').value;
  const localLevelFilter = document.getElementById('localLevelFilter');

  // Clear local level filter
  localLevelFilter.innerHTML = '<option value="all">सबै स्थानीय तह</option>';

  if (provinceId !== 'all' && districtName !== 'all' && window.nepalData && window.nepalData.MUNICIPALITIES) {
    const municipalities = window.nepalData.MUNICIPALITIES[provinceId]?.[districtName] || [];
    municipalities.forEach(municipality => {
      const option = document.createElement('option');
      option.value = municipality;
      option.textContent = municipality;
      localLevelFilter.appendChild(option);
    });
  }
}

// Handle office change
function onOfficeChange() {
  const officeId = document.getElementById('officeFilter').value;
  const questionFilter = document.getElementById('questionFilter');

  // Clear question filter
  questionFilter.innerHTML = '<option value="all">सबै प्रश्नहरू</option>';

  if (officeId !== 'all' && officeId !== 'other') {
    const office = OFFICES.find(o => o.id === officeId);
    if (office && office.q) {
      office.q.forEach((question, index) => {
        const option = document.createElement('option');
        option.value = `q${index + 1}`;
        option.textContent = question;
        questionFilter.appendChild(option);
      });
    }
  }
}

// Load dashboard data from Apps Script
async function loadDashboardData() {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getData`);
    const result = await response.json();
    
    if (result.success) {
      currentData = result.data;
      updateDashboard(result.data, result.stats);
      populateFilters(result.data);
    } else {
      console.error('Error loading data:', result.error);
      showNoDataMessage();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showNoDataMessage();
  }
}

// Update dashboard with data
function updateDashboard(data, stats) {
  updateStatCards(stats);
  updateCharts(data, stats);
  updateTable(data);
  updateDistrictMap(data, stats);
}

// Update stat cards
function updateStatCards(stats) {
  const totalResponses = stats.totalResponses || 0;
  const officeCount = Object.keys(stats.officeStats || {}).length;
  const districtCount = Object.keys(stats.districtStats || {}).length;
  
  // Calculate average satisfaction score
  let totalScore = 0;
  let scoreCount = 0;
  for (const office in stats.satisfactionScores) {
    const score = parseFloat(stats.satisfactionScores[office]);
    if (!isNaN(score)) {
      totalScore += score;
      scoreCount++;
    }
  }
  const avgSatisfaction = scoreCount > 0 ? (totalScore / scoreCount).toFixed(2) : '0.0';
  
  document.getElementById('totalResponses').textContent = toDevanagari(totalResponses);
  document.getElementById('totalOffices').textContent = toDevanagari(officeCount);
  document.getElementById('avgSatisfaction').textContent = toDevanagari(avgSatisfaction);
  document.getElementById('totalDistricts').textContent = toDevanagari(districtCount);
}

// Update charts
function updateCharts(data, stats) {
  // Destroy existing charts
  if (officeChart) officeChart.destroy();
  if (satisfactionChart) satisfactionChart.destroy();
  if (ageGroupChart) ageGroupChart.destroy();
  if (professionChart) professionChart.destroy();
  if (districtChart) districtChart.destroy();
  if (goodOfficeChart) goodOfficeChart.destroy();
  if (badOfficeChart) badOfficeChart.destroy();
  
  // Office responses chart
  const officeLabels = Object.keys(stats.officeStats || {});
  const officeData = officeLabels.map(office => stats.officeStats[office].count);
  
  const officeCtx = document.getElementById('officeChart').getContext('2d');
  officeChart = new Chart(officeCtx, {
    type: 'bar',
    data: {
      labels: officeLabels,
      datasets: [{
        label: 'प्रतिक्रियाहरू',
        data: officeData,
        backgroundColor: 'rgba(12, 55, 104, 0.7)',
        borderColor: 'rgba(12, 55, 104, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
  
  // Satisfaction scores chart
  const satisfactionLabels = Object.keys(stats.satisfactionScores || {});
  const satisfactionData = satisfactionLabels.map(office => parseFloat(stats.satisfactionScores[office]) || 0);
  
  const satisfactionCtx = document.getElementById('satisfactionChart').getContext('2d');
  satisfactionChart = new Chart(satisfactionCtx, {
    type: 'bar',
    data: {
      labels: satisfactionLabels,
      datasets: [{
        label: 'सन्तुष्टि स्कोर',
        data: satisfactionData,
        backgroundColor: satisfactionData.map(score => {
          if (score >= 4) return 'rgba(62, 122, 76, 0.7)';
          if (score >= 3) return 'rgba(185, 133, 46, 0.7)';
          return 'rgba(166, 24, 42, 0.7)';
        }),
        borderColor: satisfactionData.map(score => {
          if (score >= 4) return 'rgba(62, 122, 76, 1)';
          if (score >= 3) return 'rgba(185, 133, 46, 1)';
          return 'rgba(166, 24, 42, 1)';
        }),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 5,
          ticks: {
            stepSize: 1
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
  
  // Age group chart
  const ageGroupLabels = Object.keys(stats.ageGroupStats || {});
  const ageGroupData = ageGroupLabels.map(group => stats.ageGroupStats[group]);
  
  const ageGroupCtx = document.getElementById('ageGroupChart').getContext('2d');
  ageGroupChart = new Chart(ageGroupCtx, {
    type: 'doughnut',
    data: {
      labels: ageGroupLabels,
      datasets: [{
        data: ageGroupData,
        backgroundColor: [
          'rgba(12, 55, 104, 0.7)',
          'rgba(166, 24, 42, 0.7)',
          'rgba(62, 122, 76, 0.7)',
          'rgba(185, 133, 46, 0.7)',
          'rgba(91, 86, 72, 0.7)'
        ],
        borderColor: [
          'rgba(12, 55, 104, 1)',
          'rgba(166, 24, 42, 1)',
          'rgba(62, 122, 76, 1)',
          'rgba(185, 133, 46, 1)',
          'rgba(91, 86, 72, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });

  // Profession chart
  const professionLabels = Object.keys(stats.professionStats || {}).slice(0, 10);
  const professionData = professionLabels.map(profession => stats.professionStats[profession]);

  const professionCtx = document.getElementById('professionChart').getContext('2d');
  professionChart = new Chart(professionCtx, {
    type: 'bar',
    data: {
      labels: professionLabels,
      datasets: [{
        label: 'प्रतिक्रियाहरू',
        data: professionData,
        backgroundColor: 'rgba(147, 51, 234, 0.7)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

  // District chart
  const districtLabels = Object.keys(stats.districtStats || {}).slice(0, 10);
  const districtData = districtLabels.map(district => stats.districtStats[district]);

  const districtCtx = document.getElementById('districtChart').getContext('2d');
  districtChart = new Chart(districtCtx, {
    type: 'bar',
    data: {
      labels: districtLabels,
      datasets: [{
        label: 'प्रतिक्रियाहरू',
        data: districtData,
        backgroundColor: 'rgba(185, 133, 46, 0.7)',
        borderColor: 'rgba(185, 133, 46, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

  // Good offices chart
  const goodOfficeEntries = Object.entries(stats.goodOfficeStats || {}).sort((a, b) => b[1] - a[1]);
  const goodOfficeLabels = goodOfficeEntries.slice(0, 3).map(entry => entry[0]);
  const goodOfficeData = goodOfficeEntries.slice(0, 3).map(entry => entry[1]);

  const goodOfficeCtx = document.getElementById('goodOfficeChart').getContext('2d');
  goodOfficeChart = new Chart(goodOfficeCtx, {
    type: 'bar',
    data: {
      labels: goodOfficeLabels,
      datasets: [{
        label: 'प्रतिक्रियाहरू',
        data: goodOfficeData,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });

  // Bad offices chart
  const badOfficeEntries = Object.entries(stats.badOfficeStats || {}).sort((a, b) => b[1] - a[1]);
  const badOfficeLabels = badOfficeEntries.slice(0, 3).map(entry => entry[0]);
  const badOfficeData = badOfficeEntries.slice(0, 3).map(entry => entry[1]);

  const badOfficeCtx = document.getElementById('badOfficeChart').getContext('2d');
  badOfficeChart = new Chart(badOfficeCtx, {
    type: 'bar',
    data: {
      labels: badOfficeLabels,
      datasets: [{
        label: 'प्रतिक्रियाहरू',
        data: badOfficeData,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Update data table
function updateTable(data) {
  tableData = data;
  currentPage = 1;
  renderTable();
}

// Update district map
let districtMap = null;

function updateDistrictMap(data, stats) {
  if (!districtMap) {
    // Initialize map
    districtMap = L.map('districtMap').setView([28.3949, 84.1240], 7);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(districtMap);
  }

  const districtStats = stats.districtStats || {};

  const districtScores = {};
  data.forEach(row => {
    const districtSource = row.district || row.district_name || row.districtName || row.localLevel || row.local_level || row.locallevel || '';
    const districtName = districtSource ? extractDistrictFromLocalLevel(districtSource) : null;

    if (!districtName) return;

    const normalizedDistrict = normalizeDistrictName(districtName);
    if (!normalizedDistrict) return;

    if (!districtScores[normalizedDistrict]) {
      districtScores[normalizedDistrict] = { total: 0, count: 0 };
    }

    const rawScore = Number(row.q9 ?? row.q10 ?? row.score ?? row.satisfactionScore ?? row.satisfaction ?? NaN);
    if (!Number.isNaN(rawScore)) {
      districtScores[normalizedDistrict].total += rawScore;
      districtScores[normalizedDistrict].count++;
    }
  });

  const districtAverages = {};
  for (const district in districtScores) {
    if (districtScores[district].count > 0) {
      districtAverages[district] = districtScores[district].total / districtScores[district].count;
    }
  }

  const matchedDistrictMap = {};
  Object.keys(districtScores).forEach(district => {
    matchedDistrictMap[district] = district;
  });

  console.log('District stats from backend:', districtStats);
  console.log('District scores calculated:', districtScores);
  console.log('District averages:', districtAverages);

  fetch('https://raw.githubusercontent.com/mesaugat/geoJSON-Nepal/master/nepal-districts-new.geojson')
    .then(response => response.json())
    .then(geojson => {
      districtMap.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
          districtMap.removeLayer(layer);
        }
      });

      L.geoJSON(geojson, {
        style: function(feature) {
          const geoDistrictName = getGeoDistrictName(feature);
          const matchedDistrict = findMatchingDistrict(geoDistrictName, districtAverages);
          const avgScore = matchedDistrict ? districtAverages[matchedDistrict] : 0;

          return {
            fillColor: getColorForScore(avgScore),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          };
        },
        onEachFeature: function(feature, layer) {
          const geoDistrictName = getGeoDistrictName(feature);
          const matchedDistrict = findMatchingDistrict(geoDistrictName, districtAverages);
          const avgScore = matchedDistrict ? districtAverages[matchedDistrict] : 0;
          const count = matchedDistrict ? districtScores[matchedDistrict]?.count : 0;
          const displayDistrictName = matchedDistrict || normalizeDistrictName(geoDistrictName) || geoDistrictName || 'Unknown';

          layer.bindPopup(`
            <strong>${displayDistrictName}</strong><br/>
            सन्तुष्टि स्कोर: ${avgScore > 0 ? avgScore.toFixed(2) : 'N/A'}<br/>
            प्रतिक्रिया संख्या: ${count || 0}
          `);
        }
      }).addTo(districtMap);
    })
    .catch(error => {
      console.error('Error loading GeoJSON:', error);
    });
}

// Extract district name from local level string
function extractDistrictFromLocalLevel(localLevelStr) {
  if (!localLevelStr || typeof localLevelStr !== 'string') return null;

  const cleaned = localLevelStr.trim();
  if (!cleaned) return null;

  if (window.nepalData && window.nepalData.DISTRICTS) {
    for (const provinceId in window.nepalData.DISTRICTS) {
      const districts = window.nepalData.DISTRICTS[provinceId] || [];
      for (const district of districts) {
        if (cleaned.includes(district) || district.includes(cleaned)) {
          return district;
        }
      }
    }
  }

  if (window.nepalData && window.nepalData.MUNICIPALITIES) {
    for (const provinceId in window.nepalData.MUNICIPALITIES) {
      const municipalitiesByDistrict = window.nepalData.MUNICIPALITIES[provinceId] || {};
      for (const district in municipalitiesByDistrict) {
        const municipalities = municipalitiesByDistrict[district] || [];
        for (const municipality of municipalities) {
          if (cleaned.includes(municipality) || municipality.includes(cleaned)) {
            return district;
          }
        }
      }
    }
  }

  return cleaned;
}

function getGeoDistrictName(feature) {
  if (!feature || !feature.properties) return null;

  const props = feature.properties;
  const preferredKeys = ['DIST_EN', 'DIST_ALT1E', 'DIST_ALT2E', 'DISTRICT', 'district', 'District', 'NAME', 'name', 'district_name', 'districtName'];
  for (const key of preferredKeys) {
    if (props[key]) {
      return props[key];
    }
  }

  const fallbackKey = Object.keys(props).find(key => /district/i.test(key) || /name/i.test(key));
  return fallbackKey ? props[fallbackKey] : null;
}

// Normalize district name for matching with GeoJSON
function normalizeDistrictName(districtName) {
  if (!districtName || typeof districtName !== 'string') return null;

  const cleaned = districtName.trim().replace(/\s+/g, ' ');
  if (!cleaned) return null;

  const normalizeAlias = value => String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z\u0900-\u097f]/g, '');

  const districtAliasMap = {};

  if (window.nepalData && window.nepalData.DISTRICTS) {
    Object.values(window.nepalData.DISTRICTS).flat().forEach(district => {
      const alias = normalizeAlias(district);
      if (alias) districtAliasMap[alias] = district;
    });
  }

  if (window.DISTRICT_NAME_MAP) {
    Object.entries(window.DISTRICT_NAME_MAP).forEach(([englishKey, nepaliName]) => {
      const englishAlias = normalizeAlias(englishKey);
      const nepaliAlias = normalizeAlias(nepaliName);
      if (englishAlias) districtAliasMap[englishAlias] = nepaliName;
      if (nepaliAlias) districtAliasMap[nepaliAlias] = nepaliName;
    });
  }

  const alias = normalizeAlias(cleaned);
  if (districtAliasMap[alias]) {
    return districtAliasMap[alias];
  }

  const directMatch = Object.values(window.nepalData?.DISTRICTS || {}).flat().find(district => normalizeAlias(district) === alias);
  if (directMatch) {
    return directMatch;
  }

  const englishFallback = Object.entries(window.DISTRICT_NAME_MAP || {}).find(([englishKey, nepaliName]) => normalizeAlias(englishKey) === alias);
  if (englishFallback) {
    return englishFallback[1];
  }

  return cleaned;
}

function districtKeyMatch(a, b) {
  if (!a || !b) return false;
  const normalize = value => String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z\u0900-\u097f]/g, '');

  return normalize(a) === normalize(b);
}

// Find matching district name (flexible matching)
function findMatchingDistrict(geoDistrictName, districtAverages) {
  if (!geoDistrictName || !districtAverages) return null;

  if (districtAverages[geoDistrictName]) {
    return geoDistrictName;
  }

  const normalizedGeoDistrict = normalizeDistrictName(geoDistrictName);
  if (normalizedGeoDistrict && districtAverages[normalizedGeoDistrict]) {
    return normalizedGeoDistrict;
  }

  for (const district in districtAverages) {
    if (districtKeyMatch(district, geoDistrictName) || districtKeyMatch(district, normalizedGeoDistrict)) {
      return district;
    }
  }

  if (window.nepalData && window.nepalData.DISTRICTS) {
    for (const provinceId in window.nepalData.DISTRICTS) {
      const districts = window.nepalData.DISTRICTS[provinceId] || [];
      for (const district of districts) {
        if (districtKeyMatch(district, geoDistrictName) || districtKeyMatch(district, normalizedGeoDistrict)) {
          return normalizeDistrictName(district);
        }
      }
    }
  }

  return null;
}

// Get color based on satisfaction score (1-5 scale)
function getColorForScore(score) {
  if (score >= 4.5) return '#22c55e'; // Green - Very satisfied
  if (score >= 3.5) return '#86efac'; // Light green - Satisfied
  if (score >= 2.5) return '#fbbf24'; // Yellow - Neutral
  if (score >= 1.5) return '#fb923c'; // Orange - Dissatisfied
  return '#ef4444'; // Red - Very dissatisfied
}

// Render table with pagination
function renderTable() {
  const tbody = document.getElementById('tableBody');

  if (tableData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">कुनै डाटा छैन</td></tr>';
    updatePaginationInfo();
    return;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = tableData.slice(startIndex, endIndex);

  tbody.innerHTML = pageData.map(row => {
    const date = row.serviceDate || new Date(row.timestamp).toLocaleDateString('ne-NP');
    const score = row.q9 || row.q10 || 'N/A';
    const problem = row.problem ? row.problem.substring(0, 50) + (row.problem.length > 50 ? '...' : '') : '-';
    const suggestion = row.suggestion ? row.suggestion.substring(0, 50) + (row.suggestion.length > 50 ? '...' : '') : '-';

    return `
      <tr>
        <td>${date}</td>
        <td>${row.officeName}</td>
        <td>${row.district || '-'}</td>
        <td>${row.ageGroup || '-'}</td>
        <td>${score}</td>
        <td>${problem}</td>
        <td>${suggestion}</td>
      </tr>
    `;
  }).join('');

  updatePaginationInfo();
}

// Update pagination info and controls
function updatePaginationInfo() {
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const infoText = totalItems > 0
    ? `${toDevanagari(startIndex)} - ${toDevanagari(endIndex)} कुल ${toDevanagari(totalItems)}`
    : '० - ० कुल ०';

  document.getElementById('paginationInfo').textContent = infoText;

  // Update page numbers
  const pageNumbers = document.getElementById('pageNumbers');
  pageNumbers.innerHTML = '';

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.textContent = toDevanagari(i);
    btn.onclick = () => goToPage(i);
    if (i === currentPage) {
      btn.classList.add('active');
    }
    pageNumbers.appendChild(btn);
  }

  // Update prev/next buttons
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

// Go to specific page
function goToPage(page) {
  currentPage = page;
  renderTable();
}

// Previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
}

// Next page
function nextPage() {
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
}

// Change items per page
function changeItemsPerPage() {
  itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
  currentPage = 1;
  renderTable();
}

// Populate filter dropdowns
function populateFilters(data) {
  // Note: age group and profession filters have static options in HTML, no need to populate dynamically

  // Populate problem and suggestion filters
  populateProblemSuggestionFilters(data);
}

// Populate problem and suggestion filters
function populateProblemSuggestionFilters(data) {
  const problemFilter = document.getElementById('problemFilter');
  const suggestionFilter = document.getElementById('suggestionFilter');
  
  problemFilter.innerHTML = '<option value="all">सबै समस्याहरू</option>';
  suggestionFilter.innerHTML = '<option value="all">सबै सुझावहरू</option>';
  
  // Get unique problems and suggestions from all offices
  const problems = [...new Set(data.map(row => row.problem).filter(p => p && p.trim()))];
  const suggestions = [...new Set(data.map(row => row.suggestion).filter(s => s && s.trim()))];
  
  problems.forEach(problem => {
    const option = document.createElement('option');
    option.value = problem;
    option.textContent = problem.substring(0, 50) + (problem.length > 50 ? '...' : '');
    problemFilter.appendChild(option);
  });
  
  suggestions.forEach(suggestion => {
    const option = document.createElement('option');
    option.value = suggestion;
    option.textContent = suggestion.substring(0, 50) + (suggestion.length > 50 ? '...' : '');
    suggestionFilter.appendChild(option);
  });
}

// Apply filters
async function applyFilters() {
  const provinceId = document.getElementById('provinceFilter').value;
  const district = document.getElementById('districtFilter').value;
  const localLevel = document.getElementById('localLevelFilter').value;
  const officeId = document.getElementById('officeFilter').value;
  const ageGroup = document.getElementById('ageGroupFilter').value;
  const profession = document.getElementById('professionFilter').value;

  // Use Nepali dates directly (BS format YYYY-MM-DD)
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const startDate = startDateInput.dataset.nepaliDate || startDateInput.value;
  const endDate = endDateInput.dataset.nepaliDate || endDateInput.value;

  const questionFilter = document.getElementById('questionFilter').value;
  const problemFilter = document.getElementById('problemFilter').value;
  const suggestionFilter = document.getElementById('suggestionFilter').value;
  
  try {
    const url = `${APPS_SCRIPT_URL}?action=getFilteredData&provinceId=${encodeURIComponent(provinceId)}&district=${encodeURIComponent(district)}&localLevel=${encodeURIComponent(localLevel)}&officeId=${encodeURIComponent(officeId)}&ageGroup=${encodeURIComponent(ageGroup)}&profession=${encodeURIComponent(profession)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&questionFilter=${encodeURIComponent(questionFilter)}&problemFilter=${encodeURIComponent(problemFilter)}&suggestionFilter=${encodeURIComponent(suggestionFilter)}`;
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      currentData = result.data;
      updateDashboard(result.data, result.stats);
    }
  } catch (error) {
    console.error('Error applying filters:', error);
  }
}

// Reset filters
function resetFilters() {
  document.getElementById('provinceFilter').value = 'all';
  document.getElementById('districtFilter').innerHTML = '<option value="all">सबै जिल्लाहरू</option>';
  document.getElementById('localLevelFilter').innerHTML = '<option value="all">सबै स्थानीय तह</option>';
  document.getElementById('officeFilter').value = 'all';
  document.getElementById('ageGroupFilter').value = 'all';
  document.getElementById('professionFilter').value = 'all';
  document.getElementById('startDate').value = '';
  document.getElementById('startDate').dataset.nepaliDate = '';
  document.getElementById('endDate').value = '';
  document.getElementById('endDate').dataset.nepaliDate = '';
  document.getElementById('questionFilter').innerHTML = '<option value="all">सबै प्रश्नहरू</option>';
  document.getElementById('problemFilter').value = 'all';
  document.getElementById('suggestionFilter').value = 'all';
  loadDashboardData();
}

// Filter table by search
function filterTable() {
  const searchTerm = document.getElementById('tableSearch').value.toLowerCase();

  if (searchTerm === '') {
    tableData = currentData;
  } else {
    tableData = currentData.filter(row => {
      const text = Object.values(row).join(' ').toLowerCase();
      return text.includes(searchTerm);
    });
  }

  currentPage = 1;
  renderTable();
}

// Export data to CSV
function exportData() {
  if (currentData.length === 0) {
    alert('निर्यात गर्नका लागि कुनै डाटा छैन');
    return;
  }

  const headers = ['मिति', 'कार्यालय', 'जिल्ला/स्थानीय तह', 'उमेर समूह', 'सन्तुष्टि स्कोर', 'समस्या', 'सुझाव'];
  const csvContent = [
    headers.join(','),
    ...currentData.map(row => {
      const date = row.serviceDate || new Date(row.timestamp).toLocaleDateString('ne-NP');
      const score = row.q9 || row.q10 || 'N/A';
      return [
        `"${date}"`,
        `"${row.officeName}"`,
        `"${row.district || ''}"`,
        `"${row.ageGroup || ''}"`,
        `"${score}"`,
        `"${(row.problem || '').replace(/"/g, '""')}"`,
        `"${(row.suggestion || '').replace(/"/g, '""')}"`
      ].join(',');
    })
  ].join('\n');

  // Add UTF-8 BOM for proper Nepali character display in Excel
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'survey_data.csv';
  link.click();
}

// Close dashboard
function closeDashboard() {
  window.close();
}

// Logout function
function logout() {
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('loggedInUser');
  sessionStorage.removeItem('loginTime');
  window.location.href = 'login.html';
}

// Show no data message
function showNoDataMessage() {
  document.getElementById('totalResponses').textContent = '०';
  document.getElementById('totalOffices').textContent = '०';
  document.getElementById('avgSatisfaction').textContent = '०.०';
  document.getElementById('totalDistricts').textContent = '०';
  document.getElementById('tableBody').innerHTML = '<tr><td colspan="7" class="no-data">डाटा लोड गर्न सकिएन। कृपया Apps Script URL कन्फिगर गर्नुहोस्।</td></tr>';
}

// Convert numbers to Devanagari
function toDevanagari(n) {
  const map = { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९', '.': '.' };
  return String(n).split('').map(c => map[c] !== undefined ? map[c] : c).join('');
}
