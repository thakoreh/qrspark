"use client";

import { FolderSimple } from "@phosphor-icons/react";
import { useQuery } from "convex/react";
import { Panel } from "@/components/ui";
import { api } from "../../../../convex/_generated/api";

export default function FoldersPage() {
  const folders = useQuery(api.qrCodes.foldersMine);
  const loading = folders === undefined;
  return <div className="grid gap-5">
    <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Folders</p><h1 className="text-4xl font-semibold tracking-tighter">Collections</h1><p className="mt-2 text-zinc-500">Folders are created from the folder field on saved QR campaigns.</p></div>
    {loading ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2].map((item)=><Panel key={item} className="h-36 animate-pulse"><span /></Panel>)}</div> : folders.length === 0 ? <Panel className="grid place-items-center border-dashed py-12 text-center"><FolderSimple size={32} className="text-emerald-600"/><h2 className="mt-4 text-xl font-semibold">No folders yet</h2><p className="mt-2 max-w-md text-sm text-zinc-500">Create a QR campaign and fill the Folder field. It will appear here automatically.</p><a href="/dashboard/create" className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">Create QR</a></Panel> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{folders.map((folder)=><Panel key={folder.name}><FolderSimple size={28} className="text-emerald-600"/><h2 className="mt-5 text-xl font-semibold">{folder.name}</h2><p className="mt-1 text-sm text-zinc-500">{folder.count} QR {folder.count === 1 ? "code" : "codes"}</p><p className="mt-3 text-xs text-zinc-400">Updated {new Date(folder.updatedAt).toLocaleDateString()}</p></Panel>)}</div>}
  </div>;
}
