/**
 * AI Clinical Health Assistant & Symptom Triage Service
 * Supports English & Gujarati medical queries, PMJAY-MA scheme information,
 * clinical urgency evaluations, and specialist referrals for Gujarat hospitals.
 */

import defaultDoctors from '../data/doctors.json';
import defaultDepartments from '../data/departments.json';

const SYMPTOM_PATTERNS = [
  {
    keywords: [
      'chest pain', 'heart', 'palpitations', 'left arm pain', 'sweating', 'shortness of breath', 'angina', 'breathlessness',
      'છાતીમાં દુખાવો', 'હૃદય', 'ધબકારા', 'શ્વાસ', 'છાતી', 'હાર્ટ એટેક', 'એન્જાઇના', 'chhati ma dukhavo', 'shwas', 'hruday', 'heart attack'
    ],
    department: 'Cardiology',
    departmentGujarati: 'હૃદય રોગ વિભાગ (Cardiology)',
    urgency: 'Emergency',
    level: 'Level 1 - Critical / Urgent Evaluation',
    warning: 'Severe chest discomfort radiating to jaw/left arm requires IMMEDIATE 24/7 Emergency Room evaluation. (છાતીમાં તીવ્ર દુખાવો અને શ્વાસ ચડવો તાત્કાલિક ઈમરજન્સી કેરની જરૂર છે)',
    advice: 'Sit down, remain calm, loosen tight clothing. Call Gujarat 108 Emergency. Do not drive yourself.',
    adviceGujarati: 'શાંતિથી બેસી જાઓ, કપડાં ઢીલા કરો અને તાત્કાલિક ગુજરાત ૧૦૮ (108) ઈમરજન્સી એમ્બ્યુલન્સ અથવા યુ.એન. મહેતા / ઝાયડસ હોસ્પિટલનો સંપર્ક કરો.',
    questions: [
      'How long has the chest sensation lasted? (દુખાવો કેટલા સમયથી છે?)',
      'Does it worsen with physical exertion? (ચાલવાથી વધે છે?)',
      'Any history of high blood pressure? (બીપી અથવા હૃદયની બીમારી છે?)'
    ]
  },
  {
    keywords: [
      'headache', 'migraine', 'dizziness', 'seizure', 'numbness', 'tingling', 'weakness', 'vision loss', 'tremor', 'stroke', 'vertigo',
      'માથાનો દુખાવો', 'માથું દુખવું', 'ચક્કર', 'પક્ષઘાત', 'લકવો', 'ખેંચ', 'ઝાંખપ', 'migren', 'mathano dukhavo', 'chakkar', 'lakvo', 'mathu'
    ],
    department: 'Neurology',
    departmentGujarati: 'મગજ અને ચેતાતંત્ર વિભાગ (Neurology)',
    urgency: 'High',
    level: 'Level 2 - Priority Neurological Assessment',
    warning: 'Sudden facial droop, arm weakness, or speech difficulty indicates potential stroke (Act FAST). (ચહેરા કે હાથ-પગમાં અચાનક નબળાઈ કે લકવાના લક્ષણમાં તાત્કાલિક સારવાર લો)',
    advice: 'Avoid sudden movements, rest in a quiet dark room, stay hydrated.',
    adviceGujarati: 'અચાનક હલનચલન ટાળો, શાંત અને અંધારા વાળા રૂમમાં આરામ કરો અને પાણી/પ્રવાહી પીઓ.',
    questions: [
      'Did the headache begin suddenly or gradually? (માથાનો દુખાવો અચાનક શરૂ થયો કે ધીમે ધીમે?)',
      'Are you experiencing light sensitivity or nausea? (પ્રકાશ કે ઉલટી જેવું થાય છે?)',
      'Any visual aura or speech changes? (જોવામાં કે બોલવામાં તકલીફ છે?)'
    ]
  },
  {
    keywords: [
      'bone', 'joint', 'knee', 'back pain', 'spine', 'fracture', 'sprain', 'shoulder', 'arthritis', 'swelling', 'ligament',
      'ગોઠણનો દુખાવો', 'સાંધાનો દુખાવો', 'કમરનો દુખાવો', 'હાડકા', 'ફ્રેક્ચર', 'સોજો', 'વા', 'gothan', 'sandha no dukhavo', 'kamar no dukhavo', 'hadka'
    ],
    department: 'Orthopedics',
    departmentGujarati: 'હાડકા અને સાંધા વિભાગ (Orthopedics)',
    urgency: 'Moderate',
    level: 'Level 3 - Outpatient Specialist Consultation',
    warning: 'Inability to bear weight or visible deformity requires acute X-ray imaging.',
    advice: 'Apply R.I.C.E protocol (Rest, Ice, Compression, Elevation) for acute soft tissue strains.',
    adviceGujarati: 'વજન આપવાનું ટાળો, બરફનો શેક કરો અને નિષ્ણાત ઓર્થોપેડિક સર્જનની સલાહ લઈ એક્સ-રે કરાવો.',
    questions: [
      'Was there a specific trauma or sports injury? (કોઈ પડી જવાથી કે ઈજા થઈ છે?)',
      'Is the pain worse in the morning or after movement? (સવારે કે ચાલ્યા પછી દુખાવો વધે છે?)',
      'Is there joint swelling or redness? (સાંધામાં સોજો કે લાલાશ છે?)'
    ]
  },
  {
    keywords: [
      'fever', 'cough', 'cold', 'flu', 'sore throat', 'chills', 'weakness', 'fatigue', 'body ache', 'viral', 'infection',
      'તાવ', 'શરદી', 'ઉધરસ', 'ગળામાં દુખાવો', 'શરીર દુખવું', 'ધ્રૂજારી', 'કમજોરી', 'વાયરલ', 'tav', 'shardi', 'udhras', 'gala ma dukhavo'
    ],
    department: 'General Medicine',
    departmentGujarati: 'જનરલ મેડિસિન / ફિઝિશિયન (General Medicine)',
    urgency: 'Moderate',
    level: 'Level 3 - Clinical Outpatient Assessment',
    warning: 'Fever above 103°F (39.4°C) or lasting >3 consecutive days warrants diagnostic blood tests (CBC, Dengue/Malaria/Typhoid).',
    advice: 'Maintain oral hydration with electrolyte fluids, rest, and monitor body temperature every 6 hours.',
    adviceGujarati: 'પ્રવાહી અને ઓઆરએસ/લીંબુ પાણી વધુ પીવો, આરામ કરો અને ૩ દિવસથી વધુ તાવ હોય તો ડેન્ગ્યુ/મેલેરિયા ટેસ્ટ કરાવો.',
    questions: [
      'What is your current temperature reading? (હાલ કેટલો તાવ છે?)',
      'How many days have you had the fever? (કેટલા દિવસથી તાવ છે?)',
      'Any rash, vomiting, or cough with phlegm? (શરીર પર ચકામા કે કફ છે?)'
    ]
  },
  {
    keywords: [
      'stomach', 'abdomen', 'acidity', 'gas', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'reflux', 'heartburn', 'ulcer',
      'પેટમાં દુખાવો', 'પેટ', 'એસિડિટી', 'ગેસ', 'ઉલટી', 'ઝાડા', 'કબજિયાત', 'બળતરા', 'pet ma dukhavo', 'acidity', 'ulti', 'jhada', 'gas'
    ],
    department: 'Gastroenterology',
    departmentGujarati: 'પેટ અને પાચનતંત્ર વિભાગ (Gastroenterology)',
    urgency: 'Moderate',
    level: 'Level 3 - Gastroenterology Consultation',
    warning: 'Severe rebound abdominal tenderness or persistent black/tarry stools requires urgent evaluation.',
    advice: 'Consume a bland diet (khichdi, curd, bananas), avoid oily/spicy foods, stay hydrated.',
    adviceGujarati: 'હળવો ખોરાક (ખીચડી, છાશ, દહીં) લો, તેલ-મરચા વાળો તીખો ખોરાક ટાળો અને પુષ્કળ પાણી પીઓ.',
    questions: [
      'Where specifically is the pain localized? (પેટમાં ચોક્કસ કઈ જગ્યાએ દુખાવો થાય છે?)',
      'Does the pain relate to meal timings? (જમ્યા પછી દુખાવો વધે છે?)',
      'Any associated vomiting or loose motions? (ઉલટી કે ઝાડા જેવું છે?)'
    ]
  },
  {
    keywords: [
      'skin', 'rash', 'itching', 'acne', 'eczema', 'allergy', 'hives', 'redness', 'pigmentation', 'hair fall', 'dermatitis',
      'ચામડી', 'ખંજવાળ', 'એલર્જી', 'ધાધર', 'ખીલ', 'વાળ ખરવા', 'લાલ ચકામા', 'chamdi', 'khanjwal', 'allergy', 'dhadhar', 'khil'
    ],
    department: 'Dermatology',
    departmentGujarati: 'ચામડી અને સૌંદર્ય વિભાગ (Dermatology)',
    urgency: 'Routine',
    level: 'Level 4 - Routine Clinical Consultation',
    warning: 'Rapidly spreading hives with facial or tongue swelling is anaphylaxis and requires emergency medical care.',
    advice: 'Avoid scratching affected lesions. Use hypoallergenic moisturizers and avoid self-medicating steroid creams.',
    adviceGujarati: 'ખંજવાળવાનું ટાળો, સુગંધ વગરનું મોઈશ્ચરાઇઝર લગાવો અને ડોક્ટરની સલાહ વગર કોઈ ક્રીમ ન લગાવો.',
    questions: [
      'When did the skin condition first appear? (ચામડીની તકલીફ ક્યારથી છે?)',
      'Have you used any new soap, oil or medication? (કોઈ નવો સાબુ, તેલ કે દવા વાપરી છે?)'
    ]
  },
  {
    keywords: [
      'child', 'infant', 'baby', 'pediatric', 'teething', 'vaccination', 'crying', 'colic', 'milestones',
      'બાળક', 'નાનું બાળક', 'રડવું', 'બાળરોગ', 'રસીકરણ', 'દૂધ', 'balak', 'nanu balak', 'vaccine', 'pediatric'
    ],
    department: 'Pediatrics',
    departmentGujarati: 'બાળરોગ વિભાગ (Pediatrics)',
    urgency: 'Moderate',
    level: 'Level 3 - Pediatric Consultation',
    warning: 'Infants under 3 months with fever over 100.4°F require prompt pediatric evaluation.',
    advice: 'Ensure adequate mother milk/fluid intake, monitor wet diaper count.',
    adviceGujarati: 'બાળકને પૂરતું ધાવણ/પ્રવાહી આપો અને બાળરોગ નિષ્ણાત (Pediatrician) પાસે તપાસ કરાવો.',
    questions: [
      'What is the age of the child? (બાળકની ઉંમર કેટલી છે?)',
      'Is the child feeding and sleeping normally? (બાળક બરાબર ધાવે છે અને ઊંઘે છે?)'
    ]
  },
  {
    keywords: [
      'pmjay', 'ayushman', 'ma yojana', 'ma card', 'mukhyamantri amrutam', 'free treatment',
      'પીએમજેએવાય', 'મા કાર્ડ', 'આયુષ્માન ભારત', 'મુખ્યમંત્રી અમૃતમ', 'સરકારી યોજના', 'મફત સારવાર', 'pmjay-ma', 'ma amrutam'
    ],
    department: 'General Medicine',
    departmentGujarati: 'PMJAY-MA યોજના સહાયતા કેન્દ્ર',
    urgency: 'Informational',
    level: 'Government Healthcare Scheme Assistance',
    warning: 'In Gujarat, PMJAY-MA provides up to ₹10 Lakhs cashless hospitalization per family per year.',
    advice: 'Carry your Ayushman/MA Card, Aadhaar Card, and Ration Card to the PMJAY helpdesk at UN Mehta, Civil Hospital, Zydus, KD Hospital, or Kiran Hospital Surat for 100% cashless treatment.',
    adviceGujarati: 'ગુજરાતમાં PMJAY-MA (મુખ્યમંત્રી અમૃતમ) યોજના હેઠળ વાર્ષિક ₹૧૦ લાખ સુધીની વિનામૂલ્યે કેશલેસ સારવાર મળે છે. સિવિલ હોસ્પિટલ, યુ.એન. મહેતા, કિરણ હોસ્પિટલ સુરત અથવા ઝાયડસ હોસ્પિટલ ખાતે મા કાર્ડ અને આધાર કાર્ડ સાથે સંપર્ક કરો.',
    questions: [
      'Do you have an active Ayushman PMJAY-MA card? (તમારી પાસે સક્રિય મા કાર્ડ અથવા આયુષ્માન કાર્ડ છે?)',
      'Which Gujarat city are you located in? (તમે ગુજરાતના કયા શહેરમાં છો?)'
    ]
  }
];

