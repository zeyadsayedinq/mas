import logoSrc from "../assets/brand/aroma-logo.webp";
import markSrc from "../assets/brand/aroma-icon.webp";
import { CARD_H, CARD_W, canvasBlob, dayLabel, fontsReady, loadImage, paragraph, roundRect, spaced, wrap, type InviteData } from "./core";
import type { CardCopy } from "./covyCard";

export type AromaPlan = "coffee" | "breakfast" | "feteer" | "grill" | "work" | "shisha";
export const AROMA_PLANS: AromaPlan[] = ["coffee", "breakfast", "feteer", "grill", "work", "shisha"];
export const AROMA_TIMES = ["10:00", "13:00", "17:00", "20:00", "22:00"] as const;

const GREEN = "#82A541", DEEP = "#6c8a35", INK = "#23301A", MUTED = "#5c6650", TINT = "#EEF4E1";

export function planLabel(p: AromaPlan, ar: boolean): string {
  const t: Record<AromaPlan, [string, string]> = {
    coffee: ["Coffee catch-up", "قهوة وقعدة"],
    breakfast: ["Breakfast", "فطار"],
    feteer: ["Feteer night", "سهرة فطير"],
    grill: ["Dinner off the grill", "عشا مشويات"],
    work: ["Work session", "قعدة شغل"],
    shisha: ["Terrace and shisha", "تراس وشيشة"],
  };
  return t[p][ar ? 1 : 0];
}

/** Everything written on an Aroma card. Each line is something the menu or the room really has. */
export function aromaCopy(d: InviteData, ar: boolean, branchName: string): CardCopy {
  const tr = (en: string, a: string) => (ar ? a : en);
  const plan = (AROMA_PLANS.includes(d.m as AromaPlan) ? d.m : "coffee") as AromaPlan;
  const title: Record<AromaPlan, string> = {
    coffee: tr("Let's get coffee.", "يلا نشرب قهوة."),
    breakfast: tr("Breakfast, properly.", "فطار على أصوله."),
    feteer: tr("Feteer night.", "سهرة فطير."),
    grill: tr("Dinner off the grill.", "عشا من على الشواية."),
    work: tr("Work session, good coffee.", "قعدة شغل وقهوة حلوة."),
    shisha: tr("Terrace and shisha.", "تراس وشيشة."),
  };
  const line: Record<AromaPlan, string> = {
    coffee: tr("Lavazza espresso, pulled to order, and no rush to leave.", "إسبريسو لافاتزا بيتعمل على طلبك، ومحدش مستعجل."),
    breakfast: tr("The breakfast menu, fresh juice, and good coffee next to it.", "منيو الفطار، عصير فريش، وجنبه قهوة مظبوطة."),
    feteer: tr("Layered, folded and straight from the oven. Sweet or savoury, your call.", "فطير مورّق طالع من الفرن. حلو ولا حادق، اللي تحبه."),
    grill: tr("Rib eye, brisket and the rest of the grill, cooked to order.", "ريب آي وبريسكت وباقي المشويات، على طلبك."),
    work: tr("A desk, power, wifi, and coffee within reach.", "مكتب وكهربا وواي فاي، والقهوة جنبك."),
    shisha: tr("An evening outside on the terrace.", "سهرة في الهوا على التراس."),
  };
  const g = d.g ?? 2;
  const people = ar ? (g === 1 ? "شخص واحد" : g === 2 ? "شخصين" : g <= 10 ? `${g} أشخاص` : `${g} شخص`) : g === 1 ? "1 person" : `${g} people`;
  const day = dayLabel(d.d, ar, false);
  const when = [/^(Today|Tomorrow)$/.test(day) ? day.toLowerCase() : day, d.a].filter(Boolean).join(ar ? "، " : ", ");
  const where = tr(`Aroma Lounge ${branchName}`, `أروما لاونج ${branchName}`);
  return {
    eyebrow: tr("you're invited", "عزومة"),
    title: title[plan],
    lines: [line[plan]],
    meta: [day, d.a ?? "", people, branchName].filter(Boolean),
    forLine: d.to ?? "",
    fromLine: d.from ? tr(`From ${d.from}`, `من ${d.from}`) : "",
    shareText: d.to
      ? tr(`${d.to}, you're invited. ${title[plan]} ${where}${when ? `, ${when}` : ""}.`, `${d.to}، معزوم. ${title[plan]} ${where}${when ? `، ${when}` : ""}.`)
      : tr(`${title[plan]} ${where}${when ? `, ${when}` : ""}. Coming?`, `${title[plan]} ${where}${when ? `، ${when}` : ""}. جاي؟`),
  };
}

