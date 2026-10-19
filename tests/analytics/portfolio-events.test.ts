import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isValidElement, type ReactElement } from "react";

const { recorded, writeText } = vi.hoisted(() => ({ recorded: vi.fn(), writeText: vi.fn() }));
vi.mock("../../src/analytics/client", () => ({track:recorded, getConsent:()=>"unknown", subscribeConsent:()=>()=>{}, isAnalyticsConfigured:()=>false}));
vi.mock("react", async original => ({...await original<typeof import("react")>(), useState:(value:unknown)=>[typeof value==="function"?value():value,vi.fn()], useRef:()=>({current:null}), useEffect:()=>{}}));
vi.mock("motion/react", () => ({motion:new Proxy({}, {get:(_target,key)=>String(key)}), AnimatePresence:"div", useReducedMotion:()=>true, useScroll:()=>({scrollYProgress:0}),useSpring:()=>0}));
import App from "../../src/App";
import { ProjectDialog } from "../../src/components/ProjectDialog";
import { projects } from "../../src/data";

type Element = ReactElement<Record<string, any>>;
function elements(tree: unknown): Element[] {
  if (Array.isArray(tree)) return tree.flatMap(elements);
  if (!isValidElement(tree)) return [];
  const element=tree as Element;
  return [element,...elements(element.props.children)];
}
beforeEach(() => {
  recorded.mockClear(); writeText.mockReset();
  vi.stubGlobal("window",{location:{search:""}});
  vi.stubGlobal("navigator",{clipboard:{writeText}});
});
afterEach(()=>vi.unstubAllGlobals());

describe("portfolio action controls", () => {
  it("records each of the three project open controls with the preserved project ID", () => {
    const nodes=elements(App());
    for(const project of projects) {
      const controls = [
        nodes.find(n=>n.props["aria-label"]===`Conhecer o projeto ${project.name}`),
        nodes.find(n=>n.type==="button" && n.props.children===project.name),
        nodes.find(n=>n.props["aria-label"]===`Ver detalhes de ${project.name}`),
      ];
      controls.forEach((control,index)=> {
        recorded.mockClear(); control!.props.onClick();
        expect(recorded.mock.calls).toEqual([[{name:"project_open",params:{project_id:project.id,ui_location:["project_cover","project_title","project_details"][index]}}]]);
      });
    }
  });
  it("records demo and public repository only at their respective controls", () => {
    for(const project of projects) {
      const nodes=elements(ProjectDialog({project,onClose:()=>{}}));
      recorded.mockClear(); nodes.find(n=>n.type==="a" && n.props.href===project.demo)!.props.onClick();
      expect(recorded.mock.calls).toEqual([[{name:"project_visit",params:{project_id:project.id,ui_location:"project_dialog"}}]]);
      if(project.github) { recorded.mockClear(); nodes.find(n=>n.props.href===project.github)!.props.onClick(); expect(recorded.mock.calls).toEqual([[{name:"link_click",params:{link_id:"project_code",destination_id:"project_repository",project_id:"playsenac",ui_location:"project_dialog"}}]]); }
    }
  });
  it("measures both resume CTAs and leaves the header anchor alone", () => {
    const nodes=elements(App());
    for(const [index,element] of nodes.filter(n=>n.type==="a"&&n.props.download!==undefined).entries()) {
      recorded.mockClear(); element.props.onClick();
      expect(recorded.mock.calls).toEqual([[{name:"resume_download",params:{asset_id:"resume_fullstack",ui_location:index===0?"hero":"contact"}}]]);
      expect(element.props.href).toBe("/GuilhermeSerafim_Fullstack.pdf");
    }
    expect(nodes.find(n=>n.props.className==="header-contact")!.props.onClick).toBeUndefined();
  });
  it("records email opening but records copying only after the clipboard resolves", async () => {
    const nodes=elements(App());
    nodes.filter(n=>n.type==="a"&&String(n.props.href).startsWith("mailto:")).forEach((element,index)=>{
      recorded.mockClear(); element.props.onClick();
      expect(recorded.mock.calls).toEqual([[{name:"contact_intent",params:{contact_method:"email_open",ui_location:index===0?"contact_arrow":"contact_email"}}]]);
    });
    const copy=nodes.find(n=>n.props.className==="copy-button")!;
    let resolve!:()=>void; writeText.mockReturnValue(new Promise<void>(done=>{resolve=done;}));
    recorded.mockClear(); const copying=copy.props.onClick(); expect(recorded).not.toHaveBeenCalled(); resolve(); await copying;
    expect(recorded.mock.calls).toEqual([[{name:"contact_intent",params:{contact_method:"email_copy",ui_location:"contact_copy"}}]]);
    recorded.mockClear(); writeText.mockRejectedValue(Error("denied")); await copy.props.onClick(); expect(recorded).not.toHaveBeenCalled();
  });
  it("identifies the social links and the project card repository", () => {
    const nodes=elements(App());
    const expectations = [
      ["https://github.com/GuilhermeSerafim", "github", "github_profile", ["projects_footer","contact"]],
      ["https://www.linkedin.com/in/guiserafim/", "linkedin", "linkedin_profile", ["about","contact"]],
    ] as const;
    for(const [href,link_id,destination_id,locations] of expectations) nodes.filter(n=>n.type==="a"&&n.props.href===href).forEach((element,index)=>{
      recorded.mockClear(); element.props.onClick(); expect(recorded.mock.calls).toEqual([[{name:"link_click",params:{link_id,destination_id,ui_location:locations[index]}}]]);
    });
    recorded.mockClear(); nodes.find(n=>n.props.className==="project-code")!.props.onClick();
    expect(recorded.mock.calls).toEqual([[{name:"link_click",params:{link_id:"project_code",destination_id:"project_repository",project_id:"playsenac",ui_location:"project_card"}}]]);
  });
});
