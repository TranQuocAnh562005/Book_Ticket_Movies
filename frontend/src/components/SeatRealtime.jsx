import { cn } from "../lib/utils";

function getRowLabel(index) {
  return String.fromCharCode(65 + index);
}

function getSeatType(rowLabel, cinemaData) {
  if ((cinemaData.coupleRows || []).includes(rowLabel)) return "COUPLE";
  if ((cinemaData.vipRows || []).includes(rowLabel)) return "VIP";
  return "STANDARD";
}

function getSeatPrice(rowLabel, cinemaData) {
  const prices = cinemaData.prices || {};
  const seatType = getSeatType(rowLabel, cinemaData);

  if (seatType === "COUPLE") return prices.couple || 0;
  if (seatType === "VIP") return prices.vip || 0;
  return prices.standard || 0;
}

export default function SeatRealtime({ 
  setSelectedSeat, 
  selectedSeat, 
  cinemaData, 
  heldSeats, 
  currentUserId,
  onSeatHold,
  onSeatUnhold
}) {
  const rows = Number(cinemaData?.rows) || 0;
  const seatPerRow = Number(cinemaData?.seatsPerRow) || 0;
  const soldSeatSet = new Set(cinemaData?.soldSeats || []);

  const handleSelectedSeat = (seatId) => {
    if (soldSeatSet.has(seatId)) return;
    
    // Check if held by someone else
    const heldBy = heldSeats?.get(seatId);
    if (heldBy && heldBy.userId !== currentUserId) {
      return; // Cannot select someone else's held seat
    }

    if (selectedSeat.includes(seatId)) {
      // Unselect
      setSelectedSeat((prev) => prev.filter((seat) => seat !== seatId));
      if (onSeatUnhold) onSeatUnhold(seatId);
    } else {
      // Select
      setSelectedSeat((prev) => [...prev, seatId]);
      if (onSeatHold) onSeatHold(seatId);
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="mx-auto flex w-max flex-col gap-3">
        {Array.from({ length: rows }).map((_, rowIndex) => {
          const rowLabel = getRowLabel(rowIndex);

          return (
            <div key={rowLabel} className="grid grid-cols-[28px_1fr_28px] items-center gap-3">
              <span className="text-center text-sm font-semibold text-white/60">
                {rowLabel}
              </span>

              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${seatPerRow}, 40px)`,
                }}
              >
                {Array.from({ length: seatPerRow }).map((__, seatIndex) => {
                  const seatNumber = seatIndex + 1;
                  const seatId = `${rowLabel}${seatNumber}`;
                  const seatType = getSeatType(rowLabel, cinemaData);
                  const isSoldSeat = soldSeatSet.has(seatId);
                  const isSelected = selectedSeat.includes(seatId);

                  const heldInfo = heldSeats?.get(seatId);
                  const isHeldByOthers = heldInfo && heldInfo.userId !== currentUserId;
                  const remainingMinutes = heldInfo ? Math.max(1, Math.ceil((heldInfo.expiresAt - Date.now()) / 60000)) : 0;

                  return (
                    <button
                      key={seatId}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded text-[11px] font-semibold transition",
                        isSoldSeat && "cursor-not-allowed bg-gray-500 text-white opacity-70",
                        isHeldByOthers && "cursor-not-allowed bg-yellow-400 text-black opacity-80",
                        isSelected && "bg-red-500 text-white shadow-[0_0_0_2px_rgba(248,113,113,0.35)]",
                        !isSoldSeat &&
                          !isSelected &&
                          !isHeldByOthers &&
                          seatType === "STANDARD" &&
                          "border-2 border-green-500 bg-white text-black hover:bg-green-100",
                        !isSoldSeat &&
                          !isSelected &&
                          !isHeldByOthers &&
                          seatType === "VIP" &&
                          "border-2 border-red-500 bg-white text-black hover:bg-red-100",
                        !isSoldSeat &&
                          !isSelected &&
                          !isHeldByOthers &&
                          seatType === "COUPLE" &&
                          "bg-pink-500 text-white hover:bg-pink-400",
                      )}
                      disabled={isSoldSeat || isHeldByOthers}
                      title={isHeldByOthers ? `Ghế đang được giữ - còn ${remainingMinutes} phút` : `${seatId} - ${seatType} - ${getSeatPrice(rowLabel, cinemaData).toLocaleString("vi-VN")}d`}
                      onClick={() => handleSelectedSeat(seatId)}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>

              <span className="text-center text-sm font-semibold text-white/60">
                {rowLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


