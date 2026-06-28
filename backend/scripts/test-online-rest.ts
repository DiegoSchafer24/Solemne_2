/// <reference types="node" />

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: string;
  };
  token: string;
}

async function registerUser(username: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email: `${username}@test.com`,
      password: 'secret123'
    })
  });

  if (!response.ok) {
    throw new Error(`Register failed for ${username}: ${await response.text()}`);
  }

  return response.json() as Promise<AuthResponse>;
}

async function main() {
  const suffix = Date.now();
  const player1 = await registerUser(`onlinep1${suffix}`);
  const player2 = await registerUser(`onlinep2${suffix}`);

  const matchResponse = await fetch(`${API_URL}/api/matches/online`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${player1.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roomCode: `R${String(suffix).slice(-6)}`,
      players: [
        { userId: player1.user.id, username: player1.user.username, slot: 1 },
        { userId: player2.user.id, username: player2.user.username, slot: 2 }
      ],
      winnerUserId: player1.user.id,
      winnerSlot: 1,
      durationSeconds: 60
    })
  });

  console.log(`Create online match: ${await matchResponse.text()}`);

  const matchesResponse = await fetch(`${API_URL}/api/matches/online/me`, {
    headers: {
      Authorization: `Bearer ${player1.token}`
    }
  });
  console.log(`Player 1 matches: ${await matchesResponse.text()}`);

  const statsResponse = await fetch(`${API_URL}/api/matches/online/stats/me`, {
    headers: {
      Authorization: `Bearer ${player1.token}`
    }
  });
  console.log(`Player 1 stats: ${await statsResponse.text()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
