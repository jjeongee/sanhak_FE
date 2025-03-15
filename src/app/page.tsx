import { UserProvider } from '@/context/UserContext';
import MainComponent from './main/pageComponents';

export default function Home() {
    return (
        <div>
            <UserProvider>
              <MainComponent />
            </UserProvider>
        </div>
    );
}