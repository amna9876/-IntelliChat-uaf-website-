const express = require('express');
const router  = express.Router();

const campusLocations = [
    { id: 'admin',      title: 'Administration Block', icon: 'fa-building',   lat: 31.4290, lng: 73.0815, category: 'admin',    desc: 'VC Office, Registrar, Treasurer. Hours: 8:30am–4:30pm. Near Main Gate.', phone: 'Ext. 2000' },
    { id: 'vc_office',  title: 'VC Office',            icon: 'fa-user-tie',   lat: 31.4290, lng: 73.0815, category: 'admin',    desc: '3rd Floor, Admin Block, Room 301. Hours: 9am–5pm (Mon–Fri).', phone: 'Ext. 2001' },
    { id: 'library',    title: 'Central Library',      icon: 'fa-book',       lat: 31.4320, lng: 73.0840, category: 'academic', desc: 'Open 24/7 during exams. 200,000+ books, e-journals, WiFi, group study rooms.', phone: 'Ext. 3301' },
    { id: 'cafe',       title: 'Cafeterias',           icon: 'fa-utensils',   lat: 31.4305, lng: 73.0830, category: 'services', desc: 'Main Cafeteria (Student Center), Faculty Café (Admin), Engineering & Agri Cafés. Hours: 7am–11pm.', phone: '' },
    { id: 'exhibition', title: 'Exhibition Centre',    icon: 'fa-chalkboard', lat: 31.4340, lng: 73.0855, category: 'events',   desc: 'Near Sports Complex, East Campus. Capacity 2,000+. Annual Agri Expo (March), Tech Fest (Oct).', phone: 'Ext. 9500' },
    { id: 'photocopy',  title: 'Digital Print & Copy', icon: 'fa-print',      lat: 31.4305, lng: 73.0830, category: 'services', desc: 'Student Center, Ground Floor, Shop #5. Photocopy Rs 2/page, Printing, Binding, Scanning. 8am–8pm.', phone: '' },
    { id: 'sports',     title: 'Sports Complex',       icon: 'fa-futbol',     lat: 31.4345, lng: 73.0862, category: 'sports',   desc: 'East Campus. Cricket, football, tennis, swimming pool, gym. Open 6am–10pm daily. Free for students.', phone: '' },
    { id: 'hostel',     title: 'Student Hostels',      icon: 'fa-home',       lat: 31.4275, lng: 73.0800, category: 'housing',  desc: 'West Campus (Boys) & North Campus (Girls). 10 hostels, 3,000+ students. Mess, study rooms, 24/7 security.', phone: 'Ext. 7001' },
    { id: 'medical',    title: 'Health Center',        icon: 'fa-hospital',   lat: 31.4280, lng: 73.0810, category: 'services', desc: '24/7 emergency & OPD, pharmacy, ambulance. Near Hostels.', phone: '041-9200161 Ext. 7100' },
    { id: 'bank',       title: 'Allied Bank & ATMs',   icon: 'fa-university', lat: 31.4288, lng: 73.0818, category: 'services', desc: 'Allied Bank near Main Gate. ATMs: HBL, MCB, National Bank on campus. ATM 24/7.', phone: '' },
    { id: 'registrar',  title: 'Registrar Office',     icon: 'fa-clipboard',  lat: 31.4292, lng: 73.0818, category: 'admin',    desc: 'Admin Block. Enrollment, transcripts, degree certificates, migration. 8:30am–4pm.', phone: 'Ext. 2200' },
    { id: 'mosque',     title: 'Central Mosque',       icon: 'fa-mosque',     lat: 31.4315, lng: 73.0845, category: 'worship',  desc: 'Central Campus Mosque. Open for all five daily prayers. Capacity 1,000+.', phone: '' },
];

// GET /api/maps/locations  – all locations
router.get('/locations', (_req, res) => {
    res.json({ success: true, locations: campusLocations });
});

// GET /api/maps/locations/:id  – single location by ID
router.get('/locations/:id', (req, res) => {
    const loc = campusLocations.find(l => l.id === req.params.id);
    if (!loc) return res.status(404).json({ success: false, message: 'Location not found.' });
    res.json({ success: true, location: loc });
});

// GET /api/maps/search?q=library&category=academic  – search locations
router.get('/search', (req, res) => {
    const q        = (req.query.q || '').toLowerCase().trim();
    const category = (req.query.category || '').toLowerCase().trim();

    let results = campusLocations;

    if (q) {
        results = results.filter(l =>
            l.title.toLowerCase().includes(q) ||
            l.desc.toLowerCase().includes(q) ||
            l.id.toLowerCase().includes(q)
        );
    }

    if (category) {
        results = results.filter(l => l.category === category);
    }

    res.json({ success: true, locations: results, count: results.length });
});

// GET /api/maps/categories  – list of all unique categories
router.get('/categories', (_req, res) => {
    const cats = [...new Set(campusLocations.map(l => l.category))];
    res.json({ success: true, categories: cats });
});

module.exports = router;
