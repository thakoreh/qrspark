import { FolderSimple } from "@phosphor-icons/react/dist/ssr";
import { Panel } from "@/components/ui";
const folders=["Retail","Real estate","Restaurant","Operations","Events","PDF campaigns"];
export default function FoldersPage(){return <div className="grid gap-5"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Folders</p><h1 className="text-4xl font-semibold tracking-tighter">Collections</h1></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{folders.map((folder,index)=><Panel key={folder}><FolderSimple size={28} className="text-emerald-600"/><h2 className="mt-5 text-xl font-semibold">{folder}</h2><p className="mt-1 text-sm text-zinc-500">{index+2} QR codes, shared with campaign team.</p></Panel>)}</div></div>}
