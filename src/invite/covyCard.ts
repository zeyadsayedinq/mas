import monogramSrc from "../assets/brand/covy-monogram-greige.webp";
import { CARD_H, CARD_W, canvasBlob, dayLabel, fontsReady, loadImage, paragraph, roundRect, spaced, star, wrap, type InviteData } from "./core";

export type CovyMood = "quiet" | "friends" | "late" | "private";
export const COVY_ARRIVALS = ["20:00", "21:00", "22:00", "23:00", "late"] as const;

const NAVY = "#262D3F", GREIGE = "#DCD4CF", GLOW = "#F4EFEB", BLUE = "#7E98AE";

export interface CardCopy {
  eyebrow: string;
  title: string;
  lines: string[];
  /** day, time, guests */
  meta: string[];
  forLine: string;
  fromLine: string;
  /** the message that travels with the card */
  shareText: string;
}

/** Everything written on a COVY card, from the choices alone. Every line is something COVY actually is. */
export function covyCopy(d: InviteData, ar: boolean): CardCopy {
  const tr = (en: string, a: string) => (ar ? a : en);
  const g = d.g ?? 2;
  const mood = d.m as CovyMood;
  const title =
    mood === "quiet" ? (g === 2 ? tr("A quiet table for two", "طاولة هادئة لشخصين") : tr(`A quiet table for ${g}`, `طاولة هادئة لـ${g}`))
    : mood === "friends" ? tr("An evening with friends", "سهرة مع الأصدقاء")
    : mood === "late" ? tr("A late dinner", "عشاء متأخر")
    : tr("A private evening", "سهرة خاصة");

  const lines: string[] = [];
  if (mood === "quiet") lines.push(tr("Low light, and a room quiet enough to hear each other.", "إضاءة خافتة، ومكان هادئ بما يكفي ليسمع كلٌّ منكما الآخر."));
  if (mood === "friends") lines.push(tr(`A table for ${g}, and a full bar that keeps up with the conversation.`, `طاولة لـ${g}، وبار كامل يواكب الحديث.`));
  if (mood === "late") lines.push(tr("Dinner from the late kitchen, with nobody watching the clock.", "عشاء من مطبخ آخر الليل، ولا أحد ينظر إلى الساعة."));
  if (mood === "private") lines.push(tr("One of the quiet rooms, kept for your guests. The rest we plan with you.", "إحدى الغرف الهادئة، محجوزة لضيوفك. والباقي نرتّبه معك."));
  if (d.a === "late") lines.push(tr("Arriving late. The kitchen will still be open.", "الوصول متأخرًا. سيبقى المطبخ مفتوحًا."));
  else if (d.a === "23:00") lines.push(tr("Arriving around 23:00, when the room is at its best.", "الوصول نحو 23:00، حين يكون المكان في أجمل حالاته."));
  else if (d.a === "20:00") lines.push(tr("Arriving around 20:00, with the whole evening ahead.", "الوصول نحو 20:00، والسهرة كلها أمامكم."));
  else if (d.a) lines.push(tr(`Arriving around ${d.a}. Nobody rushes the last table.`, `الوصول نحو ${d.a}. ولا أحد يستعجل آخر طاولة.`));

  const time = d.a === "late" ? tr("Late", "متأخرًا") : d.a ?? "";
  const guests = ar ? (g === 1 ? "ضيف واحد" : g === 2 ? "ضيفان" : g <= 10 ? `${g} ضيوف` : `${g} ضيفًا`) : g === 1 ? "1 guest" : `${g} guests`;
  const day = dayLabel(d.d, ar);
  // "tonight", not "Tonight", in the middle of a sentence
  const when = [/^(Tonight|Tomorrow)$/.test(day) ? day.toLowerCase() : day, time === "Late" ? "late" : time].filter(Boolean).join(ar ? "، " : ", ");

  return {
    eyebrow: d.to || d.from ? tr("You are invited", "دعوة") : tr("An evening at COVY", "سهرة في كوفي"),
    title,
    lines,
    meta: [day, time, guests].filter(Boolean),
    forLine: d.to ? tr(`For ${d.to}`, `إلى ${d.to}`) : "",
    fromLine: d.from ? tr(`From ${d.from}`, `من ${d.from}`) : "",
    shareText: d.to
      ? tr(`${d.to}, you're invited to COVY. ${title}${when ? `, ${when}` : ""}.`, `${d.to}، أنت مدعوّ إلى كوفي. ${title}${when ? `، ${when}` : ""}.`)
      : tr(`An evening at COVY. ${title}${when ? `, ${when}` : ""}. Join me?`, `سهرة في كوفي. ${title}${when ? `، ${when}` : ""}. تنضمّ إليّ؟`),
  };
}