export const aiHealthService = {
  /**
   * Evaluates patient message and returns comprehensive clinical triage
   */
  async triageSymptoms(userPrompt) {
    // Artificial latency for natural AI conversational feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!userPrompt || userPrompt.trim().length === 0) {
      return {
        reply: "Please describe your symptoms, when they began, and how severe they feel so I can provide relevant clinical guidance. (તમારા લક્ષણો જણાવો જેથી હું યોગ્ય માર્ગદર્શન આપી શકું).",
        triageLevel: null
      };
    }

    const clean = userPrompt.toLowerCase();
    const isGujaratiScript = /[\u0A80-\u0AFF]/.test(userPrompt);

    // Match against symptom patterns
    let bestMatch = null;
    let matchScore = 0;

    for (const pattern of SYMPTOM_PATTERNS) {
      let count = 0;
      for (const kw of pattern.keywords) {
        if (clean.includes(kw.toLowerCase())) {
          count += 1;
        }
      }
      if (count > matchScore) {
        matchScore = count;
        bestMatch = pattern;
      }
    }

    if (!bestMatch) {
      bestMatch = {
        department: 'General Medicine',
        departmentGujarati: 'જનરલ મેડિસિન (General Medicine)',
        urgency: 'Standard',
        level: 'Level 3 - Clinical General Physician Consultation',
        warning: 'If you experience severe acute pain, sudden shortness of breath, or loss of consciousness, seek immediate emergency care (Dial 108).',
        advice: 'Keep a daily log of symptoms, maintain hydration, and consult a qualified physician in Gujarat.',
        adviceGujarati: 'તમારા લક્ષણો નોંધો, પૂરતું પાણી પીઓ અને નજીકના અનુભવી જનરલ ફિઝિશિયન ડોક્ટરનો સંપર્ક કરો.',
        questions: [
          'How many days have you had these symptoms? (કેટલા દિવસથી તકલીફ છે?)',
          'Are your symptoms constant or intermittent? (તકલીફ સતત રહે છે કે ક્યારેક થાય છે?)'
        ]
      };
    }

    // Find recommended doctors for this department
    const matchingDocs = defaultDoctors.filter(
      (d) => d.department.toLowerCase().includes(bestMatch.department.toLowerCase()) ||
             bestMatch.department.toLowerCase().includes(d.department.toLowerCase())
    ).slice(0, 2);

    const reply = isGujaratiScript
      ? `તમારા જણાવેલા લક્ષણો મુજબ, અમારું ક્લિનિકલ ટ્રાયેજ **${bestMatch.departmentGujarati || bestMatch.department}** નો સંપર્ક કરવાની સલાહ આપે છે. ${bestMatch.adviceGujarati || bestMatch.advice}`
      : `Based on your symptoms, our clinical triage suggests consulting **${bestMatch.department}** (${bestMatch.level}). ${bestMatch.advice}`;

    return {
      success: true,
      department: bestMatch.department,
      departmentGujarati: bestMatch.departmentGujarati,
      triageLevel: bestMatch.level,
      urgency: bestMatch.urgency,
      clinicalWarning: bestMatch.warning,
      immediateSelfCare: isGujaratiScript ? bestMatch.adviceGujarati : bestMatch.advice,
      followUpQuestions: bestMatch.questions,
      suggestedDoctors: matchingDocs,
      reply
    };
  }
};
