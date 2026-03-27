import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import { useSpeechToText, useTextToSpeech } from "@/hooks/useSpeech";
import { sendChatMessage, submitComplaint, type ChatMessage, type ComplaintFormData } from "@/services/api";
import { COMPLAINT_TYPES, PLATFORMS } from "@/data/complaintTypes";
import MicButton from "@/components/MicButton";
import { Send, Upload, CheckCircle, Volume2 } from "lucide-react";

export default function ComplaintPage() {
  const { t, language, setLanguage, isLanguageSelected } = useLanguage();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText();
  const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech();
  const [isContinuousMode, setIsContinuousMode] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form state
  const [form, setForm] = useState<ComplaintFormData>({
    fullName: "", phone: "", email: "", address: "",
    incidentType: "", dateTime: "", description: "",
    amountLost: "", transactionId: "", suspectDetails: "",
    suspectVpa: "", suspectPhone: "", suspectBankAccount: "",
    platform: "", language: language.code,
  });
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [idFiles, setIdFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isFormValid = Boolean(
    form.fullName &&
      form.phone &&
      form.email &&
      form.address &&
      form.incidentType &&
      form.dateTime &&
      form.description &&
      form.platform
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // When user stops speaking, send transcript
  useEffect(() => {
    if (!isListening && transcript) {
      setInputText(transcript);
      resetTranscript();
      // If continuous mode is on, submitting the transcript should immediately show loading
      // The sendMessage call is handled by useEffect or manual button. Wait, actually we rely on 'sendMessage' being called directly?
      // Currently, it just sets inputText and clears transcript. Wait, how was it sending before?
      // Ah! It wasn't sending! The user had to click "Submit" button! Oh!
    }
  }, [isListening, transcript, resetTranscript]);

  // If continuous mode is on, and we have input text, we should probably auto-send it
  useEffect(() => {
    if (isContinuousMode && inputText && !isListening && !isSpeaking) {
      sendMessage(inputText);
    }
  }, [isContinuousMode, inputText, isListening, isSpeaking]);

  // Auto-resume listening if continuous mode is active
  useEffect(() => {
    if (isContinuousMode && !isSpeaking && !isListening && !chatLoading && !inputText) {
      const timer = setTimeout(() => {
        startListening();
      }, 500); // tiny delay ensures TTS completely releases the audio interface
      return () => clearTimeout(timer);
    }
  }, [isContinuousMode, isSpeaking, isListening, chatLoading, inputText, startListening]);

  const applyCollectedFields = useCallback((fields?: Record<string, string>) => {
    if (!fields || Object.keys(fields).length === 0) return;
    setForm((prev) => ({
      ...prev,
      fullName: fields.full_name || prev.fullName,
      phone: fields.phone_number || prev.phone,
      email: fields.email || prev.email,
      address: fields.address || prev.address,
      incidentType: fields.complaint_type || prev.incidentType,
      dateTime: fields.date_time || prev.dateTime,
      description: fields.description || prev.description,
      amountLost: fields.amount_lost || prev.amountLost,
      transactionId: fields.transaction_id || prev.transactionId,
      suspectDetails: fields.suspect_details || prev.suspectDetails,
      platform: fields.platform || prev.platform,
      suspectVpa: fields.suspect_vpa || prev.suspectVpa,
      suspectPhone: fields.suspect_phone || prev.suspectPhone,
      suspectBankAccount: fields.suspect_bank_account || prev.suspectBankAccount,
    }));
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");

    // --- Voice Input Sequence: hlo -> choose language -> converse ---
    if (!isLanguageSelected || text.toLowerCase() === "hlo" || text.toLowerCase() === "hello") {
      // Check if the user is specifying a language
      const matchedLang = LANGUAGES.find((l: any) => text.toLowerCase().includes(l.name.toLowerCase()) || text.includes(l.nativeName));
      
      if (matchedLang) {
         // User selected a language!
         setLanguage(matchedLang);
         
         // Trigger the AI to start conversing in that language
         setChatLoading(true);
         try {
           const apiRes = await sendChatMessage(newMessages, matchedLang.code);
           setMessages((prev) => [...prev, { role: "assistant", content: apiRes.response }]);
           applyCollectedFields(apiRes.collected_fields);
           
           // We use the updated speak hook that safely overrides the context language code
           // and guarantees the isSpeaking state triggers automatically
           speak(apiRes.response, matchedLang.speechCode);
         } catch {
           setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, error." }]);
         }
         setChatLoading(false);
         return;
      } else {
         // Step 2: "choose your language"
         const reply = "Please choose your language. For example: English, Hindi, or Tamil.";
         setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
         speak(reply);
          return;
      }
    }

    // --- Voice Submission Trigger ---
    const submitRegex = /submit|file|confirm|register|submit the form|file my complaint/i;
    if (submitRegex.test(text.toLowerCase()) && isFormValid) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Understood. Submitting your complaint now..." }]);
      speak("Understood. Submitting your complaint now.");
      handleSubmit();
      return;
    } else if (submitRegex.test(text.toLowerCase()) && !isFormValid) {
       const missingFieldsReply = "I'm ready to submit, but some required fields are still missing. Please provide your full name, incident details, and the platform where it happened.";
       setMessages((prev) => [...prev, { role: "assistant", content: missingFieldsReply }]);
       speak(missingFieldsReply);
       return;
    }

    setChatLoading(true);

    try {
      const apiRes = await sendChatMessage(newMessages, language.name);
      setMessages((prev) => [...prev, { role: "assistant", content: apiRes.response }]);
      applyCollectedFields(apiRes.collected_fields);
      speak(apiRes.response);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("sorryError") }]);
    }
    setChatLoading(false);
  }, [messages, language.name, isLanguageSelected, speak, applyCollectedFields, handleSubmit, isFormValid]);

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await submitComplaint({ ...form, evidenceFiles, idProofFiles: idFiles, language: language.code });
      setTicketId(res.ticketId);
      setSubmitted(true);
      speak(`${t("yourComplaintFiled")} ${res.ticketId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("failedSubmit");
      setSubmitError(message);
    }
    setSubmitting(false);
  };

  const updateForm = (field: keyof ComplaintFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
        <div className="text-center animate-reveal-up bg-card rounded-xl p-12 shadow-lg border border-border max-w-md gov-border-top">
          <CheckCircle className="w-16 h-16 text-status-resolved mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t("complaintSuccess")}</h2>
          <p className="text-muted-foreground mb-4">{t("complaintRegistered")}</p>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">{t("ticketId")}</p>
            <p className="text-2xl font-bold text-primary tabular-nums">{ticketId}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t("saveTicketId")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] max-w-[1400px] mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 animate-reveal-up">{t("fileComplaint")}</h1>

      <div className="grid lg:grid-cols-[auto_1fr_1fr] gap-6">
        {/* LEFT: Mic */}
        <div className="flex lg:flex-col items-center gap-4 animate-reveal-up" style={{ animationDelay: "80ms" }}>
          <MicButton
            isListening={isListening || isContinuousMode}
            onToggle={() => {
              if (isContinuousMode || isListening) {
                setIsContinuousMode(false);
                stopListening();
                stopSpeaking();
              } else {
                setIsContinuousMode(true);
                startListening();
              }
            }}
            size="lg"
          />
          <p className="text-xs text-muted-foreground text-center">
            {isContinuousMode ? t("listening") + " (Continuous)" : isListening ? t("listening") : t("speakNow")}
          </p>
        </div>

        {/* CENTER: Chat */}
        <div className="bg-card rounded-xl shadow-sm border border-border flex flex-col h-[600px] animate-reveal-up" style={{ animationDelay: "160ms" }}>
          <div className="px-4 py-3 border-b border-border bg-muted/50 rounded-t-xl">
            <h2 className="text-sm font-semibold">{t("aiAssistant")}</h2>
            <p className="text-xs text-muted-foreground">{t("conversationIn")} {language.nativeName}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-msg-in`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" && (
                    <button
                      onClick={() => speak(msg.content)}
                      className="inline-block ml-2 text-accent hover:opacity-70"
                      aria-label="Read aloud"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(inputText)}
                placeholder={t("speakNow")}
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-accent outline-none"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || chatLoading}
                className="p-2 rounded-lg bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-40 active:scale-95 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="bg-card rounded-xl shadow-sm border border-border overflow-y-auto h-[600px] animate-reveal-up" style={{ animationDelay: "240ms" }}>
          <div className="px-4 py-3 border-b border-border bg-muted/50">
            <h2 className="text-sm font-semibold">{t("complaintForm")}</h2>
            <p className="text-xs text-muted-foreground">{t("autoFilled")}</p>
          </div>

          <div className="p-4 space-y-4">
            <FormField label={t("fullName")} value={form.fullName} onChange={(v) => updateForm("fullName", v)} />
            <FormField label={t("phone")} value={form.phone} onChange={(v) => updateForm("phone", v)} type="tel" />
            <FormField label={t("email")} value={form.email} onChange={(v) => updateForm("email", v)} type="email" />
            <FormField label={t("address")} value={form.address} onChange={(v) => updateForm("address", v)} textarea />

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{t("incidentType")}</label>
              <select
                value={form.incidentType}
                onChange={(e) => updateForm("incidentType", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="">{t("selectItem")}</option>
                {COMPLAINT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <FormField label={t("dateTime")} value={form.dateTime} onChange={(v) => updateForm("dateTime", v)} type="datetime-local" />
            <FormField label={t("description")} value={form.description} onChange={(v) => updateForm("description", v)} textarea />
            <FormField label={t("amountLost")} value={form.amountLost || ""} onChange={(v) => updateForm("amountLost", v)} placeholder="₹" />
            <FormField label={t("transactionId")} value={form.transactionId || ""} onChange={(v) => updateForm("transactionId", v)} />
            <FormField label={t("suspectDetails")} value={form.suspectDetails || ""} onChange={(v) => updateForm("suspectDetails", v)} textarea />
            <FormField label="Suspect UPI/VPA" value={form.suspectVpa || ""} onChange={(v) => updateForm("suspectVpa", v)} placeholder="e.g. suspect@upi" />
            <FormField label="Suspect Phone" value={form.suspectPhone || ""} onChange={(v) => updateForm("suspectPhone", v)} type="tel" />
            <FormField label="Suspect Bank Account" value={form.suspectBankAccount || ""} onChange={(v) => updateForm("suspectBankAccount", v)} />

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{t("platform")}</label>
              <select
                value={form.platform}
                onChange={(e) => updateForm("platform", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="">{t("selectItem")}</option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* File uploads */}
            <FileUpload
              label={t("uploadEvidence")}
              hint={t("evidenceHint")}
              files={evidenceFiles}
              onChange={setEvidenceFiles}
              accept="audio/*,video/*,.pdf,image/*"
            />
            <FileUpload
              label={t("uploadId")}
              hint={t("idHint")}
              files={idFiles}
              onChange={setIdFiles}
              accept="image/*,.pdf"
            />

            <button
              onClick={handleSubmit}
              disabled={submitting || !isFormValid}
              className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 disabled:opacity-40 transition-all active:scale-[0.98]"
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
            {submitError && (
              <p className="text-xs text-destructive leading-relaxed">{submitError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function FormField({
  label, value, onChange, type = "text", textarea = false, placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; textarea?: boolean; placeholder?: string;
}) {
  const cls = "w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-accent outline-none transition-all";
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} min-h-[60px] resize-y`} placeholder={placeholder} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      )}
    </div>
  );
}

function FileUpload({
  label, hint, files, onChange, accept,
}: {
  label: string; hint: string; files: File[]; onChange: (f: File[]) => void; accept: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
      <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-input bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
        <Upload size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{hint}</span>
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) onChange([...files, ...Array.from(e.target.files)]);
          }}
        />
      </label>
      {files.length > 0 && (
        <div className="mt-1 space-y-0.5">
          {files.map((f, i) => (
            <p key={i} className="text-xs text-muted-foreground truncate">📎 {f.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}