/** The same card as on the page, drawn as a 1080 x 1350 image for sending or saving. */
export async function drawCovyCard(d: InviteData, ar: boolean): Promise<Blob> {
  const c = covyCopy(d, ar);
  const serif = ar ? '"Amiri", serif' : '"Bodoni Moda", Georgia, serif';
  const sans = ar ? '"IBM Plex Sans Arabic", sans-serif' : '"Jost", system-ui, sans-serif';
  await fontsReady(
    ar ? ['400 80px "Amiri"', '400 30px "IBM Plex Sans Arabic"'] : ['italic 400 80px "Bodoni Moda"', '400 30px "Jost"', '500 30px "Jost"'],
    c.title + c.lines.join(" "),
  );
  const mono = await loadImage(monogramSrc).catch(() => null);

  const cv = document.createElement("canvas");
  cv.width = CARD_W; cv.height = CARD_H;
  const x = cv.getContext("2d")!;
  x.direction = ar ? "rtl" : "ltr";
  x.textAlign = "center";
  x.textBaseline = "alphabetic";
  const cx = CARD_W / 2;

  // ground, a little light from above, the inner rule
  x.fillStyle = NAVY; x.fillRect(0, 0, CARD_W, CARD_H);
  const glow = x.createRadialGradient(cx, -60, 40, cx, -60, 900);
  glow.addColorStop(0, "rgba(244,239,235,.16)"); glow.addColorStop(1, "rgba(244,239,235,0)");
  x.fillStyle = glow; x.fillRect(0, 0, CARD_W, CARD_H);
  x.strokeStyle = "rgba(220,212,207,.24)"; x.lineWidth = 2;
  roundRect(x, 36, 36, CARD_W - 72, CARD_H - 72, 44); x.stroke();
  // a scatter of small stars
  x.fillStyle = "rgba(126,152,174,.55)";
  for (const [sx, sy, r] of [[150, 190, 9], [930, 150, 7], [880, 420, 6], [170, 1010, 6], [940, 1090, 9], [120, 600, 5]]) star(x, sx, sy, r);

  let y = 112;
  if (mono) {
    const w = 128, h = (mono.naturalHeight / mono.naturalWidth) * w;
    x.drawImage(mono, cx - w / 2, y, w, h);
    y += h;
  }
  y += 62;
  x.fillStyle = "rgba(220,212,207,.75)";
  x.font = `500 26px ${sans}`;
  if (!ar) spaced(x, 9);
  x.fillText(ar ? c.eyebrow : c.eyebrow.toUpperCase(), cx, y);
  spaced(x, 0);

  if (c.forLine) {
    y += 70;
    x.fillStyle = BLUE;
    x.font = `${ar ? "" : "italic "}400 44px ${serif}`;
    x.fillText(c.forLine, cx, y);
  }

  // title, sized down if it runs long
  y += 30;
  let size = 92;
  x.fillStyle = GLOW;
  do {
    x.font = `${ar ? "" : "italic "}400 ${size}px ${serif}`;
    if (wrap(x, c.title, 820).length <= 2) break;
    size -= 8;
  } while (size > 56);
  const lh = size * (ar ? 1.5 : 1.12);
  y += lh * 0.85;
  y = paragraph(x, c.title, cx, y, 820, lh);

  // rule with a star
  y += 6;
  x.strokeStyle = "rgba(220,212,207,.32)"; x.lineWidth = 2;
  x.beginPath(); x.moveTo(cx - 150, y); x.lineTo(cx - 34, y); x.moveTo(cx + 34, y); x.lineTo(cx + 150, y); x.stroke();
  x.fillStyle = BLUE; star(x, cx, y, 13);

  y += 78;
  x.fillStyle = "rgba(220,212,207,.88)";
  x.font = `400 36px ${sans}`;
  for (const l of c.lines) y = paragraph(x, l, cx, y, 780, ar ? 62 : 54) + 14;

  // foot: who it is from, when and how many, where. Pinned low, but pushed
  // down if the writing above runs long, so nothing ever overlaps.
  let fy = Math.max(y + 46, 1070);
  if (c.fromLine) {
    x.fillStyle = GLOW;
    x.font = `${ar ? "" : "italic "}400 44px ${serif}`;
    x.fillText(c.fromLine, cx, fy);
    fy += 78;
  } else fy += 20;
  fy = Math.max(fy, 1170);
  x.fillStyle = "rgba(220,212,207,.8)";
  x.font = `500 28px ${sans}`;
  if (!ar) spaced(x, 6);
  x.fillText((ar ? c.meta : c.meta.map((m) => m.toUpperCase())).join("   ·   "), cx, fy);
  spaced(x, 0);
  x.fillStyle = "rgba(220,212,207,.5)";
  x.font = `400 24px ${sans}`;
  if (!ar) spaced(x, 5);
  x.fillText(ar ? "كوفي · لاونج ومطبخ لآخر الليل" : "COVY · LOUNGE AND LATE KITCHEN", cx, Math.min(fy + 70, CARD_H - 62));
  spaced(x, 0);
  x.fillStyle = GREIGE;

  return canvasBlob(cv);
}
