import CardAlerts from '@/components/alerts/CardAlerts';
import Calendar from '@/components/calendar/Calendar';

export default function Home() {
    return (
        <main className="flex h-screen w-full">
            {/* Calendar Section (9/12 width) */}
            <div className="w-9/12 h-full flex">
                <Calendar />
            </div>

            {/* Warnings Section (3/12 width) */}
            <div className="w-3/12 h-full p-4 flex flex-col items-center justify-center">
                <CardAlerts />
            </div>
        </main>
    );
}
