import { getUser } from "@/app/lib/dal";
import DashboardClient from "./DashboardClient";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    // Redirect to the login page if the user is not authenticated
    return (
      <div>
        <p>Redirecting to login...</p>
        <script>window.location.href = &quot;/&quot;;</script>
      </div>
    );
  }

  return <DashboardClient user={user} />;
}
