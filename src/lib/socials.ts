/**
 * Central social/contact directory for WatchBox7.
 * Update handles here and every page uses them.
 */
export type Social = {
  key: "instagram" | "whatsapp" | "facebook" | "youtube" | "tiktok" | "telegram" | "x" | "email";
  label: string;
  handle: string;
  href: string;
  color: string; // tailwind gradient classes
};

export const WHATSAPP_NUMBER = "0725639512";
// International format for wa.me (Rwanda +250, strip leading 0)
export const WHATSAPP_INTL = "250725639512";

export const SOCIALS: Social[] = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    handle: WHATSAPP_NUMBER,
    href: `https://wa.me/${WHATSAPP_INTL}`,
    color: "from-green-500 to-emerald-500",
  },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@__watchbox7",
    href: "https://instagram.com/__watchbox7",
    color: "from-pink-500 via-fuchsia-500 to-purple-600",
  },
  {
    key: "facebook",
    label: "Facebook",
    handle: "WatchBox7",
    href: "https://facebook.com/watchbox7",
    color: "from-blue-600 to-blue-400",
  },
  {
    key: "tiktok",
    label: "TikTok",
    handle: "@__watchbox7",
    href: "https://tiktok.com/@__watchbox7",
    color: "from-zinc-900 to-zinc-600",
  },
  {
    key: "youtube",
    label: "YouTube",
    handle: "@watchbox7",
    href: "https://youtube.com/@watchbox7",
    color: "from-red-600 to-red-400",
  },
  {
    key: "telegram",
    label: "Telegram",
    handle: "@watchbox7",
    href: "https://t.me/watchbox7",
    color: "from-sky-500 to-blue-500",
  },
  {
    key: "x",
    label: "X (Twitter)",
    handle: "@watchbox7",
    href: "https://x.com/watchbox7",
    color: "from-zinc-700 to-zinc-500",
  },
  {
    key: "email",
    label: "Email",
    handle: "beldenbyiringiro116@gmail.com",
    href: "mailto:beldenbyiringiro116@gmail.com",
    color: "from-amber-500 to-orange-500",
  },
];
