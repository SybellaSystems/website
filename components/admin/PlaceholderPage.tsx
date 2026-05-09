"use client";

export default function PlaceholderPage(props: {
  title: string;
  description?: string;
  integrationHint?: string;
}) {
  const { title, description, integrationHint } = props;
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      ) : null}

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="text-sm font-semibold text-slate-800">Live workspace</div>
        <div className="mt-1 text-sm text-slate-700">
          {integrationHint ?? "This workspace is configured for live operational data."}
        </div>
      </div>
    </div>
  );
}

