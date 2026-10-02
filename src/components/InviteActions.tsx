import { useEffect, useState } from "react";
import { Share2, Download, Link2, Check, MessageCircle } from "lucide-react";
import { canShareImage, copyText, saveImage, shareImage, whatsappLink } from "../invite/core";
import { useLang } from "../i18n";
import { track } from "../track";

interface Props {
  brand: "covy" | "aroma";
  /** The card as an image, started as soon as the card is written so sharing is instant. */
  image: Promise<Blob> | null;
  fileName: string;
  /** The words that travel with it, and the link that opens the same card. */
  text: string;
  url: string;
  colors: { solidBg: string; solidFg: string; line: string; fg: string; muted: string };
  active?: boolean;
}

/**
 * Send or keep an invitation. On a phone the first button opens the phone's
 * own share menu with the card image in it, which is how it reaches
 * WhatsApp, Instagram, Messages and Snapchat. Everywhere, the card can also
 * go to WhatsApp as a link, be saved as a picture, or be copied as a link.
 */
export default function InviteActions({ brand, image, fileName, text, url, colors, active = true }: Props) {
  const { tr } = useLang();
  const [native, setNative] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => setNative(canShareImage()), []);

  const tab = active ? 0 : -1;
  const ghost = "min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full border transition-transform hover:scale-[1.03] active:scale-95";

  const share = async () => {
    if (!image || busy) return;
    setBusy(true);
    try {
      const blob = await image;
      const ok = await shareImage(blob, fileName, text, url);
      track("invite_share", { brand, via: "sheet", done: ok ? 1 : 0 });
    } finally {
      setBusy(false);
    }
  };
  const save = async () => {
    if (!image) return;
    saveImage(await image, fileName);
    track("invite_share", { brand, via: "save" });
  };
  const copy = async () => {
    if (await copyText(`${text}\n${url}`)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      track("invite_share", { brand, via: "copy" });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5">
        {native && (
          <button type="button" onClick={share} tabIndex={tab} className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full transition-transform hover:scale-[1.03] active:scale-95" style={{ background: colors.solidBg, color: colors.solidFg }}>
            <Share2 size={15} />
            {tr("Send invitation", "أرسل الدعوة")}
          </button>
        )}
        <a
          href={whatsappLink(text, url)}
          target="_blank"
          rel="noreferrer"
          tabIndex={tab}
          onClick={() => track("invite_share", { brand, via: "whatsapp" })}
          className={native ? ghost : "min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-2.5 rounded-full transition-transform hover:scale-[1.03] active:scale-95"}
          style={native ? { borderColor: colors.line, color: colors.fg } : { background: colors.solidBg, color: colors.solidFg }}
        >
          <MessageCircle size={15} />
          WhatsApp
        </a>
        <button type="button" onClick={save} tabIndex={tab} className={ghost} style={{ borderColor: colors.line, color: colors.fg }}>
          <Download size={15} />
          {tr("Save as image", "احفظها كصورة")}
        </button>
        <button type="button" onClick={copy} tabIndex={tab} className={ghost} style={{ borderColor: colors.line, color: colors.fg }}>
          {copied ? <Check size={15} /> : <Link2 size={15} />}
          {copied ? tr("Copied", "تم النسخ") : tr("Copy link", "انسخ الرابط")}
        </button>
      </div>
      <p className="mt-3 text-center text-xs" style={{ color: colors.muted }} aria-live="polite">
        {native
          ? tr("Send opens your share menu: WhatsApp, Instagram, Messages, Snapchat.", "الإرسال يفتح قائمة المشاركة: واتساب، إنستجرام، الرسائل، سناب شات.")
          : tr("For Instagram, Messages or Snapchat, save the image and attach it. On a phone, one tap sends it.", "لإنستجرام أو الرسائل أو سناب شات: احفظ الصورة ثم أرفقها. ومن الهاتف تُرسَل بضغطة واحدة.")}
      </p>
    </div>
  );
}