/** The Aroma invitation as a 1080 x 1350 image: white, green, the logo up top and a wave at the foot. */
export async function drawAromaCard(d: InviteData, ar: boolean, branchName: string): Promise<Blob> {
  const c = aromaCopy(d, ar, branchName);
  const display = ar ? '"Almarai", sans-serif' : '"Fraunces", Georgia, serif';
  const script = ar ? '"Aref Ruqaa", "Almarai", serif' : '"Caveat", cursive';
  const sans = ar ? '"Almarai", sans-serif' : '"DM Sans", system-ui, sans-serif';
  await fontsReady(
    ar ? ['700 80px "Almarai"', '400 30px "Almarai"', '700 60px "Aref Ruqaa"'] : ['500 80px "Fraunces"', '700 60px "Caveat"', '400 30px "DM Sans"', '600 30px "DM Sans"'],
    c.title + c.lines.join(" ") + c.eyebrow,
  );
  const [logo, mark] = await Promise.all([loadImage(logoSrc).catch(() => null), loadImage(markSrc).catch(() => null)]);

  const cv = document.createElement("canvas");
  cv.width = CARD_W; cv.height = CARD_H;
  const x = cv.getContext("2d")!;
  x.direction = ar ? "rtl" : "ltr";
  x.textAlign = "center";
  const cx = CARD_W / 2;

  x.fillStyle = "#FFFFFF"; x.fillRect(0, 0, CARD_W, CARD_H);
  const wash = x.createRadialGradient(cx, 520, 60, cx, 520, 760);
  wash.addColorStop(0, "rgba(130,165,65,.10)"); wash.addColorStop(1, "rgba(130,165,65,0)");
  x.fillStyle = wash; x.fillRect(0, 0, CARD_W, CARD_H);

  // the wave at the foot, in the footer's own tint, with a green band under it
  x.fillStyle = TINT;
  x.beginPath();
  x.moveTo(0, 1060);
  x.bezierCurveTo(240, 1000, 420, 1110, 640, 1050);
  x.bezierCurveTo(820, 1002, 960, 1030, CARD_W, 1070);
  x.lineTo(CARD_W, CARD_H); x.lineTo(0, CARD_H); x.closePath(); x.fill();
  x.fillStyle = GREEN; x.fillRect(0, CARD_H - 92, CARD_W, 92);

  // thin green frame
  x.strokeStyle = "rgba(130,165,65,.5)"; x.lineWidth = 3;
  roundRect(x, 34, 34, CARD_W - 68, CARD_H - 68, 40); x.stroke();

  let y = 150;
  if (logo) {
    const w = 370, h = (logo.naturalHeight / logo.naturalWidth) * w;
    x.drawImage(logo, cx - w / 2, y, w, h);
    y += h;
  }

  y += 118;
  x.fillStyle = DEEP;
  x.font = `700 68px ${script}`;
  x.save();
  x.translate(cx, y); x.rotate(-0.035);
  x.fillText(c.forLine ? (ar ? `${c.eyebrow} لـ${c.forLine}` : `${c.forLine}, ${c.eyebrow}`) : c.eyebrow, 0, 0);
  x.restore();

  let size = 112;
  x.fillStyle = INK;
  do {
    x.font = `${ar ? 700 : 500} ${size}px ${display}`;
    if (wrap(x, c.title, 860).length <= 2) break;
    size -= 8;
  } while (size > 60);
  const lh = size * (ar ? 1.4 : 1.08);
  y += lh * 0.9 + 34;
  y = paragraph(x, c.title, cx, y, 860, lh);

  y += 34;
  x.fillStyle = MUTED;
  x.font = `400 40px ${sans}`;
  for (const l of c.lines) y = paragraph(x, l, cx, y, 800, ar ? 64 : 56);

  // details as pills
  y += 54;
  x.font = `600 32px ${sans}`;
  const pills = c.meta;
  const pad = 32, gap = 16, ph = 70;
  const widths = pills.map((p) => x.measureText(p).width + pad * 2);
  // two rows at most
  const rows: number[][] = [[]];
  let rw = 0;
  widths.forEach((w, i) => {
    if (rw + w > 900 && rows[rows.length - 1].length) { rows.push([]); rw = 0; }
    rows[rows.length - 1].push(i); rw += w + gap;
  });
  for (const row of rows) {
    const total = row.reduce((a, i) => a + widths[i], 0) + gap * (row.length - 1);
    let px = ar ? cx + total / 2 : cx - total / 2;
    for (const i of row) {
      const w = widths[i];
      const left = ar ? px - w : px;
      x.fillStyle = "#FFFFFF"; roundRect(x, left, y, w, ph, ph / 2); x.fill();
      x.strokeStyle = "rgba(130,165,65,.6)"; x.lineWidth = 2.5; roundRect(x, left, y, w, ph, ph / 2); x.stroke();
      x.fillStyle = INK; x.fillText(pills[i], left + w / 2, y + 46);
      px += ar ? -(w + gap) : w + gap;
    }
    y += ph + 14;
  }

  if (c.fromLine) {
    x.fillStyle = DEEP;
    x.font = `700 58px ${script}`;
    x.fillText(c.fromLine, cx, 1190);
  }

  // foot band
  x.fillStyle = "#FFFFFF";
  x.font = `600 26px ${sans}`;
  if (!ar) spaced(x, 5);
  const foot = ar ? "أروما لاونج · قهوة، مشويات، فطير ومساحة شغل" : "AROMA LOUNGE · COFFEE, GRILL, FETEER AND DESKS";
  x.fillText(foot, cx, CARD_H - 36);
  spaced(x, 0);
  if (mark) {
    x.save(); x.globalAlpha = 0.9;
    x.drawImage(mark, 70, 1215, 62, (mark.naturalHeight / mark.naturalWidth) * 62);
    x.drawImage(mark, CARD_W - 132, 1215, 62, (mark.naturalHeight / mark.naturalWidth) * 62);
    x.restore();
  }

  return canvasBlob(cv);
}
