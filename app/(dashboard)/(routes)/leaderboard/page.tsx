import { auth, clerkClient } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { LeaderboardEntry, getLeaderboard } from "@/actions/get-leaderboard";

const LeaderboardPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  let leaderboardData: LeaderboardEntry[] = [];
  let userList: any[] = [];

  try {
    leaderboardData = await getLeaderboard();
    userList = await clerkClient.users.getUserList({ limit: 100 });

    if (!Array.isArray(leaderboardData)) {
      throw new Error("Leaderboard data is not an array.");
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    leaderboardData = [];
  }

  // Filter user list based on user IDs present in the leaderboard data
  const filteredUserList = userList.filter(user => leaderboardData.some(entry => entry.userId === user.id));

  // Sort leaderboardData based on total_completed_chapters
  leaderboardData.sort((a, b) => b.total_completed_chapters - a.total_completed_chapters);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completed Chapters
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Chapters
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Courses Completed
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leaderboardData.map((entry, index) => {
            // Find corresponding user data
            const user = filteredUserList.find(user => user.id === entry.userId);
            if (!user) return null;
            const userName = user ? `${user.firstName} ${user.lastName}` : "Unknown User";
            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.total_completed_chapters}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.total_chapters_in_courses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.course_completed}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
