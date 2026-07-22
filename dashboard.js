// Dashboard JavaScript for Customer Survey
// Replace this URL with your deployed Google Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx8HdpgkQveFRofvf1qM0z6Kwiu3A0-D3bnF5U087KV8lkSUGs8KaSWdLPCzsCLN6TC6A/exec';

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
  id: 'electricity',
  name: 'नेपाल विद्युत् प्राधिकरण',
  q: [
    '१. नयाँ लाइन/मिटर जडानको प्रक्रिया सहज थियो ?',
    '२. महसुल भुक्तानी प्रणाली सरल र पारदर्शी थियो ?',
    '३. विद्युत् आपूर्तिको गुणस्तर (भोल्टेज) राम्रो थियो ?',
    '४. गुनासो/जडान समस्या समाधान समयमै भयो ?',
    '५. कार्यालयको कर्मचारी व्यवहार सहयोगी थियो ?',
    '६. महसुलको बिल स्पष्ट र सही थियो ?',
    '७. अनलाइन महसुल तिर्ने/हेर्ने सुविधा प्रभावकारी थियो ?',
    '८. लोडसेडिङ/अवरोधको समयमा सूचना प्रणाली प्रभावकारी थियो ?',
    '९. विद्युत् सेवाको समग्र स्कोर (१–५)',
    '१०. के तपाईं विद्युत् प्राधिकरणको सेवा सिफारिस गर्नुहुन्छ ?'
  ]
}, {
  id: 'water',
  name: 'खानेपानी तथा ढल निकास (नेपाल खानेपानी संस्थान)',
  q: [
    '१. खानेपानी जडान/धाराको प्रक्रिया सहज थियो ?',
    '२. पानीको गुणस्तर र आपूर्ति भरपर्दो थियो ?',
    '३. महसुल/दस्तुर उचित र स्पष्ट थियो ?',
    '४. मर्मत/गुनासो समाधान समयमै भयो ?',
    '५. कर्मचारीको सहयोगशीलता उचित थियो ?',
    '६. बिल/रसिद प्रणाली पारदर्शी थियो ?',
    '७. अनलाइन/मोबाइल भुक्तानी सेवा प्रभावकारी थियो ?',
    '८. ढल/निकास सेवाको पहुँच उपलब्ध थियो ?',
    '९. खानेपानी सेवाको समग्र स्कोर (१–५)',
    '१०. के तपाईं खानेपानी सेवा सिफारिस गर्नुहुन्छ ?'
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
let officeChart, satisfactionChart, ageGroupChart, districtChart;
let currentData = [];

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
          // Store Nepali date in data attribute for conversion
          startDateInput.dataset.nepaliDate = date;
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
          // Store Nepali date in data attribute for conversion
          endDateInput.dataset.nepaliDate = date;
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
  
  applyFilters();
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
  
  applyFilters();
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
  
  applyFilters();
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
  if (districtChart) districtChart.destroy();
  
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
}

// Update data table
function updateTable(data) {
  const tbody = document.getElementById('tableBody');
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">कुनै डाटा छैन</td></tr>';
    return;
  }
  
  tbody.innerHTML = data.map(row => {
    const date = new Date(row.timestamp).toLocaleDateString('ne-NP');
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
}

// Populate filter dropdowns
function populateFilters(data) {
  const ageGroups = [...new Set(data.map(row => row.ageGroup).filter(a => a))];
  
  const ageGroupFilter = document.getElementById('ageGroupFilter');
  
  // Clear existing options (except first)
  ageGroupFilter.innerHTML = '<option value="all">सबै</option>';
  
  ageGroups.forEach(ageGroup => {
    const option = document.createElement('option');
    option.value = ageGroup;
    option.textContent = ageGroup;
    ageGroupFilter.appendChild(option);
  });
  
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
  
  // Convert Nepali dates to English dates for backend filtering
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const startDate = startDateInput.dataset.nepaliDate ? nepaliToEnglish(startDateInput.dataset.nepaliDate) : startDateInput.value;
  const endDate = endDateInput.dataset.nepaliDate ? nepaliToEnglish(endDateInput.dataset.nepaliDate) : endDateInput.value;
  
  const questionFilter = document.getElementById('questionFilter').value;
  const problemFilter = document.getElementById('problemFilter').value;
  const suggestionFilter = document.getElementById('suggestionFilter').value;
  
  try {
    const url = `${APPS_SCRIPT_URL}?action=getFilteredData&provinceId=${encodeURIComponent(provinceId)}&district=${encodeURIComponent(district)}&localLevel=${encodeURIComponent(localLevel)}&officeId=${encodeURIComponent(officeId)}&ageGroup=${encodeURIComponent(ageGroup)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&questionFilter=${encodeURIComponent(questionFilter)}&problemFilter=${encodeURIComponent(problemFilter)}&suggestionFilter=${encodeURIComponent(suggestionFilter)}`;
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
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  document.getElementById('questionFilter').innerHTML = '<option value="all">सबै प्रश्नहरू</option>';
  document.getElementById('problemFilter').value = 'all';
  document.getElementById('suggestionFilter').value = 'all';
  loadDashboardData();
}

// Filter table by search
function filterTable() {
  const searchTerm = document.getElementById('tableSearch').value.toLowerCase();
  const rows = document.querySelectorAll('#tableBody tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
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
      const date = new Date(row.timestamp).toLocaleDateString('ne-NP');
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
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
