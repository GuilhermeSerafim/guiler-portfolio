import { afterEach, describe, expect, it, vi } from "vitest";
import { isValidElement, type ReactElement } from "react";
const { state, choose, effects, refs } = vi.hoisted(() => ({ state:{consent:"granted",configured:false,open:false}, choose:vi.fn(), effects:[] as Array<()=>void|(()=>void)>, refs:[] as Array<{focus:ReturnType<typeof vi.fn>}> }));
vi.mock("../../src/analytics/client", () => ({getConsent:()=>state.consent,isAnalyticsConfigured:()=>state.configured,setConsent:choose,subscribeConsent:()=>()=>{}}));
vi.mock("react",async original=>({...await original<typeof import("react")>(),useContext:()=>"pt-BR",useState:(value:unknown)=>[typeof value==="boolean"?state.open:value,vi.fn()],useRef:()=>{const current={showModal:vi.fn(),close:vi.fn(),focus:vi.fn()};refs.push(current);return{current};},useEffect:(effect:()=>void|(()=>void))=>effects.push(effect),useSyncExternalStore:(_subscribe:unknown,getSnapshot:()=>unknown)=>getSnapshot()}));
import { AnalyticsPreferences } from "../../src/components/AnalyticsPreferences";
type Element=ReactElement<Record<string,any>>;
function elements(tree:unknown):Element[] {
  if(Array.isArray(tree)) return tree.flatMap(elements);
  if(!isValidElement(tree)) return [];
  return [tree as Element,...elements((tree as Element).props.children)];
}
describe("preferences when collection is unavailable",()=>{
  afterEach(()=>{state.open=false;effects.length=0;refs.length=0;vi.unstubAllGlobals();});
  it("returns focus to the actual dialog opener, including the viewport invitation",()=>{
    class Focusable { focus=vi.fn(); isConnected=true; }
    const opener=new Focusable();
    vi.stubGlobal("HTMLElement",Focusable);
    vi.stubGlobal("document",{activeElement:opener});
    state.open=true;
    AnalyticsPreferences();
    const cleanup=effects.at(-1)!();
    if(typeof cleanup==="function") cleanup();
    expect(opener.focus).toHaveBeenCalledTimes(1);
  });
  it("focuses the persistent preferences control if making a choice removed the invitation opener",()=>{
    class Focusable { focus=vi.fn(); isConnected=false; }
    const opener=new Focusable();
    vi.stubGlobal("HTMLElement",Focusable);
    vi.stubGlobal("document",{activeElement:opener});
    state.open=true;
    AnalyticsPreferences();
    const cleanup=effects.at(-1)!();
    if(typeof cleanup==="function") cleanup();
    expect(refs[1].focus).toHaveBeenCalledTimes(1);
    expect(opener.focus).not.toHaveBeenCalled();
  });
  it("lets a saved grant be withdrawn even if this entry or environment is blocked",()=>{
    const nodes=elements(AnalyticsPreferences());
    const withdrawal=nodes.find(n=>n.type==="button"&&n.props.children==="Retirar autorização");
    expect(withdrawal).toBeDefined();
    expect(nodes.some(n=>n.type==="button"&&n.props.children==="Aceitar estatísticas")).toBe(false);
    withdrawal!.props.onClick();
    expect(choose).toHaveBeenCalledWith("denied");
  });
});
