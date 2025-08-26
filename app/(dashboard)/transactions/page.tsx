import { fetchMerchants } from "@/app/actions/merchant";
import { fetchOrders } from "@/app/actions/order";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import moment from "moment";

export default async function Page() {
  const orders = await fetchOrders();

  const merchants = await fetchMerchants();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-6 space-y-4">
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
