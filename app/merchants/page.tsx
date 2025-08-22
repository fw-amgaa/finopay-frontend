import { fetchMerchants } from "../actions";
import { MerchantTable } from "./merchant-table";

export default async function Page() {
  const merchants = await fetchMerchants();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <MerchantTable merchants={merchants} />
    </div>
  );
}
