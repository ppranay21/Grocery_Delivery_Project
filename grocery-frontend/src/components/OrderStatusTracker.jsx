import { Check, Package, Truck, Home, XCircle } from "lucide-react";

const statusSteps = [
  {
    key: "PLACED",
    label: "Placed",
    icon: Check,
  },
  {
    key: "PACKED",
    label: "Packed",
    icon: Package,
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    icon: Home,
  },
];

function OrderStatusTracker({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="cancelled-status-box">
        <XCircle size={22} />
        <span>Order Cancelled</span>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="order-tracker">
      {statusSteps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= currentStepIndex;

        return (
          <div className="tracker-item" key={step.key}>
            <div
              className={
                isCompleted
                  ? "tracker-circle tracker-completed"
                  : "tracker-circle"
              }
            >
              <Icon size={18} />
            </div>

            <span className={isCompleted ? "tracker-label active" : "tracker-label"}>
              {step.label}
            </span>

            {index < statusSteps.length - 1 && (
              <div
                className={
                  index < currentStepIndex
                    ? "tracker-line completed"
                    : "tracker-line"
                }
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OrderStatusTracker;
