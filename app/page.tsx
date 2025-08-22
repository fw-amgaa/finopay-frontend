import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { fetchMerchants, fetchOrders } from "./actions";
import { DataTable } from "@/components/data-table";
import moment from "moment";

export default async function Page() {
  const orders = await fetchOrders();

  const merchants = await fetchMerchants();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive orders={orders} />
      </div>
      <DataTable
        merchants={merchants}
        data={orders.toSorted(
          (a, b) => moment(b.created_at).unix() - moment(a.created_at).unix()
        )}
      />
    </div>
  );
}
