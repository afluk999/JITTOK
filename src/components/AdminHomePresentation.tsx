"use client";

import { useEffect, useState } from "react";
import { getHomeContent, updateHomeContent } from "@/lib/contentService";
import { defaultHomePresentation, safeInternalHref, validImageSource, type HomePresentation } from "@/lib/homePresentation";
import HeroWall from "@/components/HeroWall";

const fields: { key: keyof HomePresentation; label: string; image?: boolean }[] = [
  { key: "heroDesktop", label: "Desktop hero image", image: true },
  { key: "heroMobile", label: "Mobile hero image (optional)", image: true },
  { key: "heroTitle", label: "Hero headline (optional)" },
  { key: "heroButton", label: "Button text (leave blank to hide)" },
  { key: "heroHref", label: "Button destination, e.g. /collections/ringer" },
  { key: "bannerMobile", label: "Mobile promo banner (optional)", image: true },
  { key: "bannerHref", label: "Promo banner destination" },
];

export default function AdminHomePresentation() {
  const [value, setValue] = useState<HomePresentation>(defaultHomePresentation);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [previewTime, setPreviewTime] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    void getHomeContent().then(content => { if (active) { setValue(content.presentation); setLoaded(true); } })
      .catch(() => { if (active) setMessage("Homepage settings could not be loaded. Reload to try again."); });
    return () => { active = false; };
  }, []);
  function patch(key: keyof HomePresentation, text: string | boolean) {
    setValue(previous => ({ ...previous, [key]: text }));
    setPreviewTime(null);
  }
  function validate() {
    for (const key of ["heroDesktop", "heroMobile", "bannerMobile", "launchDesktop", "launchMobile"] as const) {
      if (value[key] && !validImageSource(value[key])) throw new Error("Use an uploaded image or a local image path.");
    }
    if (!value.heroDesktop) throw new Error("Choose a desktop hero image.");
    for (const key of ["heroHref", "bannerHref", "launchHref"] as const) {
      if (safeInternalHref(value[key], "") !== value[key] || !value[key]) throw new Error("Destinations must be site paths beginning with /.");
    }
    if (value.launchEnabled && (!value.launchDesktop || !Number.isFinite(Date.parse(value.launchAt)))) {
      throw new Error("Choose a launch date and launch image before enabling the schedule.");
    }
  }
  async function save() {
    try {
      validate(); setBusy(true); setMessage("");
      await updateHomeContent({ presentation: value });
      setMessage("Homepage settings saved. Open the storefront to see them.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save settings."); }
    finally { setBusy(false); }
  }
  async function upload(key: keyof HomePresentation, file?: File) {
    if (!file) return;
    setBusy(true); setMessage("");
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/cloudinary-upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.secure_url) throw new Error(result.error || "Upload failed.");
      patch(key, result.secure_url);
      setMessage("Image uploaded. Save settings to publish it.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); }
    finally { setBusy(false); }
  }
  function field(key: keyof HomePresentation, label: string, image = false) {
    return <label key={key} className="admin-field">{label}
      <input value={String(value[key])} onChange={e => patch(key, e.target.value)} />
      {image && <input aria-label={`Upload ${label}`} type="file" accept="image/*" onChange={e => void upload(key, e.target.files?.[0])} />}
    </label>;
  }
  return <section className="admin-tool-panel">
    <h2>Hero, mobile images & launch schedule</h2>
    <p>Preview your changes, then save to publish. Image uploads use your existing media service.</p>
    <fieldset disabled={!loaded || busy}>
      <div className="admin-field-grid">{fields.map(f => field(f.key, f.label, f.image))}</div>
      <label className="admin-check"><input type="checkbox" checked={value.launchEnabled} onChange={e => patch("launchEnabled", e.target.checked)} /> Switch the hero for a scheduled launch</label>
      <p>The schedule changes the homepage image and link. Publish the collection’s products separately when they are ready.</p>
      <div className="admin-field-grid">
        <label className="admin-field">Launch time (India Standard Time)
          <input type="datetime-local" value={value.launchAt ? new Date(Date.parse(value.launchAt) + 330 * 60000).toISOString().slice(0,16) : ""}
            onChange={e => patch("launchAt", e.target.value ? new Date(e.target.value + ":00+05:30").toISOString() : "")} />
        </label>
        {field("launchTitle", "Launch headline")}
        {field("launchDesktop", "Launch desktop image", true)}
        {field("launchMobile", "Launch mobile image (optional)", true)}
        {field("launchHref", "Launch destination")}
      </div>
      <div className="admin-toolbar">
        <button type="button" onClick={() => { try { validate(); setPreviewTime(Date.now()); setMessage(""); } catch (e) { setMessage((e as Error).message); } }}>Preview current hero</button>
        <button type="button" disabled={!value.launchEnabled} onClick={() => { try { validate(); setPreviewTime(Date.parse(value.launchAt)); setMessage(""); } catch (e) { setMessage((e as Error).message); } }}>Preview scheduled hero</button>
        <button type="button" onClick={() => void save()}>{busy ? "Saving…" : "Save homepage settings"}</button>
      </div>
    </fieldset>
    <p role="status">{message}</p>
    {previewTime !== null && <div className="admin-hero-preview" key={previewTime}><HeroWall presentation={value} initialTime={previewTime} preview /></div>}
  </section>;
}
