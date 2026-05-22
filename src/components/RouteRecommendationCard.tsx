export type RouteRecommendation = {
  isCommuteRecommended: boolean;
  reasons: string[];
  title: "Commute recommended" | "LEV trip recommended";
};

const recommendationStyles = {
  commute: "border-rose-400 bg-rose-400/10 text-rose-100",
  lev: "border-emerald-400 bg-emerald-400/10 text-emerald-100",
  pending: "border-zinc-700 bg-zinc-900 text-zinc-300",
};

export default function RouteRecommendationCard({
  recommendation,
}: {
  recommendation: RouteRecommendation | null;
}) {
  if (!recommendation) {
    return (
      <div
        aria-live="polite"
        className={`edaan-card px-5 py-5 ${recommendationStyles.pending}`}
      >
        <p className="text-lg font-bold">Route recommendation pending</p>
        <p className="mt-2 text-sm font-semibold">
          Enter battery and route details to calculate the final recommendation.
        </p>
      </div>
    );
  }

  const toneClass = recommendation.isCommuteRecommended
    ? recommendationStyles.commute
    : recommendationStyles.lev;

  return (
    <div aria-live="polite" className={`edaan-card px-5 py-5 ${toneClass}`}>
      <p className="text-2xl font-bold">{recommendation.title}</p>
      {recommendation.reasons.length > 0 ? (
        <ul className="mt-4 grid gap-2 text-sm font-semibold">
          {recommendation.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm font-semibold">
          Battery, safety, and highway preferences look acceptable.
        </p>
      )}
    </div>
  );
}
