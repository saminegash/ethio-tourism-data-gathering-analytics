import Link from 'next/link';
import { JourneySyncStatus } from '../components/journey-sync-status';
import { OfflineStatusBanner } from '../components/offline-status-banner';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-10">
      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <OfflineStatusBanner />
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">
          Welcome to Ethiopia
        </h1>
        <p className="mt-2 text-slate-600">
          Explore curated recommendations, manage your wristband wallet, and
          stay connected even when you are offline.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-primary-500"
            href="/itinerary"
          >
            View Itinerary
          </Link>
          <Link
            className="rounded-lg border border-primary-200 px-4 py-2 font-medium text-primary-600 hover:bg-primary-50"
            href="/wallet"
          >
            Wallet
          </Link>
        </div>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Sync & Connectivity
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          The app keeps working when offline. We sync updates whenever a
          connection is available.
        </p>
        <JourneySyncStatus />
      </section>
    </main>
  );
}
