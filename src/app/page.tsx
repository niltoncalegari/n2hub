import ScoreComponent from './components/ScoreComponent';
import ServerStatus from './components/ServerStatus';

export default function Home() {
    return (
        <main>
            <ScoreComponent />
            <ServerStatus />
        </main>
    );
}