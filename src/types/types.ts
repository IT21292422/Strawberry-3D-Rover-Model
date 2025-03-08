export enum RoverStatus {
  STOP = 0,
  START = 1,
  PAUSE = 2,
  SERVICE = 3,
}

export interface FlowerCoordinate {
  x: number;
  y: number;
  confidence: number;
}

export interface FlowerData {
  id: number;
  rover_id: number;
  random_id: number;
  battery_status: number;
  temperature: number;
  humidity: number;
  blob_url: string;
  image_data: FlowerCoordinate[];
  created_at: { $date: string };
}
