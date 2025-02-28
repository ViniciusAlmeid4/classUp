import './cardAlerts.css';

export default function CardAlerts() {
    return (
        <div className='h-full w-full flex flex-col items-center justify-start pt-5 card-alerts'>
            <h2 className="text-lg font-bold mb-2">Warnings</h2>
            <p className="text-sm text-red-600">No warnings at the moment.</p>
        </div>
    );
}
