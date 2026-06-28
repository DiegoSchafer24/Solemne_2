export interface OnlineRoomRegistryEntry {
  roomId: string;
  roomCode: string;
  status: 'waiting' | 'playing' | 'finished';
}

const roomsByCode = new Map<string, OnlineRoomRegistryEntry>();

export function registerOnlineRoom(entry: OnlineRoomRegistryEntry) {
  roomsByCode.set(entry.roomCode, entry);
}

export function updateOnlineRoomStatus(roomCode: string, status: OnlineRoomRegistryEntry['status']) {
  const entry = roomsByCode.get(roomCode);

  if (!entry) return;

  entry.status = status;
}

export function unregisterOnlineRoom(roomCode: string) {
  roomsByCode.delete(roomCode);
}

export function findOnlineRoomByCode(roomCode: string) {
  return roomsByCode.get(roomCode.toUpperCase()) ?? null;
}
