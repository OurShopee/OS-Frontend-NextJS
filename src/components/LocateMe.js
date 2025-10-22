import React, { useEffect, useMemo, useState } from 'react';

export default function LocateMe({ showGuide, setShowGuide, getLocation }) {
    const [httpsWarn, setHttpsWarn] = useState(false);
    const isAndroid = useMemo(() => /Android/i.test(navigator.userAgent || ''), []);

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.isSecureContext) {
            setHttpsWarn(true);
        }
    }, []);

    const handleLocateClick = async () => {
        if (typeof getLocation === 'function') getLocation();
    };

    return (
        <div className="max-w-[520px] font-sans">
            {httpsWarn && (
                <div className="mb-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                    This page is not a secure context (HTTPS), and location may not prompt or work in Chrome.
                </div>
            )}

            {showGuide && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 p-3"
                >
                    <div className="w-full max-w-[560px] rounded-2xl bg-white shadow-xl relative">
                        {/* Header banner */}
                        <div className="rounded-t-2xl border-b border-[#FFFAE6] bg-[#FFFAE6] p-4">
                            <h4 className="m-0 text-xl font-medium text-slate-900">
                                Enable location for this site
                            </h4>
                            <p className="mt-0 mb-0 text-sm text-slate-600 max-w-[95%]">
                                Location access is blocked for this site in Chrome; enable it in Site settings, return here, and press Try again.
                            </p>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => setShowGuide(false)}
                                style={{ boxShadow: "0px 2px 4px 0px #82828240" }}
                                className="absolute top-2 right-2 border-none rounded-full inline-flex h-6 w-6 items-center justify-center text-black bg-white hover:bg-slate-100 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-4 p-4 pb-0">

                            {/* Desktop card */}
                            {!isAndroid && (
                                <div className="rounded-lg border border-slate-200 p-4">
                                    <div className="font-semibold text-slate-900">Desktop Chrome</div>
                                    <ul className="my-2 space-y-1 pl-5 text-sm text-slate-700">
                                        <li>Click the site icon at the left of the address bar, then open Site settings.</li>
                                        <li>Find Location and change the permission to Allow or Ask.</li>
                                        <li>Reload this page, then press Try again.</li>
                                    </ul>
                                </div>
                            )}

                            {/* Android card */}
                            <div className="rounded-lg border border-slate-200 p-4">
                                <div className="font-semibold text-slate-900">Android Chrome</div>
                                <ul className="my-2 space-y-1 pl-5 text-sm text-slate-700">
                                    <li>Menu → Settings → Site settings → Location.</li>
                                    <li>Ensure Location is On and this site is set to Allow.</li>
                                    <li>Return to this page, reload, then press Try again.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 border-t border-slate-200 bg-white p-4 rounded-b-xl">
                            <button
                                type="button"
                                onClick={() => setShowGuide(false)}
                                className="flex-grow border-none items-center justify-center rounded-md border border-slate-300 bg-[#DDDDDD] px-4 py-2 text-sm font-medium text-black hover:bg-slate-200"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={handleLocateClick}
                                className="flex-grow border-none items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
