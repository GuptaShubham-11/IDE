import { userApi } from '@/api/userApi';
import GenderQuestion from '@/components/GenderQuestion';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <GenderQuestion />
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg">Welcome to your dashboard!</p>
      <button
        onClick={async () => {
          try {
            const response = await userApi.signOut();
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        }}
        className="mt-8 bg-red-500 hover:text-white hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
