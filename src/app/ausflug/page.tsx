import { redirect } from "next/navigation";
import { monatJetzt, monatSlug } from "@/lib/anlass";

// «Was hat jetzt Saison?» – immer auf die Seite des laufenden Monats
export const dynamic = "force-dynamic";

export default function AusflugJetzt() {
  redirect(`/ausflug/${monatSlug(monatJetzt())}`);
}
