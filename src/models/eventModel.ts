import { pool } from "../config/database";
import { BaseEvent, EventType } from "../types/events";

export class EventModel {
  static async saveEvent(event: BaseEvent): Promise<void> {
    const client = await pool.connect();

    try {
      // Dynamically create table if not exists based on event type
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${event.type.toLowerCase()}_events (
          id SERIAL PRIMARY KEY,
          client_id TEXT NOT NULL,
          timestamp BIGINT NOT NULL,
          payload JSONB NOT NULL
        )
      `);

      // Insert event with type-specific payload
      await client.query(
        `INSERT INTO ${event.type.toLowerCase()}_events 
         (client_id, timestamp, payload) 
         VALUES ($1, $2, $3)`,
        [event.clientId, event.timestamp, JSON.stringify(event)]
      );
    } catch (error) {
      console.error("Error saving event:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getRecentEvents(
    type: EventType,
    limit: number = 100
  ): Promise<BaseEvent[]> {
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT payload FROM ${type.toLowerCase()}_events 
         ORDER BY timestamp DESC 
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row) => JSON.parse(row.payload));
    } catch (error) {
      console.error("Error retrieving events:", error);
      throw error;
    } finally {
      client.release();
    }
  }
}
