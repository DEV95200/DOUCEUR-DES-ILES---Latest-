import { useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, Mail, MessageSquareText, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminStore } from "../../store/adminStore";
import { Button } from "../ui/Button";
import { WaveDivider } from "../ui/WaveDivider";

type SubmitState = "idle" | "sending" | "success" | "error";

type ContactApiResponse = {
  ok?: boolean;
  error?: string;
};

const fieldClass =
  "w-full rounded-2xl border border-kala-ink/10 bg-white/85 px-4 py-3.5 text-kala-ink outline-none transition placeholder:text-kala-ink/35 focus:border-kala-green focus:ring-4 focus:ring-kala-green/10";

export function Contact() {
  const contactEmail = useAdminStore((state) => state.siteSettings.contactEmail);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const startedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
      website: String(formData.get("website") || ""),
      submittedAt: startedAt.current,
    };

    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as ContactApiResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "L’envoi du message a échoué.");
      }

      form.reset();
      startedAt.current = Date.now();
      setStatus("success");
      toast.success("Message envoyé à l’équipe Kalawang.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "L’envoi du message a échoué.";
      setErrorMessage(message);
      setStatus("error");
      toast.error(message);
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 text-kala-ink sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-kala-lime/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-kala-pink/45 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="lg:sticky lg:top-32"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-kala-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-kala-lime">
            <Sparkles size={15} /> Contact direct
          </div>
          <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[1.02] sm:text-5xl">
            Parlons de votre
            <br /> prochaine envie.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-kala-ink/68">
            Commande spéciale, événement, partenariat ou simple question : écrivez-nous ici. Le message arrive directement dans notre boîte professionnelle.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-4 rounded-3xl border border-white/60 bg-white/55 p-5 backdrop-blur">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-kala-green text-kala-cream"><Mail size={20} /></span>
              <div>
                <p className="font-display font-bold">Par e-mail</p>
                <a href={`mailto:${contactEmail}`} className="mt-1 block text-sm text-kala-ink/60 hover:text-kala-green">{contactEmail}</a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-3xl border border-white/60 bg-white/55 p-5 backdrop-blur">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-kala-mango text-kala-ink"><MessageSquareText size={20} /></span>
              <div>
                <p className="font-display font-bold">Réponse personnalisée</p>
                <p className="mt-1 text-sm leading-relaxed text-kala-ink/60">Nous recevons toutes les informations utiles pour vous répondre sans perdre le contexte.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="rounded-[2rem] border border-white/70 bg-kala-cream/80 p-5 shadow-[0_24px_80px_rgba(20,35,27,.13)] backdrop-blur-xl sm:p-8"
        >
          {status === "success" ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center px-4 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-kala-green text-kala-cream shadow-lg"><CheckCircle2 size={38} /></span>
              <h3 className="mt-7 font-display text-3xl font-bold">Votre message est parti !</h3>
              <p className="mt-3 max-w-md leading-relaxed text-kala-ink/65">Il a été transmis à notre équipe. Un e-mail de confirmation peut également arriver dans votre boîte de réception.</p>
              <button type="button" onClick={() => setStatus("idle")} className="mt-7 font-display font-bold text-kala-green underline decoration-2 underline-offset-4">Envoyer un autre message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
              <div>
                <p className="font-display text-2xl font-bold">Écrivez-nous</p>
                <p className="mt-1 text-sm text-kala-ink/55">Les champs marqués d’un astérisque sont obligatoires.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom et prénom *" name="name" autoComplete="name" minLength={2} required placeholder="Ex. Gaëtan Jean-Baptiste" />
                <Field label="Adresse e-mail *" name="email" type="email" autoComplete="email" required placeholder="vous@exemple.fr" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" placeholder="Optionnel" />
                <label className="grid gap-2 text-sm font-bold text-kala-ink/80">
                  Sujet *
                  <select name="subject" required defaultValue="" className={fieldClass}>
                    <option value="" disabled>Choisir un sujet</option>
                    <option>Question sur une commande</option>
                    <option>Commande spéciale ou événement</option>
                    <option>Partenariat commercial</option>
                    <option>Point de vente ou distribution</option>
                    <option>Presse et création de contenu</option>
                    <option>Autre demande</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm font-bold text-kala-ink/80">
                Votre message *
                <textarea name="message" required minLength={20} maxLength={4000} rows={7} className={`${fieldClass} resize-y`} placeholder="Donnez-nous les détails utiles pour que nous puissions vous répondre précisément…" />
              </label>

              <label className="flex gap-3 text-sm leading-relaxed text-kala-ink/60">
                <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-kala-green" />
                <span>J’accepte que les informations saisies soient utilisées uniquement pour traiter ma demande.</span>
              </label>

              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>

              {status === "error" && (
                <p role="alert" className="rounded-2xl border border-kala-chili/20 bg-kala-chili/8 px-4 py-3 text-sm font-semibold text-kala-chili">{errorMessage}</p>
              )}

              <Button type="submit" size="lg" disabled={status === "sending"} className="mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60">
                {status === "sending" ? <><LoaderCircle size={20} className="animate-spin" /> Envoi en cours…</> : <><Send size={19} /> Envoyer mon message</>}
              </Button>
              <p className="text-center text-xs text-kala-ink/42">Vos identifiants Gmail et votre clé Resend restent protégés côté serveur et ne sont jamais envoyés au navigateur.</p>
            </form>
          )}
        </motion.div>
      </div>

      <WaveDivider color="#ffb6e1" />
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
};

function Field({ label, name, type = "text", autoComplete, placeholder, required, minLength }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold text-kala-ink/80">
      {label}
      <input name={name} type={type} autoComplete={autoComplete} placeholder={placeholder} required={required} minLength={minLength} className={fieldClass} />
    </label>
  );
}
