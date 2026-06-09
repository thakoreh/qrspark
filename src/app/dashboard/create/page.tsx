import { QrGenerator } from "@/components/qr-generator";
import { SmartRedirect } from "@/components/smart-redirect";
export default function CreatePage(){return <div className="grid gap-5"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Create</p><h1 className="text-4xl font-semibold tracking-tighter">Build a new QR code</h1></div><QrGenerator/><SmartRedirect/></div>}
