// UAF Institutional Knowledge Base — powers RAG for IntelliChat
const UAF_KNOWLEDGE_BASE = [

  // ── ADMISSIONS (10) ──────────────────────────────────────────────────────────
  {
    id: 'adm-001',
    category: 'Admissions',
    keywords: ['apply','undergraduate','bachelor','admission','how to apply','online application'],
    question: 'How to apply for undergraduate admission at UAF?',
    answer: 'Apply for undergraduate programs at UAF through the official admissions portal at admissions.uaf.edu.pk. Submit your matriculation/FSc certificates, entry test result, CNIC copy, and passport photos. Applications open in July–August each year. Processing fee is Rs 1,500. You can track your application status online after submission.'
  },
  {
    id: 'adm-002',
    category: 'Admissions',
    keywords: ['entry test','NTS','test date','registration','UAF test'],
    question: 'What are UAF entry test dates and registration process?',
    answer: 'UAF conducts its own entry test usually in August. Registration opens in July on the UAF admissions portal. Test fee is Rs 500. The test covers English, Mathematics/Science, and subject knowledge. Bring your CNIC/B-Form and admit card on the test day. Results are usually announced within two weeks.'
  },
  {
    id: 'adm-003',
    category: 'Admissions',
    keywords: ['merit','criteria','formula','weightage','70 percent','30 percent'],
    question: 'What is the UAF admission merit criteria formula?',
    answer: 'UAF uses a standard merit formula: 70% weight for academic marks (Matric + FSc aggregate) and 30% weight for the UAF entry test score. Final merit = (70/100 × Academic Score) + (30/100 × Entry Test Score). Separate merit lists are prepared for open merit, sports, and hafiz-e-Quran quota seats.'
  },
  {
    id: 'adm-004',
    category: 'Admissions',
    keywords: ['programs','courses','degrees','BS','BSc','agriculture','CS','vet','engineering','food science'],
    question: 'What programs does UAF offer?',
    answer: 'UAF offers programs across 6 faculties: BS Agriculture (4 years), BS Computer Science, BS Food Science & Technology, BS Environmental Sciences, DVM (Veterinary), BSc Agri Engineering, BS Social Sciences, BBA, BS Home Economics, and many MSc/PhD programs. Total of 60+ undergraduate and graduate programs are available.'
  },
  {
    id: 'adm-005',
    category: 'Admissions',
    keywords: ['last date','deadline','form submission','application deadline','closing date'],
    question: 'What is the last date to submit admission forms at UAF?',
    answer: 'The last date for admission form submission is usually August 31 for Fall semester intake. Spring intake (for select programs) closes in January. Dates are announced on the UAF official website web.uaf.edu.pk and the admissions portal. Submitting after the deadline requires special permission from the Admissions Office.'
  },
  {
    id: 'adm-006',
    category: 'Admissions',
    keywords: ['international','foreign','overseas','SAARC','study in Pakistan'],
    question: 'How can international students apply at UAF?',
    answer: 'International students from SAARC and other countries can apply through the HEC Foreign Students Scheme or directly through UAF International Office. Required: equivalence certificate from IBCC, valid passport, medical fitness certificate, and two reference letters. Contact intl@uaf.edu.pk or call +92-41-9200161 Ext. 2050 for details.'
  },
  {
    id: 'adm-007',
    category: 'Admissions',
    keywords: ['postgraduate','masters','MSc','MPhil','PhD','graduate admission'],
    question: 'What are the postgraduate admission requirements at UAF?',
    answer: 'For MSc/MPhil: 16 years of relevant education with minimum 45% marks, valid GAT (NTS) score of 50+. For PhD: 18 years of education (MSc/MPhil), GRE/GAT score 60+, research proposal, and supervisor consent. Admissions for postgraduate programs open twice a year (Fall and Spring). Apply via uaf.edu.pk/admissions.'
  },
  {
    id: 'adm-008',
    category: 'Admissions',
    keywords: ['DVM','doctor of veterinary','vet medicine','veterinary','animal doctor'],
    question: 'What are the DVM program admission details at UAF?',
    answer: 'The DVM (Doctor of Veterinary Medicine) is a 5-year professional degree at the Faculty of Veterinary Sciences, UAF. Eligibility: FSc Pre-Medical with 60%+ marks. Seats: ~300 per year. Entry test is mandatory. The program covers anatomy, physiology, surgery, and clinical training. For details contact: vet@uaf.edu.pk.'
  },
  {
    id: 'adm-009',
    category: 'Admissions',
    keywords: ['documents','required','certificate','CNIC','attested','originals'],
    question: 'What documents are required for UAF admission?',
    answer: 'Required documents: (1) Matric certificate + DMC (attested), (2) FSc/A-level certificate + DMC (attested), (3) Entry test score card, (4) CNIC or Form-B copy, (5) 4 passport-size photos, (6) Domicile certificate, (7) Character certificate from last institution, (8) HEC equivalence (if O/A-levels), (9) Migration certificate (if applicable).'
  },
  {
    id: 'adm-010',
    category: 'Admissions',
    keywords: ['constituent','campuses','Toba','Burewala','Depalpur','sub-campus'],
    question: 'What are UAF constituent campuses?',
    answer: 'UAF has three constituent campuses: (1) UAF Sub-Campus Toba Tek Singh — offers BS Agriculture, BS CS, BS Food Technology; (2) UAF Sub-Campus Burewala — agriculture-focused programs; (3) UAF Sub-Campus Depalpur — BS Agriculture and related programs. These campuses are fully affiliated with UAF main campus and offer the same degree programs.'
  },

  // ── FEES (5) ──────────────────────────────────────────────────────────────────
  {
    id: 'fee-001',
    category: 'Fees',
    keywords: ['semester fee','tuition','BS fee','cost per semester','how much'],
    question: 'What is the approximate semester fee for BS programs at UAF?',
    answer: 'BS program semester fees at UAF range from Rs 45,000 to Rs 75,000 depending on the program and faculty. Computer Science: ~Rs 65,000/semester. Agriculture: ~Rs 45,000/semester. Engineering: ~Rs 70,000/semester. Food Science: ~Rs 55,000/semester. DVM: ~Rs 55,000/semester. These are approximate figures; check the official fee schedule at uaf.edu.pk.'
  },
  {
    id: 'fee-002',
    category: 'Fees',
    keywords: ['hostel fee','boarder','non-boarder','mess','accommodation fee'],
    question: 'What is the hostel fee structure at UAF?',
    answer: 'Boarder students (living in hostel) pay Rs 20,000–25,000 per semester for room + mess. Non-boarder students pay a nominal non-boarder fee of Rs 2,000–3,000 per semester (for access to campus facilities). Mess charges are included in boarder fee. Girls hostel fees are similar. Contact Hostel Office at Ext. 310 for exact current rates.'
  },
  {
    id: 'fee-003',
    category: 'Fees',
    keywords: ['fee voucher','payment','challan','appserver','how to pay fee'],
    question: 'How to generate and pay fee voucher at UAF?',
    answer: 'Generate your fee voucher at appserver1.uaf.edu.pk using your registration number. Log in, select "Fee Voucher", choose the semester, and print the challan. Pay at HBL Bank branch on campus or any HBL branch across Pakistan. After payment, verify your payment on the SIS portal at sis.uaf.edu.pk within 3 working days.'
  },
  {
    id: 'fee-004',
    category: 'Fees',
    keywords: ['scholarship waiver','fee waiver','free tuition','merit scholarship'],
    question: 'Are there scholarship fee waivers available at UAF?',
    answer: 'Yes, UAF offers fee waivers for scholarship recipients. Top merit students (Honhaar Scholarship) receive 100% fee waiver for the entire degree. Need-based scholarship recipients get 50–75% fee waiver. HEC scholarships provide Rs 3,000–6,000/month stipend. Apply through the Treasurer Office (Ext. 2300) or online at uaf.edu.pk/scholarships.'
  },
  {
    id: 'fee-005',
    category: 'Fees',
    keywords: ['late fee','fine','penalty','overdue','missed deadline','late payment'],
    question: 'What is the late fee fine policy at UAF?',
    answer: 'If you miss the fee payment deadline, a fine is imposed: Rs 500 for first 5 days late, Rs 1,000 for 6–15 days late, Rs 2,000 for 16–30 days late. After 30 days, enrollment may be suspended. Apply for fee extension from the Treasurer (Ext. 2300) before the deadline if facing financial difficulties. Extension granted once per semester only.'
  },

  // ── HOSTELS (8) ──────────────────────────────────────────────────────────────
  {
    id: 'hos-001',
    category: 'Hostels',
    keywords: ['boys hostel','male hostel','blocks','hostel list','Block A','Block B','Block C','Block D','Block E','Block F'],
    question: 'What are the boys hostels at UAF?',
    answer: 'UAF has 7 boys hostels: Block A, Block B, Block C, Block D, Block E, Block F (all in North Campus residential area), and the New Boys Hostel (near Engineering Block). Each block has common rooms, study halls, WiFi, 24/7 security, and mess facility. Capacity: 300–400 students per block.'
  },
  {
    id: 'hos-002',
    category: 'Hostels',
    keywords: ['girls hostel','female hostel','ladies','Block 1','Block 2'],
    question: 'What are the girls hostels at UAF?',
    answer: 'UAF has 2 girls hostels: Girls Hostel Block 1 and Girls Hostel Block 2, located in the secured North Campus area near the Faculty of Social Sciences. Both have a dedicated lady warden, mess facility, WiFi, and 24/7 security. Female students must submit parents\' consent along with the boarder proforma. Contact: Ext. 7002 or girls.hostel@uaf.edu.pk.'
  },
  {
    id: 'hos-003',
    category: 'Hostels',
    keywords: ['boarder proforma','hostel application','how to apply hostel','get hostel room'],
    question: 'How to apply for hostel (boarder proforma) at UAF?',
    answer: 'The boarder proforma is available at the Hostel Office (near Main Gate) and online at uaf.edu.pk/hostels. Fill the form, attach: admission letter, fee payment receipt, CNIC copy, and parent\'s CNIC. Submit to the Hostel Office before the deadline (usually first week of semester). Rooms are allotted on merit/distance criteria. Hostel fee must be paid within 7 days of allotment.'
  },
  {
    id: 'hos-004',
    category: 'Hostels',
    keywords: ['non-boarder','day scholar','non boarder proforma','off-campus'],
    question: 'What is the non-boarder proforma process at UAF?',
    answer: 'Students living off-campus (day scholars) must fill the non-boarder proforma available at the Registrar\'s Office or online. Attach CNIC and parent/guardian declaration. This proforma is mandatory for enrollment. Non-boarders pay a minimal non-boarder fee but can still use campus facilities like library, sports complex, and cafeterias during campus hours.'
  },
  {
    id: 'hos-005',
    category: 'Hostels',
    keywords: ['hostel warden','warden contact','hostel office','hostel help'],
    question: 'How to contact the hostel warden at UAF?',
    answer: 'Boys Hostel Warden: +92-41-9200161 Ext. 310 | Email: hostelboys@uaf.edu.pk. Girls Hostel Warden: +92-41-9200161 Ext. 7002 | Email: hostelgirls@uaf.edu.pk. Chief Warden Office is near the Main Gate, Admin Block. Office hours: 8:30 AM – 4:30 PM (Mon–Fri). For night emergencies, security guards at the hostel gate are available 24/7.'
  },
  {
    id: 'hos-006',
    category: 'Hostels',
    keywords: ['hostel facilities','wifi hostel','mess','laundry','gym','facilities'],
    question: 'What facilities are provided in UAF hostels?',
    answer: 'UAF hostels provide: (1) 24/7 WiFi (PERN network), (2) Mess with 3 meals/day (breakfast, lunch, dinner), (3) Common room with TV, (4) Indoor sports facilities, (5) Study rooms and reading halls, (6) Laundry service (paid), (7) Prayer room, (8) 24/7 security and CCTV, (9) Generator backup for power cuts, (10) Nearest medical facility: UAF Health Center.'
  },
  {
    id: 'hos-007',
    category: 'Hostels',
    keywords: ['internship hostel','summer internship','visiting student','temporary hostel'],
    question: 'Can internship/visiting students stay in UAF hostel?',
    answer: 'Yes, students doing internships at UAF or visitors attending short courses can apply for temporary hostel accommodation. Submit a letter from your institution confirming the internship/course, along with CNIC copy and passport photos to the Hostel Office. Charges: Rs 500/night or Rs 8,000/month. Available on first-come basis. Contact: hostelboys@uaf.edu.pk.'
  },
  {
    id: 'hos-008',
    category: 'Hostels',
    keywords: ['hostel allotment','criteria','preference','who gets hostel','distance'],
    question: 'What is the hostel allotment criteria at UAF?',
    answer: 'Hostel allotment is based on: (1) Distance from UAF — students from farther cities get priority, (2) Academic merit — higher CGPA gets priority, (3) Financial need — declared and verified need cases, (4) Year of study — fresh students get preference for remaining seats. Total hostel capacity: ~5,000 students. All hostels are allocated through the centralized Hostel Office.'
  },

  // ── DEPARTMENTS (8) ──────────────────────────────────────────────────────────
  {
    id: 'dep-001',
    category: 'Departments',
    keywords: ['CS department','computer science','CS building','CS location','CS contact'],
    question: 'Where is the Department of Computer Science at UAF and how to contact?',
    answer: 'Department of Computer Science is in the Faculty of Computer Science & Information Technology (CS&IT) Building, near the Engineering Block on main campus. Programs: BS CS, MS CS, PhD CS. Chairman: Dr. Saqib Ali. Email: cs@uaf.edu.pk. Phone: +92-41-9200161 Ext. 2550. Website: uaf.edu.pk/faculty-cs. Office hours: 8:30 AM – 4:30 PM.'
  },
  {
    id: 'dep-002',
    category: 'Departments',
    keywords: ['faculty of agriculture','agricultural sciences','agri faculty','BSc agriculture'],
    question: 'What is the Faculty of Agriculture at UAF?',
    answer: 'The Faculty of Agriculture is UAF\'s largest and oldest faculty, established in 1906. It offers BS Agriculture (Hons), MSc, MPhil, and PhD in Agronomy, Plant Pathology, Soil Science, Horticulture, Plant Breeding, Entomology, and more. Dean\'s office: Agriculture Block, Main Campus. Email: agri.dean@uaf.edu.pk. Over 2,000 students enrolled.'
  },
  {
    id: 'dep-003',
    category: 'Departments',
    keywords: ['veterinary','vet science','DVM','animal','Faculty of Veterinary'],
    question: 'What is the Faculty of Veterinary Science at UAF?',
    answer: 'The Faculty of Veterinary Sciences at UAF offers the prestigious DVM (5-year) degree along with MSc and PhD programs in Veterinary Microbiology, Pathology, Surgery, Pharmacology, and Animal Reproduction. Located on the East side of main campus. Contact: vet@uaf.edu.pk | +92-41-9200161. The faculty has its own teaching hospital for clinical training.'
  },
  {
    id: 'dep-004',
    category: 'Departments',
    keywords: ['engineering','technology','agri engineering','BSc engineering','Faculty of Engineering'],
    question: 'What is the Faculty of Engineering and Technology at UAF?',
    answer: 'The Faculty of Agricultural Engineering & Technology (FAET) offers BS Agricultural Engineering, BS Food Engineering, MS and PhD programs. Located near the Workshop & Lab complex on main campus. Specializations: Farm Machinery, Irrigation, Processing Technology, Food Engineering. Email: faet@uaf.edu.pk. The faculty has state-of-the-art labs and a tractor workshop.'
  },
  {
    id: 'dep-005',
    category: 'Departments',
    keywords: ['food science','nutrition','home economics','food nutrition','Faculty of Food'],
    question: 'What is the Faculty of Food, Nutrition and Home Sciences at UAF?',
    answer: 'This faculty offers BS Food Science & Technology, BS Human Nutrition, BS Home Economics, and postgraduate programs. Located in the Home Economics Building, South Campus. Key areas: Food processing, Nutritional analysis, Dietetics, Textile Technology. Email: foods@uaf.edu.pk. The faculty has fully equipped food processing and nutrition analysis labs.'
  },
  {
    id: 'dep-006',
    category: 'Departments',
    keywords: ['social sciences','sociology','economics','rural sociology','Faculty of Social'],
    question: 'What is the Faculty of Social Sciences at UAF?',
    answer: 'The Faculty of Social Sciences offers BS Economics, BS Sociology, BS Rural Development, and BS Mass Communication. Located in the Social Sciences Block near the Girls Hostels. Key departments: Agricultural Economics, Rural Sociology, Communication & Media Studies. Email: socsci@uaf.edu.pk. The faculty also offers Extension Education programs.'
  },
  {
    id: 'dep-007',
    category: 'Departments',
    keywords: ['business','management','BBA','MBA','Institute of Business','IBMS'],
    question: 'What is the Institute of Business Management Sciences (IBMS) at UAF?',
    answer: 'IBMS offers BBA (4 years), MBA (1.5 years for BBA holders), MS Management Sciences, and PhD. Located in the IBMS Building near the Main Gate. Affiliations: PBC, NBEAC. Focus: Business Administration, Finance, Marketing, HR, Agribusiness Management. Email: ibms@uaf.edu.pk | Phone: Ext. 2700. Strong industry linkages and placement cell.'
  },
  {
    id: 'dep-008',
    category: 'Departments',
    keywords: ['arts','humanities','languages','English','Urdu','Faculty of Arts'],
    question: 'What is the Faculty of Arts and Humanities at UAF?',
    answer: 'The Faculty of Arts & Humanities at UAF offers BS English, BS Urdu, BS Pakistan Studies, and related programs. Located in the Arts & Humanities Block. Key departments: Department of English, Department of Urdu, Department of Islamic Studies. Email: arts@uaf.edu.pk. The faculty also supports language courses for all other faculties and organizes literary festivals.'
  },

  // ── EXAMS & RESULTS (6) ───────────────────────────────────────────────────────
  {
    id: 'exam-001',
    category: 'Exams',
    keywords: ['check result','exam result','result portal','grade','CGPA','how to check result'],
    question: 'How to check exam results at UAF?',
    answer: 'UAF exam results are published on the official website: web.uaf.edu.pk under the "Examinations" section. You can also check your results on the SIS portal at sis.uaf.edu.pk using your student ID and password. Results are announced 2–4 weeks after the exam. For result queries, contact the Controller of Examinations: Ext. 2400 or exams@uaf.edu.pk.'
  },
  {
    id: 'exam-002',
    category: 'Exams',
    keywords: ['date sheet','exam schedule','timetable','when are exams','exam dates'],
    question: 'How are exam date sheets announced at UAF?',
    answer: 'Exam date sheets are announced by the Controller of Examinations 3–4 weeks before exams. They are published on web.uaf.edu.pk/examinations and displayed on departmental notice boards. The SIS portal also shows your personalized exam schedule. Midterm exams are in week 8–9 of the semester; Final exams in week 17–18.'
  },
  {
    id: 'exam-003',
    category: 'Exams',
    keywords: ['rechecking','recounting','re-checking application','marks review','challenge'],
    question: 'How to apply for re-checking or recounting of exam paper at UAF?',
    answer: 'Apply for re-checking/recounting within 7 days of result announcement. Form available at the Controller of Examinations Office (Admin Block, Ext. 2400). Fee: Rs 500 per paper for recounting; Rs 1,000 per paper for re-marking. Submit the form with fee challan. Result of re-checking is usually announced within 30 days. The decision of re-marking is final.'
  },
  {
    id: 'exam-004',
    category: 'Exams',
    keywords: ['GAT','GRE','NTS test','postgraduate test','admission test schedule'],
    question: 'What is the GAT and GRE test schedule at UAF?',
    answer: 'UAF accepts NTS-GAT (Graduate Assessment Test) for MSc/MPhil admissions — minimum score 50. For PhD, NTS-GAT (Subject) or HEC-approved GRE score of 60+ is required. NTS conducts GAT tests every 2 months; check nts.org.pk for dates. Some departments conduct their own departmental tests. Valid test score from last 2 years is accepted.'
  },
  {
    id: 'exam-005',
    category: 'Exams',
    keywords: ['degree','transcript','issuance','obtain degree','certificate','graduation'],
    question: 'How to get degree and transcript from UAF Registrar?',
    answer: 'Apply for degree/transcript at the Registrar Office (Admin Block, Ext. 301). Provisional certificate issued within 30 days of result. Final degree issued within 6 months. Transcript fee: Rs 500 per copy. Required documents: clearance certificate from Library, Hostel, Finance, and Department. Apply online at appserver1.uaf.edu.pk or visit the Registrar Office (Mon–Fri 8:30 AM–4 PM).'
  },
  {
    id: 'exam-006',
    category: 'Exams',
    keywords: ['low CGPA','dropout','readmission','CGPA policy','academic probation'],
    question: 'What is UAF\'s CGPA readmission/dropout policy?',
    answer: 'Students with CGPA below 2.0 after 2nd semester are placed on academic probation. If CGPA remains below 2.0 after 4th semester, they may be dropped from the program. Students can apply for readmission within one year with valid reasons. Readmission requires departmental approval, Dean\'s approval, and minimum CGPA of 1.5. Contact the Registrar Office (Ext. 301) for details.'
  },

  // ── SCHOLARSHIPS (6) ─────────────────────────────────────────────────────────
  {
    id: 'sch-001',
    category: 'Scholarships',
    keywords: ['Honhaar','honhaar scholarship','merit scholarship','top student','full scholarship'],
    question: 'What is the Honhaar Scholarship at UAF and how to apply?',
    answer: 'The Honhaar Scholarship (Government of Punjab) gives full fee waiver + Rs 3,000/month stipend to top-merit students from government schools. Eligibility: SSC 90%+ marks, admitted on open merit, household income below Rs 45,000/month. Apply online at honhaar.punjab.gov.pk after enrollment. Documents: matric certificate, income proof, CNIC, domicile. UAF Registrar\'s office assists with the process.'
  },
  {
    id: 'sch-002',
    category: 'Scholarships',
    keywords: ['need-based scholarship','financial aid','poor student','income-based'],
    question: 'What need-based scholarships are available at UAF?',
    answer: 'UAF offers need-based scholarships for financially deserving students: (1) UAF Need-Based Scholarship — 25–50% fee waiver, apply to the Treasurer; (2) HEC Need-Based Scholarship — Rs 4,000–6,000/month; (3) Benevolent Fund grants for orphans and very low-income families. Submit income proof, parent\'s CNIC, and departmental recommendation to the Scholarship Office (Ext. 2300).'
  },
  {
    id: 'sch-003',
    category: 'Scholarships',
    keywords: ['HDF','human development','HDF scholarship','NGO scholarship'],
    question: 'What is the HDF Scholarship at UAF?',
    answer: 'The Human Development Foundation (HDF) Scholarship is available for students from underprivileged backgrounds who are enrolled at UAF. It covers tuition fee + monthly stipend. Eligibility: household income below Rs 30,000/month, good academic standing (CGPA 2.5+). Apply through the UAF Scholarship Office or directly at hdf.org.pk. Interviews held every semester.'
  },
  {
    id: 'sch-004',
    category: 'Scholarships',
    keywords: ['laptop','CM laptop','Punjab laptop','Chief Minister laptop','free laptop'],
    question: 'What documents are required for the CM Punjab Laptop Program at UAF?',
    answer: 'For the Chief Minister Punjab Laptop Program, required documents are: (1) UAF enrollment letter, (2) CNIC copy, (3) Domicile certificate (Punjab), (4) Bank account details (Meezan or HBL), (5) Academic transcripts, (6) Parent\'s income certificate, (7) Passport-size photo. Eligibility: BS 2nd year and above, no backlogs, CGPA 2.5+. Apply at cmgp.punjab.gov.pk when announced.'
  },
  {
    id: 'sch-005',
    category: 'Scholarships',
    keywords: ['89-AG','family scholarship','agriculture scholarship','martyred','special quota'],
    question: 'What is the 89-AG Family Scholarship at UAF?',
    answer: 'The 89-AG Family Scholarship is a UAF-specific scholarship for children of UAF faculty/staff members and families of martyred/disabled defense personnel. It provides 50% tuition fee waiver for the full degree duration. Eligibility: direct child of qualifying parent, admitted on merit. Apply with parent\'s employment letter and CNIC to the Treasurer\'s Office (Ext. 2300) within first month of semester.'
  },
  {
    id: 'sch-006',
    category: 'Scholarships',
    keywords: ['benevolent fund','educational scholarship','welfare scholarship','orphan'],
    question: 'What is the Benevolent Fund educational scholarship at UAF?',
    answer: 'The UAF Benevolent Fund provides educational grants to children of UAF employees, orphans, and students facing extreme financial hardship. Monthly stipend: Rs 1,500–3,000. Grants are also available for examination fees and educational supplies. Apply with a formal application, death/disability certificate (if applicable), and income statement to the Benevolent Fund Office in the Admin Block.'
  },

  // ── FACILITIES (5) ───────────────────────────────────────────────────────────
  {
    id: 'fac-001',
    category: 'Facilities',
    keywords: ['library','books','24/7','study','digital library','e-journal','JSTOR'],
    question: 'What are the facilities and timings of UAF Central Library?',
    answer: 'UAF Central Library is open 24/7 during exam periods and 8 AM–midnight on regular days. Collection: 200,000+ physical books, 50,000+ e-books, subscriptions to JSTOR, ScienceDirect, and HEC Digital Library. Services: book borrowing (3 books, 2-week period), inter-library loan, group study rooms (bookable), individual carrels, print/scan services. Extension: 3301. Location: Central Academic Block.'
  },
  {
    id: 'fac-002',
    category: 'Facilities',
    keywords: ['health center','dispensary','doctor','medical','OPD','medicine'],
    question: 'Where is the UAF Health Center and dispensary?',
    answer: 'UAF Health Center is located near Boys Hostel Block C on main campus. Services: OPD 8 AM–8 PM daily, 24/7 emergency service, free consultation for UAF students, subsidized medicines at on-campus pharmacy, ambulance service (call Ext. 7100). Specialist clinics on specific days (Eye, Dental, Gynecology). Free basic medicines for registered students. Emergency: 041-9200161 Ext. 7100.'
  },
  {
    id: 'fac-003',
    category: 'Facilities',
    keywords: ['HBL','bank','ATM','HBL bank','MCB','money','banking'],
    question: 'Is there an HBL Bank branch and ATM on UAF campus?',
    answer: 'Yes, HBL (Habib Bank Limited) has a full branch on UAF campus near the Main Gate, open Mon–Fri 9 AM–5 PM. Services: fee payment, account opening, demand draft, cheque encashment. Campus also has ATMs for HBL, MCB, and National Bank, all operational 24/7. HBL is the designated bank for UAF fee payments via challan form.'
  },
  {
    id: 'fac-004',
    category: 'Facilities',
    keywords: ['print','copy','photocopy','printing','print shop'],
    question: 'Where is the Print and Copy Shop on UAF campus?',
    answer: 'The Print & Copy Shop (Reprographic Section) is located at the Student Center, Ground Floor, near the Main Cafeteria. Services: Black & white photocopy at Rs 2/page, color printing Rs 15/page, binding, lamination, spiral binding. Hours: 8 AM–8 PM weekdays, 9 AM–5 PM weekends. Additional print shops are near the CS Department and Library.'
  },
  {
    id: 'fac-005',
    category: 'Facilities',
    keywords: ['sports complex','cricket','football','gym','swimming pool','sports'],
    question: 'What facilities are available at UAF Sports Complex?',
    answer: 'UAF Sports Complex (East Campus) offers: Cricket ground (international standard), Football & hockey fields, Tennis courts (6), Badminton hall, Basketball courts, Swimming pool (Olympic-size), Gymnasium (weight training + cardio), Athletics track (400m). Open 6 AM–10 PM daily. All facilities are FREE for registered UAF students. Contact Sports Department: Ext. 4500.'
  },

  // ── EVENTS (6) ───────────────────────────────────────────────────────────────
  {
    id: 'evt-000',
    category: 'Events',
    keywords: ['events','festivals','annual events','uaf events','melas','celebrations','cultural events','student events','what events'],
    question: 'What events and festivals are held at UAF?',
    answer: 'UAF hosts several major annual events and festivals: (1) Jashn-e-Bahara (Spring Festival) — Feb/Mar, the flagship event with music, food, and performances; (2) Gur Mela — Jan/Feb, celebrating jaggery heritage; (3) Kapas Mela — Oct/Nov, cotton research showcase; (4) Wadiyain Mela — cultural heritage festival; (5) Inter Hall Sports Gala — Nov/Dec, inter-hostel sports competition; (6) TechFest UAF — Oct, computing & tech festival. Plus: Annual Agriculture Exhibition (March), Research Symposium, and Convocation (July). All events are open to UAF students.'
  },
  {
    id: 'evt-001',
    category: 'Events',
    keywords: ['Gur Mela','jaggery','gur','annual festival','agricultural festival'],
    question: 'What is Gur Mela at UAF?',
    answer: 'Gur Mela is UAF\'s annual jaggery (gur) festival celebrating Pakistan\'s agricultural heritage, specifically the sugarcane and jaggery-making tradition. Held every January/February, it features live gur-making demonstrations, stalls by farmers and students, cultural performances, horse shows, and traditional food. It attracts thousands of visitors and celebrates UAF\'s deep roots in agriculture. It\'s one of UAF\'s most beloved traditions.'
  },
  {
    id: 'evt-002',
    category: 'Events',
    keywords: ['Kapas Mela','cotton festival','cotton','kapas','cotton research'],
    question: 'What is Kapas Mela at UAF?',
    answer: 'Kapas Mela is UAF\'s Cotton Festival that showcases UAF\'s world-class cotton research. Held annually in the cotton harvest season (October/November), it features exhibition of cotton varieties developed by UAF scientists, field visits to research farms, expert talks by agronomists, and stalls by cotton farmers. UAF has developed several high-yield cotton varieties planted across Punjab and Sindh.'
  },
  {
    id: 'evt-003',
    category: 'Events',
    keywords: ['Wadiyain Mela','valley','cultural','regional','heritage','mela'],
    question: 'What is Wadiyain Mela at UAF?',
    answer: 'Wadiyain Mela is a vibrant cultural festival organized by UAF students representing the valley traditions and regional heritage of Punjab. The event features folk music, traditional dances, regional cuisine stalls, handicrafts exhibition, and cultural performances. Students from different regions of Punjab set up stalls representing their hometown\'s culture. It promotes cultural diversity and unity among UAF\'s diverse student body.'
  },
  {
    id: 'evt-004',
    category: 'Events',
    keywords: ['Jashn-e-Bahara','spring festival','spring','Bahara','bahara','annual event','awaited'],
    question: 'What is Jashn-e-Bahara at UAF?',
    answer: 'Jashn-e-Bahara (Spring Festival) is UAF\'s flagship annual event and the most awaited festival of the year. Held in February/March when UAF campus blooms with spring flowers, it features: music concerts, art exhibitions, food street with 100+ stalls, student talent competitions, sports tournaments, photography contests, and a Grand Finale night. Entry is open to all UAF students and is managed by the Students Union.'
  },
  {
    id: 'evt-005',
    category: 'Events',
    keywords: ['Inter Hall Sports','sports gala','inter hostel','hostel sports','hostel competition'],
    question: 'What is the Inter Hall Sports competition at UAF?',
    answer: 'Inter Hall Sports is UAF\'s annual inter-hostel sports competition. All hostel blocks (Boys Blocks A–F and Girls Hostels 1–2) compete in sports including cricket, football, volleyball, badminton, table tennis, tug-of-war, and athletics. Organized by the Sports Department (Ext. 4500). Usually held in November–December. Winning hostel gets the UAF Sports Trophy. Open to all hostel residents.'
  },

  // ── SOCIETIES (5) ────────────────────────────────────────────────────────────
  {
    id: 'soc-000',
    category: 'Societies',
    keywords: ['clubs','societies','student clubs','student organizations','extracurricular','activities','join club','student society','what clubs','what societies'],
    question: 'What clubs and societies are available at UAF?',
    answer: 'UAF has 7 active student clubs and societies: (1) UAF Debating Club — public speaking, national competitions; (2) Rotaract Club — community service, leadership; (3) Naat Club — Naat recitation, Hamd, Mehfil-e-Naat events; (4) UAF Computing Society — hackathons, coding, TechFest; (5) Drama & Arts Society — theatre, exhibitions; (6) Environmental Society — conservation, plantation drives; (7) More societies coming soon. To join, visit the Students Affairs Office or contact the club directly. Membership is generally open to all registered UAF students.'
  },
  {
    id: 'soc-001',
    category: 'Societies',
    keywords: ['debating club','debate','public speaking','debating society','how to join debate'],
    question: 'What is the UAF Debating Club and how to join?',
    answer: 'UAF Debating Club holds weekly practice sessions every Tuesday at 4 PM in the CS Building Seminar Hall. It participates in national debating competitions including NUML, LUMS, and NUST tournaments. Activities: mock debates, parliamentary procedure training, elocution contests. Membership: open to all UAF students. Fill the membership form at the Students Affairs Office or email debate@uaf.edu.pk. Annual membership fee: Rs 200.'
  },
  {
    id: 'soc-002',
    category: 'Societies',
    keywords: ['Rotaract','rotary','community service','youth leadership','Rotaract club','volunteer'],
    question: 'What is the UAF Rotaract Club and its activities?',
    answer: 'UAF Rotaract Club is affiliated with Rotary International and focuses on youth leadership and community service. Activities: blood donation drives, tree plantation, health camps in rural areas, career counseling sessions, and district-level Rotaract conferences. Open to all UAF students. Monthly meetings, community service hours can be added to your CV. Contact: rotaract.uaf@gmail.com.'
  },
  {
    id: 'soc-003',
    category: 'Societies',
    keywords: ['Naat','naat club','hamd','Islamic poetry','Quran recitation','mehfil','naat recitation'],
    question: 'What is the Naat Club at UAF?',
    answer: 'The UAF Naat Club organizes Naat recitation competitions, Hamd programmes, and Mehfil-e-Naat events at UAF. The club celebrates Islamic poetry and love of the Prophet ﷺ. Major events are held during Ramadan and Eid Milad-un-Nabi. The club represents UAF at provincial and national Naat competitions. Open to all UAF students — no prior experience needed. Visit the Students Affairs Office to join.'
  },
  {
    id: 'soc-004',
    category: 'Societies',
    keywords: ['computing society','hackathon','coding','programming','tech competition','CS society'],
    question: 'What is the UAF Computing Society and its events?',
    answer: 'UAF Computing Society organizes hackathons, coding competitions, tech workshops, and industrial visits for CS/IT students. Annual flagship event: "TechFest UAF" (held in October). Activities: app development competitions, cybersecurity workshops, AI/ML seminars, and gaming tournaments. Membership open to all students. Email: computing.uaf@gmail.com or visit the CS Department Seminar Hall every Thursday 4 PM.'
  },

  // ── CONTACTS (5) ─────────────────────────────────────────────────────────────
  {
    id: 'con-001',
    category: 'Contacts',
    keywords: ['phone number','contact number','main phone','telephone','call UAF'],
    question: 'What is UAF\'s main phone number?',
    answer: 'UAF main switchboard: +92-41-9200161 to 70 (10 lines). Specific extensions: VC Office Ext. 200, Registrar Ext. 301, Admissions Ext. 302, Treasurer Ext. 2300, Controller of Exams Ext. 2400, IT Help Desk Ext. 250, Library Ext. 3301, Health Center Ext. 7100, Hostels Ext. 310, Sports Dept. Ext. 4500. For general queries call the main line and ask for the relevant department.'
  },
  {
    id: 'con-002',
    category: 'Contacts',
    keywords: ['email','info email','official email','uaf email','contact email'],
    question: 'What is UAF\'s official email address?',
    answer: 'UAF official email: info@uaf.edu.pk. Department emails: Admissions: admissions@uaf.edu.pk | IT Support: it@uaf.edu.pk | CS Department: cs@uaf.edu.pk | Veterinary: vet@uaf.edu.pk | International Office: intl@uaf.edu.pk | Registrar: registrar@uaf.edu.pk | Hostel Office: hostelboys@uaf.edu.pk. Student email IDs (@uaf.edu.pk) are issued after enrollment through the IT Department.'
  },
  {
    id: 'con-003',
    category: 'Contacts',
    keywords: ['registrar','registrar office','registrar contact','enrollment office'],
    question: 'How to contact the UAF Registrar Office?',
    answer: 'Registrar Office is located on Ground Floor, Admin Block, Main Campus. Services: student enrollment, degree issuance, transcript requests, character certificates, migration certificates, examination fee clearances. Phone: +92-41-9200161 Ext. 301. Email: registrar@uaf.edu.pk. Office hours: Mon–Fri 8:30 AM – 4:00 PM. For online services: appserver1.uaf.edu.pk.'
  },
  {
    id: 'con-004',
    category: 'Contacts',
    keywords: ['VC office appointment','vice chancellor appointment','meet VC','VC schedule','book appointment'],
    question: 'How to book an appointment with the UAF Vice Chancellor?',
    answer: 'Appointments with the Vice Chancellor (Prof. Dr. Zulfiqar Ali) can be booked at outlook.office.com/book/ViceChancellorUAF. Alternatively, call the VC Office at Ext. 200 or email vc@uaf.edu.pk. Walk-in appointments are not available. Appointment slots are Mon–Thu 10 AM–12 PM and 2 PM–4 PM. Allow 5–7 working days for confirmation. For urgent matters, contact the Personal Secretary at Ext. 201.'
  },
  {
    id: 'con-005',
    category: 'Contacts',
    keywords: ['LMS','SIS','portal','student portal','online learning','lms.uaf.edu.pk'],
    question: 'How to access UAF LMS and SIS portals?',
    answer: 'UAF LMS (Learning Management System): lms.uaf.edu.pk — access course materials, submit assignments, view grades, attend virtual classes. UAF SIS (Student Information System): sis.uaf.edu.pk — view fee challan, exam schedule, results, enrollment status. Both portals use your UAF Student ID and password (provided at enrollment). For login issues, contact IT Help Desk: it@uaf.edu.pk or Ext. 250.'
  },

  // ── CAMPUS MAP (3) ───────────────────────────────────────────────────────────
  {
    id: 'map-001',
    category: 'Campus Map',
    keywords: ['campus map','find location','where is','navigate','directions','building location'],
    question: 'How do I navigate and find locations on UAF campus?',
    answer: 'Use the UAF IntelliChat Campus Map section (click "Campus Maps" in navigation). It shows all major buildings with an interactive Leaflet map. You can click any location in the list to zoom in on the map and get directions. The map has category filters (Academic, Admin, Services, Sports, Hostels, Health, Mosque). For Google Maps directions, search "University of Agriculture Faisalabad" or use coordinates: 31.4502°N 73.0665°E.'
  },
  {
    id: 'map-002',
    category: 'Campus Map',
    keywords: ['parking','car parking','bike parking','where to park'],
    question: 'Where is the parking area at UAF campus?',
    answer: 'Main parking areas at UAF: (1) Main Gate Parking — near HBL Bank, motorbike parking free, car parking Rs 500/month with monthly pass. (2) CS Block Parking — near CS Department, student-only bikes. (3) Admin Block Parking — faculty/staff designated. (4) Hostel Parking — for hostel residents with registered vehicles. Contact Security Office (Main Gate) for parking pass: Ext. 5001.'
  },
  {
    id: 'map-003',
    category: 'Campus Map',
    keywords: ['mosque','prayer','namaz','masjid','central mosque','prayer times'],
    question: 'Where is the mosque on UAF campus?',
    answer: 'UAF has two mosques: (1) Central Mosque — near Admin Block, Central Campus, capacity 1,000+ worshippers. Open for all five daily prayers. Friday Juma prayers draw the entire campus community. (2) Jamia Masjid near Boys Hostels — smaller, for hostel residents. Both mosques have wudu facilities and separate prayer areas. Prayer times follow Faisalabad city Azan schedule. A muezzin is on duty for all five prayers at the Central Mosque.'
  },
];

module.exports = { UAF_KNOWLEDGE_BASE };
