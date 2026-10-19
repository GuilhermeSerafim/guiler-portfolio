import { SITE_HOSTS, SITE_TITLES, type SiteId } from "./config";
import { sanitizePageUrl, sanitizeReferrer } from "./urls";

export type ProjectId = "georisk" | "seven-tools" | "playsenac" | "mesa";
export type ProjectOpenLocation = "project_cover" | "project_title" | "project_details";
type LinkParams =
  | { link_id: "projects"; destination_id: "portfolio_projects"; ui_location: "link_grid" }
  | { link_id: "hackathon"; destination_id: "georisk_story"; ui_location: "link_grid" }
  | { link_id: "code"; destination_id: "github_profile"; ui_location: "link_grid" }
  | { link_id: "instagram"; destination_id: "instagram_profile"; ui_location: "footer" }
  | { link_id: "github"; destination_id: "github_profile"; ui_location: "footer" | "projects_footer" | "contact" }
  | { link_id: "linkedin"; destination_id: "linkedin_profile"; ui_location: "about" | "contact" }
  | { link_id: "project_code"; destination_id: "project_repository"; project_id: ProjectId; ui_location: "project_card" | "project_dialog" };
type ContactParams =
  | { contact_method: "calendly"; link_id: "conversation"; ui_location: "link_grid" }
  | { contact_method: "email_open"; link_id?: "email"; ui_location: "footer" | "contact_arrow" | "contact_email" }
  | { contact_method: "email_copy"; ui_location: "contact_copy" };

export type AnalyticsEvent =
  | { name: "page_view"; params: { ui_location: "page"; page_location: string; page_referrer: string } }
  | { name: "link_click"; params: LinkParams }
  | { name: "project_open"; params: { project_id: ProjectId; ui_location: ProjectOpenLocation } }
  | { name: "project_visit"; params: { project_id: ProjectId; ui_location: "project_dialog" } }
  | { name: "resume_download"; params: { asset_id: "resume_fullstack"; ui_location: "hero" | "contact" } }
  | { name: "contact_intent"; params: ContactParams };

const projects = ["georisk", "seven-tools", "playsenac", "mesa"];
const links: Record<string, { destination: string; locations: string[] }> = {
  projects: { destination: "portfolio_projects", locations: ["link_grid"] },
  hackathon: { destination: "georisk_story", locations: ["link_grid"] },
  code: { destination: "github_profile", locations: ["link_grid"] },
  instagram: { destination: "instagram_profile", locations: ["footer"] },
  github: { destination: "github_profile", locations: ["footer", "projects_footer", "contact"] },
  linkedin: { destination: "linkedin_profile", locations: ["about", "contact"] },
  project_code: { destination: "project_repository", locations: ["project_card", "project_dialog"] },
};

export function serializeEvent(event: AnalyticsEvent, site: SiteId): Record<string, string | number> | null {
  try {
    if (!Object.hasOwn(SITE_HOSTS, site) || !event || typeof event !== "object" || !event.params || typeof event.params !== "object" || Array.isArray(event.params)) return null;
    const p = event.params as unknown as Record<string, unknown>;
    const location = p.ui_location;
    if (typeof location !== "string") return null;
    const result: Record<string, string | number> = { site_id: site, schema_version: 1, ui_location: location };
    switch (event.name) {
      case "page_view":
        if (location !== "page" || typeof p.page_location !== "string" || typeof p.page_referrer !== "string") return null;
        return { ...result, page_location: sanitizePageUrl(site, p.page_location), page_referrer: sanitizeReferrer(p.page_referrer), page_title: SITE_TITLES[site] };
      case "project_open":
      case "project_visit":
        if (!projects.includes(p.project_id as string) || !(event.name === "project_open" ? ["project_cover", "project_title", "project_details"] : ["project_dialog"]).includes(location)) return null;
        return { ...result, project_id: p.project_id as string };
      case "resume_download":
        return p.asset_id === "resume_fullstack" && ["hero", "contact"].includes(location) ? { ...result, asset_id: "resume_fullstack" } : null;
      case "contact_intent": {
        const valid = p.contact_method === "calendly" ? location === "link_grid" && p.link_id === "conversation" : p.contact_method === "email_copy" ? location === "contact_copy" && p.link_id === undefined : p.contact_method === "email_open" && ["footer", "contact_arrow", "contact_email"].includes(location) && (p.link_id === undefined || p.link_id === "email");
        if (!valid) return null;
        return { ...result, contact_method: p.contact_method as string, ...(p.link_id ? { link_id: p.link_id as string } : {}) };
      }
      case "link_click": {
        if (typeof p.link_id !== "string" || !Object.hasOwn(links, p.link_id)) return null;
        const rule = links[p.link_id];
        if (p.destination_id !== rule.destination || !rule.locations.includes(location) || (p.link_id === "project_code" && !projects.includes(p.project_id as string))) return null;
        return { ...result, link_id: p.link_id, destination_id: rule.destination, ...(p.link_id === "project_code" ? { project_id: p.project_id as string } : {}) };
      }
      default: return null;
    }
  } catch { return null; }
}
