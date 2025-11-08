// Multilingual Translation System
// Supported languages: English (en), German (de), Romanian (ro)

const translations = {
    en: {
        // Common
        appName: 'AI CleanCheck',
        appSubtitle: 'Quality Assurance System',

        // Login Page
        login: {
            title: 'Welcome',
            subtitle: 'Professional Cleaning Quality Control',
            username: 'Username',
            password: 'Password',
            showPassword: 'Show password',
            hidePassword: 'Hide password',
            signIn: 'Sign In',
            signingIn: 'Signing in...',
            demoCredentials: 'Demo Credentials: wisag / wisag'
        },

        // Navigation
        nav: {
            inspect: '📸 Inspect',
            dashboard: '📊 Dashboard',
            history: '📋 History',
            users: '👥 Users'
        },

        // Header
        header: {
            logout: 'Logout',
            language: 'Language',
            logoutConfirm: 'Are you sure you want to logout?'
        },

        // Inspect Tab
        inspect: {
            uploadMode: 'Upload Mode',
            singleImage: '📸 Single Image - Analyze one image at a time',
            batchUpload: '📦 Batch Upload - Analyze up to 10 images at once',
            taskSelection: 'Task Selection',
            autoDetect: 'Auto-detect',
            autoDetectDesc: 'AI will identify the area',
            manualSelect: 'Manual Selection',
            chooseTask: '-- Choose Task --',
            captureArea: 'Capture Cleaning Area',
            takePhoto: 'Take Photo',
            uploadPhoto: 'Upload Photo',
            selectMultiple: 'Select Multiple Images (Max 10)',
            imagesSelected: 'images selected',
            clearAll: 'Clear All',
            analyzeAll: 'Analyze All Images',
            capturePhoto: 'Capture Photo',
            selectImages: 'Select Images',
            analyzeImage: 'Analyze Image',
            analyzeBatch: 'Analyze Batch',
            retakePhoto: 'Retake Photo',
            processingBatch: 'Processing Batch...',
            analyzingImage: 'Analyzing image'
        },

        // Tasks
        tasks: {
            'trash-bin': 'Trash Bin',
            'whiteboard': 'Whiteboard',
            'desk-surface': 'Desk Surface',
            'floor': 'Floor',
            'window': 'Window'
        },

        // Results
        results: {
            qualityAssessment: 'Quality Assessment',
            overallScore: 'Overall Score',
            findings: 'Findings',
            recommendations: 'Recommendations',
            confidence: 'Confidence',
            observations: 'Observations',
            viewDetails: 'View Details',
            batchComplete: 'Batch Analysis Complete',
            imagesAnalyzed: 'images analyzed',
            passed: 'PASS',
            failed: 'FAIL'
        },

        // Dashboard
        dashboard: {
            title: 'Dashboard',
            totalInspections: 'Total Inspections',
            averageScore: 'Average Score',
            qualityDistribution: 'Quality Distribution',
            good: 'Good',
            medium: 'Medium',
            poor: 'Poor',
            taskDistribution: 'Task Distribution',
            noData: 'No data available yet',
            startInspecting: 'Start by performing some inspections'
        },

        // History
        history: {
            title: 'Recent Inspections',
            noInspections: 'No inspections yet',
            startCapturing: 'Start by capturing and analyzing a cleaning area',
            by: 'By',
            emptyMessage: 'No inspections yet',
            emptyHint: 'Start by capturing and analyzing a cleaning area',
            editScore: 'Edit Score',
            newScore: 'New Score (0-100)',
            updateScore: 'Update Score',
            cancel: 'Cancel',
            scoreUpdated: 'Score updated successfully!'
        },

        // Users Management
        users: {
            title: 'User Management',
            subtitle: 'Create and manage staff cleaner accounts (Maximum 2 staff members)',
            createUser: 'Create Staff User',
            username: 'Username',
            fullName: 'Full Name',
            password: 'Password',
            admin: 'Admin',
            staff: 'Staff',
            created: 'Created',
            delete: 'Delete',
            noUsers: 'No users found',
            deleteConfirm: 'Are you sure you want to delete user'
        },

        // Messages & Toasts
        messages: {
            apiNotRunning: 'Backend API is not running. Please start your server.',
            cannotConnect: 'Cannot connect to server. Please check your connection.',
            userCreated: 'User created successfully!',
            userDeleted: 'User deleted successfully!',
            failedToCreateUser: 'Failed to create user',
            failedToDeleteUser: 'Failed to delete user',
            failedToLoadUsers: 'Failed to load users',
            sessionExpired: 'Session expired',
            analysisComplete: 'Analysis complete!',
            batchAnalysisComplete: 'Batch analysis complete!',
            noImagesSelected: 'No images selected',
            processingImages: 'Processing {count} images...',
            analyzingImage: 'Analyzing image {current} of {total}...',
            successfullyAnalyzed: 'Successfully analyzed {count} images!',
            batchAnalysisFailed: 'Batch Analysis Failed',
            batchAnalysisError: 'Batch analysis failed. See details above.',
            successfullyAnalyzedPartial: 'Successfully analyzed: {count} of {total} images'
        },

        // Quality levels
        quality: {
            GOOD: 'GOOD',
            MEDIUM: 'MEDIUM',
            POOR: 'POOR'
        },

        // Date/Time
        dateTime: {
            today: 'Today',
            yesterday: 'Yesterday',
            at: 'at'
        }
    },

    de: {
        // Common
        appName: 'AI CleanCheck',
        appSubtitle: 'Qualitätssicherungssystem',

        // Login Page
        login: {
            title: 'Willkommen',
            subtitle: 'Professionelle Reinigungsqualitätskontrolle',
            username: 'Benutzername',
            password: 'Passwort',
            showPassword: 'Passwort anzeigen',
            hidePassword: 'Passwort verbergen',
            signIn: 'Anmelden',
            signingIn: 'Anmelden...',
            demoCredentials: 'Demo-Zugangsdaten: wisag / wisag'
        },

        // Navigation
        nav: {
            inspect: '📸 Prüfen',
            dashboard: '📊 Dashboard',
            history: '📋 Verlauf',
            users: '👥 Benutzer'
        },

        // Header
        header: {
            logout: 'Abmelden',
            language: 'Sprache',
            logoutConfirm: 'Sind Sie sicher, dass Sie sich abmelden möchten?'
        },

        // Inspect Tab
        inspect: {
            uploadMode: 'Upload-Modus',
            singleImage: '📸 Einzelnes Bild - Ein Bild gleichzeitig analysieren',
            batchUpload: '📦 Batch-Upload - Bis zu 10 Bilder gleichzeitig analysieren',
            taskSelection: 'Aufgabenauswahl',
            autoDetect: 'Auto-Erkennung',
            autoDetectDesc: 'KI identifiziert den Bereich',
            manualSelect: 'Manuelle Auswahl',
            chooseTask: '-- Aufgabe wählen --',
            captureArea: 'Reinigungsbereich erfassen',
            takePhoto: 'Foto aufnehmen',
            uploadPhoto: 'Foto hochladen',
            selectMultiple: 'Mehrere Bilder auswählen (Max 10)',
            imagesSelected: 'Bilder ausgewählt',
            clearAll: 'Alle löschen',
            analyzeAll: 'Alle Bilder analysieren',
            capturePhoto: 'Foto aufnehmen',
            selectImages: 'Bilder auswählen',
            analyzeImage: 'Bild analysieren',
            analyzeBatch: 'Batch analysieren',
            retakePhoto: 'Foto erneut aufnehmen',
            processingBatch: 'Batch wird verarbeitet...',
            analyzingImage: 'Bild wird analysiert'
        },

        // Tasks
        tasks: {
            'trash-bin': 'Mülleimer',
            'whiteboard': 'Whiteboard',
            'desk-surface': 'Schreibtischoberfläche',
            'floor': 'Boden',
            'window': 'Fenster'
        },

        // Results
        results: {
            qualityAssessment: 'Qualitätsbewertung',
            overallScore: 'Gesamtbewertung',
            findings: 'Feststellungen',
            recommendations: 'Empfehlungen',
            confidence: 'Konfidenz',
            observations: 'Beobachtungen',
            viewDetails: 'Details anzeigen',
            batchComplete: 'Batch-Analyse abgeschlossen',
            imagesAnalyzed: 'Bilder analysiert',
            passed: 'BESTANDEN',
            failed: 'NICHT BESTANDEN'
        },

        // Dashboard
        dashboard: {
            title: 'Dashboard',
            totalInspections: 'Gesamtinspektionen',
            averageScore: 'Durchschnittliche Bewertung',
            qualityDistribution: 'Qualitätsverteilung',
            good: 'Gut',
            medium: 'Mittel',
            poor: 'Schlecht',
            taskDistribution: 'Aufgabenverteilung',
            noData: 'Noch keine Daten verfügbar',
            startInspecting: 'Beginnen Sie mit einigen Inspektionen'
        },

        // History
        history: {
            title: 'Letzte Inspektionen',
            noInspections: 'Noch keine Inspektionen',
            startCapturing: 'Beginnen Sie mit der Erfassung und Analyse eines Reinigungsbereichs',
            by: 'Von',
            emptyMessage: 'Noch keine Inspektionen',
            emptyHint: 'Beginnen Sie mit der Erfassung und Analyse eines Reinigungsbereichs',
            editScore: 'Bewertung bearbeiten',
            newScore: 'Neue Bewertung (0-100)',
            updateScore: 'Bewertung aktualisieren',
            cancel: 'Abbrechen',
            scoreUpdated: 'Bewertung erfolgreich aktualisiert!'
        },

        // Users Management
        users: {
            title: 'Benutzerverwaltung',
            subtitle: 'Erstellen und verwalten Sie Reinigungspersonal-Konten (Maximal 2 Mitarbeiter)',
            createUser: 'Mitarbeiter erstellen',
            username: 'Benutzername',
            fullName: 'Vollständiger Name',
            password: 'Passwort',
            admin: 'Administrator',
            staff: 'Mitarbeiter',
            created: 'Erstellt',
            delete: 'Löschen',
            noUsers: 'Keine Benutzer gefunden',
            deleteConfirm: 'Möchten Sie den Benutzer wirklich löschen'
        },

        // Messages & Toasts
        messages: {
            apiNotRunning: 'Backend-API läuft nicht. Bitte starten Sie Ihren Server.',
            cannotConnect: 'Keine Verbindung zum Server möglich. Bitte überprüfen Sie Ihre Verbindung.',
            userCreated: 'Benutzer erfolgreich erstellt!',
            userDeleted: 'Benutzer erfolgreich gelöscht!',
            failedToCreateUser: 'Fehler beim Erstellen des Benutzers',
            failedToDeleteUser: 'Fehler beim Löschen des Benutzers',
            failedToLoadUsers: 'Fehler beim Laden der Benutzer',
            sessionExpired: 'Sitzung abgelaufen',
            analysisComplete: 'Analyse abgeschlossen!',
            batchAnalysisComplete: 'Batch-Analyse abgeschlossen!',
            noImagesSelected: 'Keine Bilder ausgewählt',
            processingImages: '{count} Bilder werden verarbeitet...',
            analyzingImage: 'Bild {current} von {total} wird analysiert...',
            successfullyAnalyzed: '{count} Bilder erfolgreich analysiert!',
            batchAnalysisFailed: 'Batch-Analyse fehlgeschlagen',
            batchAnalysisError: 'Batch-Analyse fehlgeschlagen. Siehe Details oben.',
            successfullyAnalyzedPartial: 'Erfolgreich analysiert: {count} von {total} Bildern'
        },

        // Quality levels
        quality: {
            GOOD: 'GUT',
            MEDIUM: 'MITTEL',
            POOR: 'SCHLECHT'
        },

        // Date/Time
        dateTime: {
            today: 'Heute',
            yesterday: 'Gestern',
            at: 'um'
        }
    },

    ro: {
        // Common
        appName: 'AI CleanCheck',
        appSubtitle: 'Sistem de Asigurare a Calității',

        // Login Page
        login: {
            title: 'Bine ați venit',
            subtitle: 'Control Profesional al Calității Curățeniei',
            username: 'Nume utilizator',
            password: 'Parolă',
            showPassword: 'Arată parola',
            hidePassword: 'Ascunde parola',
            signIn: 'Autentificare',
            signingIn: 'Se autentifică...',
            demoCredentials: 'Credențiale demo: wisag / wisag'
        },

        // Navigation
        nav: {
            inspect: '📸 Inspectează',
            dashboard: '📊 Tablou de bord',
            history: '📋 Istoric',
            users: '👥 Utilizatori'
        },

        // Header
        header: {
            logout: 'Deconectare',
            language: 'Limbă',
            logoutConfirm: 'Sigur doriți să vă deconectați?'
        },

        // Inspect Tab
        inspect: {
            uploadMode: 'Mod încărcare',
            singleImage: '📸 Imagine unică - Analizează o singură imagine',
            batchUpload: '📦 Încărcare lot - Analizează până la 10 imagini deodată',
            taskSelection: 'Selectare sarcină',
            autoDetect: 'Detectare automată',
            autoDetectDesc: 'AI va identifica zona',
            manualSelect: 'Selectare manuală',
            chooseTask: '-- Alegeți sarcina --',
            captureArea: 'Capturează zona de curățenie',
            takePhoto: 'Fă fotografie',
            uploadPhoto: 'Încarcă fotografie',
            selectMultiple: 'Selectează imagini multiple (Max 10)',
            imagesSelected: 'imagini selectate',
            clearAll: 'Șterge tot',
            analyzeAll: 'Analizează toate imaginile',
            capturePhoto: 'Capturează fotografie',
            selectImages: 'Selectează imagini',
            analyzeImage: 'Analizează imagine',
            analyzeBatch: 'Analizează lot',
            retakePhoto: 'Refă fotografia',
            processingBatch: 'Se procesează lotul...',
            analyzingImage: 'Se analizează imaginea'
        },

        // Tasks
        tasks: {
            'trash-bin': 'Coș de gunoi',
            'whiteboard': 'Tablă albă',
            'desk-surface': 'Suprafață birou',
            'floor': 'Pardoseală',
            'window': 'Fereastră'
        },

        // Results
        results: {
            qualityAssessment: 'Evaluare calitate',
            overallScore: 'Scor general',
            findings: 'Constatări',
            recommendations: 'Recomandări',
            confidence: 'Încredere',
            observations: 'Observații',
            viewDetails: 'Vezi detalii',
            batchComplete: 'Analiză lot finalizată',
            imagesAnalyzed: 'imagini analizate',
            passed: 'PROMOVAT',
            failed: 'RESPINS'
        },

        // Dashboard
        dashboard: {
            title: 'Tablou de bord',
            totalInspections: 'Total inspecții',
            averageScore: 'Scor mediu',
            qualityDistribution: 'Distribuție calitate',
            good: 'Bun',
            medium: 'Mediu',
            poor: 'Slab',
            taskDistribution: 'Distribuție sarcini',
            noData: 'Nu există date disponibile încă',
            startInspecting: 'Începeți prin a efectua câteva inspecții'
        },

        // History
        history: {
            title: 'Inspecții recente',
            noInspections: 'Nicio inspecție încă',
            startCapturing: 'Începeți prin capturarea și analiza unei zone de curățenie',
            by: 'De',
            emptyMessage: 'Nicio inspecție încă',
            emptyHint: 'Începeți prin capturarea și analiza unei zone de curățenie',
            editScore: 'Editează scor',
            newScore: 'Scor nou (0-100)',
            updateScore: 'Actualizează scor',
            cancel: 'Anulează',
            scoreUpdated: 'Scor actualizat cu succes!'
        },

        // Users Management
        users: {
            title: 'Gestionare utilizatori',
            subtitle: 'Creați și gestionați conturi pentru personalul de curățenie (Maxim 2 membri)',
            createUser: 'Crează utilizator personal',
            username: 'Nume utilizator',
            fullName: 'Nume complet',
            password: 'Parolă',
            admin: 'Administrator',
            staff: 'Personal',
            created: 'Creat',
            delete: 'Șterge',
            noUsers: 'Niciun utilizator găsit',
            deleteConfirm: 'Sigur doriți să ștergeți utilizatorul'
        },

        // Messages & Toasts
        messages: {
            apiNotRunning: 'API-ul backend nu rulează. Vă rugăm să porniți serverul.',
            cannotConnect: 'Nu se poate conecta la server. Verificați conexiunea.',
            userCreated: 'Utilizator creat cu succes!',
            userDeleted: 'Utilizator șters cu succes!',
            failedToCreateUser: 'Eroare la crearea utilizatorului',
            failedToDeleteUser: 'Eroare la ștergerea utilizatorului',
            failedToLoadUsers: 'Eroare la încărcarea utilizatorilor',
            sessionExpired: 'Sesiune expirată',
            analysisComplete: 'Analiză completă!',
            batchAnalysisComplete: 'Analiză lot completă!',
            noImagesSelected: 'Nicio imagine selectată',
            processingImages: 'Se procesează {count} imagini...',
            analyzingImage: 'Se analizează imaginea {current} din {total}...',
            successfullyAnalyzed: '{count} imagini analizate cu succes!',
            batchAnalysisFailed: 'Analiză lot eșuată',
            batchAnalysisError: 'Analiză lot eșuată. Vezi detalii mai sus.',
            successfullyAnalyzedPartial: 'Analizat cu succes: {count} din {total} imagini'
        },

        // Quality levels
        quality: {
            GOOD: 'BUN',
            MEDIUM: 'MEDIU',
            POOR: 'SLAB'
        },

        // Date/Time
        dateTime: {
            today: 'Astăzi',
            yesterday: 'Ieri',
            at: 'la'
        }
    }
};

// Language management functions
let currentLanguage = localStorage.getItem('wisag_language') || 'en';

function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('wisag_language', lang);
        applyTranslations();
    }
}

function t(key, replacements = {}) {
    const keys = key.split('.');
    let value = translations[currentLanguage];

    for (const k of keys) {
        value = value?.[k];
    }

    let result = value || key;

    // Replace placeholders like {count}, {current}, {total}
    for (const [placeholder, replacement] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), replacement);
    }

    return result;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);

        if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });

    // Trigger custom event for dynamic content updates
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
});
