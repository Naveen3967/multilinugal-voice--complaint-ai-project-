export interface Language {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
}

// Language order follows user requirement.
export const LANGUAGES: Language[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechCode: "hi-IN" },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", speechCode: "kok-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechCode: "kn-IN" },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", speechCode: "doi-IN" },
  { code: "brx", name: "Bodo", nativeName: "बड़ो", speechCode: "brx-IN" },
  { code: "ur", name: "Urdu", nativeName: "اردو", speechCode: "ur-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechCode: "ta-IN" },
  { code: "ks", name: "Kashmiri", nativeName: "कॉशुर", speechCode: "ks-IN" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", speechCode: "as-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", speechCode: "bn-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", speechCode: "mr-IN" },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", speechCode: "sd-IN" },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", speechCode: "mai-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", speechCode: "pa-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", speechCode: "ml-IN" },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্", speechCode: "mni-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechCode: "te-IN" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", speechCode: "sa-IN" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", speechCode: "ne-NP" },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", speechCode: "sat-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", speechCode: "gu-IN" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", speechCode: "or-IN" },
  { code: "en", name: "English", nativeName: "English", speechCode: "en-IN" },
];
