export type HomePresentation = {
  heroDesktop: string; heroMobile: string; heroTitle: string; heroButton: string; heroHref: string;
  bannerMobile: string; bannerHref: string;
  launchEnabled: boolean; launchAt: string; launchTitle: string;
  launchDesktop: string; launchMobile: string; launchHref: string;
};
export const defaultHomePresentation: HomePresentation = {
  heroDesktop: "/hero-slide-1.png", heroMobile: "", heroTitle: "",
  heroButton: "Shop the collection", heroHref: "/collections",
  bannerMobile: "", bannerHref: "/Store", launchEnabled: false,
  launchAt: "", launchTitle: "", launchDesktop: "", launchMobile: "", launchHref: "/collections",
};
export function safeInternalHref(value: string, fallback = "/collections") {
  return /^\/(?!\/)/.test(value) && !/[\\\s\u0000-\u001f]/.test(value) ? value : fallback;
}
export function validImageSource(value: string) {
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try { const url = new URL(value); return url.protocol === "https:" && url.hostname === "res.cloudinary.com"; }
  catch { return false; }
}
export function normalizeHomePresentation(value: Partial<HomePresentation> | null = {}): HomePresentation {
  value ??= {};
  const result = { ...defaultHomePresentation };
  for (const key of Object.keys(result) as (keyof HomePresentation)[]) {
    if (key === "launchEnabled") result.launchEnabled = value.launchEnabled === true;
    else if (typeof value[key] === "string") result[key] = value[key].trim();
  }
  for (const key of ["heroDesktop", "heroMobile", "bannerMobile", "launchDesktop", "launchMobile"] as const) {
    if (result[key] && !validImageSource(result[key])) result[key] = defaultHomePresentation[key];
  }
  if (result.launchAt && !Number.isFinite(Date.parse(result.launchAt))) result.launchAt = "";
  result.heroDesktop ||= defaultHomePresentation.heroDesktop;
  result.heroHref = safeInternalHref(result.heroHref);
  result.bannerHref = safeInternalHref(result.bannerHref, "/Store");
  result.launchHref = safeInternalHref(result.launchHref);
  return result;
}
export function resolveHero(value: HomePresentation, now: number) {
  const launch = value.launchEnabled && Boolean(value.launchDesktop)
    && Number.isFinite(Date.parse(value.launchAt)) && Date.parse(value.launchAt) <= now;
  return {
    desktop: launch ? value.launchDesktop : value.heroDesktop,
    mobile: launch ? value.launchMobile || value.launchDesktop : value.heroMobile || value.heroDesktop,
    title: launch ? value.launchTitle : value.heroTitle,
    button: value.heroButton, href: launch ? value.launchHref : value.heroHref,
  };
}
