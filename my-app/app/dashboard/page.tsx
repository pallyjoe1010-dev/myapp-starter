import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();

  // 1️⃣ Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return (
      <div className="p-8 text-red-600">
        ❌ No authenticated user found.
      </div>
    );
  }

  // 2️⃣ Fetch activities for this user
  const { data: activities, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-red-600">
        ❌ Error loading activities: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Debug confirmation */}
      <div className="bg-gray-100 p-4 rounded text-sm">
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Total Activities:</strong>{" "}
          {activities?.length ?? 0}
        </p>
      </div>

      {/* Activities list */}
      {activities && activities.length > 0 ? (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="border rounded p-4"
            >
              <p className="font-semibold">
                {activity.title}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(
                  activity.created_at
                ).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">
          No activities found.
        </p>
      )}
    </div>
  );
}
