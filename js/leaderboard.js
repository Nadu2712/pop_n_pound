let leaderboard = [];

function showLeaderboard() {
    fetch('http://localhost:3000/leaderboard')
        .then((response) => response.json())
        .then((data) => {
            if (!Array.isArray(data)) {
                console.error('Invalid leaderboard data:', data);
                return;
            }
            const leaderboardList = document.getElementById("leaderboard-list");
            leaderboardList.innerHTML = data
                .map((entry, index) => `<li>${index + 1}. ${entry.username}: ${entry.score}</li>`)
                .join("");
            document.getElementById("leaderboard-popup").classList.remove("hidden");
        })
        .catch((error) => {
            console.error('Error fetching leaderboard:', error);
        });
}

function closeLeaderboard() {
    document.getElementById("leaderboard-popup").classList.add("hidden");
  }
  
function addToLeaderboard(score) {
    leaderboard.push(score);
    leaderboard.sort((a, b) => b - a);
    leaderboard = leaderboard.slice(0, 5);
  }
  